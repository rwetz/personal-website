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
import ProjectBackground from './stage/ProjectBackground'
import Intro from './stage/Intro'
import Rail from './stage/Rail'
import AssetWarmup from './stage/AssetWarmup'
import Heptagram from './brand/Heptagram'
import './stage/stage.css'
import './stage/identities.css'
import './stage/refinements.css'
import './stage/product-buttons.css'

const AboutPage = lazy(() => import('./stage/AboutPage'))
const loadMotionFeatures = () => import('./lib/motion-features').then(mod => mod.default)

export default function App() {
  const stage = useStage()
  const [returnProject, setReturnProject] = useState(null)
  const openAbout = () => {
    if (stage.pageId !== 'about') setReturnProject(stage.project?.id ?? null)
    stage.navigate('about')
  }
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className="showcase-shell" data-project={stage.pageId} onClickCapture={event => {
          if (stage.pageId !== 'logscope') return
          const control = event.target.closest('.showcase-header-actions button, .media-toggle, .showcase-rail button, .showcase-rail > a')
          if (!control) return
          control.classList.remove('ferrite-ack')
          void control.offsetWidth
          control.classList.add('ferrite-ack')
        }} onAnimationEnd={event => {
          if (event.animationName === 'ferrite-ack') event.target.classList.remove('ferrite-ack')
        }}>
          {stage.pageId !== 'about' && <ProjectBackground key={stage.pageId} project={stage.project} />}
          <a className="showcase-skip" href="#main-content" onClick={event => {
            event.preventDefault()
            document.getElementById('main-content')?.focus()
          }}>Skip to project</a>
          <header className="showcase-header">
            <a href="#/" className="showcase-wordmark" aria-label="Ryan Wetzstein, home"><Heptagram activeId={stage.project?.id} /><span>Ryan Wetzstein</span></a>
            <div className="showcase-header-actions">
              <a href="/resume.pdf" download>Resume ↗</a>
              <button id="about-trigger" onClick={openAbout} aria-current={stage.pageId === 'about' ? 'page' : undefined}>About & contact</button>
            </div>
          </header>
          <main id="main-content" tabIndex={-1} {...(stage.pageId === 'about' ? {} : stage.gestures)}>
            {stage.pageId === 'about' ? <Suspense fallback={<p role="status">Loading about…</p>}><AboutPage returnProject={returnProject} /></Suspense> : stage.project ? <Stage project={stage.project} /> : <Intro />}
          </main>
          <footer className="showcase-footer">
            <div className="showcase-footer-meta"><span>← → to explore <span className="footer-divider">/</span> Esc for home</span></div>
            <Rail activeId={stage.project?.id} navigate={stage.navigate} pageId={stage.pageId} />
          </footer>
          <span className="sr-only" role="status" aria-live="polite">{stage.pageId === 'about' ? 'About Ryan' : stage.project?.name ?? 'Home, selected work'}</span>
        </div>
        <AssetWarmup />
        <CommandPaletteHost onAbout={openAbout} />
        <Toaster />
      </MotionConfig>
    </LazyMotion>
  )
}
