// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { motion } from 'framer-motion'
import { FolderKanban, Download, ArrowUpRight } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

const FEATURED_TAGS = ['Python', 'FastAPI', 'React', 'PostgreSQL']

export default function Hero() {
  return (
    <section
      id="hero"
      className="dot-grid"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'flex-start' }}
    >
      {/* ── Text content — pushed to lower-left ──────────────────────────── */}
      <div
        style={{
          padding: 'calc(64px + 58vh) 24px 48px 56px',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: 480 }}>
        <motion.h1
          {...fadeUp(0)}
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
        </motion.h1>

        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 24 }}>
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
            Currently interning
          </span>
        </motion.div>

        <motion.p
          {...fadeUp(0.15)}
          style={{
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
        </motion.p>

        <motion.div
          {...fadeUp(0.2)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}
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
        </motion.div>

        <motion.div
          {...fadeUp(0.28)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px 20px',
            paddingTop: 28,
            borderTop: '1px solid var(--m-hairline)',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--m-border-strong)' }}>
            North Dakota State University · Computer Science · Class of 2027
          </span>
          <span style={{ color: 'var(--m-hairline)', fontSize: 12 }}>|</span>
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
                fontSize: 12,
                color: 'var(--m-muted)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--m-hairline)',
                paddingBottom: 1,
              }}
            >
              {label}
            </a>
          ))}
        </motion.div>
        </div>
      </div>

      {/* ── Featured project card — anchored bottom-right (lg+ only) ── */}
      <motion.div
        className="hidden lg:block"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.4 }}
        style={{
          position: 'absolute',
          bottom: 96,
          right: 56,
          width: 520,
          background: 'var(--m-ink)',
          borderRadius: 18,
          overflow: 'hidden',
        }}
      >
        {/* macOS header bar */}
        <div
          style={{
            padding: '13px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
          </div>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.25)',
              marginLeft: 8,
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}
          >
            featured-project
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: '32px 36px 36px' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 16,
            }}
          >
            Featured project
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Nexis
          </div>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.48)',
              margin: '0 0 28px',
              maxWidth: 380,
            }}
          >
            AI-powered developer productivity platform — semantic code search,
            inline AI assistance, and context-aware completions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 32 }}>
            {FEATURED_TAGS.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '4px 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a
              href="https://github.com/rwetz/Nexis"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.18)',
                paddingBottom: 2,
              }}
            >
              GitHub <ArrowUpRight size={12} />
            </a>
            <a
              href="#projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.18)',
                paddingBottom: 2,
              }}
            >
              All projects <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
