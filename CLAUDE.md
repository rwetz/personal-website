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

**Theme system** — dark/light mode is toggled by `Navbar` adding/removing a `light` class on `<html>`. Theme state is persisted to `localStorage`. All colors use CSS custom properties defined in `index.css` under `@theme` (Tailwind v4 syntax), so components reference them as `var(--color-accent)`, `var(--color-muted)`, etc.

**Reactbits canvas components** — three heavy visual components live in `src/components/`:

- `PixelBlast` — WebGL (Three.js + postprocessing) full-screen pixel/dithering background with click-ripple interaction. Props control pixel shape, color, ripple physics, and an optional liquid warp effect. Reinitializes the renderer only when `antialias`, `liquid`, or `noiseAmount` change; other props update uniforms in-place.
- `ASCIIText` — Three.js scene that renders text to a canvas texture, applies vertex wave distortion, then converts the WebGL output to ASCII characters via a `<pre>` overlay. Uses IBM Plex Mono loaded from Google Fonts.
- `GlassSurface` — SVG `feDisplacementMap` filter applied via `backdrop-filter: url(#id)` for a chromatic-aberration glass effect. Falls back gracefully on Safari/Firefox (which don't support `backdrop-filter: url()`).

**Styling** — Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no `tailwind.config.js`). Utility classes plus `var(--color-*)` tokens. Font stack: Geist (body) / Geist Mono (code).

**No routing, no state management library, no tests.** All navigation is anchor-link scroll (`href="#section-id"`). Active section highlighting uses `IntersectionObserver` in `Navbar`.

## Key conventions

- ESLint ignores unused vars matching `/^[A-Z_]/` — uppercase constants in shader/uniform code are intentionally excluded from the rule.
- Assets (`signature.png`, `profile.jpg`) are referenced from `src/assets/` via `/src/assets/` paths (works in dev; for prod builds, import them into components instead).
- Resume PDF is expected at `public/resume.pdf` for the download link in `Hero`.
