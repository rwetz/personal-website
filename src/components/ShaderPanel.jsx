// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useRef } from 'react'
import { VERTEX_SHADER } from '@/lib/shaders'

/** CSS fallback for browsers without WebGL2, built from the shader's own palette. */
const paletteGradient = (colors, count) => {
  const stops = []
  for (let i = 0; i < count; i++) {
    const [r, g, b] = colors.slice(i * 3, i * 3 + 3).map(c => Math.round(c * 255))
    stops.push(`rgb(${r},${g},${b}) ${Math.round((i / (count - 1)) * 100)}%`)
  }
  return `linear-gradient(115deg, ${stops.join(', ')})`
}

/**
 * Renders a fullscreen-triangle fragment shader into a container-sized canvas.
 *
 * The canvas is absolutely positioned and measured off its wrapper rather than
 * itself: assigning canvas.width sets the element's intrinsic size, so a canvas
 * that is also the element being measured can feed its own growth.
 *
 * Animates only while on-screen, and holds a still frame under reduced motion.
 *
 * <ShaderPanel {...MOIRE_CFG} style={{ height: 160 }} />
 */
export default function ShaderPanel({
  fragmentShader,
  uniforms = {},
  colors,
  colorCount,
  seed = 0,
  startTime = 0,
  style,
  className,
}) {
  const hostRef = useRef(null)
  const canvasRef = useRef(null)
  // Uniform values change far more often than the shader; keep them off the
  // effect's dep list so tweaking a number doesn't relink the program.
  const cfgRef = useRef(null)
  cfgRef.current = { uniforms, colors, colorCount, seed, startTime }

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let gl = null
    let program = null
    let visible = true
    let disposed = false
    const locations = new Map()

    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // A null info log with a lost context means the failure is the context,
        // not the GLSL — report that rather than an empty error.
        const log = gl.isContextLost()
          ? 'context lost before compile'
          : gl.getShaderInfoLog(shader) || 'unknown compile error'
        gl.deleteShader(shader)
        throw new Error(log)
      }
      return shader
    }

    // getUniformLocation is a synchronous driver round-trip; cache it.
    const uniformLocation = name => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name))
      return locations.get(name)
    }

    const draw = () => {
      const cfg = cfgRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      const elapsed = reduced ? 0 : performance.now() / 1000
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uniformLocation('u_resolution'), w, h)
      gl.uniform1f(uniformLocation('u_time'), cfg.startTime + elapsed)
      gl.uniform1f(uniformLocation('u_seed'), cfg.seed)
      gl.uniform3fv(uniformLocation('u_colors'), new Float32Array(cfg.colors))
      gl.uniform1i(uniformLocation('u_colorCount'), cfg.colorCount)
      for (const [name, value] of Object.entries(cfg.uniforms)) {
        gl.uniform1f(uniformLocation(name), value)
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const frame = () => {
      if (disposed || !gl || gl.isContextLost()) return
      draw()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (disposed || raf || !gl) return
      if (reduced) draw()
      else raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const init = () => {
      if (disposed) return
      locations.clear()
      gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false })
      if (!gl) {
        console.warn('ShaderPanel: WebGL2 unavailable, falling back to gradient')
        host.style.background = paletteGradient(cfgRef.current.colors, cfgRef.current.colorCount)
        return
      }

      try {
        program = gl.createProgram()
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER))
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader))
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program))
        }
      } catch (err) {
        console.error('ShaderPanel: shader failed to build', err)
        host.style.background = paletteGradient(cfgRef.current.colors, cfgRef.current.colorCount)
        gl = null
        return
      }

      gl.useProgram(program)
      gl.bindVertexArray(gl.createVertexArray())
      if (visible) start()
    }

    const onLost = event => {
      event.preventDefault()
      stop()
      gl = null
    }
    const onRestored = () => init()

    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    // Don't burn GPU time on a panel that's scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '100px' },
    )
    io.observe(host)

    // A reduced-motion still frame won't redraw on its own, so repaint on resize.
    const ro = new ResizeObserver(() => {
      if (reduced && gl && visible) draw()
    })
    ro.observe(host)

    init()

    return () => {
      disposed = true
      stop()
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      // Deliberately not calling WEBGL_lose_context here. Losing the context
      // kills it for the canvas element itself, and React reuses that element
      // across StrictMode's double-invoke — the remount would then get back a
      // dead context and every shader compile would fail. Dropping the
      // reference is enough; the context is released with the canvas.
      gl = null
    }
  }, [fragmentShader])

  return (
    <div ref={hostRef} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
