// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import signatureImg from '../assets/signature.png'
import nexisLogoSrc from '../assets/nexis-logo.webp'
import PillNav from './PillNav'

/** Nexis lives on its own domain; the navbar carries the only top-level pointer to it. */
const NEXIS_URL = 'https://nexisdev.org'

const links = [
  { label: 'Projects',   href: '#projects'   },
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Contact',    href: '#contact'    },
]

// Page order — the active-section lookup depends on it.
const sectionIds = ['hero', 'projects', 'about', 'experience', 'skills', 'contact']

/* Logo + pill nav + right cluster need ~1140px side by side; below this the
   hamburger takes over. Keep in step with the min-[1180px] classes below. */
const DESKTOP_NAV_MIN = 1180

export default function Navbar() {
  const [scrolled, setScrolled]    = useState(false)
  const [hidden, setHidden]        = useState(false)
  const [activeSection, setActive] = useState('')
  const [menuOpen, setMenuOpen]    = useState(false)
  const prevScrollY                = useRef(0)
  const menuRef                    = useRef(null)

  useEffect(() => {
    // Just past the 90px navbar, where a section lands after a nav click
    // (scroll-margin-top in index.css).
    const OFFSET = 100

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 16)
      setHidden(y > prevScrollY.current && y > 80)
      prevScrollY.current = y

      // The active section is the *last* one whose top has scrolled past the
      // offset. At the very bottom the final section may never reach it, so
      // treat the bottom of the page as that section.
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80
      let current = nearBottom ? sectionIds[sectionIds.length - 1] : ''
      if (!nearBottom) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i])
          if (el && el.getBoundingClientRect().top <= OFFSET) { current = sectionIds[i]; break }
        }
      }
      setActive(current)
    }

    // Scroll events can fire several times per frame; the section lookup reads
    // layout, so coalesce to one pass per frame.
    let frame = 0
    const onScrollFrame = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; onScroll() })
    }

    onScroll()
    window.addEventListener('scroll', onScrollFrame, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollFrame)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= DESKTOP_NAV_MIN) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return
    const focusable = menuRef.current.querySelectorAll('a, button')
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const trap  = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    first?.focus()
    return () => document.removeEventListener('keydown', trap)
  }, [menuOpen])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 90,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.96)' : '#ffffff',
        borderBottom: scrolled ? '1px solid #dddddd' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
    >
      <div className="page-container nav-row" style={{ height: '100%' }}>
        {/* Logo */}
        <a
          href="#hero"
          aria-label="Go to top"
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          {/* Signature is dark-on-transparent — render as-is on white */}
          <img src={signatureImg} alt="Ryan Wetzstein" width={152} height={48} fetchPriority="high" />
        </a>

        {/* Desktop nav — PillNav */}
        <div className="hidden min-[1180px]:block">
          <PillNav
            items={links}
            activeHref={activeSection ? `#${activeSection}` : ''}
            baseColor="var(--m-ink)"
            pillColor="var(--m-canvas)"
            pillTextColor="var(--m-ink)"
            hoveredPillTextColor="var(--m-on-dark)"
          />
        </div>

        {/* Right cluster */}
        <div className="hidden min-[1180px]:flex" style={{ alignItems: 'center', gap: 12, flexShrink: 0, justifySelf: 'end' }}>
          {/* Flagship project — outlined pill so it reads as a destination, not a section */}
          <a
            href={NEXIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ minHeight: 44, padding: '10px 16px' }}
          >
            <img
              src={nexisLogoSrc}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              style={{ borderRadius: 5, flexShrink: 0 }}
            />
            Nexis
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </a>
          <a href="/resume.pdf" download="Ryan_Wetzstein_Resume.pdf" className="text-link" style={{ fontWeight: 400, color: 'var(--m-muted)' }}>
            Resume
          </a>
          <a href="#contact" className="btn-primary" style={{ minHeight: 44, padding: '10px 20px' }}>
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="min-[1180px]:hidden"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{
            /* 44px minimum so the target clears the touch-accessibility floor. */
            /* No `display` here — it would override the hidden class.           */
            width: 44,
            height: 44,
            padding: 0,
            margin: -3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#181d26',
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 90,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #dddddd',
              padding: '16px 24px 24px',
            }}
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 0',
                      fontSize: 16,
                      fontWeight: 400,
                      color: '#333840',
                      textDecoration: 'none',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={NEXIS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#333840',
                    textDecoration: 'none',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <img
                    src={nexisLogoSrc}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    style={{ borderRadius: 5, flexShrink: 0 }}
                  />
                  Nexis
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
              </li>
            </ul>
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <a
                href="/resume.pdf"
                download="Ryan_Wetzstein_Resume.pdf"
                onClick={() => setMenuOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Resume
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Get in touch
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
