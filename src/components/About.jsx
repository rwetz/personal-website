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
      className="dot-grid section"
    >
      <div className="about-grid page-container">
        {/* Left — photo. Sticky on wide screens so it travels with the bio
            instead of stopping halfway and leaving an empty column. */}
        <m.figure
          className="about-photo"
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
              height: 'auto',
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              borderRadius: 20,
              boxShadow: 'var(--m-shadow-sm)',
              display: 'block',
            }}
          />
          <figcaption className="micro-label" style={{ marginTop: 16 }}>
            NDSU ’27 · CS with an AI minor · Fargo, ND
          </figcaption>
        </m.figure>

        {/* Right — eyebrow, heading, bio */}
        <m.div {...fadeUp(0.1)}>
          <p className="section-eyebrow"><span className="section-index">02</span>About</p>
          <h2 className="section-title">
            Computer Science student at NDSU, graduating 2027.
          </h2>

          <div className="about-bio">
            <p className="about-lede">
              Hi, I'm Ryan. I'm a senior at North Dakota State University pursuing a Bachelor's
              in Computer Science with a minor in Artificial Intelligence.
            </p>
            <p>
              My primary interests are machine learning, neural networks, and backend software
              development. I have over three years of experience applying OOP principles in Java,
              building web applications with C# and .NET, and using Python for ML projects and
              experimentation.
            </p>
            <p>
              Coursework in AI and Operating Systems has deepened my curiosity about the underlying
              systems that power modern software, pushing me toward low-level computing concepts,
              systems programming, and how things actually work under the hood.
            </p>
            <p>
              As I enter my senior year, I'm less focused on individual tools and more on how great
              software is designed and shipped. I actively pursue projects in systems programming while
              building hands-on experience with agentic systems, prompt engineering, and AI-assisted
              development workflows.
            </p>
            <p>
              Currently in my senior fall semester at NDSU, coming off a summer as a Full-Stack
              Development Intern at Lemhi Technologies. The full write-up is just below.
            </p>
            <p>
              Outside of development you'll find me lifting, making music, and exploring the outdoors.
              I've been golfing lots and spending time with family and friends.
            </p>
          </div>
        </m.div>
      </div>
    </section>
  )
}
