// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: 80,
          alignItems: 'start',
        }}
      >
        {/* Left — photo */}
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
              maxWidth: 480,
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              borderRadius: 12,
              border: '1px solid #dddddd',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Right — eyebrow, heading, bio */}
        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12, marginTop: 0 }}>
              About
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 400, color: '#181d26', lineHeight: 1.15, margin: '0 0 36px' }}>
              Computer Science student at NDSU, graduating 2027.
            </h2>
          </div>

          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Hi, I'm Ryan — a Senior at <span style={{ color: '#181d26' }}>North Dakota State University</span> pursuing
            a Bachelor's in Computer Science with a minor in Artificial Intelligence.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            My primary interests are <span style={{ color: '#181d26' }}>machine learning</span>,{' '}
            <span style={{ color: '#181d26' }}>neural networks</span>, and{' '}
            <span style={{ color: '#181d26' }}>backend software development</span>. I have over three years
            of experience applying OOP principles in Java, building web applications with C# and .NET, and
            using Python for ML projects and experimentation.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Coursework in AI and Operating Systems has deepened my curiosity about the underlying systems
            that power modern software — pushing me toward low-level computing concepts, systems programming,
            and how things actually work under the hood.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            As I enter my senior year, I'm less focused on individual tools and more on how great software
            is designed and shipped. I actively pursue projects in systems programming while building hands-on
            experience with agentic systems, prompt engineering, and AI-assisted development workflows.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Currently interning as a{' '}
            <span style={{ color: '#181d26' }}>Full-Stack Development Intern</span> at{' '}
            <span style={{ color: '#181d26' }}>[Company]</span>: May 2026 – present.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Outside of development you'll find me lifting, making music, and exploring the outdoors. I've been
            golfing lots and spending time with family and friends.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
