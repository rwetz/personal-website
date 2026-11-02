// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useId, useRef } from 'react'
import { detailedMark } from './mark'
import { emblems, outline } from './emblems'

// Ordered print grain, not a repeated square grid. A sparse 8×8 Bayer tile
// stays crisp at icon scale; the upper part of the mark retains a solid edge.
const BAYER8 = [
  [0, 48, 12, 60, 3, 51, 15, 63], [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55], [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61], [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53], [42, 26, 38, 22, 41, 25, 37, 21],
]

export default function Heptagram({ activeId, className = '' }) {
  const morph = useRef(null)
  const detail = useRef(null)
  const previous = useRef(null)
  const solid = useRef(null)
  const id = useId().replace(/:/g, '')
  const dithered = activeId === 'biblelm' || activeId === 'ferrite'
  useEffect(() => {
    if (!activeId && !previous.current) return
    let cancelled = false
    let timeline
    const target = emblems[activeId] ?? outline
    const from = emblems[previous.current] ?? outline
    previous.current = activeId
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      morph.current.setAttribute('d', activeId ? target : outline)
      morph.current.style.opacity = activeId ? '1' : '0'
      detail.current.style.opacity = activeId ? '0' : '1'
      solid.current.style.opacity = dithered ? '0' : '1'
      return
    }
    Promise.all([import('gsap'), import('gsap/MorphSVGPlugin')]).then(([{ gsap }, { MorphSVGPlugin }]) => {
      if (cancelled) return
      gsap.registerPlugin(MorphSVGPlugin)
      const path = morph.current
      const full = detail.current
      timeline = gsap.timeline()
        .set(path, { attr: { d: from }, opacity: 1 })
        .to(full, { opacity: 0, duration: 0.1 })
        .to(path, { morphSVG: { shape: target, shapeIndex: 'auto' }, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(solid.current, { opacity: dithered ? 0 : 1, duration: .7, ease: 'power2.inOut' }, 0)
      if (!activeId) timeline.to(path, { opacity: 0, duration: 0.15 }).to(full, { opacity: 1, duration: 0.15 }, '<')
    })
    return () => { cancelled = true; timeline?.kill() }
  }, [activeId, dithered])
  return <svg className={`heptagram mark-${activeId ?? 'home'} ${className}`} viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-spectrum`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ef7777" /><stop offset=".2" stopColor="#f2ae61" /><stop offset=".4" stopColor="#7dcf9b" /><stop offset=".6" stopColor="#75c7e9" /><stop offset=".8" stopColor="#a8a3ec" /><stop offset="1" stopColor="#d99acf" /></linearGradient>
      <pattern id={`${id}-dots`} patternUnits="userSpaceOnUse" width="192" height="192"><rect width="192" height="192" fill="white" />{BAYER8.flatMap((row, y) => row.map((value, x) => value >= 48 ? <rect key={`${x}-${y}`} x={x * 24} y={y * 24} width="24" height="24" fill="black" /> : null))}</pattern>
      <linearGradient id={`${id}-print-edge`} x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stopColor="white" /><stop offset=".95" stopColor="white" stopOpacity="0" /></linearGradient>
      <mask id={`${id}-dither`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><rect width="1024" height="1024" fill={`url(#${id}-dots)`} /><rect width="1024" height="1024" fill={`url(#${id}-print-edge)`} /><rect ref={solid} width="1024" height="1024" fill="white" /></mask>
    </defs>
    <g className="emblem-ink" fill={activeId === 'nexis' ? `url(#${id}-spectrum)` : 'currentColor'} mask={`url(#${id}-dither)`}>
      <path ref={detail} d={detailedMark} fillRule="evenodd" />
      <path ref={morph} d={outline} fillRule="evenodd" opacity="0" />
    </g>
  </svg>
}
