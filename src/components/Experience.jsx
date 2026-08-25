// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

/* Mirrors the résumé's work history — keep the two in step when either moves. */
const ROLES = [
  {
    org: 'Lemhi Technologies',
    role: 'Full-Stack Development Intern',
    period: 'May 2026 — August 2026',
    mode: 'Remote · Startup',
    points: [
      'Collaborated directly with startup founders on product scope, use-case definition, and system selection, including user-flow diagrams for proposed solutions.',
      'Built arc-gis-harvester, a Python web scraper collecting public agriculture and land GIS data to construct the dataset underpinning the company’s product.',
      'Contributed to regular strategy meetings, shaping decisions on product scope and UI/UX direction.',
    ],
    stack: ['Python', 'ArcGIS', 'Web scraping'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="dot-grid" style={{ padding: '96px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0' }}>
        <motion.div {...fadeUp(0)} style={{ marginBottom: 56 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#41454d',
              margin: '0 0 12px',
            }}
          >
            Experience
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 400,
              color: '#181d26',
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 720,
            }}
          >
            Working on real products alongside the coursework.
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {ROLES.map(({ org, role, period, mode, points, stack }, i) => (
            <motion.article
              key={org}
              {...fadeUp(0.08 + i * 0.07)}
              className="exp-row"
              style={{ borderTop: '1px solid var(--m-hairline)', paddingTop: 28 }}
            >
              {/* Left rail — when, where */}
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#41454d',
                    margin: '0 0 6px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {period}
                </p>
                <p style={{ fontSize: 12, color: '#9297a0', margin: 0 }}>{mode}</p>
              </div>

              {/* Right — role, org, detail */}
              <div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: '#181d26',
                    lineHeight: 1.35,
                    margin: '0 0 4px',
                  }}
                >
                  {org}
                </h3>
                <p style={{ fontSize: 15, color: '#41454d', margin: '0 0 18px' }}>{role}</p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    maxWidth: 720,
                  }}
                >
                  {points.map(point => (
                    <li
                      key={point}
                      style={{
                        position: 'relative',
                        paddingLeft: 20,
                        fontSize: 15,
                        color: '#333840',
                        lineHeight: 1.65,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 9,
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: '#9297a0',
                        }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {stack.map(tech => (
                    <li
                      key={tech}
                      style={{
                        padding: '4px 12px',
                        border: '1px solid var(--m-hairline)',
                        borderRadius: 9999,
                        fontSize: 12,
                        color: '#41454d',
                      }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
