import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GitCommit, GitFork, Star, FolderGit2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { fetchGithubStats, GITHUB_USER } from '@/lib/github'

const LANG_COLORS = {
  Python:     '#3572A5',
  JavaScript: '#F1E05A',
  TypeScript: '#2B7489',
  C:          '#A8B9CC',
  'C++':      '#F34B7D',
  'C#':       '#178600',
  Java:       '#B07219',
  HTML:       '#E34C26',
  CSS:        '#563d7c',
  Rust:       '#DEA584',
  Go:         '#00ADD8',
  Shell:      '#89E051',
  Jupyter:    '#DA5B0B',
  default:    '#7c3aed',
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="p-5 rounded-xl bg-[var(--color-surface-3)] border border-white/5">
      <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-bold text-[var(--color-accent-light)]">{value}</div>
    </div>
  )
}

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetchGithubStats().then(d => { setStats(d); setStatus('ok') }).catch(() => setStatus('error'))
  }, [])

  return (
    <section id="stats" className="py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 05</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">GitHub Stats</h2>
          <div className="accent-bar" />
          <p className="text-[var(--color-muted)] text-base max-w-xl mb-10">
            Live snapshot from the GitHub API. I know I don't have many repos right now but I'm working on it!
          </p>
        </motion.div>

        {status === 'loading' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[0,1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-[var(--color-surface-3)] border border-white/5" />)}
          </div>
        )}

        {status === 'error' && (
          <p className="text-[var(--color-muted)] text-sm font-mono">Could not load GitHub stats.</p>
        )}

        {status === 'ok' && stats && (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FolderGit2} value={stats.publicRepos} label="Public repos" />
              <StatCard icon={Star} value={stats.totalStars} label="Stars earned" />
              <StatCard icon={GitFork} value={stats.totalForks} label="Forks" />
              <StatCard icon={GitCommit} value={stats.followers} label="Followers" />
            </div>

            {/* Language breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-6 rounded-xl bg-[var(--color-surface-3)] border border-white/5"
            >
              <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-5">
                Language breakdown
              </h3>

              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden bg-white/5 mb-6">
                {stats.languages.map(({ name, pct }) => (
                  <motion.div
                    key={name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ background: LANG_COLORS[name] ?? LANG_COLORS.default }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {stats.languages.map(({ name, count, pct }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LANG_COLORS[name] ?? LANG_COLORS.default }} />
                    <span className="text-sm text-[var(--color-text)]">{name}</span>
                    <span className="text-xs font-mono text-[var(--color-muted)]">{pct.toFixed(0)}%</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="text-center">
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                @{GITHUB_USER} on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
