import { motion } from 'framer-motion'

// Edit this array to add your real projects
const projects = [
  {
    title: 'Project One',
    description:
      'A brief description of what this project does and the problem it solves.',
    tags: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    title: 'Project Two',
    description:
      'A brief description of what this project does and the problem it solves.',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com',
    live: null,
  },
  {
    title: 'Project Three',
    description:
      'A brief description of what this project does and the problem it solves.',
    tags: ['TypeScript', 'Next.js', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 02</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Projects</h2>
          <div className="accent-bar" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              className="flex flex-col bg-[var(--color-surface-3)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-accent-dark)]/60 hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {project.title}
              </h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  GitHub →
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent-light)] hover:text-[var(--color-text)] transition-colors"
                  >
                    Live →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
