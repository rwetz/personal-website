# Personal Website

Single-page portfolio site + music page + browser DAW built with React and Vite. Features a CSS Houdini animated gradient hero, ASCII name art, typewriter subtitle, scroll-reveal animations, gradient keyword highlights in the About section, skill icons, embedded PDF resume viewer, WebGL dither background on the music page, Wavesurfer.js audio portfolio cards, SoundCloud/YouTube embeds, and a fully in-browser DAW with Web Audio API synthesis.

---

## Stack & Dependencies

| Category | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| 3D / WebGL | Three.js, @react-three/fiber |
| Post-processing | postprocessing, @react-three/postprocessing |
| PDF viewer | react-pdf (PDF.js) |
| Audio | wavesurfer.js |

## Third-Party Components

| Component | Source |
|---|---|
| `ASCIIText` | Reactbits — Three.js ASCII text renderer |
| `GlassSurface` | Reactbits — SVG displacement map glass effect |
| `SpotlightCard` | Reactbits — radial gradient spotlight card |
| `TextType` | Reactbits — typewriter cycling text |
| `Dither` | Reactbits — WebGL dithered wave background |

## Color System

All colors are CSS custom properties defined in `index.css`. Every component references these variables — no hardcoded hex values in component files. Switching theme swaps the full palette site-wide including the WebGL Silk texture, Dither wave, WaveSurfer waveform, hero gradient, and spotlight effects.

### CSS tokens (all themes share these names)

| Token | Usage |
|---|---|
| `--color-surface` | Page background |
| `--color-surface-2` | Alternate section / card backgrounds |
| `--color-surface-3` | Inner cards, skill pills, inputs |
| `--color-text` | Primary text |
| `--color-muted` | Secondary text, nav links, placeholders |
| `--color-accent-dark` | Hover/pressed states, deep accent |
| `--color-accent` | Primary accent — buttons, underlines, borders |
| `--color-accent-light` | Nav active state, tags, cursor, badges |
| `--color-silk` | WebGL Silk texture base color |
| `--color-glow` | Profile photo box-shadow |
| `--color-spotlight` | Project card hover spotlight |

### Themes

| ID | Name | Accent | Vibe |
|---|---|---|---|
| `default` | Amethyst | `#7c3aed` | Deep purple — default |
| `spice` | Chill Spice | `#CD1C18` | Deep red |
| `tuscan` | Tuscan Sunset | `#E35336` | Warm orange |
| `aurora` | Aurora | `#06b6d4` | Electric cyan |
| `gilded` | Gilded | `#d97706` | Warm amber/gold |
| `sakura` | Sakura | `#e8799f` | Rose pink |
| `forest` | Forest | `#16a34a` | Emerald green |
| `cobalt` | Cobalt | `#4f80f7` | Deep navy blue |

Theme is selected via the color swatch button in the navbar and persisted to `localStorage` under the key `color-theme`. The `html` element gets a corresponding class (`theme-spice`, `theme-aurora`, etc.) which overrides the CSS variables. Light mode (`html.light`, toggled with Ctrl+Shift+L) is a separate easter egg that works on top of any theme.

---

## Fonts & Icons

- **Geist** / **Geist Mono** — body and code (Google Fonts)
- **Libre Baskerville** — section headings (Google Fonts)
- **IBM Plex Mono** — used by ASCIIText renderer (Google Fonts)
- **Devicons** — skill pill icons via CDN

---

## File Structure

```
├── public/
│   ├── audio/
│   │   ├── track1.mp3
│   │   ├── track2.mp3
│   │   ├── track3.mp3
│   │   ├── track4.mp3
│   │   ├── track5.mp3
│   │   └── track6.mp3
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.json
│   └── resume.pdf
├── src/
│   ├── assets/
│   │   ├── profile.jpg
│   │   └── signature.png
│   ├── components/
│   │   ├── ASCIIText.jsx      # Three.js ASCII name effect
│   │   ├── About.jsx
│   │   ├── CommandPalette.jsx # ⌘K command palette
│   │   ├── Contact.jsx        # Copy-to-clipboard + contact form
│   │   ├── Dither.jsx         # WebGL dithered wave background
│   │   ├── GlassSurface.jsx   # SVG displacement glass effect
│   │   ├── Hero.jsx           # Parallax gradient + scroll indicator
│   │   ├── DAW.jsx            # Browser DAW — Web Audio piano roll (lazy-loaded)
│   │   ├── Music.jsx          # Music page (lazy-loaded)
│   │   ├── Navbar.jsx         # Scroll-spy + animated underline
│   │   ├── Projects.jsx       # 3D tilt + spotlight cards
│   │   ├── Resume.jsx         # react-pdf viewer
│   │   ├── Skills.jsx         # Staggered pills with brand colors
│   │   ├── SpotlightCard.jsx  # Spotlight hover card
│   │   └── TextType.jsx       # Typewriter cycling text
│   ├── App.jsx                # Routing, custom cursor, Konami, ⌘K
│   ├── index.css
│   └── main.jsx
├── markdown_files/
│   ├── CLAUDE.md
│   ├── improvements.md
│   └── README.md
├── index.html
├── package.json
└── vite.config.js
```

## Features

- **8 color themes** — navbar swatch picker cycles between Amethyst, Chill Spice, Tuscan Sunset, Aurora, Gilded, Sakura, Forest, and Cobalt; persisted to `localStorage`
- **⌘K Command Palette** — jump to any section, copy email, download resume
- **Custom cursor** — dot + lagging ring on desktop pointer devices
- **Konami code** — toggles party mode easter egg
- **Ctrl+Shift+L** — toggles light mode easter egg
- **Music page** (`/#music`) — SoundCloud embeds, YouTube videos, Wavesurfer.js audio portfolio with real waveforms, seek, and live timestamps
- **PWA** — installable via `manifest.json`
- **Section URL updates** — hash updates as you scroll
- **Lazy-loaded Music bundle** — Three.js/WebGL only loads when navigating to `/#music`
- **Gradient keyword highlights** — key terms in About shimmer/glow with accent colors
- **Responsive card deck** — Projects CardSwap width adapts to screen size
- **Social footer** — Instagram and X icons alongside GitHub and music links
- **Browser DAW** (`/#daw`, also in ⌘K palette) — 5-track piano roll sequencer powered entirely by Web Audio API; each track has an icon + dropdown to swap between Piano, Synth, Strings, Bass, and Drums; 32-step grid, spacebar play/pause, BPM control, loop toggle, per-track clear; all colors follow the site theme system

## Dev

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # eslint
```
