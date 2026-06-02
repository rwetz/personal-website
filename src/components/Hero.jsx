import { motion } from 'framer-motion'
import { FolderKanban, Download } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="dot-grid"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'calc(64px + 14vh) 24px 96px',
          width: '100%',
        }}
      >
        {/* Headline — large, weight 400 */}
        <motion.h1
          {...fadeUp(0)}
          style={{
            fontSize: 'clamp(40px, 6.5vw, 72px)',
            fontWeight: 400,
            color: '#181d26',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            maxWidth: 700,
          }}
        >
          Ryan Wetzstein
        </motion.h1>

        {/* Open-to-internships badge */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 24 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              border: '1px solid #dddddd',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 400,
              color: '#41454d',
              backgroundColor: '#ffffff',
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

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.15)}
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: '#333840',
            lineHeight: 1.65,
            maxWidth: 460,
            margin: '0 0 36px',
          }}
        >
          CS student at NDSU building clean, modern software. Focused on AI,
          backend development, and full-stack web.
        </motion.p>

        {/* Button pair */}
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
              backgroundColor: '#181d26',
              color: '#ffffff',
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
              background: '#ffffff',
              color: '#181d26',
              border: '1px solid #dddddd',
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

        {/* Meta strip */}
        <motion.div
          {...fadeUp(0.28)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px 20px',
            paddingTop: 28,
            borderTop: '1px solid #dddddd',
          }}
        >
          <span style={{ fontSize: 12, color: '#9297a0' }}>
            North Dakota State University · Computer Science · Class of 2026
          </span>

          <span style={{ color: '#dddddd', fontSize: 12 }}>|</span>

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
                color: '#41454d',
                textDecoration: 'none',
                borderBottom: '1px solid #dddddd',
                paddingBottom: 1,
              }}
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
