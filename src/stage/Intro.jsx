// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { projects } from './projects'
import Heptagram from '../brand/Heptagram'
import ProjectPreview from './ProjectPreview'
export default function Intro() {
  const cluster = useRef(null)
  const [hovered, setHovered] = useState(null)
  const preview = id => {
    if (window.matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) setHovered(id)
  }
  useEffect(() => {
    if (!window.matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const element = cluster.current
    let frame
    const move = event => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect()
        element.style.setProperty('--rx', `${(event.clientY - box.top - box.height / 2) / box.height * -6}deg`)
        element.style.setProperty('--ry', `${(event.clientX - box.left - box.width / 2) / box.width * 6}deg`)
      })
    }
    const reset = () => { element.style.setProperty('--rx', '0deg'); element.style.setProperty('--ry', '0deg') }
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', reset)
    return () => { cancelAnimationFrame(frame); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset) }
  }, [])
  return <section className="showcase-intro" aria-labelledby="intro-title">
    <div className="intro-copy">
      <p className="showcase-eyebrow">Independent software. A personal point of view.</p>
      <h1 id="intro-title" tabIndex={-1}>Small details.<br /><span>Entire worlds.</span></h1>
      <p className="showcase-intro-description">I’m Ryan. I build tools and the visual languages they live in.</p>
      <a className="intro-enter" href="#/nexis">Explore the work <span aria-hidden="true">↗</span></a>
    </div>
    <div className="constellation" ref={cluster} aria-label="Choose a project">
      <div className="constellation-orbit" aria-hidden="true" />
      <Heptagram className="constellation-mark" />
      {projects.map((project, index) => <m.a layoutId={`project-preview-${project.id}`} transition={{ duration: .6, ease: [.22, 1, .36, 1] }} key={project.id} className={`constellation-object object-${index}`} href={`#/${project.id}`} style={{ '--object-accent': project.palette.accent, '--delay': `${index * -1.7}s` }} onMouseEnter={() => preview(project.id)} onMouseLeave={() => setHovered(null)} onFocus={() => preview(project.id)} onBlur={() => setHovered(null)}>
        <div className="constellation-object-inner">
        <img src={project.media.thumb ?? project.media.src} alt="" loading="lazy" width="460" height="192" />
        {hovered === project.id && project.media.animated && <ProjectPreview id={project.id} />}
        <span><small>0{index + 1}</small><strong>{project.name}</strong><small>{project.kind}</small></span>
        </div>
      </m.a>)}
    </div>
  </section>
}
