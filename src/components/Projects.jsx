import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'

const GITHUB_USER = 'rwetz'
const CACHE_KEY   = 'gh_projects_cache_v2'
const CACHE_TTL   = 10 * 60 * 1000

// ── GitHub helpers ──────────────────────────────────────────────────────────

function extractReadmeDescription(raw) {
  const bytes = Uint8Array.from(atob(raw.replace(/\n/g, '')), c => c.charCodeAt(0))
  const text  = new TextDecoder('utf-8').decode(bytes)
  for (const line of text.split('\n')) {
    const stripped = line
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_`>~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim()
    if (stripped.length > 40 && !stripped.startsWith('<') && !/shield|badge|build|passing/i.test(stripped)) {
      return stripped.length > 300 ? stripped.slice(0, 297) + '…' : stripped
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
  } catch { return null }
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

  const repos    = await res.json()
  const filtered = repos.filter(r => !r.fork && !r.archived).slice(0, 6)
  const maxStars = Math.max(...filtered.map(r => r.stargazers_count))

  const descriptions = await Promise.all(
    filtered.map(r => r.description ? Promise.resolve(r.description) : fetchReadmeDescription(r.name))
  )

  const data = filtered.map((r, idx) => ({
    title:       r.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: descriptions[idx] || 'No description available.',
    tags:        [r.language, ...(r.topics ?? [])].filter(Boolean).slice(0, 4),
    github:      r.html_url,
    live:        r.homepage || null,
    stars:       r.stargazers_count,
    featured:    r.stargazers_count === maxStars && maxStars > 0,
  }))

  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  return data
}

// ── Project card ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
      style={{
        background: '#ffffff',
        border: '1px solid #c8ccd2',
        borderRadius: 10,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {project.featured && (
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#41454d',
              border: '1px solid #dddddd',
              borderRadius: 9999,
              padding: '2px 8px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Featured
            </span>
          )}
          {project.stars > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9297a0' }}>
              <Star style={{ width: 11, height: 11 }} />
              {project.stars}
            </span>
          )}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on GitHub`}
          style={{ color: '#9297a0', flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </a>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 18, fontWeight: 500, color: '#181d26', lineHeight: 1.3, margin: 0 }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#333840', lineHeight: 1.65, margin: 0, flex: 1 }}>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 12,
                color: '#41454d',
                border: '1px solid #dddddd',
                borderRadius: 6,
                padding: '2px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#181d26',
            border: '1px solid #c8ccd2',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          GitHub
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              color: '#181d26',
              border: '1px solid #c8ccd2',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <ExternalLink style={{ width: 13, height: 13 }} />
            Live
          </a>
        )}
      </div>
    </motion.div>
  )
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            background: '#f8fafc',
            border: '1px solid #c8ccd2',
            borderRadius: 10,
            padding: 32,
            height: 240,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus]    = useState('loading')

  useEffect(() => {
    fetchGithubProjects()
      .then(data => { setProjects(data); setStatus('ok') })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <section
      id="projects"
      style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(circle, #d0d3d8 1px, transparent 1px)', backgroundSize: '28px 28px', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ marginBottom: 56 }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
            Projects
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: 0 }}>
            Things I've built.
          </h2>
        </motion.div>

        {/* Content */}
        {status === 'loading' && <Skeleton />}

        {status === 'error' && (
          <p style={{ fontSize: 14, color: '#41454d' }}>
            Could not load projects from GitHub — check back soon.
          </p>
        )}

        {status === 'ok' && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {projects.map((project, i) => (
                <ProjectCard key={project.github} project={project} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginTop: 48, textAlign: 'center' }}
            >
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: '#41454d',
                  textDecoration: 'none',
                  borderBottom: '1px solid #dddddd',
                  paddingBottom: 2,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                View all repositories on GitHub
              </a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
