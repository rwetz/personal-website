// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import '@fontsource-variable/nunito'
import CaptureScene from '../CaptureScene'
import library from '../../assets/showcase/ateru.webp'
import detail from '../../assets/showcase/ateru-detail.webp'
import search from '../../assets/showcase/ateru-search.webp'
import chronicle from '../../assets/showcase/ateru-chronicle.webp'
import stats from '../../assets/showcase/ateru-stats.webp'
// Device screenshots from an iPhone build, 3 November 2026.
const captures = [
  { label: 'Library', src: library, alt: 'Ateru’s library with Bleach up next at 5 of 366 episodes watched' },
  { label: 'Details', src: detail, alt: 'Ateru’s series page for Bleach with status and episode progress' },
  { label: 'Search', src: search, alt: 'Ateru’s catalog search showing trending series' },
  { label: 'Chronicle', src: chronicle, alt: 'Ateru’s Chronicle with streaks, hours watched and average score' },
  { label: 'Statistics', src: stats, alt: 'Ateru’s statistics with score and decade charts' },
]
export default function AteruScene({ project }) { return <CaptureScene project={project} captures={captures} portrait /> }
