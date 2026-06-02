import { motion } from 'framer-motion'
import profileImg from '../assets/profile.jpg'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

export default function About() {
  return (
    <section
      id="about"
      className="dot-grid"
      style={{ padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Eyebrow + heading */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
            About
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: 0, maxWidth: 560 }}>
            A junior CS student who builds for the real world.
          </h2>
        </motion.div>

        {/* Two-column: photo + bio */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          >
            <img
              src={profileImg}
              alt="Ryan Wetzstein"
              style={{
                width: '100%',
                maxWidth: 320,
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid #dddddd',
                display: 'block',
              }}
            />
          </motion.div>

          {/* Bio */}
          <motion.div {...fadeUp(0.15)} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ fontSize: 16, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
              Hi, I'm Ryan — a junior at <span style={{ color: '#181d26' }}>North Dakota State University</span> pursuing
              a Bachelor's in Computer Science with a minor in Artificial Intelligence.
            </p>
            <p style={{ fontSize: 16, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
              My core interests are <span style={{ color: '#181d26' }}>machine learning</span>,{' '}
              <span style={{ color: '#181d26' }}>neural networks</span>, and{' '}
              <span style={{ color: '#181d26' }}>backend development</span>. I have two years of
              experience with OOP in Java, C#, and Python — and hands-on web development using TypeScript, React,
              and FastAPI.
            </p>
            <p style={{ fontSize: 16, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
              Outside of code you'll find me lifting, making music, and exploring the outdoors.
              I'm actively seeking an internship or co-op — remote-friendly.
            </p>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
