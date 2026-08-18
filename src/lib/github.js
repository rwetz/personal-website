// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// Shared GitHub stats fetcher used by Stats.jsx and Resume.jsx so they hit
// the same sessionStorage cache instead of double-fetching.

export const GITHUB_USER = 'rwetz'
const CACHE_KEY = 'gh_stats_cache_v1'
const CACHE_TTL = 30 * 60 * 1000

export async function fetchGithubStats() {
  // sessionStorage is attacker-writable from any script on this origin, so a corrupt
  // or hostile entry must degrade to a refetch rather than throw out of the component.
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { ts, data } = JSON.parse(cached)
      if (typeof ts === 'number' && data && Date.now() - ts < CACHE_TTL) return data
    }
  } catch {
    sessionStorage.removeItem(CACHE_KEY)
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers: { Accept: 'application/vnd.github+json' } }),
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } }),
  ])
  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error')
  const user = await userRes.json()
  const repos = await reposRes.json()

  const owned = repos.filter(r => !r.fork)
  const langCounts = {}
  let totalStars = 0
  let totalForks = 0
  for (const r of owned) {
    if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1
    totalStars += r.stargazers_count
    totalForks += r.forks_count
  }
  const totalLang = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1
  const languages = Object.entries(langCounts)
    .map(([name, count]) => ({ name, count, pct: (count / totalLang) * 100 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const data = {
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars,
    totalForks,
    languages,
    languageCount: Object.keys(langCounts).length,
    bio: user.bio,
  }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    // Private-mode / quota-exceeded: caching is best-effort, never fatal.
  }
  return data
}
