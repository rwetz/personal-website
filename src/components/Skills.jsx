// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
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
      { name: 'Python',     icon: 'devicon-python-plain',     color: '#3572A5', level: 'Beginner',     years: '3 yrs',   note: 'Steadily improving: ML scripts, FastAPI, general tooling.' },
      { name: 'SQL / PostgreSQL', icon: 'devicon-postgresql-plain',      color: '#E38C00', level: 'Beginner',     years: '2 yrs',   note: 'Postgres, queries + schema design.' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#2B7489', level: 'Beginner',     years: '2 yrs',   note: 'Favorite for web work.' },
      { name: 'C#',         icon: 'devicon-csharp-plain',     color: '#178600', level: 'Beginner',     years: '2 yrs',   note: 'Mostly .NET work.' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F1E05A', level: 'Beginner',     years: '3 yrs',   note: 'Coursework + personal projects.' },
      { name: 'C',          icon: 'devicon-c-plain',          color: '#A8B9CC', level: 'Beginner',     years: '0.5 yrs', note: 'Systems courses. Love it, and can\'t wait to learn C++.' },
      { name: 'HTML + CSS', icon: 'devicon-html5-plain',      color: '#E34C26', level: 'Intermediate', years: '5 yrs',   note: 'Making websites since high school.' },
    ],
  },
  {
    category: 'AI and machine learning',
    skills: [
      { name: 'PyTorch',     icon: 'devicon-pytorch-plain',     color: '#EE4C2C', level: 'Beginner', years: '0.5 yrs', note: 'Just scratched the surface.' },
      { name: 'TensorFlow / Keras', icon: 'devicon-tensorflow-original', color: '#FF6F00', level: 'Beginner', years: '0.5 yrs', note: 'Just scratched the surface.' },
      { name: 'NumPy',       icon: 'devicon-numpy-plain',       color: '#4DABCF', level: 'Beginner', years: '1 yr',   note: 'Used in ML coursework and experiments.' },
    ],
  },
  {
    category: 'Frameworks and libraries',
    skills: [
      { name: 'React',        icon: 'devicon-react-original',     color: '#61DAFB', level: 'Beginner', years: '0.5 yrs', note: 'Hooks, Suspense, RSC. This site uses it.' },
      { name: 'Node.js',      icon: 'devicon-nodejs-plain',       color: '#339933', level: 'Beginner', years: '2 yrs',   note: 'APIs, tooling, scripts.' },
      { name: 'Next.js',      icon: 'devicon-nextjs-plain',       color: '#000000', level: 'Beginner', years: '0.5 yrs', note: 'App Router preferred.' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain',  color: '#38B2AC', level: 'Beginner', years: '1 yr',   note: 'v4 with @theme.' },
      { name: 'Tauri',        note: 'Nexis is built on Tauri 2 with a Rust backend.' },
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
  {
    // From the resume; ideas rather than tools, so they render as plain text.
    category: 'Concepts',
    plain: true,
    skills: ['Agentic development', 'OOP', 'Agile / Scrum', 'Relational databases', 'Neural networks', 'Machine learning'],
  },
]

function SkillChip({ name, icon, color, years, note }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="skill-chip" style={{ '--skill-color': color }}>
          {icon && <i className={icon} aria-hidden="true" />}
          <span>{name}</span>
          {years && <span className="skill-years">{years}</span>}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" style={{ maxWidth: 240 }}>
        <p style={{ fontSize: 12, color: '#333840', lineHeight: 1.5, margin: 0 }}>{note}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function Skills() {
  return (
    <TooltipProvider delayDuration={120}>
      <section id="skills" className="dot-grid section">
        <div className="page-container split-layout">
          <m.div
            className="split-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="section-eyebrow"><span className="section-index">04</span>Skills</p>
            <h2 className="section-title">Tools I reach for.</h2>
            <p className="section-lede">
              Languages and tools from coursework, the internship, and my own projects, with
              roughly how long I’ve used each. Hover or focus one for a note.
            </p>
          </m.div>

          {/* One row per group: label on the left, chips on the right */}
          <dl className="skill-rows">
            {skillGroups.map(({ category, skills, plain }, groupIdx) => (
              <m.div
                key={category}
                className="skill-row"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: groupIdx * 0.06 }}
              >
                <dt className="micro-label">{category}</dt>
                <dd>
                  {plain
                    ? <p className="skill-concepts">{skills.join(' · ')}</p>
                    : skills.map(skill => <SkillChip key={skill.name} {...skill} />)}
                </dd>
              </m.div>
            ))}
          </dl>
        </div>
      </section>
    </TooltipProvider>
  )
}
