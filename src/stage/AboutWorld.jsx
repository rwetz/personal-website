// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { detailedMark } from '../brand/mark'
import { irisOrigin } from './iris'
import { useState } from 'react'

// About's own world: the heptagram drawn as engraved line work, turning slowly.
// SVG rather than WebGL, so there is no canvas to warm up or pause.
export default function AboutWorld() {
  const [origin] = useState(() => {
    const point = irisOrigin()
    return { '--iris-x': point ? `${point.x}px` : '50%', '--iris-y': point ? `${point.y}px` : '20%' }
  })
  return <>
    <div className="stage-effect effect-about" aria-hidden="true" data-effect="about" style={origin}>
      <svg className="about-world-mark" viewBox="0 0 1024 1024">
        {[1, .82, .64].map(scale => <path key={scale} d={detailedMark} fill="none" stroke="currentColor" strokeWidth={1.4 / scale} vectorEffect="non-scaling-stroke"
          transform={`translate(${512 * (1 - scale)} ${512 * (1 - scale)}) scale(${scale})`} />)}
        <circle cx="512" cy="512" r="470" fill="none" stroke="currentColor" strokeDasharray="2 14" />
      </svg>
    </div>
    <span className="world-ring" aria-hidden="true" style={origin} />
  </>
}
