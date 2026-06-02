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
      style={{ backgroundColor: '#ffffff', padding: '96px 24px' }}
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
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid #dddddd',
                display: 'block',
              }}
            />
          </motion.div>

          {/* Bio */}
          <motion.div {...fadeUp(0.15)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 14, color: '#333840', lineHeight: 1.7, margin: 0 }}>
              Hi, I'm Ryan — a junior at <strong style={{ fontWeight: 500, color: '#181d26' }}>North Dakota State University</strong> pursuing
              a Bachelor's in Computer Science with a minor in Artificial Intelligence.
            </p>
            <p style={{ fontSize: 14, color: '#333840', lineHeight: 1.7, margin: 0 }}>
              My core interests are <strong style={{ fontWeight: 500, color: '#181d26' }}>machine learning</strong>,{' '}
              <strong style={{ fontWeight: 500, color: '#181d26' }}>neural networks</strong>, and{' '}
              <strong style={{ fontWeight: 500, color: '#181d26' }}>backend development</strong>. I have two years of
              experience with OOP in Java, C#, and Python — and hands-on web development using TypeScript, React,
              and FastAPI.
            </p>
            <p style={{ fontSize: 14, color: '#333840', lineHeight: 1.7, margin: 0 }}>
              Outside of code you'll find me lifting, making music, and exploring the outdoors.
              I'm actively seeking an internship or co-op — remote-friendly.
            </p>

            {/* Contact links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
              <a
                href="mailto:rwetz00@gmail.com"
                style={{ fontSize: 13, color: '#41454d', textDecoration: 'none', borderBottom: '1px solid #dddddd', paddingBottom: 1 }}
              >
                rwetz00@gmail.com
              </a>
              <span style={{ color: '#dddddd' }}>·</span>
              <a
                href="https://github.com/rwetz"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#41454d', textDecoration: 'none', borderBottom: '1px solid #dddddd', paddingBottom: 1 }}
              >
                github.com/rwetz
              </a>
              <span style={{ color: '#dddddd' }}>·</span>
              <a
                href="https://linkedin.com/in/ryan-wetzstein"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#41454d', textDecoration: 'none', borderBottom: '1px solid #dddddd', paddingBottom: 1 }}
              >
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
