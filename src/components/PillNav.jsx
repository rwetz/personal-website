// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝

/**
 * Pill-shaped nav capsule with a circle-wipe hover.
 * Desktop only — caller handles mobile.
 *
 * The wipe is pure CSS (see .pill-nav in index.css): a circle centred on the
 * pill's bottom edge scales up to fill it while the label swaps upward. The
 * same state is shown on :hover, :focus-visible, and for the active section,
 * so keyboard users and "you are here" get the same treatment as the mouse.
 *
 * Props:
 *   items       — [{ label, href }]
 *   activeHref  — currently active href string (e.g. '#about')
 *   baseColor   — capsule background + hover circle fill
 *   pillColor   — individual pill background
 *   pillTextColor       — pill resting text colour (defaults to baseColor)
 *   hoveredPillTextColor — pill text colour when circle fills
 */
export default function PillNav({
  items = [],
  activeHref,
  baseColor = 'var(--m-ink)',
  pillColor = 'var(--m-canvas)',
  hoveredPillTextColor = 'var(--m-on-dark)',
  pillTextColor,
}) {
  return (
    <div
      className="pill-nav"
      style={{
        '--pn-base': baseColor,
        '--pn-pill': pillColor,
        '--pn-text': pillTextColor ?? baseColor,
        '--pn-text-hover': hoveredPillTextColor,
      }}
    >
      {items.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="pill-nav-item"
          aria-current={activeHref === item.href ? 'location' : undefined}
        >
          <span className="pn-circle" aria-hidden="true" />
          <span className="pn-stack">
            <span className="pn-label">{item.label}</span>
            <span className="pn-hover" aria-hidden="true">{item.label}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
