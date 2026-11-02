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
| `src/components/` | Command palette and retained original resume-aligned content sources |
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

- Home and About use RAW Titanium with Geist Sans. The user authorized project identities to theme the complete project page, including header and rail, via `--stage-*` guest tokens.
- The five slots are Nexis, Ateru, BibleLM, Halcyra and Logscope. Design families are not projects in the showcase. Ateru and Halcyra are private; do not expose private repository links or imply an App Store release.
- Typography belongs to its context: Geist Sans for portfolio chrome, Space Grotesk for Nexis display type, blackletter/Garamond for BibleLM, rounded system type with Nunito fallback for Ateru, and a monospace title only for the Logscope terminal tool. Do not put monospace labels back into home, About or the footer.
- No shared gradient behind project screens. Use the app's flat surfaces, framing and restrained ornaments. Keep logo morphing: Nexis has a rainbow terminal mark; BibleLM resolves into a dithered book.
- Hash routes (`#/nexis` etc.) work on GitHub Pages without rewrites. Legacy `#nexis` normalizes locally; it must never redirect off-site.
- Home uses a structured five-project image gallery, with intentional desktop hover previews and compact rows on small screens. Do not restore the tiny orbiting cards. No WebGL or Three.js is loaded.
- Real app media only; posters under reduced motion, pause videos on hidden tabs. Record provenance in `docs/showcase-media.md`.
- Keep the detailed heptagram in sync with `docs/brand/` and the workspace brand source. `npm run brand` regenerates the favicon, PNG icons and OG image.
- About contains only current school progress and direct email/social links. Keep resume content, experience and skills out of the modal. Retain the Experience source data without altering it.
- Ateru's morph uses the actual default AppIcon SVG geometry. Halcyra and Logscope have decorative SVG signal/index diagrams, never fabricated live metrics.
