// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useRef, useState } from 'react'
const sources = {
  nexis: () => import('../assets/showcase/nexis.mp4?url'),
  biblelm: () => import('../assets/showcase/biblelm.mp4?url'),
  logscope: () => import('../assets/showcase/logscope.mp4?url'),
}
// Mounted only after intentional desktop hover/focus; no idle video downloads.
export default function ProjectPreview({ id }) {
  const [src, setSrc] = useState(null)
  const video = useRef(null)
  useEffect(() => {
    let cancelled = false
    sources[id]().then(module => { if (!cancelled) setSrc(module.default) })
    return () => { cancelled = true }
  }, [id])
  useEffect(() => {
    const sync = () => {
      if (!video.current) return
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current.pause()
      else video.current.play().catch(() => {})
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    document.addEventListener('visibilitychange', sync); query.addEventListener('change', sync)
    return () => { document.removeEventListener('visibilitychange', sync); query.removeEventListener('change', sync) }
  }, [])
  return src ? <video ref={video} src={src} autoPlay loop muted playsInline aria-hidden="true" className="constellation-preview" /> : null
}
