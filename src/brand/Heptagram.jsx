// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useRef } from 'react'
import { detailedMark } from './mark'
import { emblems, outline } from './emblems'

export default function Heptagram({ activeId, className = '' }) {
  const morph = useRef(null)
  const detail = useRef(null)
  const previous = useRef(null)
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
      if (!activeId) timeline.to(path, { opacity: 0, duration: 0.15 }).to(full, { opacity: 1, duration: 0.15 }, '<')
    })
    return () => { cancelled = true; timeline?.kill() }
  }, [activeId])
  return <svg className={`heptagram ${className}`} viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
    <path ref={detail} d={detailedMark} fillRule="evenodd" />
    <path ref={morph} d={outline} opacity="0" />
  </svg>
}
