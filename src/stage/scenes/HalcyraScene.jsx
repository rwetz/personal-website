// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import CaptureScene from '../CaptureScene'
import synth from '../../assets/showcase/halcyra.webp'
const captures = [{ label: 'Synth', src: synth, alt: 'Halcyra’s wavetable oscillator, filter and sound controls in the real synthesizer' }]
export default function HalcyraScene({ project }) { return <CaptureScene project={project} captures={captures} /> }
