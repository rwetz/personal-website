# Personal Website

Single-page portfolio site + music page built with React and Vite. Features a CSS Houdini animated gradient hero, ASCII name art, typewriter subtitle, scroll-reveal animations, gradient keyword highlights in the About section, skill icons, embedded PDF resume viewer, WebGL dither background on the music page, Wavesurfer.js audio portfolio cards, and SoundCloud/YouTube embeds.

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

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-surface` | `#0f0f13` | Page background |
| `--color-surface-2` | `#1a1a24` | Alternate section background |
| `--color-surface-3` | `#242433` | Cards, skill pills, input backgrounds |
| `--color-muted` | `#94a3b8` | Secondary text, nav links, placeholders |
| `--color-text` | `#e2e8f0` | Primary text |
| `--color-accent-dark` | `#5b21b6` | Hover/pressed states, deep accent |
| `--color-accent` | `#7c3aed` | Primary accent — buttons, underlines, borders |
| `--color-accent-light` | `#a78bfa` | Highlighted nav links, tags, cursor, badges |

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

- **⌘K Command Palette** — jump to any section, copy email, download resume
- **Custom cursor** — dot + lagging ring on desktop pointer devices
- **Konami code** — toggles light mode easter egg
- **Ctrl+Shift+L** — also toggles light mode
- **Music page** (`/#music`) — SoundCloud embeds, YouTube videos, Wavesurfer.js audio portfolio with real waveforms, seek, and live timestamps
- **PWA** — installable via `manifest.json`
- **Section URL updates** — hash updates as you scroll
- **Lazy-loaded Music bundle** — Three.js/WebGL only loads when navigating to `/#music`
- **Gradient keyword highlights** — key terms in About shimmer/glow with accent colors
- **Responsive card deck** — Projects CardSwap width adapts to screen size
- **Social footer** — Instagram and X icons alongside GitHub and music links

## Dev

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # eslint
```
