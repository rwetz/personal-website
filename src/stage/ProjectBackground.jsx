// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense, useState } from 'react'
import { backgroundLoaders } from './backgrounds'
import { irisOrigin } from './iris'

const backgrounds = Object.fromEntries(Object.entries(backgroundLoaders).map(([id, load]) => [id, lazy(load)]))
const homeColors = ['#61dca3', '#61b3dc']

export default function ProjectBackground({ project }) {
  const id = project?.id ?? 'home'
  const Background = backgrounds[id]
  const accent = project?.palette.accent
  // Each world opens as a circle from wherever the visitor chose it.
  const [origin] = useState(() => {
    const point = irisOrigin()
    return { '--iris-x': point ? `${point.x}px` : '50%', '--iris-y': point ? `${point.y}px` : '55%' }
  })
  const settings = {
    home: { glitchColors: homeColors, baseColor: '#2b4539', spacing: .1, density: 1, baseOpacity: 1, glitchAmount: .85, flow: 0, characters: '0123456789ABCDEF', interactive: true, clickEffect: 'tear', intro: false, dpr: 1 },
    nexis: { colors: [project?.palette.bg, '#526580', accent], speed: .35, grainAmount: .1, interactive: true, clickSwirl: true, intro: false, dpr: 1 },
    ateru: { color: accent, accentColor: '#f2b5a8', speed: .35, lineCount: 64, thickness: .7, angle: 25, opacity: .8, parting: .5, enableMouseInteraction: true },
    biblelm: { waveColor: accent, backgroundColor: 'transparent', waveSpeed: .035, waveFrequency: 2.5, waveAmplitude: .3, colorNum: 4, pixelSize: 3, mouseRadius: .22, enableMouseInteraction: true, clickRipple: true, intro: false, dpr: 1 },
    halcyra: { glowColor: accent, lineColor: '#c6deff', secondaryColor: '#526aa3', speed: .25, threads: 48, layers: 2, particles: .2, sparkle: .2, fiberStyle: 'lines', mouseInteraction: true, pulseOnClick: true, intro: false, dpr: 1 },
    logscope: { tint: '#ffb347', glyphs: 'dots', scale: 1.6, digitSize: 1.25, timeScale: .85, brightness: .8, glow: .6, persistence: .5, mouseStrength: .5, mouseGlow: .55, scramble: .5, scanlineIntensity: .5, glitchAmount: 1, flickerAmount: 1, noiseAmp: 1, chromaticAberration: 0, curvature: .07, vignette: .25, mouseReact: true, clickEffect: 'glitch', pageLoadAnimation: true, pause: false, lightMode: false, dpr: 1 },
  }
  return <>
    <div className={`stage-effect effect-${id}`} aria-hidden="true" data-effect={id} style={origin}>
      <Suspense fallback={null}><Background {...settings[id]} /></Suspense>
    </div>
    <span className="world-ring" aria-hidden="true" style={origin} />
  </>
}
