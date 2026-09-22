// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { m } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

/*
 * Newest first. Copy is taken from the resume (public/resume.pdf); keep the
 * two in step when either moves. `current` gets the accent marker.
 */
const ENTRIES = [
  {
    kind: 'Education',
    org: 'North Dakota State University',
    role: 'B.S. Computer Science, minor in Artificial Intelligence',
    period: 'Now · expected fall 2027',
    mode: 'Fargo, ND',
    current: true,
    points: [
      'Dean’s List for four semesters, fall 2023 through spring 2026.',
      'Coursework in artificial intelligence and operating systems.',
    ],
  },
  {
    kind: 'Internship',
    org: 'Lemhi Technologies',
    role: 'Full-Stack Development Intern',
    period: 'May to Aug 2026',
    mode: 'Remote · startup',
    points: [
      'Built arc-gis-harvester, a resumable Python scraper for public ArcGIS REST servers, to construct the South Dakota farmland dataset underpinning the company’s product, classifying agricultural, parcel, and boundary layers from 3+ state and federal GIS sources.',
      'Worked directly with the founders on product scope and system selection, including user-flow diagrams for proposed solutions.',
    ],
    stack: ['Python', 'ArcGIS REST API', 'pytest'],
    link: { label: 'The harvester on GitHub', href: 'https://github.com/rwetz/arcgis-parcel-harvester' },
  },
  {
    kind: 'Senior capstone',
    org: 'FarmQA',
    role: 'Full-stack client project, team of 4',
    period: 'Jan to May 2026',
    mode: 'NDSU CSCI Capstone',
    points: [
      'Delivered a client-approved full-stack application for FarmQA’s internal team to visualize metrics and work with sensitive data.',
      'Designed an SQL staging layer fed by nightly jobs from Azure Blob Storage, replacing runtime scans of the blob store with indexed queries. Load times fell ~98%, from 75s to ~1.5s, against ~250GB of test data.',
      'Presented the finished product at the 2026 NDSU Engineering Senior Design Expo.',
    ],
    stack: ['React', 'Vite', 'Azure Functions', 'SQL Server'],
    highlight: { value: '75s → 1.5s', label: 'load time, ~250GB of data' },
    link: { label: 'farmqa.com', href: 'https://farmqa.com' },
  },
]

export default function Experience() {
  return (
    <section id="experience" className="dot-grid section">
      <div className="page-container split-layout">
        {/* Heading rides alongside the timeline on wide screens */}
        <m.div {...fadeUp(0)} className="split-heading">
          <p className="section-eyebrow"><span className="section-index">03</span>Experience</p>
          <h2 className="section-title">
            Working on real products alongside the coursework.
          </h2>
          <p className="section-lede">
            A startup internship, a client capstone that shipped, and a CS degree with an
            AI focus, most recent first.
          </p>
        </m.div>

        <ol className="timeline">
          {ENTRIES.map(({ kind, org, role, period, mode, current, points, stack, link, highlight }, i) => (
            <m.li
              key={org}
              {...fadeUp(0.08 + i * 0.08)}
              className={current ? 'timeline-item is-current' : 'timeline-item'}
            >
              <p className="micro-label timeline-meta">
                <span style={{ color: current ? 'var(--m-accent)' : 'var(--m-ink)' }}>{period}</span>
                <span aria-hidden="true">·</span>
                <span>{kind}</span>
                <span aria-hidden="true">·</span>
                <span>{mode}</span>
              </p>

              <div className="timeline-head">
                <div>
                  <h3 className="timeline-org">{org}</h3>
                  <p className="timeline-role">{role}</p>
                </div>
                {/* One headline result, set large so it can be scanned */}
                {highlight && (
                  <p className="timeline-highlight">
                    <span className="timeline-highlight-value">{highlight.value}</span>
                    <span className="micro-label">{highlight.label}</span>
                  </p>
                )}
              </div>

              <ul className="timeline-points">
                {points.map(point => <li key={point}>{point}</li>)}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px' }}>
                {stack && (
                  <ul className="timeline-stack" aria-label="Tools used">
                    {stack.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                )}
                {link && (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 14 }}>
                    {link.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
