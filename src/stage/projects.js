// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import nexis from '../assets/nexis/welcome-1600.webp'
import biblelm from '../assets/showcase/biblelm.webp'
import logscope from '../assets/showcase/logscope.webp'
import ferrite from '../assets/showcase/ferrite.svg'
import nexisDesign from '../assets/showcase/nexis-design.svg'
import nexisThumb from '../assets/showcase/nexis-thumb.webp'
import biblelmThumb from '../assets/showcase/biblelm-thumb.webp'
import logscopeThumb from '../assets/showcase/logscope-thumb.webp'

const sans = "'Geist Variable', ui-sans-serif, sans-serif"
const mono = "'Geist Mono Variable', ui-monospace, monospace"
// Family colors are copied from Dev/brand/heptagram/palettes/*.css.
export const projects = [
  {
    id: 'nexis', name: 'Nexis', kind: 'App',
    tagline: 'A terminal built as a workspace, with code, commands and AI within reach.',
    tags: ['Rust + Tauri', 'Terminal', 'Workspace'],
    palette: { bg: '#101319', fg: '#f0f3f7', accent: '#8dbce8', surface: '#222b36', font: sans, radius: '18px' },
    media: { src: nexis, thumb: nexisThumb, alt: 'The Nexis welcome screen in the real desktop app', caption: 'Nexis / Desktop workspace' },
    links: [{ label: 'Launch', href: 'https://nexisdev.org' }, { label: 'Source', href: 'https://github.com/rwetz/Nexis' }],
  },
  {
    id: 'ferrite', name: 'Ferrite', kind: 'Design family',
    tagline: 'A family of focused desktop tools, forged from one amber-on-iron design language.',
    tags: ['Rust + GPUI', 'Molten Iron', 'Design system'],
    palette: { bg: '#10100f', fg: '#e6d9bc', accent: '#e5a64b', surface: '#292824', font: mono, radius: '4px' },
    media: { src: ferrite, alt: 'The canonical Ferrite Molten Iron color palette', caption: 'Molten Iron / Living specimen' },
    links: [{ label: 'Explore system', href: 'https://github.com/rwetz/ferrite-design' }],
  },
  {
    id: 'biblelm', name: 'BibleLM', kind: 'App',
    tagline: 'An illustrated Bible study tool with notebooks, connected passages and a from-scratch language model lab.',
    tags: ['Bible study', 'Public-domain art', 'ML lab'],
    palette: { bg: '#0b0907', fg: '#efe6d3', accent: '#d9603f', surface: '#221b16', font: "Georgia, 'Times New Roman', serif", radius: '3px' },
    media: { src: biblelm, thumb: biblelmThumb, alt: 'BibleLM running with its illustrated study interface', caption: 'BibleLM / Illustrated study' },
    links: [{ label: 'Source & download', href: 'https://github.com/rwetz/biblelm' }],
  },
  {
    id: 'nexis-design', name: 'Nexis design', kind: 'Design family',
    tagline: 'A shared language of frosted surfaces, precise typography and motion for the Nexis family.',
    tags: ['React', 'Frosted Glass', 'Design system'],
    palette: { bg: '#222b36', fg: '#f0f3f7', accent: '#8dbce8', surface: '#101319', font: sans, radius: '24px' },
    media: { src: nexisDesign, alt: 'The canonical Nexis Frosted Glass color palette', caption: 'Frosted Glass / Living specimen' },
    links: [{ label: 'Explore system', href: 'https://github.com/rwetz/nexis-design' }],
  },
  {
    id: 'logscope', name: 'Logscope', kind: 'App',
    tagline: 'Tail many logs, index every line and search the live stream with a purpose-built trigram engine.',
    tags: ['Rust', 'Live search', 'Trigram index'],
    palette: { bg: '#090b10', fg: '#f3f5f7', accent: '#c7d0dd', surface: '#1b222c', font: mono, radius: '6px' },
    media: { src: logscope, thumb: logscopeThumb, alt: 'Logscope filtering a live stream of synthetic logs', caption: 'Logscope / Synthetic log stream' },
    links: [],
  },
]

export function projectFromHash(hash) {
  const id = hash.replace(/^#\/?/, '').replace(/\/$/, '')
  return projects.find(project => project.id === id) ?? null
}
