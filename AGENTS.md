# Personal Website

Single-page portfolio for Ryan Wetzstein: React 19, Vite, deployed to GitHub Pages at ryanwetzstein.com.

Workspace rules live in `Dev/AGENTS.md`. This file holds only what is specific to this site.

## Design family

Neither Ferrite nor Nexis. RAW Titanium palette (`brand/heptagram/palettes/`).

## Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Preview build | `npm run preview` |
| Browser + accessibility tests | `npm run build` then `npm run test:e2e` (Edge on Windows, Chromium elsewhere) |
| Regenerate brand assets | `npm run brand` |

## Layout

| Path | What lives there |
|---|---|
| `src/stage/` | One-viewport Stage, Constellation, project data, scenes, routing and rail |
| `src/brand/` | Inline heptagram, morph silhouettes and canonical mark data |
| `src/components/` | Command palette and original About, Experience, Skills, Contact content rendered in the About modal |
| `public/` | Static assets |
| `markdown_files/` | Content sources |
| `docs/` | Notes |
| `dist/` | Build output (do not edit or commit) |
| `CNAME` | The custom domain. Do not change |

## Do not touch

- `CNAME`: changing it takes the site offline.
- Experience must stay in step with the resume.
- Pushing to `main` publishes. Do not push without being asked.

## Why it is built this way

- Site chrome, intro and About use RAW Titanium. Project stages own `--stage-*` guest palettes. Keep project colors out of site chrome.
- Hash routes (`#/nexis` etc.) work on GitHub Pages without rewrites. Legacy `#nexis` normalizes locally; it must never redirect off-site.
- The Constellation uses CSS depth and desktop pointer tilt. No WebGL or Three.js is loaded.
- Real app media only; posters under reduced motion, pause videos on hidden tabs. Record provenance in `docs/showcase-media.md`.
- Keep the detailed heptagram in sync with `docs/brand/` and the workspace brand source. `npm run brand` regenerates the favicon, PNG icons and OG image.
- The contact form validates and opens the visitor's mail client; there is no backend.
