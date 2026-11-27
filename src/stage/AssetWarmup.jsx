// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect } from 'react'
import { projects, projectFromHash } from './projects'
import { backgroundLoaders } from './backgrounds'

const storageKey = 'portfolio-assets-ready-v1'
let prepared
let warmed = false
const alreadyReady = () => {
  try { return warmed || sessionStorage.getItem(storageKey) === 'true' }
  catch { return warmed }
}
const bounded = promise => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('Asset warmup timed out')), 8000)
  promise.then(resolve, reject).finally(() => clearTimeout(timer))
})
function prepareAssets() {
  if (!prepared) {
    const current = projectFromHash(window.location.hash)?.id ?? 'home'
    const images = projects.map(project => {
      const image = new Image()
      image.src = project.media.src
      return bounded(image.decode())
    })
    prepared = Promise.allSettled([...images, bounded(document.fonts.ready), bounded(backgroundLoaders[current]())])
  }
  return prepared
}

// Warm the posters, fonts and current field once per browser session. Nothing is shown;
// the page works the same whether or not this finishes.
export default function AssetWarmup() {
  useEffect(() => {
    if (alreadyReady()) return
    prepareAssets().then(results => {
      if (!results.every(result => result.status === 'fulfilled')) return
      warmed = true
      try { sessionStorage.setItem(storageKey, 'true') } catch { /* In-memory state covers restricted storage. */ }
    })
  }, [])
  return null
}
