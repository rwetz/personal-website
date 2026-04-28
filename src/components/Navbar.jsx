import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search } from 'lucide-react'
import GlassSurface from './GlassSurface'
import signatureImg from '../assets/signature.png'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const THEME_OPTIONS = [
  { id: 'default', label: 'Amethyst',      swatch: '#7c3aed' },
  { id: 'spice',   label: 'Chill Spice',   swatch: '#CD1C18' },
  { id: 'tuscan',  label: 'Tuscan Sunset', swatch: '#E35336' },
  { id: 'aurora',  label: 'Aurora',        swatch: '#06b6d4' },
  { id: 'gilded',  label: 'Gilded',        swatch: '#d97706' },
  { id: 'sakura',  label: 'Sakura',        swatch: '#e8799f' },
  { id: 'forest',  label: 'Forest',        swatch: '#16a34a' },
  { id: 'cobalt',  label: 'Cobalt',        swatch: '#4f80f7' },
]

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Now',      href: '#now' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Stats',    href: '#stats' },
  { label: 'Resume',   href: '#resume' },
  { label: 'Inspiration', href: '#inspiration' },
  { label: 'Contact',  href: '#contact' },
]

const sectionIds = ['hero', ...links.map(l => l.href.slice(1))]

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function Navbar({ onOpenPalette, theme = 'default', onThemeChange }) {
  const [scrolled, setScrolled]       = useState(false)
  const [hidden, setHidden]           = useState(false)
  const [activeSection, setActive]    = useState('')
  const [menuOpen, setMenuOpen]       = useState(false)
  const prevScrollY                   = useRef(0)
  const menuRef                       = useRef(null)

  // Single merged scroll listener — hide/show + scroll-spy
  useEffect(() => {
    const OFFSET = 120

    const onScroll = () => {
      const y = window.scrollY

      // Hide / show
      setScrolled(y > 20)
      setHidden(y > prevScrollY.current && y > 80)
      prevScrollY.current = y

      // Scroll-spy
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80
      if (nearBottom) {
        let last = ''
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top < window.innerHeight) last = id
        }
        setActive(last)
        return
      }

      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= OFFSET) current = id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Focus trapping for mobile menu
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return
    const focusable = menuRef.current.querySelectorAll('a, button')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    first?.focus()
    return () => document.removeEventListener('keydown', trap)
  }, [menuOpen])

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
        {/* Logo */}
        <a href="#hero" className="hover:opacity-70 transition-opacity shrink-0" aria-label="Go to top">
          <img src={signatureImg} alt="Ryan Wetzstein" className="h-8 w-auto invert" />
        </a>

        {/* Desktop nav — glass pill + music icon, absolutely centered */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
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
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-3 right-3 h-px bg-[var(--color-accent-light)] rounded"
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </GlassSurface>

          <a
            href="#music"
            aria-label="Music page"
            className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-accent-light)] hover:bg-white/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </a>
        </div>

        {/* Right side: theme picker + palette + hamburger */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Theme picker — desktop (shadcn DropdownMenu) */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Change color theme"
                className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
              >
                <span
                  className="block w-3.5 h-3.5 rounded-full border-2 border-white/30"
                  style={{ background: THEME_OPTIONS.find(t => t.id === theme)?.swatch }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuLabel>THEME</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {THEME_OPTIONS.map(opt => (
                  <DropdownMenuItem
                    key={opt.id}
                    onSelect={() => onThemeChange?.(opt.id)}
                    className={theme === opt.id ? 'bg-white/10 text-[var(--color-text)]' : ''}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: opt.swatch }} />
                    <span>{opt.label}</span>
                    {theme === opt.id && <Check className="ml-auto w-3.5 h-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {onOpenPalette && (
            <button
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors text-xs font-mono"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="bg-white/5 border border-white/10 px-1 rounded">Ctrl+K</kbd>
            </button>
          )}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
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
            className="md:hidden bg-[var(--color-surface-2)]/95 backdrop-blur border-b border-white/10 px-6 pb-4"
          >
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
              <li>
                <a
                  href="#music"
                  onClick={handleNavClick}
                  className="block py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors duration-200"
                >
                  Music
                </a>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs font-mono text-[var(--color-muted)] mb-2 px-0.5">Theme</p>
              <div className="flex gap-2">
                {THEME_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { onThemeChange?.(opt.id); setMenuOpen(false) }}
                    aria-label={opt.label}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                      theme === opt.id
                        ? 'border-white/20 text-[var(--color-text)] bg-white/10'
                        : 'border-transparent text-[var(--color-muted)] hover:bg-white/5'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: opt.swatch }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
