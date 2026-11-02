// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { projects } from './projects'
import Heptagram from '../brand/Heptagram'
import { emblems } from '../brand/emblems'
import RubberSegment from '../components/micro/RubberSegment'
export default function Rail({ activeId, navigate, pageId }) {
  const onKeyDown = event => {
    const index = projects.findIndex(project => project.id === activeId)
    let next
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % projects.length
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + projects.length) % projects.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = projects.length - 1
    if (/^[0-4]$/.test(event.key)) next = Number(event.key)
    if (event.key === 'Escape') { event.preventDefault(); navigate(null); document.getElementById('rail-home')?.focus(); return }
    if (next === undefined) return
    event.preventDefault(); navigate(projects[next].id)
    document.getElementById(`tab-${projects[next].id}`)?.focus()
  }
  return (
    <nav className="showcase-rail" aria-label="Selected work">
      <a id="rail-home" href="#/" aria-label="Home" aria-current={pageId === 'home' ? 'page' : undefined}><Heptagram /></a>
      <RubberSegment value={activeId ?? null} onChange={navigate} onKeyDown={onKeyDown} aria-label="Projects"
        size="lg" inset={5} radius={12} stretch={80} squash={3} draggable={false}
        trackColor="transparent" thumbColor="color-mix(in srgb, var(--stage-surface) 65%, transparent)" textColor="var(--chrome-muted)" activeTextColor="var(--stage-fg)"
        items={projects.map((project, index) => ({ value: project.id, label: <><span className="rail-number">{String(index).padStart(2, '0')}</span><svg className="rail-emblem" viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg><span className="rail-name">{project.name}</span></> }))} />
    </nav>
  )
}
