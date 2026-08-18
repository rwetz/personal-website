// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝

// Echo the path that missed, so the visitor can see the typo rather than guess
// at it. textContent only — the URL is attacker-controlled, and an innerHTML
// write here would turn a 404 into a reflected-XSS sink.
const el = document.getElementById('path')

if (el) {
  const path = location.pathname + location.search
  // Cap the echo: a very long crafted URL should not blow out the layout.
  const shown = path.length > 120 ? path.slice(0, 120) + '…' : path
  el.textContent = 'Requested: ' + shown
  el.classList.add('is-shown')
}
