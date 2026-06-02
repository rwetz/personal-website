import { motion } from 'framer-motion'

const VARIANTS = {
  coral:  { bg: '#aa2d00', text: '#ffffff', border: 'rgba(255,255,255,0.12)' },
  forest: { bg: '#0a2e0e', text: '#ffffff', border: 'rgba(255,255,255,0.12)' },
  dark:   { bg: '#181d26', text: '#ffffff', border: 'rgba(255,255,255,0.10)' },
  cream:  { bg: '#f5e9d4', text: '#181d26', border: 'rgba(24,29,38,0.10)'  },
}

/**
 * Full-bleed "voltage" section card.
 *
 * <SignatureCard variant="coral">
 *   <h2 className="display-md">…</h2>
 *   <p className="body-md" style={{ opacity: 0.8 }}>…</p>
 *   <a className="btn-secondary-on-dark">…</a>
 * </SignatureCard>
 *
 * Props:
 *   variant  — 'coral' | 'forest' | 'dark' | 'cream'
 *   id       — section id for hash-nav
 *   children — any React content
 */
export default function SignatureCard({ variant = 'coral', id, children }) {
  const { bg, text } = VARIANTS[variant] ?? VARIANTS.coral

  return (
    <section
      id={id}
      style={{
        backgroundColor: bg,
        color: text,
        padding: '96px 24px',
      }}
    >
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 64, alignItems: 'center' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
