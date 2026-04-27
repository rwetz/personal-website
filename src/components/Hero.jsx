import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ASCIIText from './ASCIIText'
import GlassSurface from './GlassSurface'
import TextType from './TextType'
import Silk from './Silk'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-[10px] font-mono text-[var(--color-muted)] tracking-widest uppercase">scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-light)]" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

function useSilkColor() {
  const [color, setColor] = useState(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-silk').trim() || '#1e0f40'
  )
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setColor(getComputedStyle(document.documentElement).getPropertyValue('--color-silk').trim() || '#1e0f40')
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return color
}

export default function Hero() {
  const { scrollY } = useScroll()
  const gradientY = useTransform(scrollY, [0, 600], [0, 80])
  const silkColor = useSilkColor()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Parallax gradient background */}
      <motion.div className="hero-gradient z-0" style={{ y: gradientY }} />

      {/* Silk texture layer */}
      <Silk color={silkColor} speed={5} scale={1.2} noiseIntensity={1.5} opacity={0.30} />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Mobile name — shown only below md */}
      <motion.div className="relative z-10 md:hidden mb-4" {...fadeUp(0.1)}>
        <h1
          className="shimmer-text font-bold tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 3.75rem)' }}
        >
          Ryan Wetzstein
        </h1>
      </motion.div>

      {/* ASCII name effect — desktop only */}
      <motion.div
        className="relative z-10 hidden md:block w-full"
        style={{ height: '260px' }}
        {...fadeUp(0.1)}
      >
        <ASCIIText
          text="Ryan Wetzstein"
          enableWaves={true}
          textFontSize={350}
          textColor="#fdf9f3"
          asciiFontSize={13}
          planeBaseHeight={15}
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Open to work badge */}
        <motion.div className="mb-4" {...fadeUp(0.3)}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-[var(--color-accent-dark)]/40 text-[var(--color-muted)]">
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Open to internships
          </span>
        </motion.div>

        <motion.div className="w-full flex flex-col items-center" {...fadeUp(0.45)}>
          <TextType
            as="p"
            text={[
              'A passionate developer building clean, modern web experiences.',
              "CS student at NDSU who's especially focused on AI and backend development.",
              'Always learning. Always building. Always improving. The grind never stops.',
            ]}
            typingSpeed={45}
            deletingSpeed={25}
            pauseDuration={2500}
            loop
            showCursor
            cursorCharacter="|"
            cursorClassName="text-[var(--color-accent-light)]"
            className="text-xl sm:text-2xl text-white max-w-xl mb-10 mt-2 min-h-[2.5rem]"
          />
        </motion.div>

        <motion.div className="flex flex-wrap gap-4 justify-center" {...fadeUp(0.6)}>
          <a href="#projects" className="min-h-[48px] flex items-center">
            <GlassSurface
              width="auto"
              height={48}
              borderRadius={12}
              distortionScale={-180}
              brightness={60}
              opacity={0.9}
              blur={10}
              backgroundOpacity={0.15}
              saturation={1.4}
              className="px-6 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-white font-medium text-sm whitespace-nowrap">View Projects</span>
            </GlassSurface>
          </a>
          <a href="/resume.pdf" download className="min-h-[48px] flex items-center">
            <GlassSurface
              width="auto"
              height={48}
              borderRadius={12}
              distortionScale={-180}
              brightness={60}
              opacity={0.9}
              blur={10}
              backgroundOpacity={0.08}
              saturation={1.2}
              className="px-6 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-[var(--color-accent-light)] font-medium text-sm whitespace-nowrap">Download Resume</span>
            </GlassSurface>
          </a>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
