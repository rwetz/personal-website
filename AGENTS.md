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

## Layout

| Path | What lives there |
|---|---|
| `src/` | React app. Sections top to bottom: Hero, Projects, About, Experience, Skills, Contact |
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

- Hero WebGL shader panels are desktop only to keep mobile fast.
- The contact form validates and opens the visitor's mail client; there is no backend.
