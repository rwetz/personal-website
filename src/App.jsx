// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { InstagramLogo, XLogo, TerminalWindow } from '@phosphor-icons/react'
import './index.css'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Experience     from './components/Experience'
import Projects       from './components/Projects'
import Skills         from './components/Skills'
import Contact        from './components/Contact'
import CommandPaletteHost from './components/CommandPaletteHost'
import { Toaster }    from '@/components/ui/sonner'

/** Nexis moved off this site to its own domain; #nexis is kept only as a redirect. */
const NEXIS_URL = 'https://nexisdev.org'

/** Animation features arrive in their own chunk; see lib/motion-features.js. */
const loadMotionFeatures = () => import('./lib/motion-features').then(mod => mod.default)

export default function App() {
  // Send old #nexis bookmarks and inbound links to the standalone Nexis site.
  // replace() rather than assign() so Back doesn't bounce them straight here
  // again. A listener rather than hash state: every nav click changes the hash,
  // and state here would re-render the entire page each time.
  useEffect(() => {
    const redirect = () => {
      if (window.location.hash === '#nexis') window.location.replace(NEXIS_URL)
    }
    redirect()
    window.addEventListener('hashchange', redirect)
    return () => window.removeEventListener('hashchange', redirect)
  }, [])

  return (
    // reducedMotion="user": framer skips transform animations for visitors who
    // ask for reduced motion, leaving only opacity fades.
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <CommandPaletteHost />
        <Toaster />

        <div>
          <Navbar />

          <main id="main-content">
            {/* 1. White canvas hero */}
            <Hero />

            {/* 2. Surface-soft — Projects, straight after the intro: it's the strongest evidence */}
            <Projects />

            {/* 3. White — About */}
            <About />

            {/* 4. White — Experience */}
            <Experience />

            {/* 5. White — Skills */}
            <Skills />

            {/* 6. White — Contact, with availability */}
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
                    <InstagramLogo size={20} aria-hidden="true" />
                  </a>
                  <a
                    href="https://x.com/ryanawetzstein"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    style={{ color: 'var(--m-subtle)', display: 'flex' }}
                  >
                    <XLogo size={20} aria-hidden="true" />
                  </a>
                  <a
                    href={NEXIS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Nexis"
                    style={{ color: 'var(--m-subtle)', display: 'flex' }}
                  >
                    <TerminalWindow size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

            </div>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
