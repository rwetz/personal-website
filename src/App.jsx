// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useState } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import CommandPaletteHost from './components/CommandPaletteHost'
import { Toaster } from '@/components/ui/sonner'
import { useStage } from './stage/useStage'
import Stage from './stage/Stage'
import Intro from './stage/Intro'
import Rail from './stage/Rail'
import Heptagram from './brand/Heptagram'
import './stage/stage.css'
import './stage/identities.css'
import './stage/refinements.css'

const AboutModal = lazy(() => import('./stage/AboutModal'))
const loadMotionFeatures = () => import('./lib/motion-features').then(mod => mod.default)

export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const stage = useStage()
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="showcase-shell" data-project={stage.project?.id ?? 'home'}>
          <a className="showcase-skip" href="#main-content" onClick={event => {
            event.preventDefault()
            document.getElementById('main-content')?.focus()
          }}>Skip to project</a>
          <header className="showcase-header">
            <a href="#/" className="showcase-wordmark" aria-label="Ryan Wetzstein, home"><Heptagram activeId={stage.project?.id} /><span>Ryan Wetzstein</span></a>
            <div className="showcase-header-actions">
              <a href="/resume.pdf" download>Resume ↗</a>
              <button id="about-trigger" onClick={() => setAboutOpen(true)}>About & contact</button>
            </div>
          </header>
          <main id="main-content" tabIndex={-1} {...stage.gestures}>
            {stage.project ? <Stage project={stage.project} /> : <Intro />}
          </main>
          <footer className="showcase-footer">
            <div className="showcase-footer-meta"><span>Selected work <span className="footer-count">Five projects</span></span><span>← → to explore <span className="footer-divider">/</span> Esc for home</span></div>
            <Rail activeId={stage.project?.id} navigate={stage.navigate} />
          </footer>
          <span className="sr-only" role="status" aria-live="polite">{stage.project?.name ?? 'Home, selected work'}</span>
        </div>
        <CommandPaletteHost onAbout={() => setAboutOpen(true)} />
        {aboutOpen && <Suspense fallback={<div className="showcase-loading" role="status">Loading about…</div>}><AboutModal onClose={() => setAboutOpen(false)} /></Suspense>}
        <Toaster />
      </MotionConfig>
    </LazyMotion>
  )
}
