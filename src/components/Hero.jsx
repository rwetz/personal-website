// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
import { ArrowDown, DownloadSimple } from '@phosphor-icons/react'
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
        <div style={{ maxWidth: 560 }}>
        <h1
          style={{
            fontSize: 'clamp(52px, 8vw, 104px)',
            fontWeight: 500,
            color: 'var(--m-ink)',
            lineHeight: 0.95,
            letterSpacing: '-0.045em',
            margin: '0 0 28px',
          }}
        >
          Ryan Wetzstein
        </h1>

        {/* Status as a plain line with the accent dot, not a pill badge */}
        <p
          className="hero-rise"
          style={{
            animationDelay: '0.1s',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            fontFamily: 'var(--m-font-mono)',
            fontSize: 13,
            color: 'var(--m-muted)',
            margin: '0 0 20px',
          }}
        >
          <span
            aria-hidden="true"
            style={{ width: 7, height: 7, marginTop: 6, borderRadius: '50%', backgroundColor: 'var(--m-accent)', flexShrink: 0 }}
          />
          Available from fall 2026 · SWE &amp; ML internships
        </p>

        <p
          className="hero-rise prose-measure"
          style={{
            animationDelay: '0.15s',
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--m-body)',
            lineHeight: 1.6,
            margin: '0 0 36px',
          }}
        >
          Computer science senior at North Dakota State. I build developer tools
          and AI systems. Most recently: Nexis, an open-source AI-native terminal,
          and a GIS data pipeline for Lemhi Technologies.
        </p>

        <div
          className="hero-rise"
          style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px', marginBottom: 44 }}
        >
          <a href="#projects" className="btn-primary">
            View projects
            <ArrowDown size={16} weight="bold" aria-hidden="true" />
          </a>
          <a href="/resume.pdf" download="Ryan_Wetzstein_Resume.pdf" className="text-link">
            <DownloadSimple size={16} aria-hidden="true" />
            Download resume
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
