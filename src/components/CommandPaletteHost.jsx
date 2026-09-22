// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'

// cmdk + the Radix dialog only matter once someone presses ⌘K, so they live in
// their own chunk rather than the first-load bundle.
const CommandPalette = lazy(() => import('./CommandPalette'))

/**
 * Owns the palette's open state and the ⌘K / Ctrl+K shortcut. Keeping the state
 * here (not in App) means toggling the palette re-renders only this component,
 * not the whole page.
 */
export default function CommandPaletteHost() {
  const [open, setOpen]     = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setLoaded(true)
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  if (!loaded) return null
  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onClose={close} />
    </Suspense>
  )
}
