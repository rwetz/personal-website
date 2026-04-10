import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Project One',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/rwetz',
    live: 'https://example.com',
    featured: true,
  },
  {
    title: 'Project Two',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/rwetz',
    live: null,
  },
  {
    title: 'Project Three',
    description: 'A brief description of what this project does and the problem it solves.',
    tags: ['TypeScript', 'Next.js', 'Tailwind'],
    github: 'https://github.com/rwetz',
    live: 'https://example.com',
  },
]

function ProjectCard({ project, i, featured = false }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  const onMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -6, y: dx * 6 })
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 0.12 })
  }

  const onLeave = () => {
    setTilt({ x: 0, y: 0 })
    setSpotlight(s => ({ ...s, opacity: 0 }))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative flex flex-col bg-[var(--color-surface-3)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-all duration-200 overflow-hidden ${featured ? 'sm:col-span-2' : ''}`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x !== 0 || tilt.y !== 0 ? '-2px' : '0'})`,
        transition: tilt.x !== 0 || tilt.y !== 0 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(167,139,250,0.5), transparent 60%)`,
        }}
      />

      {featured && (
        <span className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]">
          featured
        </span>
      )}

      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{project.title}</h3>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1 mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] font-mono">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3 text-sm mt-auto">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-white/20 transition-colors"
          aria-label={`${project.title} GitHub repository`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent-light)] hover:bg-[var(--color-accent)]/10 transition-colors"
            aria-label={`${project.title} live demo`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live
          </a>
        )}
      </div>
    </motion.div>
  )
}

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
            <ProjectCard key={project.title} project={project} i={i} featured={project.featured} />
          ))}
        </div>
      </div>
    </section>
  )
}
