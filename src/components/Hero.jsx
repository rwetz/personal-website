// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
import { FolderKanban, Download } from 'lucide-react'
import ShaderPanel from './ShaderPanel'
import { MOIRE_CFG, CELLS_CFG, CONTOUR_CFG } from '@/lib/shaders'

/** Purely decorative — ordered coarse to fine so the stack reads top-down. */
const SHADER_CARDS = [
  { key: 'contour', cfg: CONTOUR_CFG },
  { key: 'moire',   cfg: MOIRE_CFG   },
  { key: 'cells',   cfg: CELLS_CFG   },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="dot-grid hero-shell"
      style={{ position: 'relative', display: 'flex' }}
    >
      {/* ── Text content — pushed to lower-left ──────────────────────────── */}
      {/* Sizing lives in .hero-shell / .hero-inner (index.css) so it can key   */}
      {/* off viewport height; short screens drop the one-screen pin entirely.  */}
      <div className="hero-inner page-container">
        <div style={{ maxWidth: 480 }}>
        <h1
          style={{
            fontSize: 'clamp(40px, 6.5vw, 72px)',
            fontWeight: 400,
            color: 'var(--m-ink)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            maxWidth: 480,
          }}
        >
          Ryan Wetzstein
        </h1>

        <div className="hero-rise" style={{ marginBottom: 24, animationDelay: '0.1s' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              border: '1px solid var(--m-hairline)',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 400,
              color: 'var(--m-muted)',
              backgroundColor: 'var(--m-canvas)',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                flexShrink: 0,
              }}
            />
            Senior at NDSU
          </span>
        </div>

        <p
          className="hero-rise"
          style={{
            animationDelay: '0.15s',
            fontSize: 15,
            fontWeight: 400,
            color: 'var(--m-body)',
            lineHeight: 1.65,
            maxWidth: 460,
            margin: '0 0 36px',
          }}
        >
          CS student at NDSU building clean, modern software. Focused on AI,
          backend development, and full-stack web.
        </p>

        <div
          className="hero-rise"
          style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}
        >
          <a
            href="#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 24px',
              backgroundColor: 'var(--m-ink)',
              color: 'var(--m-on-dark)',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              minHeight: 48,
            }}
          >
            <FolderKanban size={16} />
            View Projects
          </a>

          <a
            href="/resume.pdf"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 24px',
              background: 'var(--m-canvas)',
              color: 'var(--m-ink)',
              border: '1px solid var(--m-hairline)',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              minHeight: 48,
            }}
          >
            <Download size={15} />
            Download Resume
          </a>
        </div>

        <div
          className="hero-rise"
          style={{
            animationDelay: '0.28s',
            paddingTop: 28,
            borderTop: '1px solid var(--m-hairline)',
          }}
        >
          {/* School on its own line so the links below always stay together */}
          <p style={{ fontSize: 13, color: 'var(--m-subtle)', margin: '0 0 4px' }}>
            North Dakota State University · Computer Science · Class of 2027
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 24 }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/rwetz' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/ryan-wetzstein' },
              { label: 'Email',    href: 'mailto:rwetz00@gmail.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: 'var(--m-muted)',
                  /* A text underline (not a border) stays hugging the text even   */
                  /* though the box is 44px tall to clear the touch-target floor. */
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--m-border-strong)',
                  textUnderlineOffset: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* ── Right rail — three decorative shader cards (lg+ only) ────────── */}
      {/* Bottom-anchored so the column grows upward; heights are clamped to    */}
      {/* keep the stack clear of the 90px navbar on short viewports.           */}
      <div className="hidden lg:flex hero-rail">
        {SHADER_CARDS.map(({ key, cfg }, i) => (
          <m.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.4 + i * 0.1 }}
            style={{ borderRadius: 18, overflow: 'hidden' }}
          >
            <ShaderPanel {...cfg} style={{ height: 'clamp(120px, 17vh, 190px)' }} />
          </m.div>
        ))}
      </div>
    </section>
  )
}
