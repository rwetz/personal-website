import { motion } from 'framer-motion'

const skillGroups = [
  {
    category: 'AI / Machine Learning',
    skills: [
      { name: 'Python',     icon: 'devicon-python-plain',     color: '#3572A5' },
      { name: 'PyTorch',    icon: 'devicon-pytorch-plain',    color: '#EE4C2C' },
      { name: 'TensorFlow', icon: 'devicon-tensorflow-original', color: '#FF6F00' },
      { name: 'NumPy',      icon: 'devicon-numpy-plain',      color: '#4DABCF' },
    ],
  },
  {
    category: 'Languages',
    skills: [
      { name: 'C',          icon: 'devicon-c-plain',          color: '#A8B9CC' },
      { name: 'C#',         icon: 'devicon-csharp-plain',     color: '#178600' },
      { name: 'Java',       icon: 'devicon-java-plain',       color: '#B07219' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#2B7489' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F1E05A' },
      { name: 'SQL',        icon: 'devicon-mysql-plain',      color: '#E38C00' },
      { name: 'HTML + CSS', icon: 'devicon-html5-plain',      color: '#E34C26' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { name: 'React',        icon: 'devicon-react-original',      color: '#61DAFB' },
      { name: 'Node.js',      icon: 'devicon-nodejs-plain',        color: '#339933' },
      { name: 'Next.js',      icon: 'devicon-nextjs-plain',        color: '#ffffff' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain',   color: '#38B2AC' },
      { name: 'FastAPI',      icon: 'devicon-fastapi-plain',       color: '#009688' },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Git',    icon: 'devicon-git-plain',       color: '#F05032' },
      { name: 'GitHub', icon: 'devicon-github-original', color: '#ffffff' },
      { name: 'VS Code',icon: 'devicon-vscode-plain',    color: '#007ACC' },
      { name: 'Docker', icon: 'devicon-docker-plain',    color: '#2496ED' },
      { name: 'Vite',   icon: 'devicon-vitejs-plain',    color: '#646CFF' },
    ],
  },
]

function SkillPill({ name, icon, color }) {
  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-3)] text-[var(--color-text)] text-sm border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 cursor-default"
      style={{ '--brand': color }}
    >
      <i
        className={`${icon} text-base transition-colors duration-200`}
        style={{ color: 'var(--color-muted)' }}
        onMouseEnter={e => { e.currentTarget.style.color = color }}
        onMouseLeave={e => { e.currentTarget.style.color = '' }}
      />
      {name}
    </motion.span>
  )
}

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
          {skillGroups.map(({ category, skills }, groupIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: groupIdx * 0.08 }}
            >
              <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-4">
                {category}
              </h3>
              <motion.div
                className="flex flex-wrap gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={{
                  visible: { transition: { staggerChildren: 0.04, delayChildren: groupIdx * 0.08 } },
                  hidden: {},
                }}
              >
                {skills.map(({ name, icon, color }) => (
                  <motion.div
                    key={name}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                    }}
                  >
                    <SkillPill name={name} icon={icon} color={color} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
