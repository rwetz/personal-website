import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Pill-shaped nav capsule with GSAP circle-wipe hover animation.
 * Desktop only — caller handles mobile.
 *
 * Props:
 *   items       — [{ label, href }]
 *   activeHref  — currently active href string (e.g. '#about')
 *   baseColor   — capsule background + hover circle fill
 *   pillColor   — individual pill background
 *   pillTextColor       — pill resting text colour (defaults to baseColor)
 *   hoveredPillTextColor — pill text colour when circle fills
 *   ease        — GSAP ease string
 */
export default function PillNav({
  items = [],
  activeHref,
  ease = 'power3.easeOut',
  baseColor = 'var(--m-ink)',
  pillColor = 'var(--m-canvas)',
  hoveredPillTextColor = 'var(--m-on-dark)',
  pillTextColor,
}) {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const circleRefs  = useRef([])
  const tlRefs      = useRef([])
  const tweenRefs   = useRef([])

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement
        const { width: w, height: h } = pill.getBoundingClientRect()
        if (!w || !h) return

        const R      = ((w * w) / 4 + h * h) / (2 * h)
        const D      = Math.ceil(2 * R) + 2
        const delta  = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width  = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector('.pn-label')
        const hover = pill.querySelector('.pn-hover')
        if (label) gsap.set(label, { y: 0 })
        if (hover) gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })

        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        tlRefs.current[i] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {})
    return () => window.removeEventListener('resize', layout)
  }, [items, ease])

  const enter = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }

  const leave = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        height: 40,
        background: baseColor,
        padding: 3,
        gap: 3,
      }}
    >
      {items.map((item, i) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={activeHref === item.href ? 'page' : undefined}
          onMouseEnter={() => enter(i)}
          onMouseLeave={() => leave(i)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 9999,
            background: pillColor,
            color: resolvedPillTextColor,
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 0,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          {/* GSAP circle */}
          <span
            ref={el => { circleRefs.current[i] = el }}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              borderRadius: '50%',
              zIndex: 1,
              display: 'block',
              pointerEvents: 'none',
              background: baseColor,
              willChange: 'transform',
            }}
          />
          {/* Label stack */}
          <span style={{ position: 'relative', display: 'inline-block', lineHeight: 1, zIndex: 2 }}>
            <span
              className="pn-label"
              style={{ position: 'relative', zIndex: 2, display: 'inline-block', lineHeight: 1, willChange: 'transform' }}
            >
              {item.label}
            </span>
            <span
              className="pn-hover"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0, top: 0,
                zIndex: 3,
                display: 'inline-block',
                color: hoveredPillTextColor,
                willChange: 'transform, opacity',
              }}
            >
              {item.label}
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}
