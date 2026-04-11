import { motion } from 'framer-motion'
import profileImg from '../assets/profile.jpg'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)}>
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 01</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">About Me</h2>
          <div className="accent-bar" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.img
            src={profileImg}
            alt="Ryan Wetzstein"
            className="shrink-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full object-cover border-2 border-[var(--color-accent)]/40"
            initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
            whileInView={{ clipPath: 'circle(55% at 50% 50%)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            style={{
              boxShadow: '0 0 32px rgba(124,58,237,0.18)',
            }}
          />
          <motion.div
            className="text-[var(--color-muted)] text-lg leading-relaxed text-left space-y-4"
            {...fadeUp(0.3)}
          >
            <p>
              <span className="shimmer-text font-semibold text-xl">Hi! I&apos;m Ryan</span>
              {' '}— a junior at <span className="keyword-text">North Dakota State University</span> pursuing a
              Bachelor&apos;s in Computer Science with a minor in Artificial Intelligence.
            </p>
            <p>
              My core interests are <span className="keyword-text">machine learning</span>,{' '}
              <span className="keyword-text">neural networks</span>, and{' '}
              <span className="keyword-text">backend development</span>. I have two years
              of experience with object-oriented programming in Java, C#, and Python, and
              hands-on web development in TypeScript, React, and FastAPI. I&apos;ve completed
              coursework in data structures &amp; algorithms, agile development, and operating systems.
            </p>
            <p>
              Outside of code you&apos;ll find me lifting, making music, and enjoying the
              outdoors. I&apos;m actively seeking an{' '}
              <span className="keyword-text">internship or co-op</span> — remote-friendly.
              Feel free to reach out!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
