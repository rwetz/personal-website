// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// "404" drawn as a constellation on a 3×5 grid: strokes become lines, every grid point a star.
const glyphs = {
  4: [[[0, 0], [0, 2], [2, 2]], [[2, 0], [2, 4]]],
  0: [[[0, 0], [2, 0], [2, 4], [0, 4], [0, 0]]],
}

export function constellation404(cx, cy, cell) {
  const stars = new Map()
  const lines = []
  ;[4, 0, 4].forEach((digit, index) => {
    const ox = (index * 3.4 - 4.4) * cell
    for (const stroke of glyphs[digit]) {
      for (let i = 1; i < stroke.length; i++) {
        const [ax, ay] = stroke[i - 1]
        const [bx, by] = stroke[i]
        const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay))
        for (let s = 0; s <= steps; s++) {
          const x = cx + ox + (ax + (bx - ax) * s / steps) * cell
          const y = cy + (ay + (by - ay) * s / steps - 2) * cell
          const key = `${Math.round(x)},${Math.round(y)}`
          if (!stars.has(key)) stars.set(key, { x, y, r: (s === 0 || s === steps) ? 2.4 : 1.6, phase: stars.size * 1.7 })
        }
        lines.push([cx + ox + ax * cell, cy + (ay - 2) * cell, cx + ox + bx * cell, cy + (by - 2) * cell])
      }
    }
  })
  return { stars: [...stars.values()], lines }
}

export function drawConstellation(ctx, { stars, lines }, { color, alpha = 1, time = 0, twinkle = true }) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.globalAlpha = alpha * .28
  ctx.lineWidth = 1
  ctx.beginPath()
  for (const [x1, y1, x2, y2] of lines) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2) }
  ctx.stroke()
  for (const star of stars) {
    ctx.globalAlpha = alpha * (twinkle ? .65 + .35 * Math.sin(time * 1.6 + star.phase) : .9)
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
