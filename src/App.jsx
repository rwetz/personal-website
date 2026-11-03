// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { ArrowsOut, ArrowsIn } from '@phosphor-icons/react'
import CommandPaletteHost from './components/CommandPaletteHost'
import { Toaster } from '@/components/ui/sonner'
import { useStage } from './stage/useStage'
import Stage from './stage/Stage'
import ProjectBackground from './stage/ProjectBackground'
import AboutWorld from './stage/AboutWorld'
import Intro from './stage/Intro'
import Rail from './stage/Rail'
import AssetWarmup from './stage/AssetWarmup'
import Heptagram from './brand/Heptagram'
import './stage/stage.css'
import './stage/identities.css'
import './stage/refinements.css'
import './stage/worlds.css'

const AboutPage = lazy(() => import('./stage/AboutPage'))
const loadMotionFeatures = () => import('./lib/motion-features').then(mod => mod.default)

// Foreground and world drift apart a little with the pointer, so they read as layers.
function usePointerDepth(shell) {
  useEffect(() => {
    const element = shell.current
    const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let x = 0
    let y = 0
    const apply = () => {
      frame = 0
      element.style.setProperty('--tilt-x', x.toFixed(3))
      element.style.setProperty('--tilt-y', y.toFixed(3))
    }
    const schedule = () => { frame ||= requestAnimationFrame(apply) }
    const onMove = event => {
      if (!query.matches) return
      x = event.clientX / window.innerWidth * 2 - 1
      y = event.clientY / window.innerHeight * 2 - 1
      schedule()
    }
    const reset = () => { x = 0; y = 0; schedule() }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    query.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      query.removeEventListener('change', reset)
    }
  }, [shell])
}

export default function App() {
  const [immersed, setImmersed] = useState(false)
  const [tint, setTint] = useState(null)
  const shell = useRef(null)
  const stage = useStage({ onEscape: () => { if (!immersed) return false; setImmersed(false); return true } })
  const [returnProject, setReturnProject] = useState(null)
  usePointerDepth(shell)
  const openAbout = () => {
    if (stage.pageId !== 'about') setReturnProject(stage.project?.id ?? null)
    stage.navigate('about')
  }
  const immersive = immersed && Boolean(stage.project)
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div ref={shell} className="showcase-shell" data-project={stage.pageId} data-immersed={immersive ? '' : undefined}
          data-tint={stage.pageId === 'home' && tint ? '' : undefined} style={tint ? { '--home-tint': tint } : undefined}>
          {stage.pageId === 'about' ? <AboutWorld key="about" /> : <ProjectBackground key={stage.pageId} project={stage.project} />}
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
            {stage.pageId === 'about' ? <Suspense fallback={<p role="status">Loading about…</p>}><AboutPage returnProject={returnProject} /></Suspense> : stage.project ? <Stage project={stage.project} /> : <Intro onTint={setTint} />}
            {immersive && <p className="immerse-hint" key={stage.project.id}><span className="immerse-hint-live">{stage.project.field}</span><span className="immerse-hint-reduced">Motion is reduced, so the field holds still.</span></p>}
          </main>
          <footer className="showcase-footer">
            <div className="showcase-footer-meta">
              <span>← → to explore <span className="footer-divider">/</span> Esc for {immersive ? 'the full page' : 'home'}</span>
              {stage.project && <button type="button" className="immerse-toggle" aria-pressed={immersive} onClick={() => setImmersed(value => !value)}>
                {immersive ? <ArrowsIn aria-hidden="true" /> : <ArrowsOut aria-hidden="true" />}{immersive ? 'Leave immersive view' : 'Immerse'}
              </button>}
            </div>
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
