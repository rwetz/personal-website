// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { projects, projectFromHash } from './projects'
import { applyTheme } from '../lib/theme'

const subscribe = listener => {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}
const snapshot = () => window.location.hash
const isBlocked = target => Boolean(document.querySelector('[role="dialog"], dialog[open]') || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))

export function useStage() {
  const hash = useSyncExternalStore(subscribe, snapshot)
  const project = projectFromHash(hash)
  const pointer = useRef(null)
  const wheel = useRef({ amount: 0, last: 0, lockedUntil: 0 })
  const navigate = useCallback(id => { window.location.hash = id ? `#/${id}` : '#/' }, [])
  const step = useCallback(direction => {
    const index = projects.findIndex(item => item.id === project?.id)
    const next = index + direction
    navigate(next < 0 || next >= projects.length ? null : projects[next].id)
  }, [project, navigate])
  useEffect(() => {
    const canonical = project ? `#/${project.id}` : '#/'
    if (hash !== canonical) {
      window.history.replaceState(null, '', canonical)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
    applyTheme(project?.palette)
    document.title = project ? `${project.name} | Ryan Wetzstein` : 'Ryan Wetzstein | Selected work'
    if (!document.activeElement?.closest('.showcase-rail')) {
      document.querySelector('.showcase-shell h1')?.focus({ preventScroll: true })
    }
  }, [hash, project])
  useEffect(() => {
    const onKey = event => {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey || isBlocked(event.target) || event.target.closest('[role="tablist"]')) return
      if (event.key === 'Escape') { event.preventDefault(); navigate(null) }
      if (/^[1-5]$/.test(event.key)) { event.preventDefault(); navigate(projects[Number(event.key) - 1].id) }
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
        event.preventDefault(); step(['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1)
      }
    }
    const onWheel = event => {
      if (event.ctrlKey || isBlocked(event.target)) return
      event.preventDefault()
      const now = performance.now()
      const state = wheel.current
      if (now < state.lockedUntil) { state.lockedUntil = now + 220; return }
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
      if (now - state.last > 180 || Math.sign(delta) !== Math.sign(state.amount)) state.amount = 0
      state.amount += delta; state.last = now
      if (Math.abs(state.amount) >= 70) { step(Math.sign(state.amount)); state.amount = 0; state.lockedUntil = now + 700 }
    }
    window.addEventListener('keydown', onKey)
    const main = document.getElementById('main-content')
    main.addEventListener('wheel', onWheel, { passive: false })
    return () => { window.removeEventListener('keydown', onKey); main.removeEventListener('wheel', onWheel) }
  }, [navigate, step])
  return {
    project, navigate,
    gestures: {
      onPointerDown: event => {
        if (!event.isPrimary || event.button !== 0 || isBlocked(event.target) || event.target.closest('a, button')) return
        pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
        event.currentTarget.setPointerCapture(event.pointerId)
      },
      onPointerCancel: () => { pointer.current = null },
      onPointerUp: event => {
        const start = pointer.current; pointer.current = null
        if (!start || event.pointerId !== start.id) return
        const dx = event.clientX - start.x; const dy = event.clientY - start.y
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1)
      },
    },
  }
}
