// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import CaptureScene from '../CaptureScene'
import synth from '../../assets/showcase/halcyra.webp'
import mod from '../../assets/showcase/halcyra-mod.webp'
import fx from '../../assets/showcase/halcyra-fx.webp'
// The three pages of the real standalone synth, captured 3 November 2026.
const captures = [
  { label: 'Synth', src: synth, width: 1742, height: 1288, alt: 'Halcyra’s two wavetable oscillators, filters, envelopes and on-screen keyboard in the real synthesizer' },
  { label: 'Mod', src: mod, width: 1742, height: 1288, alt: 'Halcyra’s modulation page with two LFOs, the mod envelope and an eight-slot mod matrix' },
  { label: 'FX', src: fx, width: 1742, height: 1288, alt: 'Halcyra’s effects rack with distortion, chorus, delay and reverb' },
]
export default function HalcyraScene({ project, onReady }) { return <CaptureScene project={project} captures={captures} onReady={onReady} /> }
