import { motion } from 'framer-motion'

const skillGroups = [
  {
    category: 'Languages',
    skills: [
      { name: 'C',          icon: 'devicon-c-plain' },
      { name: 'C#',         icon: 'devicon-csharp-plain' },
      { name: 'Java',       icon: 'devicon-java-plain' },
      { name: 'Python',     icon: 'devicon-python-plain' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain' },
      { name: 'SQL',        icon: 'devicon-mysql-plain' },
      { name: 'HTML + CSS', icon: 'devicon-html5-plain' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { name: 'React',        icon: 'devicon-react-original' },
      { name: 'Node.js',      icon: 'devicon-nodejs-plain' },
      { name: 'Next.js',      icon: 'devicon-nextjs-plain' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain' },
      { name: 'FastAPI',      icon: 'devicon-fastapi-plain' },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git',    icon: 'devicon-git-plain' },
      { name: 'GitHub', icon: 'devicon-github-original' },
      { name: 'VS Code',icon: 'devicon-vscode-plain' },
      { name: 'Docker', icon: 'devicon-docker-plain' },
      { name: 'Vite',   icon: 'devicon-vitejs-plain' },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 03</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Skills</h2>
          <div className="accent-bar" />
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
                {skills.map(({ name, icon }) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-3)] text-[var(--color-text)] text-sm border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200"
                  >
                    <i className={`${icon} text-base`} />
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
