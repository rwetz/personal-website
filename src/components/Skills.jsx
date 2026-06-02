import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const skillGroups = [
  {
    category: 'Languages',
    skills: [
      { name: 'Java',       icon: 'devicon-java-plain',       color: '#B07219', level: 'Intermediate', years: '3 yrs',   note: 'OOP coursework and foundational programming principles.' },
      { name: 'Python',     icon: 'devicon-python-plain',     color: '#3572A5', level: 'Beginner',     years: '3 yrs',   note: 'Steadily improving — ML scripts, FastAPI, general tooling.' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#2B7489', level: 'Beginner',     years: '2 yrs',   note: 'Favorite for web work.' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F1E05A', level: 'Beginner',     years: '3 yrs',   note: 'Coursework + personal projects.' },
      { name: 'C#',         icon: 'devicon-csharp-plain',     color: '#178600', level: 'Beginner',     years: '2 yrs',   note: 'Mostly .NET work.' },
      { name: 'C',          icon: 'devicon-c-plain',          color: '#A8B9CC', level: 'Beginner',     years: '0.5 yrs', note: 'Systems courses. Love it — can\'t wait to learn C++.' },
      { name: 'HTML + CSS', icon: 'devicon-html5-plain',      color: '#E34C26', level: 'Intermediate', years: '5 yrs',   note: 'Making websites since high school.' },
      { name: 'SQL',        icon: 'devicon-mysql-plain',      color: '#E38C00', level: 'Beginner',     years: '2 yrs',   note: 'Postgres, queries + schema design.' },
    ],
  },
  {
    category: 'AI / Machine Learning',
    skills: [
      { name: 'PyTorch',     icon: 'devicon-pytorch-plain',     color: '#EE4C2C', level: 'Beginner', years: '0.5 yrs', note: 'Just scratched the surface.' },
      { name: 'TensorFlow',  icon: 'devicon-tensorflow-original', color: '#FF6F00', level: 'Beginner', years: '0.5 yrs', note: 'Just scratched the surface.' },
      { name: 'NumPy',       icon: 'devicon-numpy-plain',       color: '#4DABCF', level: 'Beginner', years: '1 yr',   note: 'Used in ML coursework and experiments.' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { name: 'React',        icon: 'devicon-react-original',     color: '#61DAFB', level: 'Beginner', years: '0.5 yrs', note: 'Hooks, Suspense, RSC — this site uses it.' },
      { name: 'Node.js',      icon: 'devicon-nodejs-plain',       color: '#339933', level: 'Beginner', years: '2 yrs',   note: 'APIs, tooling, scripts.' },
      { name: 'Next.js',      icon: 'devicon-nextjs-plain',       color: '#000000', level: 'Beginner', years: '0.5 yrs', note: 'App Router preferred.' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain',  color: '#38B2AC', level: 'Beginner', years: '1 yr',   note: 'v4 with @theme.' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git',    icon: 'devicon-git-plain',    color: '#F05032', level: 'Beginner', years: '4 yrs', note: 'Rebase > merge, mostly.' },
      { name: 'GitHub', icon: 'devicon-github-original', color: '#000000', level: 'Beginner', years: '4 yrs', note: 'Coursework + personal project management.' },
      { name: 'VS Code', icon: 'devicon-vscode-plain', color: '#007ACC', level: 'Beginner', years: '2 yrs', note: 'Primary editor.' },
      { name: 'Vite',   icon: 'devicon-vitejs-plain',  color: '#646CFF', level: 'Beginner', years: '1 yr', note: 'Fast. No complaints.' },
    ],
  },
]

const LEVEL_DOT = {
  Advanced:     '#22c55e',
  Intermediate: '#f59e0b',
  Beginner:     '#94a3b8',
}

function SkillPill({ name, icon, color, level, years, note }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.span
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: '#ffffff',
            border: '1px solid #c8ccd2',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 400,
            color: '#181d26',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <i
            className={icon}
            style={{ fontSize: 15, color: '#9297a0' }}
            onMouseEnter={e => { e.currentTarget.style.color = color }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9297a0' }}
          />
          {name}
        </motion.span>
      </TooltipTrigger>
      <TooltipContent side="top" style={{ maxWidth: 220 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: LEVEL_DOT[level] ?? '#9297a0',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#41454d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {level}
          </span>
          <span style={{ fontSize: 11, color: '#9297a0' }}>· {years}</span>
        </div>
        <p style={{ fontSize: 12, color: '#333840', lineHeight: 1.5, margin: 0 }}>{note}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function Skills() {
  return (
    <TooltipProvider delayDuration={120}>
      <section
        id="skills"
        className="dot-grid"
        style={{ padding: '96px 24px' }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ marginBottom: 64 }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
              Skills
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: '0 0 12px' }}>
              What I work with.
            </h2>
            <p style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9297a0', margin: 0 }}>
              <Info size={13} strokeWidth={1.8} />
              Hover any pill for details.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {skillGroups.map(({ category, skills }, groupIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: groupIdx * 0.07 }}
              >
                <p style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#41454d',
                  marginBottom: 16,
                  margin: '0 0 16px',
                }}>
                  {category}
                </p>
                <motion.div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.04, delayChildren: groupIdx * 0.06 } },
                    hidden:  {},
                  }}
                >
                  {skills.map(skill => (
                    <motion.div
                      key={skill.name}
                      variants={{
                        hidden:  { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                      }}
                    >
                      <SkillPill {...skill} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
