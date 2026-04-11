import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = [
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcd',
  '#ff922b','#a9e34b','#74c0fc','#da77f2','#ff8787',
]

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: 6 + Math.random() * 10,
      height: 4 + Math.random() * 6,
      duration: 2.5 + Math.random() * 3,
      delay: Math.random() * 3,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 200,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99998]">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.borderRadius,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.drift],
            rotate: [p.rotation, p.rotation + 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export default function PartyMode({ active, onExit }) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onExit])

  return (
    <AnimatePresence>
      {active && (
        <>
          <Confetti />

          {/* Banner */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <motion.div
              className="text-5xl sm:text-7xl font-black select-none text-center drop-shadow-2xl"
              animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎉 PARTY MODE 🎉
            </motion.div>
          </motion.div>

          {/* Exit hint — CSS pulse so it stops cleanly on exit */}
          <motion.p
            className="party-hint-pulse fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] text-sm font-mono text-white bg-black/60 px-5 py-2 rounded-full backdrop-blur cursor-pointer pointer-events-auto whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={onExit}
          >
            press ESC or click to exit
          </motion.p>
        </>
      )}
    </AnimatePresence>
  )
}
