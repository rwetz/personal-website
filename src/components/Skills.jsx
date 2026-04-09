import { motion } from 'framer-motion'

// Edit these arrays to reflect your actual skills
const skillGroups = [
  {
    category: 'Languages',
    skills: ['C', 'Java', 'Python', 'Typescript', 'SQL', 'HTML + CSS'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'Node.js', 'Next.js', 'Tailwind CSS', 'FastAPI'],
  },
  {
    category: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'VS Code', 'Docker', 'Vite'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Skills</h2>
        <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
      </motion.div>

      <div className="space-y-10">
        {skillGroups.map(({ category, skills }, i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-lg bg-[var(--color-surface-3)] text-[var(--color-text)] text-sm border border-white/5 hover:border-[var(--color-accent)]/50 transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
