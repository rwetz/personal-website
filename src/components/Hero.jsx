import { motion } from 'framer-motion'
import PixelBlast from './PixelBlast'
import ASCIIText from './ASCIIText'
import GlassSurface from './GlassSurface'
import TextType from './TextType'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* PixelBlast background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#5f31f6"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Mobile name — shown only below md */}
      <motion.div className="relative z-10 md:hidden mb-4" {...fadeUp(0.1)}>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-[var(--color-accent-light)] to-white bg-clip-text text-transparent">
          Ryan Wetzstein
        </h1>
      </motion.div>

      {/* ASCII name effect — desktop only, full section width */}
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
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-[var(--color-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Available for internships
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
          <a href="#projects">
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
          <a href="/resume.pdf" download>
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
    </section>
  )
}
