# Personal Website

Single-page portfolio site built with React and Vite. Features a WebGL pixel-dithering hero background, ASCII name effect, typewriter subtitle, scroll-reveal animations, and an embedded PDF resume viewer.

---

## Stack & Dependencies

| Category | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| 3D / WebGL | Three.js |
| Post-processing | postprocessing (for PixelBlast liquid effect) |
| Cursor animation | gsap (used by TextType) |
| PDF viewer | react-pdf (PDF.js) |

## Third-Party Components

| Component | Source |
|---|---|
| `PixelBlast` | Reactbits — pixel dithering WebGL background |
| `ASCIIText` | Reactbits — Three.js ASCII text renderer |
| `GlassSurface` | Reactbits — SVG displacement map glass effect |
| `SpotlightCard` | Reactbits — radial gradient spotlight card |
| `TextType` | Reactbits — typewriter cycling text |

## Fonts

- **Geist** / **Geist Mono** — body and code (Google Fonts)
- **Libre Baskerville** — section headings (Google Fonts)
- **IBM Plex Mono** — used internally by ASCIIText renderer

---

## File Structure

```
├── public/
│   ├── favicon.svg
│   ├── icons.svg          # SVG sprite (Gmail, GitHub, LinkedIn icons)
│   └── resume.pdf
├── src/
│   ├── assets/
│   │   ├── profile.jpg
│   │   └── signature.png
│   ├── components/
│   │   ├── ASCIIText.jsx      # Three.js ASCII name effect (Reactbits)
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── GlassSurface.jsx   # SVG displacement glass effect (Reactbits)
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── PixelBlast.jsx     # WebGL pixel dithering background (Reactbits)
│   │   ├── Projects.jsx
│   │   ├── Resume.jsx
│   │   ├── Skills.jsx
│   │   ├── SpotlightCard.jsx  # Spotlight hover card (Reactbits)
│   │   └── TextType.jsx       # Typewriter text component (Reactbits)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Dev

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # eslint
```
