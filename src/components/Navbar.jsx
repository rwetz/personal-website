import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import signatureImg from '../assets/signature.png'
import PillNav from './PillNav'

const links = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Contact',  href: '#contact'  },
]

const sectionIds = ['hero', 'about', 'projects', 'skills', 'contact']

export default function Navbar() {
  const [scrolled, setScrolled]    = useState(false)
  const [hidden, setHidden]        = useState(false)
  const [activeSection, setActive] = useState('')
  const [menuOpen, setMenuOpen]    = useState(false)
  const prevScrollY                = useRef(0)
  const menuRef                    = useRef(null)

  useEffect(() => {
    const OFFSET = 80

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 16)
      setHidden(y > prevScrollY.current && y > 80)
      prevScrollY.current = y

      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80
      const ids = nearBottom
        ? [...sectionIds].reverse()
        : [...sectionIds]

      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= OFFSET) { current = id; break }
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
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
        height: 64,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.96)' : '#ffffff',
        borderBottom: scrolled ? '1px solid #dddddd' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          aria-label="Go to top"
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          {/* Signature is dark-on-transparent — render as-is on white */}
          <img src={signatureImg} alt="Ryan Wetzstein" style={{ height: 28, width: 'auto' }} />
        </a>

        {/* Desktop nav — PillNav */}
        <div
          className="hidden md:block"
          style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          <PillNav
            items={links}
            activeHref={activeSection ? `#${activeSection}` : ''}
            baseColor="#181d26"
            pillColor="#ffffff"
            pillTextColor="#181d26"
            hoveredPillTextColor="#ffffff"
          />
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <a
            href="/resume.pdf"
            download
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: '#41454d',
              textDecoration: 'none',
            }}
          >
            Resume
          </a>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 18px',
              background: '#181d26',
              color: '#ffffff',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{
            padding: 8,
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
          <motion.div
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
              top: 64,
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
            </ul>
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <a
                href="/resume.pdf"
                download
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: '#ffffff',
                  color: '#181d26',
                  border: '1px solid #dddddd',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Resume
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: '#181d26',
                  color: '#ffffff',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
