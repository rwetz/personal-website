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
- Home scrolls: a full-height hero on the Letter Glitch field (name and one factual line, no button), then "Why I build", Ryan's personal statement (his words, lightly edited with his approval; change it only when he asks), then a plain text Work list with small thumbnails, then a link row (GitHub, Papers, email). No project cards, numbering, eyebrow labels or ↗ arrows. On home, Up/Down scroll the page; Left/Right still step through projects. Each page lazy-loads its own React Bits WebGL2 background; no Three.js is loaded. Home uses Letter Glitch; Nexis Grainient; Ateru Threads; BibleLM Dither; Halcyra Ghost Fibers; Logscope Faulty Terminal. Keep effects behind translucent previews, matched to project colors, static under reduced motion, and paused on hidden tabs.
- Real app media only; posters under reduced motion, pause videos on hidden tabs. Record provenance in `docs/showcase-media.md`.
- Keep the detailed heptagram in sync with `docs/brand/` and the workspace brand source. `npm run brand` regenerates the favicon, PNG icons and OG image.
- About is a full page at `#/about`, with a short factual bio, direct email/social links and a React Bits Flex Carousel of placeholder frames (`src/assets/about/photo-0N.svg`) until Ryan adds his photos to `photos` in `AboutPage.jsx` (no clock, no degree meter, no 404 link). Keep resume content, experience and skills out of About. Retain the Experience source data without altering it.
- Ateru's morph uses the actual default AppIcon SVG geometry. Halcyra and Logscope use only their animated backgrounds, with no decorative SVG diagrams. Captures float without enclosing panels; preserve Ateru phone sizes and the borderless rubber dock.

- The bottom project dock adapts React Bits Rubber Segment while retaining tab semantics and arrow/number/Escape navigation. Keep the rubber thumb decorative and obey reduced motion.
- Asset warmup preloads real posters, fonts and the current background once per browser session, silently (no chip or status text). Never download videos or initialize inactive GPU effects as part of warmup.
- Worlds crossfade: the next field fades in while the outgoing one dissolves (no expanding circle or ring; the user removed it). Immerse (footer toggle, Escape leaves it) hides the copy and lets the field and media take the stage, with no tips shown inside it. Never fade chrome below AA contrast. Depth tilt is fine-pointer and motion-allowed only. Hovering or focusing a home Work row recolours only the Letter Glitch glyphs (Nexis as a spectrum); the field's behaviour, background and opacity do not change.
- About shows the real portrait and the five project emblems. About's world is an SVG line heptagram, not WebGL.
- The 404 is an Easter egg: never link to it from the site. It is its own Vite entry (`404.html`, `src/lost/`): "Lost in the Constellation", vanilla Canvas 2D, game code loaded only on Play, `?seed=` for tests. Orbits decay on a fuse, static sits beside (never on) the line between stars, upcoming stars pull flights from Ateru on, and three perfect catches raise a one-hit shield. The aim line uses the same flight step as play, and `snapshot().aim` is what the test autopilot follows; seeds 7, 11, 23, 42 and 99 reach home. Back to work must stay visible in every state.
- Phones must keep every necessary flow working by touch (`tests/mobile.spec.js`): the Resume link stays in the phone header, Immerse floats bottom-left (or at the foot of the side dock in landscape), and short landscape screens fit the stage instead of scrolling it.
- Wide screens (1100 × 700 and up) give each project its own composition: Nexis split, Ateru phones-first fan, BibleLM book spread with a spine, Halcyra faceplate over the synth, Logscope terminal with a status line. Immerse collapses any of them to one cell. The outgoing world dissolves but keeps its React key; never remount a field during travel.

## Copy

Write plainly and specifically. No slogans, eyebrow labels above headings, groups-of-three phrasing, or keyboard/interaction hints in the UI. Taglines state concrete facts from the project's own README (sizes, counts, benchmarks). Tags are a plain dotted line, and their count varies with the project.
