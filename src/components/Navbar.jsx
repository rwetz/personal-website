import { useState, useEffect, useRef } from 'react'
import GlassSurface from './GlassSurface'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['hero', ...links.map(l => l.href.slice(1))]


function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const prevScrollY = useRef(0)

  // Scroll detection for navbar background + hide/show
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > prevScrollY.current && y > 80)
      prevScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const OFFSET = 120
    const update = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80

      if (nearBottom) {
        // Find the last section that's actually visible in the viewport
        let last = ''
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (!el) continue
          if (el.getBoundingClientRect().top < window.innerHeight) last = id
        }
        setActiveSection(last)
        return
      }

      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= OFFSET) current = id
      }
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-surface)]/90 backdrop-blur border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Logo — far left */}
        <a
          href="#hero"
          className="hover:opacity-70 transition-opacity shrink-0"
          aria-label="Home"
        >
          <img
            src="/src/assets/signature.png"
            alt="Ryan"
            className="h-8 w-auto invert"
          />
        </a>

        {/* Desktop nav — glass pill, absolutely centered in the bar */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <GlassSurface
            width="auto"
            height={40}
            borderRadius={999}
            distortionScale={-180}
            brightness={55}
            opacity={0.9}
            blur={10}
            backgroundOpacity={0.1}
            saturation={1.3}
            className="px-2"
          >
            <ul className="flex items-center gap-1">
              {links.map(({ label, href }) => {
                const id = href.slice(1)
                const isActive = activeSection === id
                return (
                  <li key={label}>
                    <a
                      href={href}
                      className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 relative block ${
                        isActive
                          ? 'text-[var(--color-accent-light)]'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-px bg-[var(--color-accent-light)] rounded" />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </GlassSurface>
        </div>

        {/* Hamburger — far right */}
        <div className="flex items-center shrink-0">
          <button
            className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-surface-2)]/95 backdrop-blur border-b border-white/10 px-6 pb-4">
          <ul className="flex flex-col gap-1">
            {links.map(({ label, href }) => {
              const id = href.slice(1)
              const isActive = activeSection === id
              return (
                <li key={label}>
                  <a
                    href={href}
                    onClick={handleNavClick}
                    className={`block py-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? 'text-[var(--color-accent-light)]'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}
