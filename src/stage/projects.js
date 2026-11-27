// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import nexis from '../assets/showcase/nexis.webp'
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
    id: 'nexis', name: 'Nexis', kind: 'Terminal and editor',
    tagline: 'A terminal and code editor in one desktop app, about 32 MB on Windows. The AI panel runs on your own API keys or a local model, and there is no telemetry.',
    tags: ['Rust', 'Tauri 2', 'React 19', 'xterm.js'],
    palette: { bg: '#101319', fg: '#f0f3f7', accent: '#8dbce8', surface: '#222b36', font: sans, display: "'Space Grotesk Variable', sans-serif", radius: '18px' },
    media: { src: nexis, thumb: nexisThumb, animated: true, alt: 'Nexis editing a Python file beside its workspace explorer', caption: 'Nexis / Desktop workspace' },
    field: 'Move to stir the grain. Click to swirl it.',
    links: [{ label: 'Launch', href: 'https://nexisdev.org' }, { label: 'Source', href: 'https://github.com/rwetz/Nexis' }],
  },
  {
    id: 'ateru', name: 'Ateru', kind: 'iPhone app',
    tagline: 'A private anime tracker for iPhone. Your watch history lives in SQLite on the phone, with no account and no server.',
    tags: ['React Native', 'SQLite'],
    palette: { bg: '#0b0b0c', fg: '#f2f2f3', accent: '#ef4a44', surface: '#161618', font: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", display: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", ui: "ui-rounded, 'SF Pro Rounded', 'Nunito Variable', sans-serif", radius: '28px' },
    media: { src: ateru, thumb: ateruThumb, alt: 'Ateru’s library with Bleach up next at 5 of 366 episodes watched', caption: 'Ateru / iPhone' },
    field: 'Move through the threads to part them.',
    links: [{ label: 'Ask about Ateru', href: 'mailto:rwetz00@gmail.com?subject=Ateru' }],
  },
  {
    id: 'biblelm', name: 'BibleLM', kind: 'Bible study app',
    tagline: 'Six public-domain translations set beside all 241 of Doré’s Bible engravings. It also has a small GPT you train on Scripture yourself and can open up layer by layer.',
    tags: ['Tauri', 'PyTorch', 'transformers.js'],
    palette: { bg: '#14110d', fg: '#e9e1d0', accent: '#d4a94f', surface: '#1b1712', font: "'EB Garamond Variable', Georgia, serif", display: "'UnifrakturMaguntia', Georgia, serif", radius: '3px' },
    media: { src: biblelm, thumb: biblelmThumb, animated: true, alt: 'BibleLM’s home in the Nocturne theme with the verse of the day', caption: 'BibleLM / Illustrated study' },
    field: 'Move to disturb the dither. Click to send a ripple.',
    links: [{ label: 'Source and download', href: 'https://github.com/rwetz/biblelm' }, { label: 'Paper (PDF)', href: 'https://github.com/rwetz/papers/releases/latest/download/biblelm.pdf' }],
  },
  {
    id: 'halcyra', name: 'Halcyra', kind: 'Synth plugin',
    tagline: 'A wavetable synthesizer plugin written in C++. The sound engine and modulation are my own code, not a framework’s.',
    tags: ['C++ / JUCE', 'VST3'],
    palette: { bg: '#15161a', fg: '#e6e8ee', accent: '#7fb8ff', surface: '#1e2026', font: sans, display: sans, radius: '6px' },
    media: { src: halcyra, thumb: halcyraThumb, animated: true, alt: 'Halcyra’s real synth interface with oscillator, filter, sub and noise controls', caption: 'Halcyra / Wavetable synthesizer' },
    field: 'Move to bend the fibers. Click to pulse them.',
    links: [{ label: 'Ask about Halcyra', href: 'mailto:rwetz00@gmail.com?subject=Halcyra' }],
  },
  {
    id: 'logscope', name: 'Logscope', kind: 'Log search',
    tagline: 'Tails your log files and indexes each line as it arrives. Finding a rare token in 100 million lines takes 0.13 ms; ripgrep takes 3.7 s.',
    tags: ['Rust'],
    palette: { bg: '#090b10', fg: '#f3f5f7', accent: '#c7d0dd', surface: '#1b222c', font: sans, display: mono, radius: '2px' },
    media: { src: logscope, thumb: logscopeThumb, animated: true, alt: 'Logscope matching timeout OR refused in a live synthetic log stream', caption: 'Logscope / Synthetic log stream' },
    field: 'Move to light the terminal. Click to glitch it.',
    links: [{ label: 'Paper (PDF)', href: 'https://github.com/rwetz/papers/releases/latest/download/logscope.pdf' }],
  },
]

export function projectFromHash(hash) {
  const id = hash.replace(/^#\/?/, '').replace(/\/$/, '')
  return projects.find(project => project.id === id) ?? null
}
