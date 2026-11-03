// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// Lost in the Constellation: orbit a star, let go on the tangent, get caught by the next ring.
// Every seven stars the game crosses into the next project's world, as the site does.
import { emblems, outline } from '../brand/emblems.js'
import { detailedMark } from '../brand/mark.js'
import { constellation404, drawConstellation } from './digits.js'

export const sectors = [
  { id: 'nexis', name: 'Nexis', bg: '#101319', fg: '#f0f3f7', accent: '#8dbce8', dim: '#526580' },
  { id: 'ateru', name: 'Ateru', bg: '#0b0b0c', fg: '#f2f2f3', accent: '#ef4a44', dim: '#f2b5a8' },
  { id: 'biblelm', name: 'BibleLM', bg: '#14110d', fg: '#e9e1d0', accent: '#d4a94f', dim: '#8a7240' },
  { id: 'halcyra', name: 'Halcyra', bg: '#15161a', fg: '#e6e8ee', accent: '#7fb8ff', dim: '#526aa3' },
  { id: 'logscope', name: 'Logscope', bg: '#090b10', fg: '#f3f5f7', accent: '#ffb347', dim: '#8a6a3a' },
]
export const PER_SECTOR = 7
export const HOME = sectors.length * PER_SECTOR
const STEP = 1 / 120
const TAU = Math.PI * 2
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21]

export const sectorIndex = index => Math.max(0, Math.floor((index - 1) / PER_SECTOR)) % sectors.length
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const mix = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const channel = shift => Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t)
  return `rgb(${channel(16)},${channel(8)},${channel(0)})`
}

export function mulberry32(seed) {
  let state = seed >>> 0
  return () => {
    state = state + 0x6D2B79F5 | 0
    let t = Math.imul(state ^ state >>> 15, 1 | state)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// One small repeating tile per world, drawn once: grain, threads, dither, waves, log lines.
function makeTile(sector, rand) {
  const size = 240
  const tile = document.createElement('canvas')
  tile.width = tile.height = size
  const g = tile.getContext('2d')
  g.fillStyle = g.strokeStyle = sector.id === 'nexis' ? sector.dim : sector.accent
  if (sector.id === 'nexis') {
    for (let i = 0; i < 90; i++) { g.globalAlpha = .25 + rand() * .45; g.beginPath(); g.arc(rand() * size, rand() * size, .5 + rand() * 1.1, 0, TAU); g.fill() }
  } else if (sector.id === 'ateru') {
    g.globalAlpha = .22
    g.lineWidth = 1
    for (let k = -size; k < size * 2; k += 24) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + size, size); g.stroke() }
  } else if (sector.id === 'biblelm') {
    g.globalAlpha = .2
    for (let y = 0; y < size; y += 6) {
      const level = 18 + 16 * Math.sin(y / size * TAU)
      for (let x = 0; x < size; x += 6) if (BAYER[(y / 6 % 8) * 8 + (x / 6 % 8)] < level) g.fillRect(x, y, 2, 2)
    }
  } else if (sector.id === 'halcyra') {
    g.globalAlpha = .16
    g.lineWidth = 1
    for (let row = 15; row < size; row += 30) {
      g.beginPath()
      for (let x = 0; x <= size; x += 4) g.lineTo(x, row + 7 * Math.sin(x / size * TAU * 2 + row))
      g.stroke()
    }
  } else {
    g.globalAlpha = .16
    for (let y = 6; y < size; y += 12) for (let x = 6; x < size; x += 12) g.fillRect(x, y, 1, 1)
    g.globalAlpha = .1
    for (let y = 12; y < size; y += 24) g.fillRect(rand() * 60, y, 40 + rand() * 140, 2)
  }
  return tile
}

export function createGame(canvas, { seed = Date.now(), reduced = false, onEvent = () => {} } = {}) {
  const ctx = canvas.getContext('2d')
  const marks = Object.fromEntries(sectors.map(sector => [sector.id, new Path2D(emblems[sector.id])]))
  const homeMark = new Path2D(detailedMark)
  const playerMark = new Path2D(outline)
  const view = { width: 0, height: 0, field: 0, dpr: 1 }
  let tiles = []
  let rand
  let stars
  let player
  let cam
  let state = 'ready'
  let time = 0
  let score = 0
  let sector = 0
  let bg = sectors[0].bg
  let fade = { from: 0, t: 1 }
  let trail = []
  let sparks = []
  let digits
  let raf = 0
  let last = 0
  let acc = 0
  let motionReduced = reduced

  function resize() {
    const rect = canvas.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1)
    view.width = rect.width
    view.height = rect.height
    view.field = Math.min(rect.width - 48, 560)
    canvas.width = Math.round(rect.width * view.dpr)
    canvas.height = Math.round(rect.height * view.dpr)
    digits = constellation404(view.width / 2, view.height * .3, Math.min(view.width / 14, 52))
    if (state !== 'playing') render()
  }

  function difficulty(index) {
    const lap = Math.max(0, Math.floor((index - 1) / HOME))
    return Math.min(1, index / 36) + Math.min(.4, lap * .2)
  }

  function makeStar(index) {
    const prev = stars[index - 1]
    const d = difficulty(index)
    const id = sectors[sectorIndex(index)].id
    const ring = index === 0 ? 64 : Math.max(40, 66 - 22 * Math.min(d, 1.2))
    const half = view.field / 2
    const drift = index > 0 && (id === 'logscope' || d > 1) ? { amp: 26 + 34 * rand(), speed: .6 + .6 * rand(), phase: rand() * TAU } : null
    const edge = half - ring - (drift?.amp ?? 0)
    const reach = 80 + 150 * Math.min(d, 1)
    const gap = index === 0 ? 0 : Math.min(view.height * .5, 170 + 80 * Math.min(d, 1)) + rand() * 40
    const x = prev ? clamp(prev.x + (rand() * 2 - 1) * reach, -edge, edge) : 0
    return { index, x, baseX: x, y: prev ? prev.y + gap : 0, ring, baseRing: ring, omega: 2.2 + 1.6 * Math.min(d, 1.2), speed: 430 + 90 * Math.min(d, 1), aim: 150 - 70 * Math.min(d, 1), drift, pulse: index > 0 && id === 'halcyra', home: index === HOME }
  }

  function ensureStars(upTo) { while (stars.length <= upTo) stars.push(makeStar(stars.length)) }

  function reset(nextSeed = seed) {
    seed = nextSeed
    rand = mulberry32(seed)
    tiles = sectors.map(item => makeTile(item, rand))
    stars = []
    ensureStars(4)
    player = { mode: 'orbit', star: 0, angle: -Math.PI / 2, radius: 40, targetRadius: 40, dir: 1, x: 0, y: -40, vx: 0, vy: 0, flight: 0 }
    cam = -view.height * .3
    time = 0
    score = 0
    sector = 0
    bg = sectors[0].bg
    fade = { from: 0, t: 1 }
    trail = []
    sparks = []
    acc = 0
  }

  function emit(type, detail = {}) { onEvent({ type, score, sector: sectors[sector], ...detail }) }

  function capture(star) {
    const rx = player.x - star.x
    const ry = player.y - star.y
    player.mode = 'orbit'
    player.star = star.index
    player.dir = rx * player.vy - ry * player.vx > 0 ? 1 : -1
    player.angle = Math.atan2(ry, rx)
    player.radius = Math.max(18, Math.hypot(rx, ry))
    player.targetRadius = clamp(star.ring * .62, 24, star.ring - 8)
    ensureStars(star.index + 4)
    if (motionReduced) cam = star.y - view.height * .26
    if (!motionReduced) for (let i = 0; i < 14; i++) {
      const angle = rand() * TAU
      const speed = 60 + rand() * 140
      sparks.push({ x: player.x, y: player.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .6 })
    }
    if (star.index > score) score = star.index
    const next = sectorIndex(star.index)
    if (next !== sector) { fade = { from: sector, t: 0 }; sector = next; emit('sector') }
    emit('capture')
    if (star.home) emit('home')
  }

  function lose() {
    state = 'over'
    emit('over')
  }

  function update(dt) {
    time += dt
    for (const star of stars) {
      if (star.drift) star.x = star.baseX + Math.sin(time * star.drift.speed + star.drift.phase) * star.drift.amp
      if (star.pulse) star.ring = star.baseRing + Math.sin(time * 4 + star.index) * 7
    }
    if (player.mode === 'orbit') {
      const star = stars[player.star]
      player.radius += (player.targetRadius - player.radius) * (1 - Math.exp(-dt * 5))
      player.angle += player.dir * star.omega * dt
      player.x = star.x + Math.cos(player.angle) * player.radius
      player.y = star.y + Math.sin(player.angle) * player.radius
    } else {
      player.x += player.vx * dt
      player.y += player.vy * dt
      player.flight += dt
      for (let i = player.star + 1; i <= player.star + 3; i++) {
        const star = stars[i]
        if (Math.hypot(player.x - star.x, player.y - star.y) < star.ring) { capture(star); break }
      }
      const sx = view.width / 2 + player.x
      const sy = view.height - (player.y - cam)
      if (player.mode === 'fly' && (sx < -30 || sx > view.width + 30 || sy > view.height + 30 || sy < -30 || player.flight > 2.8)) return lose()
    }
    if (!motionReduced) {
      const target = player.mode === 'orbit' ? stars[player.star].y - view.height * .3 : Math.max(cam, player.y - view.height * .55)
      cam += (target - cam) * (1 - Math.exp(-dt * 3.2))
    }
    fade.t = Math.min(1, fade.t + dt / 1.2)
    sparks = sparks.filter(spark => (spark.life -= dt) > 0)
    for (const spark of sparks) { spark.x += spark.vx * dt; spark.y += spark.vy * dt }
  }

  function drawMark(path, x, y, size, rotation = 0) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.scale(size / 1024, size / 1024)
    ctx.translate(-512, -512)
    ctx.fill(path, 'evenodd')
    ctx.restore()
  }

  function drawField(index, alpha) {
    const pattern = ctx.createPattern(tiles[index], 'repeat')
    const offset = (cam * .4) % 240
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(0, offset)
    ctx.fillStyle = pattern
    ctx.fillRect(0, -240, view.width, view.height + 480)
    ctx.restore()
  }

  function drawRing(star, look, x, y, emphasis) {
    ctx.save()
    ctx.strokeStyle = look.accent
    ctx.globalAlpha = emphasis
    ctx.lineWidth = star.home ? 2 : 1.2
    if (look.id === 'nexis' || look.id === 'logscope') ctx.setLineDash([3, 6])
    if (look.id === 'biblelm') ctx.setLineDash([1, 4])
    ctx.beginPath()
    if (look.id === 'halcyra') {
      for (let a = 0; a <= TAU + .01; a += TAU / 72) {
        const r = star.ring + 3 * Math.sin(a * 8 + time * 5)
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      }
    } else ctx.arc(x, y, star.ring, 0, TAU)
    ctx.stroke()
    if (star.home) { ctx.setLineDash([]); ctx.globalAlpha = emphasis * .5; ctx.beginPath(); ctx.arc(x, y, star.ring + 10, 0, TAU); ctx.stroke() }
    ctx.restore()
  }

  function render() {
    if (!view.width) return
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0)
    const look = sectors[sector]
    if (fade.t < 1) bg = mix(sectors[fade.from].bg, look.bg, fade.t)
    else bg = look.bg
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, view.width, view.height)
    if (!stars) return drawConstellation(ctx, digits, { color: '#c7d0dd', alpha: .9, twinkle: false })
    if (fade.t < 1) drawField(fade.from, .9 * (1 - fade.t))
    drawField(sector, .9 * fade.t)
    const sy = y => view.height - (y - cam)
    const sx = x => view.width / 2 + x
    const home = -view.height * .3
    ctx.save()
    ctx.translate(0, (cam - home) * .65)
    drawConstellation(ctx, digits, { color: look.fg, alpha: .22, time, twinkle: !motionReduced })
    ctx.restore()

    for (const star of stars) {
      const x = sx(star.x)
      const y = sy(star.y)
      if (y < -120 || y > view.height + 120) continue
      const starLook = sectors[sectorIndex(star.index)]
      const visited = star.index < player.star
      const next = star.index === player.star + 1
      // BibleLM's world is lit like a manuscript by candle: only the next star shows plainly.
      const hidden = starLook.id === 'biblelm' && star.index > player.star + 1
      const emphasis = visited ? .14 : next ? .85 : hidden ? .12 : .4
      drawRing(star, starLook, x, y, emphasis)
      ctx.fillStyle = star.home ? starLook.fg : visited ? starLook.dim : starLook.accent
      ctx.globalAlpha = visited ? .45 : hidden ? .25 : 1
      if (star.home) drawMark(homeMark, x, y, 56, time * .3)
      else if (star.index === 0) { ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill() }
      else drawMark(marks[starLook.id], x, y, 30)
      ctx.globalAlpha = 1
    }

    const px = sx(player.x)
    const py = sy(player.y)
    if (player.mode === 'orbit' && state !== 'over') {
      const star = stars[player.star]
      const dx = -Math.sin(player.angle) * player.dir
      const dy = Math.cos(player.angle) * player.dir
      ctx.save()
      ctx.strokeStyle = look.fg
      ctx.globalAlpha = .45
      ctx.setLineDash([2, 6])
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + dx * star.aim, py - dy * star.aim)
      ctx.stroke()
      ctx.restore()
    }
    if (!motionReduced) {
      trail.push([player.x, player.y])
      if (trail.length > 28) trail.shift()
      ctx.save()
      ctx.strokeStyle = look.accent
      ctx.lineWidth = 2
      for (let i = 1; i < trail.length; i++) {
        ctx.globalAlpha = i / trail.length * .5
        ctx.beginPath()
        ctx.moveTo(sx(trail[i - 1][0]), sy(trail[i - 1][1]))
        ctx.lineTo(sx(trail[i][0]), sy(trail[i][1]))
        ctx.stroke()
      }
      ctx.restore()
      ctx.fillStyle = look.accent
      for (const spark of sparks) { ctx.globalAlpha = spark.life / .6; ctx.fillRect(sx(spark.x) - 1.5, sy(spark.y) - 1.5, 3, 3) }
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = look.id === 'nexis' ? `hsl(${(time * 80) % 360} 75% 75%)` : look.fg
    drawMark(playerMark, px, py, 26, motionReduced ? 0 : time * 2.4)
  }

  function frame(now) {
    const dt = Math.min(.25, (now - last) / 1000)
    last = now
    acc += dt
    while (acc >= STEP && state === 'playing') { update(STEP); acc -= STEP }
    render()
    raf = state === 'playing' ? requestAnimationFrame(frame) : 0
  }
  function run() {
    cancelAnimationFrame(raf)
    last = performance.now()
    acc = 0
    raf = requestAnimationFrame(frame)
  }

  resize()
  return {
    get state() { return state },
    get score() { return score },
    get seed() { return seed },
    // Read-only view for the browser tests' autopilot.
    snapshot() {
      const next = stars?.[player.star + 1]
      return { state, score, sector: sectors[sector].id, mode: player.mode, x: player.x, y: player.y, angle: player.angle, dir: player.dir, next: next && { x: next.x, y: next.y, ring: next.ring } }
    },
    start(nextSeed) {
      reset(nextSeed)
      state = 'playing'
      emit('start')
      run()
    },
    release() {
      if (state !== 'playing' || player.mode !== 'orbit') return false
      const star = stars[player.star]
      player.mode = 'fly'
      player.flight = 0
      player.vx = -Math.sin(player.angle) * player.dir * star.speed
      player.vy = Math.cos(player.angle) * player.dir * star.speed
      return true
    },
    pause() {
      if (state !== 'playing') return
      state = 'paused'
      emit('pause')
    },
    resume() {
      if (state !== 'paused') return
      state = 'playing'
      emit('resume')
      run()
    },
    setReduced(value) { motionReduced = value; trail = []; sparks = [] },
    resize,
    destroy() { cancelAnimationFrame(raf); state = 'over' },
  }
}
