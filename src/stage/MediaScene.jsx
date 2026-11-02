// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = callback => { const query = motionQuery(); query.addEventListener('change', callback); return () => query.removeEventListener('change', callback) }
export default function MediaScene({ project, mp4, webm }) {
  const video = useRef(null)
  const [playing, setPlaying] = useState(false)
  const reduced = useSyncExternalStore(subscribe, () => motionQuery().matches)
  const userIntent = useRef(null)
  const previousMotion = useRef(reduced)
  const fallbackTried = useRef(false)
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (previousMotion.current !== reduced) userIntent.current = null
    previousMotion.current = reduced
    const sync = () => {
      if (document.hidden || !(userIntent.current ?? !reduced)) element.pause()
      else element.play().catch(() => {})
    }
    sync(); document.addEventListener('visibilitychange', sync)
    return () => { element.pause(); document.removeEventListener('visibilitychange', sync) }
  }, [reduced])
  return <div className="media-scene">
    <video ref={video} poster={project.media.src} muted loop playsInline preload={reduced ? 'none' : 'metadata'} aria-label={project.media.alt}
      onError={() => {
        if (!webm || fallbackTried.current) return
        fallbackTried.current = true
        video.current.src = webm
        video.current.load()
        if (userIntent.current ?? !reduced) video.current.play().catch(() => {})
      }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src={mp4} type="video/mp4" />{webm && <source src={webm} type="video/webm" />}
    </video>
    <button className="media-toggle" aria-label={`${playing ? 'Pause' : 'Play'} ${project.name} demo`} onClick={() => {
      userIntent.current = video.current.paused
      if (userIntent.current) video.current.play().catch(() => {})
      else video.current.pause()
    }}>{playing ? 'Pause' : 'Play demo'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span></button>
  </div>
}
