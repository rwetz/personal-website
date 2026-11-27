// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect } from 'react'
import { projects } from './projects'
import { emblems } from '../brand/emblems'
import '@fontsource-variable/space-grotesk'

// Home scrolls: the glyph field is the hero, then the statement, then the work.
export default function Intro({ onTint }) {
  useEffect(() => () => onTint?.(null), [onTint])
  return <div className="home">
    <section className="home-hero" aria-labelledby="intro-title">
      <h1 id="intro-title" tabIndex={-1}>Ryan Wetzstein</h1>
      <p className="home-hero-line">Computer science senior at NDSU. I mostly build desktop software and developer tools, in Rust and TypeScript.</p>
    </section>

    {/* Ryan's own statement. Edit it only when he asks. */}
    <section className="home-statement" aria-labelledby="statement-title">
      <h2 id="statement-title">Why I build</h2>
      <div className="statement">
        <p>I believe LLM-assisted development is more than a force multiplier. It lets a developer spend their time on higher-level decisions, like system design and user-facing design, instead of on implementation details.</p>
        <p>Assisted development has real flaws, and plenty of them. So I work on two things at once: shipping products worth making, and refining the process I use to make them. I care a lot about consistency and taste, and current models are still sloppy at both. I built the <a className="statement-nexis" href="https://github.com/rwetz/Nexis" target="_blank" rel="noopener noreferrer">Nexis</a> family of applications and its design language to test whether an LLM can stay consistent across very different kinds of application, and whether it can hold all of them to a real quality bar.</p>
        <p>Every project is iterative, and I keep finding problems, along with decisions the model made without me. My goal is to refine LLM-assisted programming with strict rules, so that I need to step into the implementation less and less.</p>
        <p>The projects I’ve built in the last year, pointless or not, would have taken me years without it. The time it has saved me in learning new languages, system design and software architecture far outweighs the time I’ve spent correcting agents, and that margin is worth the effort.</p>
        <p>I don’t think humans should ever be removed from the loop. But in an industry where efficiency and quality are always competing for priority, I’m working toward both, one step at a time.</p>
      </div>
    </section>

    <section id="work" className="home-work" aria-labelledby="work-title">
      <h2 id="work-title">Work</h2>
      <ol className="work-list">
        {projects.map(project => <li key={project.id}>
          <a href={`#/${project.id}`} style={{ '--object-accent': project.palette.accent }}
            onMouseEnter={() => onTint?.(project.id)} onMouseLeave={() => onTint?.(null)}
            onFocus={() => onTint?.(project.id)} onBlur={() => onTint?.(null)}>
            <svg className="work-emblem" viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg>
            <span className="work-text">
              <span className="work-title"><strong>{project.name}</strong><span>{project.kind}</span></span>
              <span className="work-tagline">{project.tagline}</span>
            </span>
            <img className="work-thumb" src={project.media.thumb} alt="" loading="lazy" />
          </a>
        </li>)}
      </ol>
    </section>

    <footer className="home-end">
      <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://github.com/rwetz/papers" target="_blank" rel="noopener noreferrer">Papers</a>
      <a href="mailto:rwetz00@gmail.com">rwetz00@gmail.com</a>
    </footer>
  </div>
}
