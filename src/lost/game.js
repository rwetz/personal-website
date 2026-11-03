// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// Lost in the Constellation: orbit a star, let go on the tangent, get caught by the next ring.
// Every seven stars the game crosses into the next project's world, as the site does.
// Orbits decay, static sits between stars, and from Ateru on the stars ahead bend a flight.
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
  let shards
  let player
  let cam
  let state = 'ready'
  let time = 0
  let score = 0
  let sector = 0
  let combo = 0
  let shield = false
  let shake = 0
  let flash = 0
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

  // 0 at the first star, 1 just before home, and a little more on every lap after it.
  function difficulty(index) {
    const lap = Math.max(0, Math.floor((index - 1) / HOME))
    return Math.min(1, index / 32) + Math.min(.4, lap * .2)
  }

  function makeStar(index) {
    const prev = stars[index - 1]
    const d = difficulty(index)
    const hard = Math.min(d, 1.2)
    const id = sectors[sectorIndex(index)].id
    const ring = index === 0 ? 64 : Math.max(34, 64 - 26 * hard)
    const half = view.field / 2
    const drift = index > 0 && (id === 'logscope' || d > 1) ? { amp: 26 + 34 * rand(), speed: .6 + .7 * rand(), phase: rand() * TAU } : null
    const edge = half - ring - (drift?.amp ?? 0)
    const reach = 80 + 160 * Math.min(d, 1)
    const gap = index === 0 ? 0 : Math.min(view.height * .5, 170 + 90 * Math.min(d, 1)) + rand() * 40
    const x = prev ? clamp(prev.x + (rand() * 2 - 1) * reach, -edge, edge) : 0
    const omega = 2.2 + 2 * hard
    // How many turns a star holds you before the orbit decays into it. The first star waits.
    const turns = index === 0 ? Infinity : index === HOME ? 3 : 2.6 - 1.3 * hard
    const star = {
      index, x, baseX: x, y: prev ? prev.y + gap : 0, ring, baseRing: ring, omega, fuse: turns * TAU / omega,
      speed: 430 + 130 * hard, aim: 170 - 95 * Math.min(d, 1),
      // From Ateru on, the stars ahead pull on a flight and bend it.
      pull: index > PER_SECTOR ? 7e6 * Math.min(1, d + .2) : 0,
      drift, pulse: index > 0 && id === 'halcyra', home: index === HOME,
    }
    if (prev && index >= 4 && !star.home) addShards(prev, star, d)
    return star
  }

  // Static sits beside the line between two stars, never on it, so a clean shot always exists.
  function addShards(from, to, d) {
    const count = 1 + Math.floor(rand() * (1 + 2.2 * Math.min(d, 1.2)))
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.hypot(dx, dy)
    for (let i = 0; i < count; i++) {
      const amp = d > .45 && rand() < .6 ? 10 + rand() * 16 : 0
      const side = rand() < .5 ? -1 : 1
      const offset = side * (44 + amp + rand() * 70)
      const t = .3 + rand() * .4
      const x = clamp(from.x + dx * t - dy / length * offset, -view.field / 2, view.field / 2)
      const y = from.y + dy * t + dx / length * offset
      if (Math.hypot(x - to.x, y - to.y) < to.ring + 26 || Math.hypot(x - from.x, y - from.y) < from.ring + 26) continue
      shards.push({ baseX: x, baseY: y, amp, speed: 1 + rand() * 1.4, phase: rand() * TAU, r: 9, spin: rand() * TAU, dead: false })
    }
  }

  function ensureStars(upTo) { while (stars.length <= upTo) stars.push(makeStar(stars.length)) }

  const starX = (star, t) => star.drift ? star.baseX + Math.sin(t * star.drift.speed + star.drift.phase) * star.drift.amp : star.baseX
  const starRing = (star, t) => star.pulse ? star.baseRing + Math.sin(t * 4 + star.index) * 7 : star.baseRing
  const shardAt = (shard, t) => shard.amp
    ? [shard.baseX + Math.cos(t * shard.speed + shard.phase) * shard.amp, shard.baseY + Math.sin(t * shard.speed * 1.3 + shard.phase) * shard.amp]
    : [shard.baseX, shard.baseY]

  function reset(nextSeed = seed) {
    seed = nextSeed
    rand = mulberry32(seed)
    tiles = sectors.map(item => makeTile(item, rand))
    stars = []
    shards = []
    ensureStars(4)
    player = { mode: 'orbit', star: 0, angle: -Math.PI / 2, radius: 40, targetRadius: 40, dir: 1, x: 0, y: -40, vx: 0, vy: 0, flight: 0, fuse: Infinity }
    cam = -view.height * .3
    time = 0
    score = 0
    sector = 0
    combo = 0
    shield = false
    shake = 0
    flash = 0
    bg = sectors[0].bg
    fade = { from: 0, t: 1 }
    trail = []
    sparks = []
    acc = 0
  }

  function emit(type, detail = {}) { onEvent({ type, score, combo, shield, sector: sectors[sector], ...detail }) }

  // Sparks are decoration only, so they use Math.random and leave the seeded level alone.
  function burst(x, y, count, speed = 140) {
    if (motionReduced) return
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU
      const v = 60 + Math.random() * speed
      sparks.push({ x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, life: .6 })
    }
  }

  // One flight step, shared by play and by the aim preview so the preview never lies.
  function flightStep(body, t, dt) {
    for (let i = body.from + 1; i <= body.from + 3; i++) {
      const star = stars[i]
      if (!star?.pull) continue
      const rx = starX(star, t) - body.x
      const ry = star.y - body.y
      const r = Math.hypot(rx, ry) || 1
      const pull = star.pull / (r * r + 3600)
      body.vx += rx / r * pull * dt
      body.vy += ry / r * pull * dt
    }
    body.x += body.vx * dt
    body.y += body.vy * dt
    body.flight += dt
    for (let i = body.from + 1; i <= body.from + 3; i++) {
      const star = stars[i]
      if (star && Math.hypot(body.x - starX(star, t), body.y - star.y) < starRing(star, t)) return { hit: 'star', star }
    }
    for (const shard of shards) {
      if (shard.dead) continue
      const [hx, hy] = shardAt(shard, t)
      if (Math.abs(hy - body.y) < 40 && Math.hypot(body.x - hx, body.y - hy) < shard.r + 7) return { hit: 'shard', shard }
    }
    const sx = view.width / 2 + body.x
    const sy = view.height - (body.y - cam)
    if (sx < -30 || sx > view.width + 30 || sy > view.height + 30 || sy < -30 || body.flight > 2.8) return { hit: 'drift' }
    return null
  }

  function launch() {
    const star = stars[player.star]
    return { from: player.star, x: player.x, y: player.y, vx: -Math.sin(player.angle) * player.dir * star.speed, vy: Math.cos(player.angle) * player.dir * star.speed, flight: 0 }
  }

  // Where letting go right now would lead, with the path sampled for the aim line.
  function predict(limit = Infinity) {
    const body = launch()
    const points = []
    let travelled = 0
    let t = time
    for (let i = 0; i < 2.8 / STEP; i++) {
      const px = body.x
      const py = body.y
      t += STEP
      const result = flightStep(body, t, STEP)
      travelled += Math.hypot(body.x - px, body.y - py)
      if (travelled <= limit) points.push([body.x, body.y])
      if (result) return { points, hit: result.hit, star: result.star?.index }
    }
    return { points, hit: 'drift' }
  }

  function capture(star) {
    const rx = player.x - star.x
    const ry = player.y - star.y
    const speed = Math.hypot(player.vx, player.vy) || 1
    // A shot aimed through the core of the ring is a perfect catch. Three in a row raise a shield.
    const perfect = Math.abs(rx * player.vy - ry * player.vx) / speed < star.ring * .38
    combo = perfect ? combo + 1 : 0
    const gained = perfect && combo % 3 === 0 && !shield
    if (gained) shield = true
    player.mode = 'orbit'
    player.star = star.index
    player.dir = rx * player.vy - ry * player.vx > 0 ? 1 : -1
    player.angle = Math.atan2(ry, rx)
    player.radius = Math.max(18, Math.hypot(rx, ry))
    player.targetRadius = clamp(star.ring * .62, 24, star.ring - 8)
    player.fuse = star.fuse
    ensureStars(star.index + 4)
    if (motionReduced) cam = star.y - view.height * .26
    burst(player.x, player.y, perfect ? 26 : 14, perfect ? 220 : 140)
    shake = Math.max(shake, perfect ? 7 : 3)
    if (perfect) flash = 1
    if (star.index > score) score = star.index
    const next = sectorIndex(star.index)
    if (next !== sector) { fade = { from: sector, t: 0 }; sector = next; emit('sector') }
    emit('capture', { perfect })
    if (gained) emit('shield')
    if (star.home) emit('home')
  }

  function lose(reason) {
    burst(player.x, player.y, 40, 260)
    shake = 12
    state = 'over'
    emit('over', { reason })
  }

  function update(dt) {
    time += dt
    for (const star of stars) {
      star.x = starX(star, time)
      star.ring = starRing(star, time)
    }
    if (player.mode === 'orbit') {
      const star = stars[player.star]
      player.fuse -= dt
      if (player.fuse <= 0) return lose('decay')
      // The orbit tightens and quickens as its time runs out, so the danger shows as well as counts.
      const left = Number.isFinite(star.fuse) ? clamp(player.fuse / star.fuse, 0, 1) : 1
      const goal = Math.max(12, player.targetRadius * (.35 + .65 * left))
      player.radius += (goal - player.radius) * (1 - Math.exp(-dt * 5))
      player.angle += player.dir * star.omega * (1 + .35 * (1 - left)) * dt
      player.x = star.x + Math.cos(player.angle) * player.radius
      player.y = star.y + Math.sin(player.angle) * player.radius
    } else {
      const body = { from: player.star, x: player.x, y: player.y, vx: player.vx, vy: player.vy, flight: player.flight }
      const result = flightStep(body, time, dt)
      Object.assign(player, { x: body.x, y: body.y, vx: body.vx, vy: body.vy, flight: body.flight })
      if (result?.hit === 'star') capture(result.star)
      else if (result?.hit === 'shard') {
        result.shard.dead = true
        burst(player.x, player.y, 24, 200)
        if (!shield) return lose('static')
        shield = false
        combo = 0
        shake = Math.max(shake, 8)
        emit('shield-lost')
      } else if (result?.hit === 'drift') return lose('drift')
    }
    if (!motionReduced) {
      const target = player.mode === 'orbit' ? stars[player.star].y - view.height * .3 : Math.max(cam, player.y - view.height * .55)
      cam += (target - cam) * (1 - Math.exp(-dt * 3.2))
    }
    fade.t = Math.min(1, fade.t + dt / 1.2)
    shake = Math.max(0, shake - dt * 30)
    flash = Math.max(0, flash - dt * 3)
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

  // Static: a small broken cross that flickers, red in every world (white in red Ateru).
  function drawShard(x, y, shard, look) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(shard.spin + (motionReduced ? 0 : time * 1.6))
    ctx.strokeStyle = look.id === 'ateru' ? look.fg : '#ff5d5d'
    ctx.globalAlpha = motionReduced ? .9 : .65 + .35 * Math.abs(Math.sin(time * 11 + shard.phase))
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let k = 0; k < 4; k++) {
      const a = k * TAU / 4
      ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3)
      ctx.lineTo(Math.cos(a) * shard.r, Math.sin(a) * shard.r)
    }
    ctx.stroke()
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
    if (shake && !motionReduced) ctx.translate((Math.random() * 2 - 1) * shake, (Math.random() * 2 - 1) * shake)
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
      if (y < -160 || y > view.height + 160) continue
      const starLook = sectors[sectorIndex(star.index)]
      const visited = star.index < player.star
      const next = star.index === player.star + 1
      // BibleLM's world is lit like a manuscript by candle: only the next star shows plainly.
      const hidden = starLook.id === 'biblelm' && star.index > player.star + 1
      const emphasis = visited ? .14 : next ? .85 : hidden ? .12 : .4
      // Faint rings around a star that pulls, so the bend in a flight has a visible cause.
      if (star.pull && star.index > player.star) {
        ctx.save()
        ctx.strokeStyle = starLook.accent
        ctx.globalAlpha = hidden ? .03 : .08
        for (const k of [1.7, 2.4]) { ctx.beginPath(); ctx.arc(x, y, star.ring * k, 0, TAU); ctx.stroke() }
        ctx.restore()
      }
      drawRing(star, starLook, x, y, emphasis)
      ctx.fillStyle = star.home ? starLook.fg : visited ? starLook.dim : starLook.accent
      ctx.globalAlpha = visited ? .45 : hidden ? .25 : 1
      if (star.home) drawMark(homeMark, x, y, 56, time * .3)
      else if (star.index === 0) { ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill() }
      else drawMark(marks[starLook.id], x, y, 30)
      ctx.globalAlpha = 1
    }
    const ahead = sectors[sectorIndex(player.star + 1)]
    for (const shard of shards) {
      if (shard.dead) continue
      const [hx, hy] = shardAt(shard, time)
      const y = sy(hy)
      if (y > -40 && y < view.height + 40) drawShard(sx(hx), y, shard, ahead)
    }

    const px = sx(player.x)
    const py = sy(player.y)
    if (player.mode === 'orbit' && state !== 'over') {
      const star = stars[player.star]
      // The fuse: an arc around the star that empties as the orbit decays, red near the end.
      if (Number.isFinite(star.fuse)) {
        const left = clamp(player.fuse / star.fuse, 0, 1)
        const urgent = left < .3
        ctx.save()
        ctx.strokeStyle = urgent ? '#ff5d5d' : look.fg
        ctx.globalAlpha = urgent && !motionReduced ? .5 + .5 * Math.abs(Math.sin(time * 14)) : .55
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(sx(star.x), sy(star.y), star.ring + 7, -Math.PI / 2, -Math.PI / 2 + TAU * left)
        ctx.stroke()
        ctx.restore()
      }
      const aim = predict(star.aim)
      ctx.save()
      ctx.fillStyle = look.fg
      ctx.globalAlpha = .55
      aim.points.forEach(([x, y], i) => { if (i % 4 === 0) ctx.fillRect(sx(x) - 1, sy(y) - 1, 2, 2) })
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
    if (shield && state !== 'over') {
      ctx.save()
      ctx.strokeStyle = look.accent
      ctx.globalAlpha = .8
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(px, py, 19 + (motionReduced ? 0 : Math.sin(time * 6) * 1.5), 0, TAU)
      ctx.stroke()
      ctx.restore()
    }
    if (state !== 'over') {
      ctx.fillStyle = look.id === 'nexis' ? `hsl(${(time * 80) % 360} 75% 75%)` : look.fg
      drawMark(playerMark, px, py, 26, motionReduced ? 0 : time * 2.4)
    }
    if (flash && !motionReduced) {
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0)
      ctx.fillStyle = look.accent
      ctx.globalAlpha = flash * .12
      ctx.fillRect(0, 0, view.width, view.height)
      ctx.globalAlpha = 1
    }
  }

  function frame(now) {
    const dt = Math.min(.25, (now - last) / 1000)
    last = now
    acc += dt
    while (acc >= STEP && state === 'playing') { update(STEP); acc -= STEP }
    render()
    // A lost game still settles its burst of sparks for a moment.
    raf = state === 'playing' || (state === 'over' && sparks.length) ? requestAnimationFrame(frame) : 0
    if (state === 'over') { sparks = sparks.filter(spark => (spark.life -= dt) > 0); for (const spark of sparks) { spark.x += spark.vx * dt; spark.y += spark.vy * dt } }
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
    // Read-only view for the browser tests' autopilot; `aim` is where letting go now would end.
    snapshot() {
      const next = stars?.[player.star + 1]
      const aim = state === 'playing' && player.mode === 'orbit' ? predict() : null
      return {
        state, score, combo, shield, sector: sectors[sector].id, mode: player.mode, x: player.x, y: player.y, angle: player.angle, dir: player.dir, fuse: player.fuse,
        aim: aim && { hit: aim.hit, star: aim.star }, next: next && { x: next.x, y: next.y, ring: next.ring },
      }
    },
    start(nextSeed) {
      reset(nextSeed)
      state = 'playing'
      emit('start')
      run()
    },
    release() {
      if (state !== 'playing' || player.mode !== 'orbit') return false
      const body = launch()
      Object.assign(player, { mode: 'fly', vx: body.vx, vy: body.vy, flight: 0 })
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
