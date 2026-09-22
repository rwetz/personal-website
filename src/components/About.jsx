// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
import profile960 from '../assets/profile-960.webp'
import profile480 from '../assets/profile-480.webp'

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
      style={{ padding: '96px 0' }}
    >
      <div className="about-grid page-container">
        {/* Left — photo */}
        <m.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
        >
          <img
            src={profile960}
            srcSet={`${profile480} 480w, ${profile960} 960w`}
            sizes="(max-width: 860px) 360px, 480px"
            width={960}
            height={1280}
            loading="lazy"
            decoding="async"
            alt="Ryan Wetzstein"
            style={{
              width: '100%',
              maxWidth: 480,
              height: 'auto',
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              borderRadius: 12,
              border: '1px solid #dddddd',
              display: 'block',
            }}
          />
        </m.div>

        {/* Right — eyebrow, heading, bio */}
        <m.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>
          <div>
            <p className="section-eyebrow">
              About
            </p>
            <h2 className="section-title" style={{ marginBottom: 36 }}>
              Computer Science student at NDSU, graduating 2027.
            </h2>
          </div>

          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Hi, I'm Ryan. I'm a Senior at <span style={{ color: '#181d26' }}>North Dakota State University</span> pursuing
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
            that power modern software, pushing me toward low-level computing concepts, systems programming,
            and how things actually work under the hood.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            As I enter my senior year, I'm less focused on individual tools and more on how great software
            is designed and shipped. I actively pursue projects in systems programming while building hands-on
            experience with agentic systems, prompt engineering, and AI-assisted development workflows.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Currently in my senior fall semester at NDSU, coming off a summer as a{' '}
            <span style={{ color: '#181d26' }}>Full-Stack Development Intern</span> at{' '}
            <span style={{ color: '#181d26' }}>Lemhi Technologies</span> — the full write-up is just below.
          </p>
          <p style={{ fontSize: 18, color: '#1e2228', lineHeight: 1.75, margin: 0 }}>
            Outside of development you'll find me lifting, making music, and exploring the outdoors. I've been
            golfing lots and spending time with family and friends.
          </p>
        </m.div>
      </div>
    </section>
  )
}
