# Personal Website

Single-page portfolio site + music page + browser DAW built with React and Vite. Features a CSS Houdini animated gradient hero, ASCII name art, typewriter subtitle, scroll-reveal animations, gradient keyword highlights in the About section, a `/now` page-style life snapshot, GitHub-API-driven projects + live language stats, tabbed resume with vertical timeline + highlights, skill pills with proficiency tooltips, an Inspiration shelf (books / albums / films), embedded PDF resume viewer, WebGL dither background on the music page, Wavesurfer.js audio portfolio cards, SoundCloud/YouTube embeds, and a fully in-browser DAW with Web Audio API synthesis. Built on a custom shadcn/ui (radix-nova) component layer wired into the per-theme accent token system.

---

## Stack & Dependencies

| Category | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (radix-nova style) on top of `radix-ui` v1 + `class-variance-authority` + `tailwind-merge` |
| Command bar | `cmdk` |
| Toasts | `sonner` |
| Icons | `lucide-react` |
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

## shadcn/ui layer (`src/components/ui/`)

All built on `radix-ui` primitives, themed via the site's `--color-accent / --color-surface-*` CSS variables so they inherit the active theme. No `oklch` token plumbing — components reference the project palette directly.

| Component | Used by |
|---|---|
| `command` (cmdk) + `dialog` | CommandPalette ⌘K |
| `dropdown-menu` | Navbar theme picker |
| `popover` | (available) |
| `hover-card` | Projects deck previews, Inspiration tiles |
| `dialog` | Project deep-dive modal |
| `tooltip` | Skills pills (proficiency + years + note) |
| `tabs` | Resume (Timeline / Highlights / PDF) |
| `badge` | Project tags, stats counts, dialog metadata |
| `input` / `textarea` / `label` | Contact form |
| `button` | Form submits, dialog actions |
| `sonner` | Global toast — copy-email feedback, form validation errors |
| `card` | (available) |

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
│   │   ├── ui/                # shadcn/ui primitives (radix-nova style)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── command.tsx       # cmdk-based command bar
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── sonner.tsx        # global toast
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── ASCIIText.jsx      # Three.js ASCII name effect
│   │   ├── About.jsx
│   │   ├── CommandPalette.jsx # ⌘K palette — cmdk + Dialog + sonner
│   │   ├── Contact.jsx        # shadcn Input/Textarea/Label + sonner toast feedback
│   │   ├── Dither.jsx         # WebGL dithered wave background
│   │   ├── GlassSurface.jsx   # SVG displacement glass effect
│   │   ├── Hero.jsx           # Parallax gradient + scroll indicator
│   │   ├── DAW.jsx            # Browser DAW — Web Audio piano roll (lazy-loaded)
│   │   ├── Inspiration.jsx    # Books / albums / films grid with HoverCard reveal
│   │   ├── Music.jsx          # Music page (lazy-loaded)
│   │   ├── Navbar.jsx         # Scroll-spy + DropdownMenu theme picker
│   │   ├── Now.jsx            # /now-style life snapshot card grid
│   │   ├── Projects.jsx       # CardSwap deck + HoverCard previews + Dialog deep-dive
│   │   ├── Resume.jsx         # Tabs: Timeline / Highlights / PDF
│   │   ├── Skills.jsx         # Pills with Tooltip (level + years + note)
│   │   ├── SpotlightCard.jsx  # Spotlight hover card
│   │   ├── Stats.jsx          # Live GitHub stats + language breakdown bar
│   │   └── TextType.jsx       # Typewriter cycling text
│   ├── lib/
│   │   ├── github.js          # Shared GitHub API fetcher (used by Projects + Stats, sessionStorage-cached)
│   │   └── utils.ts           # cn() helper (clsx + tailwind-merge)
│   ├── App.jsx                # Routing, custom cursor, Konami, ⌘K, <Toaster />
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

## Sections (top to bottom)

1. **Hero** — ASCII name + typewriter subtitle on a Houdini animated gradient
2. **About** — bio with gradient keyword highlights
3. **Now** — `/now`-style live snapshot (building / reading / listening / learning / location / drinking)
4. **Projects** — top GitHub repos via the API; CardSwap deck with HoverCard previews + Dialog deep-dive
5. **Skills** — grouped pills, each with a Tooltip showing level / years / note
6. **GitHub Stats** — live repos / stars / forks / followers + 6-language stacked breakdown
7. **Resume** — Tabs (Timeline ▸ Highlights ▸ PDF). Timeline is a vertical icon-coded list; Highlights are stat cards + 4 strengths
8. **Inspiration** — Books / Albums / Films grid; HoverCard reveals the *why* for each
9. **Contact** — clickable cards (email / GitHub / LinkedIn) + validated form, sonner toast for copy/submit feedback

## Features

- **8 color themes** — navbar `DropdownMenu` swatch picker cycles between Amethyst, Chill Spice, Tuscan Sunset, Aurora, Gilded, Sakura, Forest, and Cobalt; persisted to `localStorage`
- **⌘K Command Palette** — cmdk-powered, with Navigate / Tools / Actions / External groups; jump to any section, copy email (toast confirm), download resume
- **Live GitHub data** — Projects + Stats sections both pull from the GitHub API at runtime, with sessionStorage caching
- **Inline form validation** — Contact form validates name / email / message and surfaces errors with sonner toast + per-field hints
- **Custom cursor** — dot + lagging ring on desktop pointer devices
- **Konami code** — toggles party mode easter egg
- **Ctrl+Shift+L** — toggles light mode easter egg
- **Music page** (`/#music`) — SoundCloud embeds, YouTube videos, Wavesurfer.js audio portfolio with real waveforms, seek, and live timestamps
- **PWA** — installable via `manifest.json`
- **Section URL updates** — hash updates as you scroll
- **Lazy-loaded Music bundle** — Three.js/WebGL only loads when navigating to `/#music`
- **Browser DAW** (`/#daw`, also in ⌘K palette) — 5-track piano roll sequencer powered entirely by Web Audio API; each track has an icon + dropdown to swap between Piano, Synth, Strings, Bass, and Drums; 32-step grid with note velocity (right-click to cycle 4 levels) and note length (1/2/4/8 steps via transport selector); per-track reverb and delay sends routed through a global convolution reverb (synthetically generated IR, no audio files) and BPM-synced feedback delay; full undo/redo (Ctrl+Z/Shift+Z, up to 60 states) and per-track copy/paste; spacebar play/pause, BPM control, loop toggle; all colors follow the site theme system

## Dev

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # eslint
```
