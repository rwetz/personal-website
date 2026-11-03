// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { projects } from './projects'
import ProjectPreview from './ProjectPreview'
import { setIrisOrigin } from './iris'
import ateruStudio from '../assets/showcase/ateru-studio.webp'
import ateruAppearance from '../assets/showcase/ateru-appearance.webp'
export default function Intro({ onTint }) {
  const [hovered, setHovered] = useState(null)
  // Any pointer or focus tints the home field; only desktop hover plays a video.
  const preview = project => {
    onTint?.(project.palette.accent)
    const id = project.id
    if (window.matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) setHovered(id)
  }
  const leave = () => { setHovered(null); onTint?.(null) }
  useEffect(() => () => onTint?.(null), [onTint])
  return <section className="showcase-intro" aria-labelledby="intro-title">
    <div className="intro-copy">
      <div><p className="showcase-eyebrow">Independent software & personal experiments</p>
      <h1 id="intro-title" tabIndex={-1}>Built with intent.<br /><span>Down to the details.</span></h1></div>
      <div className="intro-note"><p className="showcase-intro-description">I’m Ryan. I build tools for the terminal, the everyday, and the things I can’t stop thinking about.</p>
      <a className="intro-enter" href="#/nexis">Explore selected work <span aria-hidden="true">↗</span></a></div>
    </div>
    <div className="constellation" aria-label="Choose a project">
      {projects.map((project, index) => <m.a layoutId={`project-preview-${project.id}`} transition={{ duration: .6, ease: [.22, 1, .36, 1] }} key={project.id} className={`constellation-object object-${index}`} href={`#/${project.id}`} style={{ '--object-accent': project.palette.accent, '--delay': `${index * -1.7}s` }} onMouseEnter={() => preview(project)} onMouseLeave={leave} onFocus={() => preview(project)} onBlur={leave} onPointerDown={event => setIrisOrigin(event.currentTarget)}>
        <div className="constellation-object-inner">
        <div className="project-tile-image"><img src={project.media.src} alt="" loading="eager" width="460" height="192" />
        {project.id === 'ateru' && <><img src={ateruStudio} alt="" width="393" height="852" /><img src={ateruAppearance} alt="" width="393" height="852" /></>}
        {hovered === project.id && project.media.animated && <ProjectPreview id={project.id} />}
        </div>
        <span><small>{String(index).padStart(2, '0')}</small><strong>{project.name}</strong><small>{project.kind}</small><b aria-hidden="true">↗</b></span>
        </div>
      </m.a>)}
    </div>
  </section>
}
