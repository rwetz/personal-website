# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint (no test suite exists)
```

## Architecture

Single-page personal website: one scrollable page with a fixed `Navbar` and six full-screen sections rendered in sequence by `App.jsx`:

```
Hero → About → Projects → Skills → Resume → Contact
```

**Theme system** — always dark. Colors use CSS custom properties defined in `index.css` under `@theme` (Tailwind v4 syntax), referenced as `var(--color-accent)`, `var(--color-muted)`, etc. Light mode was removed.

**Reactbits canvas components** — five visual components live in `src/components/`:

- `PixelBlast` — WebGL (Three.js + postprocessing) full-screen pixel/dithering background with click-ripple interaction. Reinitializes the renderer only when `antialias`, `liquid`, or `noiseAmount` change; other props update uniforms in-place.
- `ASCIIText` — Three.js scene that renders text to a canvas texture, applies vertex wave distortion, then converts the WebGL output to ASCII characters via a `<pre>` overlay. Uses IBM Plex Mono from Google Fonts. Shown on desktop only (`hidden md:block`); mobile uses a plain gradient `<h1>`.
- `GlassSurface` — SVG `feDisplacementMap` filter via `backdrop-filter: url(#id)` for a chromatic-aberration glass effect. Falls back on Safari/Firefox.
- `SpotlightCard` — radial gradient spotlight that follows the cursor, used as a card wrapper.
- `TextType` — typewriter cycling text using gsap for cursor blink. Used in Hero subtitle.

**Animations** — Framer Motion is used for all scroll-reveal (`whileInView`, `once: true`) and Hero entrance animations (staggered `fadeUp`).

**Scroll-spy** — uses a `scroll` event + `getBoundingClientRect` in `Navbar` (not IntersectionObserver). Includes a near-bottom fallback for short sections. Navbar hides on scroll-down and reappears on scroll-up.

**Resume** — rendered with `react-pdf` (PDF.js canvas) for mobile compatibility. Capped at `max-w-2xl` on desktop.

**Styling** — Tailwind CSS v4 (no `tailwind.config.js`). Section headings use Libre Baskerville (Google Fonts). Body uses Geist / Geist Mono.

**Icons** — SVG sprite at `public/icons.svg`. Add new icons as `<symbol>` elements and reference via `<use href="/icons.svg#icon-id" />`.

**No routing, no state management library, no tests.**

## Key conventions

- ESLint ignores unused vars matching `/^[A-Z_]/` — uppercase constants in shader/uniform code are intentionally excluded.
- Assets (`signature.png`, `profile.jpg`) are referenced via `/src/assets/` paths (dev only; import directly for prod builds).
- Resume PDF lives at `public/resume.pdf`.
- `scroll-margin-top: 72px` is set globally on `section[id]` to account for the fixed navbar height.

## README maintenance

**Keep `README.md` up to date whenever any of the following change:**
- File structure (new components, moved files, new public assets)
- New third-party components added (e.g. from Reactbits)
- New dependencies added to `package.json`
- New fonts added

The README contains: project description, stack/dependency table, third-party components table with attribution, fonts list, and ASCII file structure tree.
