import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EMAIL = 'rwetz00@gmail.com'

const commands = [
  { id: 'about',    label: 'Go to About',    icon: '👤', action: () => { window.location.hash = '#about' } },
  { id: 'projects', label: 'Go to Projects', icon: '🗂️', action: () => { window.location.hash = '#projects' } },
  { id: 'skills',   label: 'Go to Skills',   icon: '⚡', action: () => { window.location.hash = '#skills' } },
  { id: 'resume',   label: 'Go to Resume',   icon: '📄', action: () => { window.location.hash = '#resume' } },
  { id: 'contact',  label: 'Go to Contact',  icon: '✉️', action: () => { window.location.hash = '#contact' } },
  { id: 'music',    label: 'Go to Music',    icon: '🎵', action: () => { window.location.hash = '#music' } },
  { id: 'daw',      label: 'Open DAW',       icon: '🎹', action: () => { window.location.hash = '#daw' } },
  { id: 'copy-email', label: 'Copy email address', icon: '📋', action: () => navigator.clipboard.writeText(EMAIL) },
  { id: 'download',   label: 'Download resume',     icon: '⬇️', action: () => { const a = document.createElement('a'); a.href = '/resume.pdf'; a.download = ''; a.click() } },
  { id: 'github',  label: 'Open GitHub',   icon: '🐙', action: () => window.open('https://github.com/rwetz', '_blank') },
  { id: 'linkedin', label: 'Open LinkedIn', icon: '💼', action: () => window.open('https://linkedin.com/in/ryan-wetzstein', '_blank') },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const filtered = query.trim()
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  useEffect(() => { setSelected(0) }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const run = useCallback((cmd) => {
    cmd.action()
    onClose()
  }, [onClose])

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      if (filtered[selected]) run(filtered[selected])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    const el = listRef.current?.children[selected]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-lg bg-[var(--color-surface-2)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <svg className="text-[var(--color-muted)] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-[var(--color-text)] placeholder-[var(--color-muted)] text-sm outline-none"
              />
              <kbd className="hidden sm:inline text-xs text-[var(--color-muted)] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono">esc</kbd>
            </div>

            {/* Results */}
            <ul ref={listRef} className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-[var(--color-muted)] text-center">No results</li>
              )}
              {filtered.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    onClick={() => run(cmd)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      i === selected
                        ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]'
                        : 'text-[var(--color-text)] hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base w-5 text-center">{cmd.icon}</span>
                    {cmd.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-xs text-[var(--color-muted)]">
              <span><kbd className="font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded">↵</kbd> select</span>
              <span><kbd className="font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
