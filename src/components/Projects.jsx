// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import nexisLogoSrc from '../assets/logo (1) (1).png'

const GITHUB_USER = 'rwetz'

/**
 * Hand-picked and hardcoded — this section is a curated shortlist, not a feed.
 * Copy is lifted from each repo's GitHub description; update here when it drifts.
 */
const PROJECTS = [
  {
    title:       'Nexis',
    description: 'Open-source AI-native terminal emulator with integrated editor, file explorer, and multi-provider AI agents. Built on Tauri 2 + Rust + React 19.',
    tags:        ['TypeScript', 'Rust', 'Tauri', 'AI'],
    github:      'https://github.com/rwetz/Nexis',
    live:        'https://nexisdev.org',
    featured:    true,
  },
  {
    title:       'BibleLM',
    description: 'A tiny GPT-style transformer trained from scratch on the Bible, with a live training dashboard. Tauri + React + PyTorch.',
    tags:        ['TypeScript', 'PyTorch', 'Transformer', 'Tauri'],
    github:      'https://github.com/rwetz/biblelm',
    live:        null,
  },
  {
    title:       'ArcGIS Parcel Harvester',
    description: 'Generalized ArcGIS FeatureLayer harvester for farmland parcel research across any US state.',
    tags:        ['Python', 'ArcGIS', 'GIS', 'Data'],
    github:      'https://github.com/rwetz/arcgis-parcel-harvester',
    live:        null,
  },
  {
    title:       'Music Genre CNN',
    description: 'A convolutional neural network pipeline for music genre classification. Raw audio is converted to mel-spectrogram images, then used to train and compare three CNN architectures.',
    tags:        ['Python', 'CNN', 'ML', 'Audio'],
    github:      'https://github.com/rwetz/music-genre-cnn',
    live:        null,
  },
  {
    title:       'EV Station GA',
    description: 'A genetic algorithm that optimizes EV charging station placement across a simulated 20x20 mile city grid, balancing demand coverage against installation cost.',
    tags:        ['Python', 'Genetic Algorithm', 'ML'],
    github:      'https://github.com/rwetz/ev-station-ga',
    live:        null,
  },
]

// ── Project glyphs ──────────────────────────────────────────────────────────
// Hand-drawn line art rather than sourced icons, so all five read as one set:
// 32px box, 1.25 stroke, no fills, inheriting the card's ink colour.

/* The header icons draw at 15-16px; negative margin grows the tappable box to
   40px without shifting where the icon appears or widening the header row. */
const iconHitArea = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  margin: -12,
}

const glyphProps = {
  width: 64, height: 64, viewBox: '0 0 32 32', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1,
  strokeLinecap: 'round', strokeLinejoin: 'round',
}

/** Open book under an AI sparkle: scripture corpus feeding a small model. */
const GlyphBibleLM = () => (
  <svg {...glyphProps} aria-hidden="true">
    <path d="M16 12c-1.4-1.4-3.8-2.1-7-2.1H4v13h5c3.2 0 5.6.7 7 2.1" />
    <path d="M16 12c1.4-1.4 3.8-2.1 7-2.1h5v13h-5c-3.2 0-5.6.7-7 2.1" />
    <path d="M16 12v13" />
    <path d="M16 1.5l1.3 2.9 2.9 1.3-2.9 1.3-1.3 2.9-1.3-2.9L11.8 5.7l2.9-1.3z" />
  </svg>
)

/** Subdivided parcels with a survey pin — the harvester's actual subject. */
const GlyphParcels = () => (
  <svg {...glyphProps} aria-hidden="true">
    <path d="M3 6h26v20H3z" />
    <path d="M3 15h11M14 6v20M21 15h8M21 15v11" />
    <circle cx="21" cy="10.5" r="2.6" />
  </svg>
)

/** Mel-spectrogram columns — the CNN's input representation. */
const GlyphSpectrogram = () => (
  <svg {...glyphProps} aria-hidden="true">
    <path d="M4 19v-5M9 22V10M14 24V6M19 21v-9M24 23V8M29 18v-3" />
  </svg>
)

/** Charging bolt over a city grid — coverage across the simulated map. */
const GlyphEvGrid = () => (
  <svg {...glyphProps} aria-hidden="true">
    <path d="M3 5h26v22H3z" />
    <path d="M11 5v22M20 5v22M3 12h26M3 20h26" opacity="0.35" />
    <path d="M17.5 9 12 17.5h4L14.5 24l6-9h-4L17.5 9Z" />
  </svg>
)

const GLYPHS = {
  'BibleLM':                  GlyphBibleLM,
  'ArcGIS Parcel Harvester':  GlyphParcels,
  'Music Genre CNN':          GlyphSpectrogram,
  'EV Station GA':            GlyphEvGrid,
}

// ── Card motion variants ────────────────────────────────────────────────────
// Named variants rather than inline objects so a hover on the card cascades to
// the title, arrow, and buttons without any per-element mouse handlers.

const SPRING = { type: 'spring', stiffness: 400, damping: 28 }

const cardVariants = {
  rest:  { y: 0,  borderColor: '#c8ccd2', boxShadow: '0 0 0 0 rgba(24, 29, 38, 0)', transition: SPRING },
  hover: { y: -6, borderColor: '#181d26', boxShadow: '0 12px 28px -12px rgba(24, 29, 38, 0.25)', transition: SPRING },
  tap:   { scale: 0.985, transition: { duration: 0.1 } },
}

const titleVariants = {
  rest:  { x: 0, transition: SPRING },
  hover: { x: 4, transition: SPRING },
}

/** Sits in a fixed-width slot so its reveal never reflows the title. */
const arrowVariants = {
  rest:  { opacity: 0, x: -4, transition: { duration: 0.18 } },
  hover: { opacity: 1, x: 0,  transition: SPRING },
}

const glyphVariants = {
  rest:  { scale: 1,    color: '#41454d', transition: SPRING },
  hover: { scale: 1.08, color: '#181d26', transition: SPRING },
}

const buttonVariants = {
  rest:  { backgroundColor: '#ffffff', color: '#181d26', borderColor: '#c8ccd2', transition: { duration: 0.25 } },
  hover: { backgroundColor: '#181d26', color: '#ffffff', borderColor: '#181d26', transition: { duration: 0.25 } },
}

// ── Project card ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const Glyph = GLYPHS[project.title]

  return (
    /* Outer node owns the scroll-in animation; inner owns hover. Splitting them  */
    /* keeps the two from fighting over `y`, and lets `hover` propagate to        */
    /* descendant motion elements as a named variant.                            */
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
    >
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      style={{
        background: '#ffffff',
        border: '1px solid #c8ccd2',
        borderRadius: 10,
        padding: 32,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 0 0 0 rgba(24, 29, 38, 0)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {project.featured && (
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#41454d',
              border: '1px solid #dddddd',
              borderRadius: 9999,
              padding: '2px 8px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Featured
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${project.title} site`}
              style={{ ...iconHitArea, color: '#9297a0' }}
            >
              <ExternalLink style={{ width: 15, height: 15 }} strokeWidth={1.75} />
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            style={{ ...iconHitArea, color: '#9297a0' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Glyph — centred above the title; Nexis carries its real mark instead */}
      <motion.div
        variants={glyphVariants}
        style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}
      >
        {Glyph
          ? <Glyph />
          : <img
              src={nexisLogoSrc}
              alt=""
              aria-hidden="true"
              style={{ width: 64, height: 64, borderRadius: 15 }}
            />}
      </motion.div>

      {/* Title — nudges right on hover, trailing arrow fades in beside it */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <motion.h3
          variants={titleVariants}
          style={{ fontSize: 18, fontWeight: 500, color: '#181d26', lineHeight: 1.3, margin: 0 }}
        >
          {project.title}
        </motion.h3>
        <motion.span
          variants={arrowVariants}
          aria-hidden="true"
          style={{ display: 'inline-flex', color: '#181d26', flexShrink: 0 }}
        >
          <ArrowRight size={16} strokeWidth={2} />
        </motion.span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#333840', lineHeight: 1.65, margin: 0, flex: 1, display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 12,
                color: '#41454d',
                border: '1px solid #dddddd',
                borderRadius: 6,
                padding: '2px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          variants={buttonVariants}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            minHeight: 44,
            border: '1px solid #c8ccd2',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          GitHub
        </motion.a>
        {project.live && (
          <motion.a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            variants={buttonVariants}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              border: '1px solid #c8ccd2',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <ExternalLink style={{ width: 13, height: 13 }} />
            Live
          </motion.a>
        )}
      </div>
    </motion.div>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(circle, #d0d3d8 1px, transparent 1px)', backgroundSize: '28px 28px', padding: '64px 0', borderTop: '1px solid #dddddd' }}
    >
      <div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ marginBottom: 56, paddingLeft: 24 }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
            Projects
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: 0 }}>
            Selected projects.
          </h2>
        </motion.div>

        {/* Content — wraps instead of forcing 5 columns into narrow viewports */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            padding: '0 24px',
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.github} project={project} index={i} />
          ))}
        </div>
      </div>

      <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginTop: 48, textAlign: 'center' }}
        >
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#41454d',
              textDecoration: 'none',
              borderBottom: '1px solid #dddddd',
              paddingBottom: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            View all repositories on GitHub
          </a>
        </motion.div>
    </section>
  )
}
