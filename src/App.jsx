// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
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
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
