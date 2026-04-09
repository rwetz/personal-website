import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">About Me</h2>
        <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
      </motion.div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        <motion.img
          src="/src/assets/profile.jpg"
          alt="Ryan"
          className="shrink-0 w-64 h-64 rounded-full object-cover border-2 border-[var(--color-accent)]/40"
          {...fadeUp(0.15)}
        />
        <motion.div
          className="text-[var(--color-muted)] text-lg leading-relaxed text-left space-y-4"
          {...fadeUp(0.3)}
        >
          <p>
            Hi! I&apos;m Ryan. I am a student at North Dakota State University
            pursuing a bachelor's degree in Computer Science, as well as a minor
            in Artificial Intelligence. I have a specific interest in artificial
            intelligence and backend software development. My biggest interests
            right now include machine learning, operating systems, and neural
            networks. I am actively seeking an internship or co-op opportunity,
            and I am open to working remotely. I am currently a junior and have
            2 years of experience with object-oriented programming principles,
            specifically in languages such as Java, C#, and Python. I have
            in-class experience creating web applications using languages such
            as HTML, CSS, TypeScript, JavaScript, and Python. I have completed
            courses focused on data structures and algorithms, object-oriented
            principles, agile software development, and frameworks.
          </p>
          <p>
            When I&apos;m not working on university work, or personal projects,
            you can find me exploring new weightlifting or excersizing, spending
            time with friends or family, and enjoying the outdoors.
          </p>
          <p>
            I&apos;m currently open to new opportunities - feel free to reach
            out!
          </p>
        </motion.div>
      </div>
    </section>
  )
}
