import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Resume from './components/Resume'
import Contact from './components/Contact'
import CommandPalette from './components/CommandPalette'
import PartyMode from './components/PartyMode'

const Music = lazy(() => import('./components/Music'))

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'resume', 'contact']
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}


export default function App() {
  const hash = useHash()
  const isMusic = hash === '#music'
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [partyMode, setPartyMode] = useState(false)
  const konamiProgress = useRef(0)

  // Section URL updates as user scrolls
  useEffect(() => {
    if (isMusic) return
    const update = () => {
      const OFFSET = 160
      let current = 'hero'
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= OFFSET) current = id
      }
      const newHash = current === 'hero' ? '#hero' : `#${current}`
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash)
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isMusic])

  // Cmd+K command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Konami code easter egg — party mode
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === KONAMI[konamiProgress.current]) {
        konamiProgress.current += 1
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0
          setPartyMode(v => !v)
        }
      } else {
        konamiProgress.current = 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Ctrl+Shift+L light mode toggle
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        document.documentElement.classList.toggle('light')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Party overlay lives OUTSIDE the content wrapper so position:fixed
          elements aren't trapped inside the hue-rotate stacking context */}
      <PartyMode active={partyMode} onExit={() => setPartyMode(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Content wrapper — hue-rotate applied here, not on body */}
      <div className={partyMode ? 'party-active' : ''}>
      <AnimatePresence mode="wait">
        {isMusic ? (
          <motion.div
            key="music"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center text-[var(--color-muted)] text-sm">
                Loading…
              </div>
            }>
              <Music />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Navbar onOpenPalette={() => setPaletteOpen(true)} />
            <main id="main-content">
              <Hero />
              <About />
              <Projects />
              <Skills />
              <Resume />
              <Contact />
            </main>
            <footer className="py-8 border-t border-white/5">
              <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-muted)]">
                  Built with React + Vite + Tailwind CSS &nbsp;·&nbsp;{' '}
                  <a
                    href="https://github.com/rwetz/personal-website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent-light)] transition-colors"
                  >
                    View source
                  </a>
                </span>
                <div className="flex items-center gap-5">
                  <a href="mailto:rwetz00@gmail.com" aria-label="Email" className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                    <svg width="20" height="20"><use href="/icons.svg#gmail-icon" /></svg>
                  </a>
                  <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                    <svg width="20" height="20"><use href="/icons.svg#github-icon" /></svg>
                  </a>
                  <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                    <svg width="20" height="20"><use href="/icons.svg#linkedin-icon" /></svg>
                  </a>
                  <a href="#music" aria-label="Music" className="p-2 text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  </a>
                </div>
              </div>
              <p className="text-center text-xs text-[var(--color-muted)]/50 mt-3">
                press <kbd className="font-mono bg-white/5 border border-white/10 px-1 rounded">Ctrl+K</kbd> for commands
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}
