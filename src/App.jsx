import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import './index.css'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Projects       from './components/Projects'
import Skills         from './components/Skills'
import Contact        from './components/Contact'
import SignatureCard  from './components/SignatureCard'
import CommandPalette from './components/CommandPalette'
import Cubes         from './components/Cubes'
import MagnetLines   from './components/MagnetLines'
import { Toaster }    from '@/components/ui/sonner'

const Music = lazy(() => import('./components/Music'))
const DAW   = lazy(() => import('./components/DAW'))
const Nexis = lazy(() => import('./components/Nexis'))

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

  const subpageProps = {
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0  },
    exit:       { opacity: 0, y: -16 },
    transition: { duration: 0.35, ease: 'easeInOut' },
  }

  return (
    <>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Toaster />

      <div>
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
                  {/* Left */}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65, marginBottom: 20 }}>
                      What I'm about
                    </p>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 24px', maxWidth: 560 }}>
                      Building production-ready software as a student — not waiting until I graduate.
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, maxWidth: 480, margin: '0 0 36px' }}>
                      Two years of object-oriented experience, hands-on with ML frameworks, and shipping
                      real web apps.
                    </p>
                    <a
                      href="#about"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '14px 24px',
                        backgroundColor: '#ffffff',
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
                  </div>

                  {/* Right — stats */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingLeft: 180 }}>
                    {[
                      { num: '2+', label: 'Years of OOP experience' },
                      { num: '6+', label: 'Projects shipped on GitHub' },
                      { num: '5', label: 'Core languages & frameworks' },
                    ].map(({ num, label }) => (
                      <div key={label}>
                        <p style={{ fontSize: 56, fontWeight: 400, color: '#ffffff', lineHeight: 1, margin: '0 0 8px', letterSpacing: '-0.03em' }}>{num}</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.02em' }}>{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Far right — MagnetLines */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 160 }}>
                    <MagnetLines
                      rows={12}
                      columns={12}
                      containerSize="340px"
                      lineColor="rgba(255,255,255,0.25)"
                      lineWidth="2px"
                      lineHeight="28px"
                      baseAngle={-160}
                    />
                  </div>
                </SignatureCard>

                {/* 3. White — About */}
                <About />

                {/* 4. Surface-soft — Projects */}
                <Projects />

                {/* 5. Forest signature card */}
                <SignatureCard variant="forest">
                  {/* Left */}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 20 }}>
                      My stack
                    </p>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 20px', maxWidth: 520 }}>
                      Depth across the full stack — always adding more.
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 440, margin: '0 0 36px' }}>
                      From low-level OOP to ML pipelines and clean UIs — I build across the whole spectrum
                      and keep learning what's next.
                    </p>
                    <a
                      href="#skills"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '14px 24px',
                        backgroundColor: '#ffffff',
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
                  </div>

                  {/* Right — Cubes */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 160 }}>
                    <div style={{ width: '100%', maxWidth: 420, aspectRatio: '1 / 1' }}>
                      <Cubes
                        gridSize={12}
                        maxAngle={180}
                        radius={2}
                        borderStyle="1px solid rgba(255,255,255,0.12)"
                        faceColor="#0a2e0e"
                        rippleColor="rgba(255,255,255,0.35)"
                        rippleSpeed={1.5}
                        autoAnimate
                        rippleOnClick
                      />
                    </div>
                  </div>

                </SignatureCard>

                {/* 6. White — Skills */}
                <Skills />

                {/* 7. Dark navy CTA card — contact teaser */}
                <SignatureCard variant="dark">
                  {/* Left */}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 20 }}>
                      Let's connect
                    </p>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 20px', maxWidth: 520 }}>
                      Open to internships, collaborations, and good conversations.
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 420, margin: '0 0 36px' }}>
                      Remote-friendly. Reach out any time — I reply to every message.
                    </p>
                    <a
                      href="#contact"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '14px 24px',
                        backgroundColor: '#ffffff',
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
                  </div>

                  {/* Right — availability details (#12: replaces ghost email button) */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[
                      { label: 'Available from', value: 'Fall 2026' },
                      { label: 'Preferred roles', value: 'SWE Intern · ML / AI Intern' },
                      { label: 'Location', value: 'Remote-friendly · Fargo, ND' },
                      { label: 'Email', value: 'rwetz00@gmail.com', href: 'mailto:rwetz00@gmail.com' },
                    ].map(({ label, value, href }) => (
                      <div key={label} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0' }}>
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 6px' }}>{label}</p>
                        {href ? (
                          <a href={href} style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: 0, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 1 }}>{value}</a>
                        ) : (
                          <p style={{ fontSize: 15, color: '#ffffff', margin: 0 }}>{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </SignatureCard>

                {/* 8. White — Contact form */}
                <Contact />
              </main>

              {/* Footer */}
              <footer
                className="dot-grid"
                style={{
                  borderTop: '1px solid #dddddd',
                  padding: '40px 80px',
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
                      © 2026 Ryan Wetzstein
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
                        href="#nexis"
                        aria-label="Nexis"
                        style={{ color: '#9297a0', display: 'flex' }}
                      >
                        <Terminal size={18} strokeWidth={1.75} />
                      </a>
                    </div>
                  </div>

                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
