// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import './index.css'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Experience     from './components/Experience'
import Projects       from './components/Projects'
import Skills         from './components/Skills'
import Contact        from './components/Contact'
import SignatureCard  from './components/SignatureCard'
import CommandPalette from './components/CommandPalette'
import { Toaster }    from '@/components/ui/sonner'

/** Nexis moved off this site to its own domain; #nexis is kept only as a redirect. */
const NEXIS_URL = 'https://nexisdev.org'

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

  // Send old bookmarks and inbound links to the standalone Nexis site.
  // replace() rather than assign() so Back doesn't bounce them straight here again.
  useEffect(() => {
    if (hash === '#nexis') window.location.replace(NEXIS_URL)
  }, [hash])

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
          <motion.div key="main" {...subpageProps}>
            <Navbar />

            <main id="main-content">
              {/* 1. White canvas hero */}
              <Hero />

              {/* 2. White — About */}
              <About />

              {/* 3. White — Experience */}
              <Experience />

              {/* 4. Surface-soft — Projects */}
              <Projects />

              {/* 5. White — Skills */}
              <Skills />

              {/* 6. Dark navy CTA card — contact teaser */}
              <SignatureCard variant="dark">
                {/* Left */}
                <div>
                  <p className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>
                    Let's connect
                  </p>
                  <h2 className="section-title" style={{ color: '#ffffff', margin: '0 0 20px', maxWidth: 520 }}>
                    Open to internships, collaborations, and good conversations.
                  </h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 420, margin: '0 0 36px' }}>
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
                      <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 6px' }}>{label}</p>
                      {href ? (
                        <a href={href} style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: 0, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 1 }}>{value}</a>
                      ) : (
                        <p style={{ fontSize: 15, color: '#ffffff', margin: 0 }}>{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </SignatureCard>

              {/* 7. White — Contact form */}
              <Contact />
            </main>

            {/* Footer */}
            <footer
              className="dot-grid"
              style={{ borderTop: '1px solid #dddddd', padding: '40px 0' }}
            >
              <div
                className="page-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--m-subtle)' }}>
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
                      style={{ color: 'var(--m-subtle)', display: 'flex' }}
                    >
                      <svg width="18" height="18"><use href="/icons.svg#instagram-icon" /></svg>
                    </a>
                    <a
                      href="https://x.com/ryanawetzstein"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                      style={{ color: 'var(--m-subtle)', display: 'flex' }}
                    >
                      <svg width="18" height="18"><use href="/icons.svg#x-icon" /></svg>
                    </a>
                    <a
                      href={NEXIS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Nexis"
                      style={{ color: 'var(--m-subtle)', display: 'flex' }}
                    >
                      <Terminal size={18} strokeWidth={1.75} />
                    </a>
                  </div>
                </div>

              </div>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
