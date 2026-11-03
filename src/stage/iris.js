// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// The dock, home tiles and edge links name where the next world opens from.
// Keyboard and swipe travel have no origin and open from the centre instead.
let origin = null

export function setIrisOrigin(element) {
  const rect = element.getBoundingClientRect()
  origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, at: performance.now() }
}

// Read without clearing: StrictMode renders twice, and a stale origin expires on its own.
export function irisOrigin() {
  return origin && performance.now() - origin.at < 1200 ? origin : null
}
