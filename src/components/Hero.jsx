import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '96px 24px',
          width: '100%',
        }}
      >
        {/* Open-to-internships badge */}
        <motion.div {...fadeUp(0)}>
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
              marginBottom: 32,
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
              <motion.span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                }}
                animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                style={{
                  position: 'relative',
                  display: 'block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                }}
              />
            </span>
            Open to internships
          </span>
        </motion.div>

        {/* Headline — weight 400, display-lg */}
        <motion.h1
          {...fadeUp(0.1)}
          style={{
            fontSize: 'clamp(32px, 5vw, 40px)',
            fontWeight: 400,
            color: '#181d26',
            lineHeight: 1.2,
            letterSpacing: 0,
            margin: '0 0 20px',
            maxWidth: 560,
          }}
        >
          Ryan Wetzstein
        </motion.h1>

        {/* Tagline — body-md */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#333840',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 0 48px',
          }}
        >
          CS student at NDSU building clean, modern software. Focused on AI,
          backend development, and full-stack web. Always shipping, always
          learning.
        </motion.p>

        {/* Button pair */}
        <motion.div
          {...fadeUp(0.3)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
        >
          {/* Primary — near-black */}
          <a
            href="#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 24px',
              background: '#181d26',
              color: '#ffffff',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              textDecoration: 'none',
              minHeight: 48,
            }}
          >
            View Projects
          </a>

          {/* Secondary — white outline */}
          <a
            href="/resume.pdf"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 24px',
              background: '#ffffff',
              color: '#181d26',
              border: '1px solid #dddddd',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              textDecoration: 'none',
              minHeight: 48,
            }}
          >
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  )
}
