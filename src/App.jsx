// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { ArrowsOut, ArrowsIn } from '@phosphor-icons/react'
import CommandPaletteHost from './components/CommandPaletteHost'
import { Toaster } from '@/components/ui/sonner'
import { useStage } from './stage/useStage'
import Stage from './stage/Stage'
import { projects } from './stage/projects'
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

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The outgoing world stays for a moment and dissolves beneath the next one's iris.
// Both keep their keys, so neither field is torn down and rebuilt on the way.
function useWorlds(pageId) {
  const [current, setCurrent] = useState(pageId)
  const [leaving, setLeaving] = useState(null)
  if (current !== pageId) {
    setCurrent(pageId)
    setLeaving(reducedMotion() ? null : current)
  }
  useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(() => setLeaving(null), 1100)
    return () => clearTimeout(timer)
  }, [leaving])
  return leaving && leaving !== pageId ? [leaving, pageId] : [pageId]
}

function World({ id, leaving }) {
  if (id === 'about') return <AboutWorld leaving={leaving} />
  return <ProjectBackground project={projects.find(project => project.id === id)} leaving={leaving} />
}

// Once per browser session, say that the field answers the pointer, then step aside.
const nudgeKey = 'field-nudge-seen'
function useFieldNudge(project) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!project || reducedMotion()) return
    try { if (sessionStorage.getItem(nudgeKey)) return; sessionStorage.setItem(nudgeKey, '1') } catch { /* Show it once for this page instead. */ }
    const show = setTimeout(() => setShown(true), 1400)
    const hide = setTimeout(() => setShown(false), 7400)
    return () => { clearTimeout(show); clearTimeout(hide); setShown(false) }
  }, [project])
  return shown
}

export default function App() {
  const [immersed, setImmersed] = useState(false)
  const [tint, setTint] = useState(null)
  const shell = useRef(null)
  // Immerse morphs the media into place with a view transition where the browser has one.
  const setImmersion = next => {
    const update = () => flushSync(() => setImmersed(next))
    if (!document.startViewTransition || reducedMotion()) update()
    else document.startViewTransition(update)
  }
  const stage = useStage({ onEscape: () => { if (!immersed) return false; setImmersion(false); return true } })
  const worlds = useWorlds(stage.pageId)
  const nudge = useFieldNudge(immersed ? null : stage.project)
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
          {worlds.map(id => <World key={id} id={id} leaving={id !== stage.pageId} />)}
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
            {nudge && !immersive && <p className="immerse-hint field-nudge" key={`nudge-${stage.project.id}`}>{stage.project.field} <span>Immerse to play with it.</span></p>}
            {immersive && <p className="immerse-hint" key={stage.project.id}><span className="immerse-hint-live">{stage.project.field}</span><span className="immerse-hint-reduced">Motion is reduced, so the field holds still.</span></p>}
          </main>
          <footer className="showcase-footer">
            <div className="showcase-footer-meta">
              <span>← → to explore <span className="footer-divider">/</span> Esc for {immersive ? 'the full page' : 'home'}</span>
              {stage.project && <button type="button" className="immerse-toggle" aria-pressed={immersive} onClick={() => setImmersion(!immersive)}>
                {immersive ? <ArrowsIn aria-hidden="true" /> : <ArrowsOut aria-hidden="true" />}<span className="immerse-label">{immersive ? 'Leave immersive view' : 'Immerse'}</span>
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
