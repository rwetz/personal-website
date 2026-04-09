import PixelBlast from './PixelBlast'
import ASCIIText from './ASCIIText'
import GlassSurface from './GlassSurface'

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

      {/* Content on top */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* ASCII name effect */}
        <div style={{ position: 'relative', width: '100%', height: '220px' }}>
          <ASCIIText
            text="Ryan"
            enableWaves={true}
            textFontSize={250}
            textColor="#fdf9f3"
            asciiFontSize={15}
            planeBaseHeight={15}
          />
        </div>

        <p className="text-xl sm:text-2xl text-[var(--color-muted)] max-w-xl mb-10 mt-2">
          A passionate developer building clean, modern web experiences.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
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
        </div>
      </div>
    </section>
  )
}
