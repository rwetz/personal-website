import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Projects       from './components/Projects'
import Skills         from './components/Skills'
import Contact        from './components/Contact'
import SignatureCard  from './components/SignatureCard'
import CommandPalette from './components/CommandPalette'
import PartyMode      from './components/PartyMode'
import { Toaster }    from '@/components/ui/sonner'

const Music = lazy(() => import('./components/Music'))
const DAW   = lazy(() => import('./components/DAW'))
const Nexis = lazy(() => import('./components/Nexis'))

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

function useSubpageExit(isSubpage, hash) {
  const wasSubpage = useRef(isSubpage)
  useEffect(() => {
    if (wasSubpage.current && !isSubpage) {
      const id = hash.replace('#', '') || 'hero'
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'instant' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }, 380)
      return () => clearTimeout(t)
    }
    wasSubpage.current = isSubpage
  }, [isSubpage]) // eslint-disable-line react-hooks/exhaustive-deps
}

const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9297a0', fontSize: 14 }}>
    Loading…
  </div>
)

export default function App() {
  const hash    = useHash()
  const isMusic = hash === '#music'
  const isDAW   = hash === '#daw'
  const isNexis = hash === '#nexis'
  useSubpageExit(isMusic || isDAW || isNexis, hash)

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [partyMode, setPartyMode]     = useState(false)
  const konamiProgress                = useRef(0)

  // Cmd+K
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

  // Konami code easter egg
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

  const subpageProps = {
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0  },
    exit:       { opacity: 0, y: -16 },
    transition: { duration: 0.35, ease: 'easeInOut' },
  }

  return (
    <>
      <PartyMode active={partyMode} onExit={() => setPartyMode(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Toaster />

      <div className={partyMode ? 'party-active' : ''}>
        <AnimatePresence mode="wait">
          {isNexis ? (
            <motion.div key="nexis" {...subpageProps}>
              <Suspense fallback={<LoadingScreen />}><Nexis /></Suspense>
            </motion.div>
          ) : isDAW ? (
            <motion.div key="daw" {...subpageProps}>
              <Suspense fallback={<LoadingScreen />}><DAW /></Suspense>
            </motion.div>
          ) : isMusic ? (
            <motion.div key="music" {...subpageProps}>
              <Suspense fallback={<LoadingScreen />}><Music /></Suspense>
            </motion.div>
          ) : (
            <motion.div key="main" {...subpageProps}>
              <Navbar />

              <main id="main-content">
                {/* 1. White canvas hero */}
                <Hero />

                {/* 2. Coral signature card — brand voltage moment */}
                <SignatureCard variant="coral">
                  <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65, marginBottom: 20 }}>
                    What I'm about
                  </p>
                  <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 24px', maxWidth: 560 }}>
                    Building production-ready software as a student — not waiting until I graduate.
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, maxWidth: 480, margin: '0 0 36px' }}>
                    Two years of object-oriented experience, hands-on with ML frameworks, and shipping
                    real web apps. Every project teaches me something I can't learn in a classroom.
                  </p>
                  <a
                    href="#about"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '14px 24px',
                      background: '#ffffff',
                      color: '#181d26',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 500,
                      textDecoration: 'none',
                      minHeight: 48,
                    }}
                  >
                    Learn more
                  </a>
                </SignatureCard>

                {/* 3. White — About */}
                <About />

                {/* 4. Surface-soft — Projects */}
                <Projects />

                {/* 5. Forest signature card */}
                <SignatureCard variant="forest">
                  <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 20 }}>
                    My stack
                  </p>
                  <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 20px', maxWidth: 520 }}>
                    Depth across the full stack — always adding more.
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 440, margin: '0 0 36px' }}>
                    Java · Python · TypeScript · React · Node.js · FastAPI · PyTorch — and always curious
                    about what's next.
                  </p>
                  <a
                    href="#skills"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '14px 24px',
                      background: '#ffffff',
                      color: '#181d26',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 500,
                      textDecoration: 'none',
                      minHeight: 48,
                    }}
                  >
                    View skills
                  </a>
                </SignatureCard>

                {/* 6. White — Skills */}
                <Skills />

                {/* 7. Dark navy CTA card — contact teaser */}
                <SignatureCard variant="dark">
                  <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 20 }}>
                    Let's connect
                  </p>
                  <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 20px', maxWidth: 520 }}>
                    Open to internships, collaborations, and good conversations.
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 420, margin: '0 0 36px' }}>
                    Remote-friendly. Reach out any time — I reply to every message.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <a
                      href="#contact"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '14px 24px',
                        background: '#ffffff',
                        color: '#181d26',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        textDecoration: 'none',
                        minHeight: 48,
                      }}
                    >
                      Get in touch
                    </a>
                    <a
                      href="mailto:rwetz00@gmail.com"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '14px 24px',
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.7)',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 400,
                        textDecoration: 'none',
                        minHeight: 48,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      rwetz00@gmail.com
                    </a>
                  </div>
                </SignatureCard>

                {/* 8. White — Contact form */}
                <Contact />
              </main>

              {/* Footer */}
              <footer
                style={{
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid #dddddd',
                  padding: '40px 24px',
                }}
              >
                <div
                  style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#9297a0' }}>
                      Built with React + Vite + Tailwind CSS
                      {' · '}
                      <a
                        href="https://github.com/rwetz/personal-website"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#41454d', textDecoration: 'none', borderBottom: '1px solid #dddddd' }}
                      >
                        View source
                      </a>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <a
                        href="https://instagram.com/ryanwetzstein"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        style={{ color: '#9297a0', display: 'flex' }}
                      >
                        <svg width="18" height="18"><use href="/icons.svg#instagram-icon" /></svg>
                      </a>
                      <a
                        href="https://x.com/ryanawetzstein"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        style={{ color: '#9297a0', display: 'flex' }}
                      >
                        <svg width="18" height="18"><use href="/icons.svg#x-icon" /></svg>
                      </a>
                      <a
                        href="#music"
                        aria-label="Music"
                        style={{ color: '#9297a0', display: 'flex' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <p style={{ fontSize: 11, color: '#9297a0', textAlign: 'center' }}>
                    press{' '}
                    <kbd style={{ fontFamily: 'monospace', background: '#f0f2f5', border: '1px solid #dddddd', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>
                      Ctrl+K
                    </kbd>
                    {' '}for commands · Konami code for a surprise
                  </p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
