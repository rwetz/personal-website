// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import nexis from '../assets/nexis/welcome-1600.webp'
import biblelm from '../assets/showcase/biblelm.webp'
import logscope from '../assets/showcase/logscope.webp'
import ateru from '../assets/showcase/ateru.webp'
import halcyra from '../assets/showcase/halcyra.webp'
import nexisThumb from '../assets/showcase/nexis-thumb.webp'
import biblelmThumb from '../assets/showcase/biblelm-thumb.webp'
import logscopeThumb from '../assets/showcase/logscope-thumb.webp'
import ateruThumb from '../assets/showcase/ateru-thumb.webp'
import halcyraThumb from '../assets/showcase/halcyra-thumb.webp'

const sans = "'Geist Variable', ui-sans-serif, sans-serif"
const mono = "'Geist Mono Variable', ui-monospace, monospace"
// Guest identities follow the apps' own typography and palette sources.
export const projects = [
  {
    id: 'nexis', name: 'Nexis', kind: 'Terminal workspace',
    tagline: 'A terminal built as a workspace, with code, commands and AI within reach.',
    tags: ['Rust + Tauri', 'Terminal', 'Workspace'],
    palette: { bg: '#101319', fg: '#f0f3f7', accent: '#8dbce8', surface: '#222b36', font: sans, display: "'Space Grotesk Variable', sans-serif", radius: '18px' },
    media: { src: nexis, thumb: nexisThumb, animated: true, alt: 'The Nexis welcome screen in the real desktop app', caption: 'Nexis / Desktop workspace' },
    links: [{ label: 'Launch', href: 'https://nexisdev.org' }, { label: 'Source', href: 'https://github.com/rwetz/Nexis' }],
  },
  {
    id: 'ateru', name: 'Ateru', kind: 'iPhone app',
    tagline: 'A private anime journal for your library, daily progress and the stories you finish.',
    tags: ['React Native', 'Local-first', 'iPhone'],
    palette: { bg: '#0b0b0c', fg: '#f2f2f3', accent: '#ef4a44', surface: '#161618', font: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", display: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", ui: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", radius: '28px' },
    media: { src: ateru, thumb: ateruThumb, alt: 'Ateru Chronicle showing a Wrapped recap and sample viewing history', caption: 'Ateru / Sample library' },
    links: [{ label: 'Ask about Ateru', href: 'mailto:rwetz00@gmail.com?subject=Ateru' }],
  },
  {
    id: 'biblelm', name: 'BibleLM', kind: 'Illustrated study',
    tagline: 'An illustrated Bible study tool with notebooks, connected passages and a from-scratch language model lab.',
    tags: ['Bible study', 'Public-domain art', 'ML lab'],
    palette: { bg: '#14110d', fg: '#e9e1d0', accent: '#d4a94f', surface: '#1b1712', font: "'EB Garamond Variable', Georgia, serif", display: "'UnifrakturMaguntia', Georgia, serif", radius: '3px' },
    media: { src: biblelm, thumb: biblelmThumb, animated: true, alt: 'BibleLM running with its illustrated study interface', caption: 'BibleLM / Illustrated study' },
    links: [{ label: 'Source & download', href: 'https://github.com/rwetz/biblelm' }],
  },
  {
    id: 'halcyra', name: 'Halcyra', kind: 'Audio instrument',
    tagline: 'A wavetable synthesizer with a custom sound engine, modulation system and effects built in C++.',
    tags: ['C++ + JUCE', 'Audio DSP', 'VST3'],
    palette: { bg: '#15161a', fg: '#e6e8ee', accent: '#7fb8ff', surface: '#1e2026', font: sans, display: sans, radius: '6px' },
    media: { src: halcyra, thumb: halcyraThumb, alt: 'Halcyra’s real synth interface with oscillator, filter, sub and noise controls', caption: 'Halcyra / Wavetable synthesizer' },
    links: [{ label: 'Ask about Halcyra', href: 'mailto:rwetz00@gmail.com?subject=Halcyra' }],
  },
  {
    id: 'logscope', name: 'Logscope', kind: 'Live log search',
    tagline: 'Tail many logs, index every line and search the live stream with a purpose-built trigram engine.',
    tags: ['Rust', 'Live search', 'Trigram index'],
    palette: { bg: '#090b10', fg: '#f3f5f7', accent: '#c7d0dd', surface: '#1b222c', font: sans, display: mono, radius: '2px' },
    media: { src: logscope, thumb: logscopeThumb, animated: true, alt: 'Logscope filtering a live stream of synthetic logs', caption: 'Logscope / Synthetic log stream' },
    links: [],
  },
]

export function projectFromHash(hash) {
  const id = hash.replace(/^#\/?/, '').replace(/\/$/, '')
  return projects.find(project => project.id === id) ?? null
}
