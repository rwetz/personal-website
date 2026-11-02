// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { projects } from './projects'
import Heptagram from '../brand/Heptagram'
import { emblems } from '../brand/emblems'
export default function Rail({ activeId, navigate }) {
  const onKeyDown = event => {
    const index = projects.findIndex(project => project.id === activeId)
    let next
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % projects.length
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + projects.length) % projects.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = projects.length - 1
    if (/^[1-5]$/.test(event.key)) next = Number(event.key) - 1
    if (event.key === 'Escape') { event.preventDefault(); navigate(null); document.getElementById('rail-home')?.focus(); return }
    if (next === undefined) return
    event.preventDefault(); navigate(projects[next].id)
    document.getElementById(`tab-${projects[next].id}`)?.focus()
  }
  return (
    <nav className="showcase-rail" aria-label="Selected work">
      <a id="rail-home" href="#/" aria-label="Home" aria-current={!activeId ? 'page' : undefined}><Heptagram /></a>
      <div role="tablist" aria-label="Projects" onKeyDown={onKeyDown}>
        {projects.map((project, index) => (
          <button key={project.id} id={`tab-${project.id}`} role="tab" type="button"
            aria-selected={activeId === project.id} aria-controls={activeId === project.id ? `panel-${project.id}` : undefined}
            tabIndex={activeId === project.id || (!activeId && index === 0) ? 0 : -1} onClick={() => navigate(project.id)}>
            <span className="rail-number">0{index + 1}</span><svg className="rail-emblem" viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg><span className="rail-name">{project.name}</span><span className="rail-state" aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  )
}
