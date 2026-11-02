// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
const titanium = {
  bg: '#090b10', fg: '#f3f5f7', accent: '#8494a9', surface: '#343d4b',
  font: "'Geist Variable', ui-sans-serif, sans-serif", radius: '12px',
}
export function applyTheme(palette = titanium) {
  for (const [key, value] of Object.entries(palette)) {
    document.documentElement.style.setProperty(`--stage-${key}`, value)
  }
}
