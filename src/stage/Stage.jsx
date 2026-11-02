// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useEffect } from 'react'
import { m } from 'framer-motion'
import { projects } from './projects'
const loaders = {
  nexis: () => import('./scenes/NexisScene'),
  biblelm: () => import('./scenes/BibleLmScene'),
  logscope: () => import('./scenes/LogscopeScene'),
  ferrite: () => import('./scenes/FerriteScene'),
  'nexis-design': () => import('./scenes/NexisDesignScene'),
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
    <section className="project-stage" role="tabpanel" id={`panel-${project.id}`} aria-labelledby={`tab-${project.id}`}>
      <div className="project-backdrop" key={`bg-${project.id}`} aria-hidden="true" style={{ background: `radial-gradient(ellipse at 75% 60%, ${project.palette.surface}, transparent 70%)` }} />
      <div className="project-copy" key={`copy-${project.id}`}>
        <p className="showcase-eyebrow"><span>0{index + 1} / 05</span><span>{project.kind}</span></p>
        <h1 tabIndex={-1}>{project.name}</h1>
        <p className="project-tagline">{project.tagline}</p>
        <ul className="project-tags" aria-label="Project tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-links">{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div>
      </div>
      <m.figure layoutId={`project-preview-${project.id}`} transition={{ duration: .6, ease: [.22, 1, .36, 1] }} className="project-media" key={project.id}>
        <Suspense fallback={<img src={project.media.src} alt={project.media.alt} />}><Scene project={project} /></Suspense>
        <figcaption><span>{project.media.caption}</span><span>{project.kind === 'App' ? 'Real UI' : 'Interactive specimen'}</span></figcaption>
      </m.figure>
    </section>
  )
}
