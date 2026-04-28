import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Maximize2, Star } from 'lucide-react'
import CardSwap, { Card } from './CardSwap'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

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

// Keywords are matched as whole words (\b...\b), so "ml" won't match "html",
// "ai" won't match "chain", "algorithm" won't match anything but the word itself.
// Multi-word phrases ("machine learning") still work.
//
// Order matters for the keyword fallback — most-specific first. Topic matches
// (from the GitHub repo's `topics` array) always beat keyword guessing.
// "Misc" always matches last as a guaranteed fallback.
const CATEGORIES = [
  {
    label: 'AI / ML',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    cardAccent: 'from-emerald-600/20 to-emerald-900/10',
    topics: ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural-network', 'pytorch', 'tensorflow', 'nlp', 'computer-vision', 'reinforcement-learning', 'llm'],
    keywords: ['cnn','neural network','machine learning','deep learning','transformer','llm','gpt','reinforcement learning','tensorflow','pytorch','keras','sklearn','scikit-learn','nlp','computer vision'],
  },
  {
    label: 'Data',
    color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
    cardAccent: 'from-cyan-600/20 to-cyan-900/10',
    topics: ['data', 'data-science', 'data-analysis', 'data-engineering', 'analytics', 'etl', 'pandas', 'numpy', 'jupyter', 'dataset', 'database', 'sql'],
    keywords: ['data science','data analysis','data engineering','analytics','etl','pandas','jupyter','dataset','sql','postgres','mongodb','data pipeline'],
  },
  {
    label: 'Algorithms / Viz',
    color: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    cardAccent: 'from-violet-600/20 to-violet-900/10',
    topics: ['algorithms', 'algorithm', 'visualization', 'visualizer', 'data-structures', 'sorting', 'pathfinding', 'simulation'],
    keywords: ['sorting algorithm','pathfinding','visualizer','visualization','data structure','data structures','algorithm visualizer','simulation'],
  },
  {
    label: 'Game / Graphics',
    color: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/20',
    cardAccent: 'from-fuchsia-600/20 to-fuchsia-900/10',
    topics: ['game', 'gamedev', 'unity', 'unreal', 'godot', 'webgl', 'three-js', 'threejs', 'shader', 'graphics', 'opengl', 'raytracing', 'creative-coding'],
    keywords: ['game','gamedev','unity','unreal','godot','webgl','three.js','shader','raytracing','raytracer','creative coding','graphics engine'],
  },
  {
    label: 'Systems',
    color: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
    cardAccent: 'from-orange-600/20 to-orange-900/10',
    topics: ['systems', 'systems-programming', 'operating-system', 'kernel', 'embedded', 'compiler', 'interpreter', 'low-level', 'rust', 'c-plus-plus'],
    keywords: ['operating system','kernel','embedded','compiler','interpreter','low-level','systems programming','assembler','memory allocator'],
  },
  {
    label: 'Mobile',
    color: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
    cardAccent: 'from-pink-600/20 to-pink-900/10',
    topics: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin', 'expo'],
    keywords: ['ios app','android app','react native','flutter','mobile app','swiftui'],
  },
  {
    label: 'Full-Stack',
    color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    cardAccent: 'from-indigo-600/20 to-indigo-900/10',
    topics: ['fullstack', 'full-stack', 'saas', 'webapp', 'web-app'],
    keywords: ['full-stack','fullstack','saas','authentication','crud','rest api','graphql'],
  },
  {
    label: 'Backend / API',
    color: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
    cardAccent: 'from-slate-600/20 to-slate-900/10',
    topics: ['backend', 'api', 'server', 'rest', 'graphql', 'fastapi', 'express', 'django', 'flask', 'microservices'],
    keywords: ['backend','rest api','graphql api','fastapi','express server','django','flask','microservice','microservices','web server'],
  },
  {
    label: 'Frontend',
    color: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
    cardAccent: 'from-sky-600/20 to-sky-900/10',
    topics: ['frontend', 'react', 'nextjs', 'next-js', 'vue', 'svelte', 'tailwind', 'vite', 'website', 'portfolio', 'landing-page', 'ui', 'ux'],
    keywords: ['react','next.js','vue','svelte','frontend','website','portfolio','dashboard','landing page','tailwind','vite'],
  },
  {
    label: 'CLI / Tool',
    color: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    cardAccent: 'from-amber-600/20 to-amber-900/10',
    topics: ['cli', 'command-line', 'terminal', 'tool', 'utility', 'automation', 'script', 'devtool'],
    keywords: ['cli','command line','terminal','automation tool','utility','scraper','dev tool'],
  },
  {
    label: 'Misc',
    color: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
    cardAccent: 'from-zinc-600/20 to-zinc-900/10',
    topics: [],
    keywords: [],
    fallback: true,
  },
]

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function inferCategory(project) {
  const repoTopics = (project.tags ?? []).map(t => String(t).toLowerCase())
  // 1. Topic-based match — explicit and authoritative.
  for (const cat of CATEGORIES) {
    if (cat.topics.some(t => repoTopics.includes(t))) return cat
  }
  // 2. Keyword fallback — title + description, whole-word match.
  const haystack = [project.title, project.description].join(' ').toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => new RegExp(`\\b${escapeRegex(kw)}\\b`).test(haystack))) return cat
  }
  // 3. Always-on fallback — guaranteed Misc bucket.
  return CATEGORIES.find(c => c.fallback) ?? null
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

// ── Project deep-dive dialog ───────────────────────────────────────────────

function ProjectDialog({ project, open, onOpenChange }) {
  if (!project) return null
  const category = inferCategory(project)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {category && <Badge variant="default" style={{}}>{category.label}</Badge>}
            {project.featured && <Badge variant="warning">featured</Badge>}
            {project.stars > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" /> {project.stars}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="leading-relaxed pt-2">{project.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
        </div>
        <div className="flex gap-3 text-sm mt-4">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-white/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent-light)] hover:bg-[var(--color-accent)]/10 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              Live
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Detail panel ───────────────────────────────────────────────────────────

function DetailPanel({ project, onOpenDialog }) {
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
          background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, var(--color-spotlight), transparent 60%)`,
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

      <div className="flex gap-3 text-sm mt-auto flex-wrap">
        <button
          onClick={onOpenDialog}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-accent)]/30 text-[var(--color-accent-light)] hover:bg-[var(--color-accent)]/10 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Details
        </button>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-white/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
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
  const [dialogOpen, setDialogOpen] = useState(false)
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
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 03</span>
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
                    <HoverCard openDelay={200} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="h-full w-full">
                          <DeckCard project={project} index={i} />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="top" className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-[var(--color-text)]">{project.title}</h4>
                          <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-4">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.tags.slice(0, 4).map(tag => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          {project.stars > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] pt-1">
                              <Star className="w-3 h-3 fill-current" />
                              {project.stars} {project.stars === 1 ? 'star' : 'stars'}
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
                  <DetailPanel project={projects[activeIdx]} onOpenDialog={() => setDialogOpen(true)} />
                )}
              </AnimatePresence>
              <ProjectDialog project={projects[activeIdx]} open={dialogOpen} onOpenChange={setDialogOpen} />
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
