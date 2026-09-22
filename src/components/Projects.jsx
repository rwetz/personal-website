// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import nexisLogoSrc from '../assets/nexis-logo.webp'
import nexisShot1600 from '../assets/nexis/welcome-1600.webp'
import nexisShot900 from '../assets/nexis/welcome-900.webp'

const GITHUB_USER = 'rwetz'

/**
 * Hand-picked and hardcoded — this section is a curated shortlist, not a feed.
 * Copy is lifted from each repo's GitHub description; update here when it drifts.
 */
/** The flagship gets its own full-width card; everything else shares the grid. */
const FEATURED = {
  title:       'Nexis',
  description: 'Open-source AI-native terminal emulator with an integrated editor, file explorer, and multi-provider AI agents.',
  highlights: [
    'Multi-provider AI agents in a side panel, working against your real shell',
    'Built-in code editor, file explorer, and live Markdown preview',
    'Keyboard-first: command palette, split panes, customizable shortcuts',
  ],
  tags:        ['Rust', 'Tauri 2', 'React 19', 'TypeScript'],
  github:      'https://github.com/rwetz/Nexis',
  live:        'https://nexisdev.org',
}

const PROJECTS = [
  {
    title:       'BibleLM',
    description: 'A tiny GPT-style transformer trained from scratch on the Bible, with a live training dashboard. Tauri + React + PyTorch.',
    tags:        ['TypeScript', 'PyTorch', 'Transformer', 'Tauri'],
    github:      'https://github.com/rwetz/biblelm',
    live:        null,
  },
  {
    title:       'ArcGIS Parcel Harvester',
    context:     'Built at Lemhi Technologies',
    description: 'Generalized ArcGIS FeatureLayer harvester for farmland parcel research across any US state. Collects public agriculture and land GIS data into the dataset underpinning the company’s product.',
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
  rest:  { y: 0,  boxShadow: '0 1px 2px rgba(24, 29, 38, 0.06), 0 0 0 1px rgba(24, 29, 38, 0.06)', transition: SPRING },
  hover: { y: -4, boxShadow: '0 18px 40px -20px rgba(24, 29, 38, 0.28), 0 0 0 1px rgba(24, 29, 38, 0.1)', transition: SPRING },
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
  hover: { scale: 1.08, color: '#a94a26', transition: SPRING },
}

// ── Project card ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const Glyph = GLYPHS[project.title]

  return (
    /* Outer node owns the scroll-in animation; inner owns hover. Splitting them  */
    /* keeps the two from fighting over `y`, and lets `hover` propagate to        */
    /* descendant motion elements as a named variant.                            */
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
    >
    <m.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 32,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Glyph — centred above the title */}
      {Glyph && (
        <m.div
          variants={glyphVariants}
          style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}
        >
          <Glyph />
        </m.div>
      )}

      {/* Title — nudges right on hover, trailing arrow fades in beside it */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <m.h3
          variants={titleVariants}
          style={{ fontSize: 20, fontWeight: 600, color: '#181d26', lineHeight: 1.25, letterSpacing: '-0.02em', margin: 0 }}
        >
          {project.title}
        </m.h3>
        <m.span
          variants={arrowVariants}
          aria-hidden="true"
          style={{ display: 'inline-flex', color: '#181d26', flexShrink: 0 }}
        >
          <ArrowRight size={16} weight="bold" />
        </m.span>
      </div>

      {/* Provenance — only on work built for someone else */}
      {project.context && (
        <p style={{ fontSize: 12, color: 'var(--m-subtle)', margin: '-4px 0 0' }}>
          {project.context}
        </p>
      )}

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
                fontFamily: 'var(--m-font-mono)',
                fontSize: 12,
                color: '#41454d',
                background: 'var(--m-surface-soft)',
                borderRadius: 6,
                padding: '3px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links — text actions, not another pair of ghost buttons */}
      <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 14 }}>
          Source
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 14 }}>
            Live site
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </m.div>
    </m.div>
  )
}

// ── Featured project ────────────────────────────────────────────────────────

function FeaturedProject({ project }) {
  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="featured-project"
    >
      <div className="featured-project-copy">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <img
            src={nexisLogoSrc}
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            style={{ borderRadius: 11, flexShrink: 0 }}
          />
          <span className="micro-label">
            <span style={{ color: 'var(--m-accent)' }}>Flagship</span> · open source
          </span>
        </div>

        <h3 style={{ fontSize: 'clamp(32px, 3.4vw, 44px)', fontWeight: 500, color: '#181d26', lineHeight: 1, letterSpacing: '-0.035em', margin: '0 0 16px' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 16, color: '#333840', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 460 }}>
          {project.description}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.highlights.map(point => (
            <li key={point} style={{ position: 'relative', paddingLeft: 20, fontSize: 14, color: '#333840', lineHeight: 1.6 }}>
              <span
                aria-hidden="true"
                style={{ position: 'absolute', left: 0, top: 8, width: 5, height: 5, borderRadius: '50%', backgroundColor: '#9297a0' }}
              />
              {point}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--m-font-mono)', fontSize: 12, color: '#41454d', background: 'var(--m-surface-soft)', borderRadius: 6, padding: '3px 8px' }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 28px', marginTop: 'auto' }}>
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Visit nexisdev.org
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link">
            <GithubLogo size={16} aria-hidden="true" />
            Source on GitHub
          </a>
        </div>
      </div>

      {/* Screenshot bleeds off the bottom-right edge, like a window peeking out */}
      <div className="featured-project-shot">
        <img
          src={nexisShot1600}
          srcSet={`${nexisShot900} 900w, ${nexisShot1600} 1600w`}
          sizes="(max-width: 960px) 100vw, 720px"
          width={1600}
          height={955}
          loading="lazy"
          decoding="async"
          alt="The Nexis welcome screen: a dark window with a New Terminal button and keyboard shortcut hints."
        />
      </div>
    </m.article>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(circle, #d0d3d8 1px, transparent 1px)', backgroundSize: '28px 28px', borderTop: '1px solid #dddddd' }}
      className="section"
    >
      <div className="page-container">

        {/* Heading */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ marginBottom: 56 }}
        >
          <p className="section-eyebrow"><span className="section-index">01</span>Projects</p>
          <h2 className="section-title">Things I’ve built.</h2>
        </m.div>

        <FeaturedProject project={FEATURED} />

        {/* Two-up rather than five skinny columns, so descriptions get room to breathe */}
        <div className="project-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.github} project={project} index={i} />
          ))}
        </div>
      </div>

      <m.div
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
            <GithubLogo size={16} aria-hidden="true" />
            View all repositories on GitHub
          </a>
        </m.div>
    </section>
  )
}
