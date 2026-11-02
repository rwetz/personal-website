<p align="center">
  <img src="assets/logo.svg" width="128" alt="Ryan Wetzstein’s heptagram on RAW Titanium">
</p>

<h1 align="center">Personal Website</h1>

<p align="center">
  Five projects, one viewport: Ryan Wetzstein’s software and design showcase in RAW Titanium.
</p>

<p align="center">
  <a href="https://github.com/rwetz/personal-website/actions/workflows/deploy.yml"><img src="https://github.com/rwetz/personal-website/actions/workflows/deploy.yml/badge.svg" alt="GitHub Pages deployment"></a>
</p>

![The home gallery with five actual projects and the project navigation dock](docs/main.png)

Explore [ryanwetzstein.com](https://ryanwetzstein.com). The five projects are
Nexis, Ateru, BibleLM, Halcyra, and Logscope. Each page adopts its app's actual
typography, surfaces, framing and motion. Home and About use RAW Titanium and
Geist Sans.

## Features

- A structured screenshot gallery with real UI previews on intentional desktop
  hover. Mobile gets a compact five-project index.
- Hash navigation and browser history that work on GitHub Pages without rewrites.
- A heptagram that morphs into project emblems, including a rainbow terminal for
  Nexis and a dithered book for BibleLM. Reduced motion disables animated effects.
- Real, silent app recordings with posters and pause controls. Videos pause in
  hidden tabs; reduced motion starts with a poster.
- Inspectable real UI galleries for Ateru and Halcyra. Ateru's current browser
  captures use sample data; both projects remain closed source.
- Distinct app identities: Space Grotesk and workspace panels for Nexis;
  rounded coral-on-black Ateru; blackletter, Garamond and dithered crosses for
  BibleLM; instrument panels for Halcyra; terminal rules for Logscope.
- A short, focus-trapped About with current school progress and direct email,
  GitHub and LinkedIn links. The resume remains a separate download.
- Lazy project scenes, a command palette, accessible tabs and screen-reader
  announcements. No Three.js or WebGL dependency.

## Keys

| Keys | Action |
|---|---|
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> | Previous or next project |
| <kbd>1</kbd> through <kbd>5</kbd> | Jump to a project |
| <kbd>Esc</kbd> | Close a modal or return home |
| <kbd>Home</kbd> / <kbd>End</kbd> in the rail | First or last project |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> | Command palette |

Horizontal swipes and debounced wheel gestures also navigate the Stage.
Shortcuts leave editable fields and open dialogs alone.

## Install

```sh
npm ci --ignore-scripts
npm run dev
```

Use Node.js 24 or newer. The site is React 19, Vite, Tailwind 4, Framer Motion,
GSAP and Radix UI. Fonts are bundled locally and project fonts load with their
scene. Ateru uses the native rounded system face on Apple browsers and Nunito
as its bundled cross-platform fallback. No proprietary Apple fonts are hosted.

## Configuration

| Path | Purpose |
|---|---|
| `src/stage/projects.js` | Project order, copy, tags, palettes, links and posters |
| `src/stage/scenes/` | Lazy app recordings and real UI galleries |
| `src/stage/identities.css` | App-specific type, surfaces, marks and framing |
| `src/stage/refinements.css` | Gallery, project dock, short About and SVG scene treatments |
| `src/stage/stage.css` | One-viewport layout, RAW Titanium chrome and responsive rules |
| `src/brand/` | Detailed heptagram and simple morph silhouettes |
| `src/components/Experience.jsx` | Resume-aligned experience data |
| `public/resume.pdf` | Downloadable resume |
| `docs/showcase-media.md` | Capture sources and playback behavior |
| `public/CNAME` | Production domain; do not change |

Project URLs use `#/nexis`, `#/ateru`, `#/biblelm`, `#/halcyra`, and
`#/logscope`. `#/` is home. Old `#nexis` bookmarks normalize to the local Stage.

## Development

```sh
npm run lint
npm run brand       # regenerate favicon, PNG icons and OG image
npm run thumbnails  # regenerate small intro images from real posters
npm run build
npm run test:e2e    # production preview, layouts, inputs, media and axe scans
npm run preview
```

The browser suite uses installed Edge on Windows. On other platforms install
Chromium once with `npx playwright install chromium`. Tests cover 360×640,
768×1024, 1440×900 and landscape 844×390, plus history, roving focus, swipe,
wheel, modal behavior, command navigation, real video decoding and reduced motion.

Pushing to `main` publishes through [GitHub Actions](.github/workflows/deploy.yml).
The workflow installs the lockfile, rejects high/critical dependency audit findings,
builds, lints, runs the browser/accessibility suite, and deploys `dist/` to GitHub
Pages. Documentation-only pushes are ignored. Generated build output stays untracked.

## License

This repository does not currently declare a project license. Dependencies retain
their own licenses; captured artwork retains its documented public-domain status.

---

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/brand/heptagram-white.svg">
    <img src="docs/brand/heptagram-black.svg" alt="heptagram" width="48">
  </picture>
</p>
