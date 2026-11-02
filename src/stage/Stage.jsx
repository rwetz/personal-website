// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useEffect } from 'react'
import { m } from 'framer-motion'
import { projects } from './projects'
import SceneArtwork from './SceneArtwork'
const loaders = {
  nexis: () => import('./scenes/NexisScene'),
  biblelm: () => import('./scenes/BibleLmScene'),
  logscope: () => import('./scenes/LogscopeScene'),
  ateru: () => import('./scenes/AteruScene'),
  halcyra: () => import('./scenes/HalcyraScene'),
}
const scenes = Object.fromEntries(Object.entries(loaders).map(([id, load]) => [id, lazy(load)]))
export default function Stage({ project }) {
  const index = projects.indexOf(project)
  const Scene = scenes[project.id]
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = projects[(index + 1) % projects.length]
      loaders[next.id]()
      const previous = projects[(index - 1 + projects.length) % projects.length]
      loaders[previous.id]()
    }, 900)
    return () => clearTimeout(timer)
  }, [index])
  return (
    <section className={`project-stage scene-${project.id}`} role="tabpanel" id={`panel-${project.id}`} aria-labelledby={`tab-${project.id}`}>
      <div className="project-backdrop" key={`bg-${project.id}`} aria-hidden="true">
        {project.id === 'biblelm' && <><svg className="scriptorium-cross" viewBox="0 0 1024 1024"><defs><pattern id="cross-dither" patternUnits="userSpaceOnUse" width="12" height="12"><rect width="6" height="6" fill="currentColor" /></pattern></defs><path d="M440 80H584V336H814V480H584V910H440V480H210V336H440Z" fill="url(#cross-dither)" /></svg><span className="scriptorium-ornament">✦ · ✦</span></>}
        <SceneArtwork project={project.id} />
      </div>
      <div className="project-copy" key={`copy-${project.id}`}>
        <p className="showcase-eyebrow"><span>0{index + 1} / 05</span><span>{project.kind}</span></p>
        <h1 tabIndex={-1}>{project.name}</h1>
        <p className="project-tagline">{project.tagline}</p>
        <ul className="project-tags" aria-label="Project tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div>
      </div>
      <m.figure layoutId={`project-preview-${project.id}`} transition={{ duration: .6, ease: [.22, 1, .36, 1] }} className="project-media" key={project.id}>
        {project.id === 'halcyra' && <div className="media-instrument-header"><span className="instrument-led" />Halcyra <span>Wavetable instrument</span><svg viewBox="0 0 80 20" aria-hidden="true"><path d="M0 10H8L16 2L28 18L40 2L52 18L64 2L72 10H80" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>}
        {project.id === 'logscope' && <div className="media-instrument-header log-window-header"><span className="instrument-led" />Logscope <span>Live search / demo session</span><span aria-hidden="true">⌘</span></div>}
        <Suspense fallback={<img src={project.media.src} alt={project.media.alt} />}><Scene project={project} /></Suspense>
        <figcaption><span>{project.media.caption}</span><span>{project.media.animated ? 'App recording' : 'App capture'}</span></figcaption>
      </m.figure>
    </section>
  )
}
