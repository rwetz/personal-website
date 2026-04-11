import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CardSwap, { Card } from './CardSwap'

const GITHUB_USER = 'rwetz'
const CACHE_KEY = 'gh_projects_cache_v2'
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// ── GitHub fetching ────────────────────────────────────────────────────────

function extractReadmeDescription(raw) {
  // Decode base64 as UTF-8 (atob alone gives Latin-1, garbling non-ASCII chars)
  const bytes = Uint8Array.from(atob(raw.replace(/\n/g, '')), c => c.charCodeAt(0))
  const text = new TextDecoder('utf-8').decode(bytes)
  const lines = text.split('\n')
  for (const line of lines) {
    const stripped = line
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_`>~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
    if (stripped.length > 40 && !stripped.startsWith('<') && !/shield|badge|build|passing/i.test(stripped)) {
      return stripped.length > 320 ? stripped.slice(0, 317) + '…' : stripped
    }
  }
  return null
}

async function fetchReadmeDescription(repoName) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repoName}/readme`,
      { headers: { Accept: 'application/vnd.github+json' } }
    )
    if (!res.ok) return null
    const { content } = await res.json()
    return extractReadmeDescription(content)
  } catch {
    return null
  }
}

async function fetchGithubProjects() {
  const cached = sessionStorage.getItem(CACHE_KEY)
  if (cached) {
    const { ts, data } = JSON.parse(cached)
    if (Date.now() - ts < CACHE_TTL) return data
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&direction=desc&per_page=20`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)

  const repos = await res.json()
  const filtered = repos.filter(r => !r.fork && !r.archived).slice(0, 3)
  const maxStars = Math.max(...filtered.map(r => r.stargazers_count))

  const descriptions = await Promise.all(
    filtered.map(r => r.description ? Promise.resolve(r.description) : fetchReadmeDescription(r.name))
  )

  const data = filtered.map((r, idx) => ({
    title: r.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: descriptions[idx] || 'No description available.',
    tags: [r.language, ...(r.topics ?? [])].filter(Boolean).slice(0, 5),
    github: r.html_url,
    live: r.homepage || null,
    stars: r.stargazers_count,
    featured: r.stargazers_count === maxStars && maxStars > 0,
  }))

  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  return data
}

// ── Category detection ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    label: 'AI / ML',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    cardAccent: 'from-emerald-600/20 to-emerald-900/10',
    keywords: ['cnn','neural','machine learning','deep learning','ai','ml','gan','lstm','transformer','llm','gpt','classification','genetic','algorithm','reinforcement','regression','tensorflow','pytorch','keras','sklearn','scikit','model','training','inference','nlp','computer vision','prediction'],
  },
  {
    label: 'Web',
    color: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
    cardAccent: 'from-sky-600/20 to-sky-900/10',
    keywords: ['react','next.js','vue','svelte','angular','frontend','website','portfolio','dashboard','landing page','web app','tailwind','vite','webpack','fullstack','full-stack'],
  },
  {
    label: 'CLI / Tool',
    color: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    cardAccent: 'from-amber-600/20 to-amber-900/10',
    keywords: ['cli','command line','terminal','script','automation','tool','utility','parser','generator','scraper'],
  },
]

function inferCategory(project) {
  const haystack = [project.title, project.description, ...project.tags].join(' ').toLowerCase()
  return CATEGORIES.find(cat => cat.keywords.some(kw => haystack.includes(kw))) ?? null
}

// ── Deck preview card ──────────────────────────────────────────────────────

function DeckCard({ project, index }) {
  const category = inferCategory(project)
  return (
    <div className="h-full flex flex-col justify-between p-6 select-none"
      style={{ background: 'var(--color-surface-3)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Subtle gradient tint based on category */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category?.cardAccent ?? 'from-white/5 to-transparent'} pointer-events-none`} />

      <div className="relative flex items-start justify-between">
        <span className="text-5xl font-bold font-mono text-white/10 leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        {category && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${category.color}`}>
            {category.label}
          </span>
        )}
      </div>

      <div className="relative">
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-2 leading-snug">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/50 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Detail panel ───────────────────────────────────────────────────────────

function DetailPanel({ project }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })
  const category = inferCategory(project)

  const onMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: dy * -4, y: dx * 4 })
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 0.12 })
  }

  const onLeave = () => {
    setTilt({ x: 0, y: 0 })
    setSpotlight(s => ({ ...s, opacity: 0 }))
  }

  return (
    <motion.div
      ref={cardRef}
      key={project.github}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex flex-col bg-[var(--color-surface-3)] rounded-2xl p-8 border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 overflow-hidden h-full"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x !== 0 || tilt.y !== 0 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(167,139,250,0.5), transparent 60%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${category.color}`}>
              {category.label}
            </span>
          )}
          {project.featured && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]">
              featured
            </span>
          )}
          {project.stars > 0 && (
            <span className="text-xs font-mono text-[var(--color-muted)] flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {project.stars}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">{project.title}</h3>
      <p className="text-[var(--color-muted)] text-sm leading-loose flex-1 mb-5">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map(tag => (
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-white/20 transition-colors"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent-light)] hover:bg-[var(--color-accent)]/10 transition-colors"
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

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ cardWidth }) {
  return (
    <div className="flex flex-col items-center gap-16 animate-pulse">
      <div className="rounded-2xl bg-[var(--color-surface-3)] border border-white/5" style={{ width: cardWidth, height: 220 }} />
      <div className="w-full max-w-2xl space-y-4 rounded-2xl bg-[var(--color-surface-3)] border border-white/5 p-8">
        <div className="h-4 w-1/3 rounded bg-white/10" />
        <div className="h-7 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-5/6 rounded bg-white/5" />
        <div className="h-3 w-4/6 rounded bg-white/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 rounded bg-white/10" />
          <div className="h-5 w-16 rounded bg-white/10" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-9 w-24 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  )
}

// ── Main section ───────────────────────────────────────────────────────────

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [activeIdx, setActiveIdx] = useState(0)
  const [cardWidth, setCardWidth] = useState(() => Math.min(340, window.innerWidth - 48))

  useEffect(() => {
    fetchGithubProjects()
      .then(data => { setProjects(data); setStatus('ok') })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    const onResize = () => setCardWidth(Math.min(340, window.innerWidth - 48))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section id="projects" className="py-28 md:py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-20 md:mb-14"
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 02</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Projects</h2>
          <div className="accent-bar" />
        </motion.div>

        {status === 'loading' && <Skeleton cardWidth={cardWidth} />}

        {status === 'error' && (
          <p className="text-[var(--color-muted)] text-sm font-mono">
            Could not load projects from GitHub. Check back soon.
          </p>
        )}

        {status === 'ok' && projects.length > 0 && (
          <div className="flex flex-col items-center gap-16">

            {/* Deck */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
              <CardSwap
                width={cardWidth}
                height={220}
                cardDistance={50}
                verticalDistance={55}
                delay={16000}
                skewAmount={4}
                easing="elastic"
                onFrontChange={setActiveIdx}
                onCardClick={setActiveIdx}
              >
                {projects.map((project, i) => (
                  <Card key={project.github}>
                    <DeckCard project={project} index={i} />
                  </Card>
                ))}
              </CardSwap>
              <p className="text-xs font-mono text-[var(--color-muted)] opacity-50 mt-2">
                click to select
              </p>
            </motion.div>

            {/* Detail panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              className="w-full max-w-2xl"
            >
              <AnimatePresence mode="sync">
                {projects[activeIdx] && (
                  <DetailPanel project={projects[activeIdx]} />
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        )}

        {status === 'ok' && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View all repositories on GitHub
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
