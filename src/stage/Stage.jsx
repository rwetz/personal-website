// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useEffect } from 'react'
import { m } from 'framer-motion'
import { projects } from './projects'
import HalcyraScene from './scenes/HalcyraScene'
import { emblems } from '../brand/emblems'
import { setIrisOrigin } from './iris'
const loaders = {
  nexis: () => import('./scenes/NexisScene'),
  biblelm: () => import('./scenes/BibleLmScene'),
  logscope: () => import('./scenes/LogscopeScene'),
  ateru: () => import('./scenes/AteruScene'),
  halcyra: () => Promise.resolve({ default: HalcyraScene }),
}
const scenes = Object.fromEntries(Object.entries(loaders).map(([id, load]) => [id, lazy(load)]))
// Wide screens show the neighbouring worlds at the edges, in their own colour.
function Peek({ project, direction }) {
  const label = direction === 'previous' ? 'Previous' : 'Next'
  return <a className={`stage-peek peek-${direction}`} href={project ? `#/${project.id}` : '#/'}
    style={project ? { '--peek-accent': project.palette.accent } : undefined}
    onPointerDown={event => setIrisOrigin(event.currentTarget)}>
    {project ? <svg viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg> : <span className="peek-home" aria-hidden="true" />}
    <span><small>{label}</small> {project?.name ?? 'Home'}</span>
  </a>
}

export default function Stage({ project }) {
  const index = projects.indexOf(project)
  const Scene = project.id === 'halcyra' ? HalcyraScene : scenes[project.id]
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
      </div>
      <div className="project-copy" key={`copy-${project.id}`}>
        <p className="showcase-eyebrow"><span>{String(index).padStart(2, '0')} / 04</span><span>{project.kind}</span></p>
        <h1 tabIndex={-1}>{project.name}</h1>
        <p className="project-tagline">{project.tagline}</p>
        <ul className="project-tags" aria-label="Project tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div>
      </div>
      <nav className="stage-peeks" aria-label="Neighbouring projects">
        <Peek project={projects[index - 1]} direction="previous" />
        <Peek project={projects[index + 1]} direction="next" />
      </nav>
      <m.figure layoutId={`project-preview-${project.id}`} transition={{ duration: .6, ease: [.22, 1, .36, 1] }} className="project-media" key={project.id}>
        <Suspense fallback={<img src={project.media.src} alt={project.media.alt} />}><Scene project={project} /></Suspense>
      </m.figure>
    </section>
  )
}
