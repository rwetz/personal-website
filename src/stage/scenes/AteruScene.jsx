// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import '@fontsource-variable/nunito-sans'
import CaptureScene from '../CaptureScene'
import chronicle from '../../assets/showcase/ateru.webp'
import studio from '../../assets/showcase/ateru-studio.webp'
import appearance from '../../assets/showcase/ateru-appearance.webp'
const captures = [
  { label: 'Chronicle', src: chronicle, alt: 'Ateru Chronicle with a Wrapped recap and sample viewing history' },
  { label: 'Studio', src: studio, alt: 'Ateru’s studio breakdown for a sample anime library' },
  { label: 'Appearance', src: appearance, alt: 'Ateru’s appearance settings with the coral and black app theme' },
]
export default function AteruScene({ project }) { return <CaptureScene project={project} captures={captures} portrait /> }
