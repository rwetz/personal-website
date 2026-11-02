// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useState } from 'react'
import CallChip from '../components/micro/CallChip'
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

export default function AssetWarmup() {
  const [status, setStatus] = useState(() => alreadyReady() ? null : 'running')
  useEffect(() => {
    if (alreadyReady()) return
    let active = true
    let dismiss
    prepareAssets().then(results => {
      if (!active) return
      const complete = results.every(result => result.status === 'fulfilled')
      setStatus(complete ? 'done' : 'error')
      if (complete) {
        warmed = true
        try { sessionStorage.setItem(storageKey, 'true') } catch { /* In-memory state covers restricted storage. */ }
      }
      dismiss = setTimeout(() => setStatus(null), 1800)
    })
    return () => { active = false; clearTimeout(dismiss) }
  }, [])
  if (!status) return null
  return <div className="asset-warmup" data-warmup={status}>
    <CallChip icon="file" name={status === 'running' ? 'Preparing' : status === 'done' ? 'Ready' : 'Continue exploring'}
      argument={status === 'running' ? 'the work' : status === 'done' ? 'Explore the work' : 'Previews load on demand'}
      status={status} showTimer={false} color="var(--t-white)" surfaceColor="#10151ef2" doneColor="#61dca3" size={34} />
  </div>
}
