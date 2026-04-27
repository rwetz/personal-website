import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS   = 32
const CELL_W  = 38
const PITCH_H = 28
const DRUM_H  = 56
const LABEL_W = 108
const STEP_H  = 38
const INST_H  = 44

const NOTE_NAMES   = ['B','Bb','A','Ab','G','Gb','F','E','Eb','D','Db','C']
const PITCHED_ROWS = [4,3].flatMap(oct => NOTE_NAMES.map(n => `${n}${oct}`))
const BASS_ROWS    = [2,1].flatMap(oct => NOTE_NAMES.map(n => `${n}${oct}`))
const DRUM_ROWS    = ['Kick','Snare','Clap','Hi-Hat','Open HH','Cymbal']

const INSTRUMENTS = [
  { id: 'Piano',   label: 'Piano',   rows: PITCHED_ROWS, type: 'pitched', cellH: PITCH_H },
  { id: 'Synth',   label: 'Synth',   rows: PITCHED_ROWS, type: 'pitched', cellH: PITCH_H },
  { id: 'Strings', label: 'Strings', rows: PITCHED_ROWS, type: 'pitched', cellH: PITCH_H },
  { id: 'Bass',    label: 'Bass',    rows: BASS_ROWS,    type: 'pitched', cellH: PITCH_H },
  { id: 'Drums',   label: 'Drums',   rows: DRUM_ROWS,    type: 'drums',   cellH: DRUM_H  },
]

const INST_MAP = Object.fromEntries(INSTRUMENTS.map(i => [i.id, i]))

const DEFAULT_TRACKS = [
  { id: 'track-0', instId: 'Piano'   },
  { id: 'track-1', instId: 'Synth'   },
  { id: 'track-2', instId: 'Strings' },
  { id: 'track-3', instId: 'Bass'    },
  { id: 'track-4', instId: 'Drums'   },
]

// ─── Instrument icons ─────────────────────────────────────────────────────────
function InstIcon({ id, size = 16 }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  if (id === 'Piano') return (
    <svg {...p}>
      <rect x="2" y="7" width="20" height="12" rx="1.5"/>
      <rect x="5.5" y="7" width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none"/>
      <rect x="11"  y="7" width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none"/>
      <rect x="16.5" y="7" width="2.5" height="7" rx="0.5" fill="currentColor" stroke="none"/>
      <line x1="8"    y1="7" x2="8"    y2="19"/>
      <line x1="11"   y1="7" x2="11"   y2="19"/>
      <line x1="14"   y1="7" x2="14"   y2="19"/>
      <line x1="16.5" y1="7" x2="16.5" y2="19"/>
    </svg>
  )
  if (id === 'Synth') return (
    <svg {...p}>
      <path d="M2 12 C4.5 12 4.5 4 7.5 4 C10.5 4 10.5 20 13.5 20 C16.5 20 16.5 12 19 12"/>
      <circle cx="21.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
  if (id === 'Strings') return (
    <svg {...p}>
      <path d="M12 2 C9.5 4.5 9 8 9.5 12 C10 16 9.5 18.5 7.5 21"/>
      <path d="M12 2 C14.5 4.5 15 8 14.5 12 C14 16 14.5 18.5 16.5 21"/>
      <line x1="9"  y1="9"  x2="15" y2="9"/>
      <line x1="9"  y1="15" x2="15" y2="15"/>
    </svg>
  )
  if (id === 'Bass') return (
    <svg {...p}>
      <path d="M7 5 L7 19"/>
      <path d="M7 8 Q13 8 13 11 Q13 14 7 14"/>
      <circle cx="16" cy="8.5"  r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="12.5" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  )
  if (id === 'Drums') return (
    <svg {...p}>
      <ellipse cx="12" cy="9" rx="8" ry="3.5"/>
      <path d="M4 9 L4 16 Q4 20 12 20 Q20 20 20 16 L20 9"/>
      <line x1="9"  y1="4" x2="6.5" y2="2"/>
      <line x1="15" y1="4" x2="17.5" y2="2"/>
    </svg>
  )
  return null
}

// ─── Audio ────────────────────────────────────────────────────────────────────
let _ctx = null
function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function noteToFreq(name) {
  const MAP = { C:0,Db:1,D:2,Eb:3,E:4,F:5,Gb:6,G:7,Ab:8,A:9,Bb:10,B:11 }
  const m = name.match(/^([A-G]b?)(\d+)$/)
  if (!m) return 220
  return 440 * Math.pow(2, (MAP[m[1]] - 9 + (parseInt(m[2]) - 4) * 12) / 12)
}

function makeNoise(ctx, dur) {
  const sr  = ctx.sampleRate
  const buf = ctx.createBuffer(1, Math.ceil(sr * dur), sr)
  const d   = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  return src
}

function playNote(instId, row, t, dur, vol) {
  const ctx = getCtx()
  const out = ctx.createGain()
  out.gain.value = vol
  out.connect(ctx.destination)

  if (instId === 'Drums') { playDrum(ctx, out, row, t); return }

  const freq = noteToFreq(row)

  if (instId === 'Piano') {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'triangle'; o.frequency.value = freq
    o.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.45, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur * 2 + 0.4, 3))
    o.start(t); o.stop(t + 3.5)
  } else if (instId === 'Synth') {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain()
    o.type = 'sawtooth'; o.frequency.value = freq
    f.type = 'lowpass'; f.Q.value = 7
    f.frequency.setValueAtTime(freq * 8, t)
    f.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.12)
    o.connect(f); f.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.35, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur + 0.15, 0.8))
    o.start(t); o.stop(t + 1)
  } else if (instId === 'Strings') {
    ;[-6, 0, 6].forEach(c => {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain()
      o.type = 'sawtooth'; o.frequency.value = freq * Math.pow(2, c / 1200)
      f.type = 'lowpass'; f.frequency.value = 2200
      o.connect(f); f.connect(g); g.connect(out)
      const d = Math.max(dur, 0.2)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.1, t + 0.07)
      g.gain.setValueAtTime(0.1, t + d - 0.06)
      g.gain.linearRampToValueAtTime(0, t + d + 0.05)
      o.start(t); o.stop(t + d + 0.15)
    })
  } else if (instId === 'Bass') {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain()
    o.type = 'sine'; o.frequency.value = freq
    f.type = 'lowpass'; f.frequency.value = 600
    o.connect(f); f.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.75, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur + 0.3, 2))
    o.start(t); o.stop(t + 2.2)
  }
}

function playDrum(ctx, out, pad, t) {
  if (pad === 'Kick') {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.3)
    o.connect(g); g.connect(out)
    g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    o.start(t); o.stop(t + 0.5)
  } else if (pad === 'Snare') {
    const n = makeNoise(ctx, 0.22), ng = ctx.createGain(), nf = ctx.createBiquadFilter()
    nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.9
    n.connect(nf); nf.connect(ng); ng.connect(out)
    ng.gain.setValueAtTime(0.75, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    n.start(t); n.stop(t + 0.25)
    const o = ctx.createOscillator(), og = ctx.createGain()
    o.type = 'sine'; o.frequency.value = 185
    o.connect(og); og.connect(out)
    og.gain.setValueAtTime(0.3, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    o.start(t); o.stop(t + 0.08)
  } else if (pad === 'Clap') {
    for (let i = 0; i < 3; i++) {
      const ti = t + i * 0.011
      const n = makeNoise(ctx, 0.06), g = ctx.createGain(), f = ctx.createBiquadFilter()
      f.type = 'highpass'; f.frequency.value = 1100
      n.connect(f); f.connect(g); g.connect(out)
      g.gain.setValueAtTime(0.55, ti); g.gain.exponentialRampToValueAtTime(0.001, ti + 0.07)
      n.start(ti); n.stop(ti + 0.09)
    }
  } else if (pad === 'Hi-Hat') {
    const n = makeNoise(ctx, 0.05), g = ctx.createGain(), f = ctx.createBiquadFilter()
    f.type = 'highpass'; f.frequency.value = 9000
    n.connect(f); f.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.045)
    n.start(t); n.stop(t + 0.06)
  } else if (pad === 'Open HH') {
    const n = makeNoise(ctx, 0.32), g = ctx.createGain(), f = ctx.createBiquadFilter()
    f.type = 'highpass'; f.frequency.value = 7000
    n.connect(f); f.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
    n.start(t); n.stop(t + 0.36)
  } else if (pad === 'Cymbal') {
    const n = makeNoise(ctx, 0.65), g = ctx.createGain(), f = ctx.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = 6000; f.Q.value = 0.45
    n.connect(f); f.connect(g); g.connect(out)
    g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.65)
    n.start(t); n.stop(t + 0.7)
  }
}

// ─── Cell Grid (memoized — no playhead/step dependency) ───────────────────────
const CellGrid = memo(function CellGrid({ instId, rows, notes, cellH, onMouseDown, onMouseEnter }) {
  const isDrums = instId === 'Drums'
  return (
    <div>
      {rows.map(row => {
        const isBlack = !isDrums && row.includes('b')
        return (
          <div
            key={row}
            style={{ height: cellH, display: 'grid', gridTemplateColumns: `repeat(${STEPS}, 1fr)` }}
          >
            {Array.from({ length: STEPS }, (_, ci) => {
              const active    = notes.has(`${row}::${ci}`)
              const evenBar   = Math.floor(ci / 4) % 2 === 0
              const barBorder = ci % 4 === 0
              return (
                <div
                  key={ci}
                  onMouseDown={() => onMouseDown(row, ci, active)}
                  onMouseEnter={() => onMouseEnter(row, ci)}
                  className={[
                    'border-r border-b transition-colors duration-[60ms]',
                    barBorder ? 'border-l border-l-white/[0.1]' : '',
                    active
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent-light)]/40'
                      : isBlack
                      ? `${evenBar ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-surface-2)]'} border-white/[0.04] hover:bg-[var(--color-accent)]/25`
                      : `${evenBar ? 'bg-[var(--color-surface-2)]' : 'bg-[var(--color-surface-3)]'} border-white/[0.07] hover:bg-[var(--color-accent)]/25`,
                  ].join(' ')}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
})

// ─── Main DAW ─────────────────────────────────────────────────────────────────
export default function DAW() {
  const [tracks, setTracks]           = useState(DEFAULT_TRACKS)
  const [notes, setNotes]             = useState(() =>
    Object.fromEntries(DEFAULT_TRACKS.map(t => [t.id, new Set()]))
  )
  const [bpm,           setBpm]           = useState(120)
  const [playing,       setPlaying]       = useState(false)
  const [loop,          setLoop]          = useState(true)
  const [volume,        setVolume]        = useState(0.7)
  const [openDropdown,  setOpenDropdown]  = useState(null) // trackId or null

  const stepRef      = useRef(0)
  const playingRef   = useRef(false)
  const loopRef      = useRef(true)
  const bpmRef       = useRef(120)
  const volRef       = useRef(0.7)
  const notesRef     = useRef(notes)
  const tracksRef    = useRef(tracks)
  const intervalRef  = useRef(null)
  const playheadRefs = useRef(DEFAULT_TRACKS.map(() => null))
  const dragging     = useRef(false)
  const drawMode     = useRef(true)

  notesRef.current  = notes
  tracksRef.current = tracks
  loopRef.current   = loop
  bpmRef.current    = bpm
  volRef.current    = volume

  // ── Playback ──────────────────────────────────────────────────────────────
  const stopPlayback = useCallback(() => {
    playingRef.current = false
    clearInterval(intervalRef.current)
    intervalRef.current = null
    playheadRefs.current.forEach(el => { if (el) el.style.opacity = '0' })
  }, [])

  const tick = useCallback(() => {
    if (!playingRef.current) return
    const s   = stepRef.current
    const ctx = getCtx()
    const dur = 60 / bpmRef.current / 4

    tracksRef.current.forEach(({ id: trackId, instId }) => {
      const inst = INST_MAP[instId]
      inst.rows.forEach(row => {
        if (notesRef.current[trackId].has(`${row}::${s}`))
          playNote(instId, row, ctx.currentTime, dur, volRef.current)
      })
    })

    playheadRefs.current.forEach(el => {
      if (el) { el.style.opacity = '0.14'; el.style.left = `${s * 100 / STEPS}%` }
    })

    const next = s + 1
    if (next >= STEPS) {
      if (!loopRef.current) { stopPlayback(); setPlaying(false); stepRef.current = 0; return }
      stepRef.current = 0
    } else {
      stepRef.current = next
    }
  }, [stopPlayback])

  const startPlayback = useCallback(() => {
    getCtx()
    playingRef.current = true
    tick()
    intervalRef.current = setInterval(tick, (60 / bpmRef.current / 4) * 1000)
  }, [tick])

  const handlePlayPause = useCallback(() => {
    if (playingRef.current) { stopPlayback(); setPlaying(false) }
    else                    { startPlayback(); setPlaying(true)  }
  }, [startPlayback, stopPlayback])

  const handleStop = useCallback(() => {
    stopPlayback(); setPlaying(false); stepRef.current = 0
  }, [stopPlayback])

  const handleBpm = useCallback((raw) => {
    const v = Math.max(40, Math.min(240, parseInt(raw) || bpmRef.current))
    setBpm(v); bpmRef.current = v
    if (playingRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(tick, (60 / v / 4) * 1000)
    }
  }, [tick])

  // ── Keyboard: spacebar play/pause ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        handlePlayPause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePlayPause])

  useEffect(() => () => stopPlayback(), [stopPlayback])

  useEffect(() => {
    const up = () => { dragging.current = false }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return
    const close = (e) => {
      if (!e.target.closest('[data-dropdown]')) setOpenDropdown(null)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [openDropdown])

  // ── Per-track handlers (stable, keyed by trackId created once) ────────────
  const handlers = useMemo(() =>
    Object.fromEntries(DEFAULT_TRACKS.map(({ id: trackId }) => [trackId, {
      onMouseDown: (row, ci, active) => {
        dragging.current = true
        drawMode.current = !active
        setNotes(prev => {
          const key  = `${row}::${ci}`
          const next = new Set(prev[trackId])
          drawMode.current ? next.add(key) : next.delete(key)
          return { ...prev, [trackId]: next }
        })
        const ctx  = getCtx()
        const inst = tracksRef.current.find(t => t.id === trackId)
        if (inst) playNote(inst.instId, row, ctx.currentTime, 60 / bpmRef.current / 4, volRef.current)
      },
      onMouseEnter: (row, ci) => {
        if (!dragging.current) return
        setNotes(prev => {
          const key  = `${row}::${ci}`
          const next = new Set(prev[trackId])
          drawMode.current ? next.add(key) : next.delete(key)
          return { ...prev, [trackId]: next }
        })
      },
    }]))
  , []) // eslint-disable-line

  const setTrackInstrument = useCallback((trackId, instId) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, instId } : t))
    setNotes(prev => ({ ...prev, [trackId]: new Set() }))
    setOpenDropdown(null)
  }, [])

  const clearTrack = useCallback((trackId) => {
    setNotes(p => ({ ...p, [trackId]: new Set() }))
  }, [])

  const clearAll = useCallback(() => {
    setNotes(Object.fromEntries(DEFAULT_TRACKS.map(t => [t.id, new Set()])))
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[var(--color-surface)] text-[var(--color-text)] flex flex-col overflow-hidden">

      {/* ── Transport bar ─────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-white/10 bg-[var(--color-surface-2)] px-5 py-3 flex items-center gap-4 flex-wrap">
        <a
          href="#hero"
          className="flex items-center gap-2 text-sm font-mono text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back
        </a>

        <div className="w-px h-6 bg-white/10" />
        <span className="font-mono text-base font-bold tracking-[0.25em] text-[var(--color-accent-light)]">DAW</span>
        <div className="flex-1" />

        {/* BPM */}
        <label className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold text-[var(--color-muted)]">BPM</span>
          <input
            type="number" min="40" max="240" value={bpm}
            onChange={e => handleBpm(e.target.value)}
            className="w-16 bg-[var(--color-surface)] border border-white/10 rounded-lg px-2 py-1.5 text-sm font-mono text-center text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]/60"
          />
        </label>

        {/* Stop */}
        <button onClick={handleStop} title="Stop"
          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/12 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </button>

        {/* Play / Pause */}
        <button onClick={handlePlayPause} title={playing ? 'Pause (Space)' : 'Play (Space)'}
          className={`p-2.5 rounded-lg transition-colors ${playing
            ? 'bg-[var(--color-accent)]/25 text-[var(--color-accent-light)] ring-1 ring-[var(--color-accent)]/40'
            : 'bg-[var(--color-accent)] text-white hover:opacity-90'}`}
        >
          {playing
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m5 3 14 9-14 9V3z"/></svg>}
        </button>

        {/* Loop */}
        <button onClick={() => setLoop(v => !v)} title="Toggle loop"
          className={`p-2.5 rounded-lg transition-colors ${loop
            ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-light)] ring-1 ring-[var(--color-accent)]/30'
            : 'bg-white/5 text-[var(--color-muted)] hover:bg-white/10 hover:text-[var(--color-text)]'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/>
            <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-muted)] shrink-0">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => { const v = parseFloat(e.target.value); setVolume(v); volRef.current = v }}
            className="w-24 accent-[var(--color-accent)] cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-white/10" />
        <button onClick={clearAll}
          className="text-sm font-mono text-red-400/60 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
          Clear all
        </button>
        <span className="hidden lg:block text-xs font-mono text-[var(--color-muted)]/35 ml-2">
          space = play/pause · drag to draw
        </span>
      </header>

      {/* ── Scrollable piano-roll area ────────────────────────────────────── */}
      <div className="flex-1 overflow-auto select-none" style={{ cursor: 'crosshair' }}>
        <div style={{ minWidth: LABEL_W + STEPS * CELL_W, position: 'relative' }}>

          {/* Sticky step-number header */}
          <div className="sticky top-0 z-30 flex border-b border-white/10"
            style={{ height: STEP_H, background: 'var(--color-surface-3)' }}>
            <div className="sticky left-0 z-40 flex-shrink-0 flex items-center justify-center border-r border-white/10"
              style={{ width: LABEL_W, background: 'var(--color-surface-3)' }}>
              <span className="text-xs font-mono font-semibold text-[var(--color-muted)]/50 tracking-widest">TRACK</span>
            </div>
            <div className="flex-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS}, 1fr)` }}>
              {Array.from({ length: STEPS }, (_, i) => (
                <div key={i} className={[
                  'flex items-center justify-center text-xs font-mono border-r border-white/[0.05]',
                  i % 4 === 0
                    ? 'text-[var(--color-accent-light)]/80 font-semibold border-l border-l-white/[0.1]'
                    : 'text-[var(--color-muted)]/25',
                ].join(' ')}>
                  {i % 4 === 0 ? i / 4 + 1 : ''}
                </div>
              ))}
            </div>
          </div>

          {/* ── Each track ────────────────────────────────────────────────── */}
          {tracks.map(({ id: trackId, instId }, idx) => {
            const inst      = INST_MAP[instId]
            const { rows, type, cellH, label } = inst
            const isDrums   = type === 'drums'
            const h         = handlers[trackId]
            const noteCount = notes[trackId].size
            const isOpen    = openDropdown === trackId

            return (
              <div key={trackId}>

                {/* Instrument banner with dropdown */}
                <div className="flex border-b border-t border-white/[0.08]"
                  style={{ height: INST_H, background: 'var(--color-surface-2)' }}>

                  {/* Sticky left: dropdown trigger */}
                  <div className="sticky left-0 z-20 flex-shrink-0 border-r border-white/10"
                    style={{ width: LABEL_W, background: 'var(--color-surface-2)' }}>
                    <div
                      data-dropdown
                      className="relative h-full"
                    >
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : trackId)}
                        className="w-full h-full flex items-center gap-2.5 px-3 hover:bg-white/5 transition-colors group"
                      >
                        <span className="text-[var(--color-accent)] group-hover:text-[var(--color-accent-light)] transition-colors">
                          <InstIcon id={instId} size={17} />
                        </span>
                        <span className="font-mono text-sm font-bold text-[var(--color-accent-light)] flex-1 text-left truncate">
                          {label}
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                          className={`text-[var(--color-muted)]/50 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>

                      {/* Dropdown panel */}
                      {isOpen && (
                        <div
                          data-dropdown
                          className="absolute top-full left-0 z-50 mt-1 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                          style={{
                            width: 200,
                            background: 'var(--color-surface-2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                          }}
                        >
                          {INSTRUMENTS.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setTrackInstrument(trackId, opt.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-mono transition-colors ${
                                opt.id === instId
                                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]'
                                  : 'text-[var(--color-text)] hover:bg-white/5'
                              }`}
                            >
                              <span className={opt.id === instId ? 'text-[var(--color-accent-light)]' : 'text-[var(--color-muted)]'}>
                                <InstIcon id={opt.id} size={15} />
                              </span>
                              {opt.label}
                              {opt.id === instId && (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note count + clear */}
                  <div className="flex flex-1 items-center gap-4 px-4">
                    {noteCount > 0 && (
                      <span className="text-xs font-mono text-[var(--color-accent-light)]/60 bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full">
                        {noteCount} notes
                      </span>
                    )}
                    <button onClick={() => clearTrack(trackId)}
                      className="text-xs font-mono text-[var(--color-muted)]/50 hover:text-[var(--color-muted)] px-2 py-1 rounded hover:bg-white/5 transition-colors ml-auto">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Row labels + grid */}
                <div className="flex">
                  {/* Sticky left: row labels */}
                  <div className="sticky left-0 z-10 flex-shrink-0 border-r border-white/10"
                    style={{ width: LABEL_W, background: 'var(--color-surface-2)' }}>
                    {rows.map(row => {
                      const isBlack = !isDrums && row.includes('b')
                      const isC     = !isDrums && row.startsWith('C')
                      return (
                        <div key={row} style={{ height: cellH, background: isBlack ? 'var(--color-surface)' : 'var(--color-surface-2)' }}
                          className={[
                            'flex items-center justify-end pr-3 text-sm font-mono border-b border-white/[0.05]',
                            isBlack ? 'text-[var(--color-muted)]/40' : 'text-[var(--color-muted)]/80',
                            isC     ? 'text-[var(--color-accent-light)] font-semibold' : '',
                          ].join(' ')}>
                          {row}
                        </div>
                      )
                    })}
                  </div>

                  {/* Grid + playhead */}
                  <div className="relative flex-1">
                    <div
                      ref={el => { playheadRefs.current[idx] = el }}
                      className="absolute top-0 bottom-0 pointer-events-none z-10"
                      style={{ width: `calc(100% / ${STEPS})`, left: 0, opacity: 0, background: 'var(--color-accent)' }}
                    />
                    <CellGrid
                      instId={instId}
                      rows={rows}
                      notes={notes[trackId]}
                      cellH={cellH}
                      onMouseDown={h.onMouseDown}
                      onMouseEnter={h.onMouseEnter}
                    />
                  </div>
                </div>

              </div>
            )
          })}

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  )
}
