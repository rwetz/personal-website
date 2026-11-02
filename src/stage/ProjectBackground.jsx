// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { lazy, Suspense } from 'react'
import { backgroundLoaders } from './backgrounds'

const backgrounds = Object.fromEntries(Object.entries(backgroundLoaders).map(([id, load]) => [id, lazy(load)]))
const homeColors = ['#61dca3', '#61b3dc']

export default function ProjectBackground({ project }) {
  const id = project?.id ?? 'home'
  const Background = backgrounds[id]
  const accent = project?.palette.accent
  const settings = {
    home: { glitchColors: homeColors, baseColor: '#2b4539', spacing: .1, density: 1, baseOpacity: 1, glitchAmount: .85, flow: 0, characters: '0123456789ABCDEF', interactive: true, clickEffect: 'tear', intro: false, dpr: 1 },
    nexis: { colors: [project?.palette.bg, '#526580', accent], speed: .35, grainAmount: .1, interactive: true, clickSwirl: true, intro: false, dpr: 1 },
    ateru: { color: accent, accentColor: '#f2b5a8', speed: .35, lineCount: 64, thickness: .7, angle: 25, opacity: .8, parting: .5, enableMouseInteraction: true },
    biblelm: { waveColor: accent, backgroundColor: 'transparent', waveSpeed: .035, waveFrequency: 2.5, waveAmplitude: .3, colorNum: 4, pixelSize: 3, enableMouseInteraction: true, clickRipple: true, intro: false, dpr: 1 },
    halcyra: { glowColor: accent, lineColor: '#c6deff', secondaryColor: '#526aa3', speed: .25, threads: 48, layers: 2, particles: .2, sparkle: .2, fiberStyle: 'lines', mouseInteraction: true, pulseOnClick: true, intro: false, dpr: 1 },
    logscope: { tint: accent, glyphs: 'characters', timeScale: .2, flickerAmount: .15, glitchAmount: .25, noiseAmp: .25, curvature: .08, brightness: .75, mouseReact: true, clickEffect: 'glitch', pageLoadAnimation: false, dpr: 1 },
  }
  return <div className={`stage-effect effect-${id}`} aria-hidden="true" data-effect={id}>
    <Suspense fallback={null}><Background {...settings[id]} /></Suspense>
  </div>
}
