// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import '@fontsource-variable/geist'
import './lost.css'
import { constellation404, drawConstellation } from './digits.js'

const $ = id => document.getElementById(id)
const root = document.querySelector('.lost')
const canvas = document.querySelector('.lost-canvas')
const stage = $('lost-stage')
const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
const bestKey = 'lost-constellation-best-v1'
let memoryBest = 0
let game
let ambient = 0
let bannerTimer

// Echo the path that missed. textContent only: the URL is attacker-controlled.
const path = location.pathname + location.search
if (path !== '/404.html' && path !== '/') {
  $('path').textContent = 'Requested: ' + (path.length > 120 ? path.slice(0, 120) + '…' : path)
  $('path').hidden = false
}

const readBest = () => { try { return Number(localStorage.getItem(bestKey)) || memoryBest } catch { return memoryBest } }
const writeBest = value => { memoryBest = value; try { localStorage.setItem(bestKey, String(value)) } catch { /* In-memory best covers blocked storage. */ } }
const announce = text => { $('lost-live').textContent = text }
$('lost-best').textContent = readBest()

// The idle screen: "404" spelled in stars, twinkling unless motion is reduced.
function drawAmbient(now = 0) {
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const { width, height } = canvas.getBoundingClientRect()
  if (canvas.width !== Math.round(width * dpr)) { canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr) }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#090b10'
  ctx.fillRect(0, 0, width, height)
  drawConstellation(ctx, constellation404(width / 2, height * .3, Math.min(width / 14, 52)), { color: '#c7d0dd', time: now / 1000, twinkle: !motion.matches })
  ambient = motion.matches ? 0 : requestAnimationFrame(drawAmbient)
}
drawAmbient()

function setState(state) {
  root.dataset.state = state
  $('lost-intro').hidden = state !== 'ready'
  stage.hidden = state === 'ready' || state === 'over'
  $('lost-over').hidden = state !== 'over'
  $('lost-paused').hidden = state !== 'paused'
  $('lost-pause').textContent = state === 'paused' ? 'Resume' : 'Pause'
}

function banner(text) {
  const element = $('lost-banner')
  element.textContent = text
  element.classList.remove('is-shown')
  void element.offsetWidth
  element.classList.add('is-shown')
  clearTimeout(bannerTimer)
  bannerTimer = setTimeout(() => element.classList.remove('is-shown'), 2200)
}

function onEvent(event) {
  root.dataset.score = event.score
  root.dataset.sector = event.sector.id
  $('lost-score').textContent = event.score
  $('lost-sector').textContent = event.sector.name
  document.documentElement.style.setProperty('--lost-accent', event.sector.accent)
  if (event.type === 'capture' && event.score > readBest()) $('lost-best').textContent = event.score
  if (event.type === 'capture' && event.perfect) banner(event.combo > 1 ? `Perfect ×${event.combo}` : 'Perfect')
  if (event.type === 'shield') { banner('Shield up'); announce('Three perfect catches. Shield up: the next hit from static is absorbed.') }
  if (event.type === 'shield-lost') { banner('Shield down'); announce('Your shield absorbed the static.') }
  if (event.type === 'start') { setState('playing'); announce('Game started. You are orbiting the first star in Nexis.') }
  if (event.type === 'sector') { banner(`Entering ${event.sector.name}`); announce(`Entering ${event.sector.name}.`) }
  if (event.type === 'home') { banner('Home. Keep drifting, or head back to work.'); announce('You found your way home. The game continues if you keep going.') }
  if (event.type === 'pause') { setState('paused'); announce('Paused.') }
  if (event.type === 'resume') { setState('playing'); announce('Resumed.') }
  if (event.type === 'over') {
    const best = Math.max(readBest(), event.score)
    const record = event.score > 0 && event.score >= best && event.score > readBest()
    writeBest(best)
    $('lost-best').textContent = best
    $('lost-over-sector').textContent = `Lost in ${event.sector.name}`
    const cause = { decay: 'Your orbit decayed into the star. Let go before the arc runs out.', static: 'You flew into static. Thread the gap, or earn a shield with three perfect catches.' }[event.reason]
      ?? (event.score === 0 ? 'You drifted off before the first star. Let go when the dotted line points into the next ring.' : 'You drifted out of reach.')
    $('lost-over-text').textContent = `${cause} ${event.score > 0 ? `You reached star ${event.score} of 35${record ? ', a new best' : `. Your best is ${best}`}.` : ''}`.trim()
    setState('over')
    $('lost-over-title').focus()
    announce(`Signal lost at star ${event.score}. Best ${best}.`)
  }
}

async function play() {
  cancelAnimationFrame(ambient)
  if (!game) {
    const { createGame } = await import('./game.js')
    const seed = Number(new URLSearchParams(location.search).get('seed')) || undefined
    game = createGame(canvas, { seed, reduced: motion.matches, onEvent })
    // A fixed seed marks a test run; expose the game so the autopilot can read it.
    if (seed) window.lostGame = game
    motion.addEventListener('change', () => game.setReduced(motion.matches))
    window.addEventListener('resize', () => game.resize())
  }
  const fixed = Number(new URLSearchParams(location.search).get('seed'))
  game.start(fixed || (Math.random() * 2 ** 31) | 0)
  stage.focus()
}

const release = () => game?.release()
const togglePause = () => { if (game?.state === 'playing') game.pause(); else if (game?.state === 'paused') { game.resume(); stage.focus() } }

$('lost-play').addEventListener('click', play)
$('lost-retry').addEventListener('click', play)
$('lost-pause').addEventListener('click', togglePause)
$('lost-resume').addEventListener('click', togglePause)
stage.addEventListener('pointerdown', event => {
  if (event.target.closest('button, a') || !event.isPrimary) return
  if (game?.state === 'paused') return togglePause()
  release()
})
stage.addEventListener('keydown', event => {
  if (event.target !== stage) return
  if ([' ', 'ArrowUp', 'Enter'].includes(event.key)) {
    event.preventDefault()
    if (game?.state === 'paused') togglePause()
    else release()
  }
  if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') { event.preventDefault(); togglePause() }
})
document.addEventListener('visibilitychange', () => { if (document.hidden) game?.pause() })
window.addEventListener('blur', () => game?.pause())
window.addEventListener('resize', () => { if (!game) { cancelAnimationFrame(ambient); drawAmbient() } })
