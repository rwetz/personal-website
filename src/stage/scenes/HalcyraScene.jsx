// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import CaptureScene from '../CaptureScene'
import synth from '../../assets/showcase/halcyra.webp'
const captures = [{ label: 'Synth', src: synth, width: 1420, height: 918, alt: 'Halcyra’s wavetable oscillator, filter and sound controls in the real synthesizer' }]
export default function HalcyraScene({ project, onReady }) { return <CaptureScene project={project} captures={captures} onReady={onReady} /> }
