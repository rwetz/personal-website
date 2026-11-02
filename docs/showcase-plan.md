# Showcase redesign plan: The Stage with a Constellation intro

Goal: the home page fits in one viewport (100dvh). Five projects, each one click, hover or keypress away. Drama comes from motion and depth, not page length. Site chrome stays RAW Titanium; each project's stage borrows its own language.

## As built: 1 November 2026

All five defaults were accepted. The five build phases are implemented;
the user subsequently authorized pushing after double-checking the work.

- Foundation: hash routes, old `#nexis` normalization, history, theme variables,
  rail, arrows, number keys, Escape, horizontal swipe and debounced wheel input.
- Brand/chrome: canonical detailed mark, GSAP silhouette morphs for all five
  emblems, home links, favicon, maskable PNG icons, OG image and standalone 404.
- Scenes: real Nexis, BibleLM and freshly recorded Logscope clips; interactive
  Ferrite and Nexis design specimens. Capture provenance is in
  [showcase-media.md](showcase-media.md).
- Constellation: CSS depth, pointer tilt, drift, expanding desktop hover previews,
  shared image transitions and a static mobile arrangement. The optional old
  WebGL shader was removed; CSS gradients and orbit lines provide the atmosphere.
- About: original biography, experience, skills and validated contact form reused
  in a lazy, focus-trapped modal. Resume and experience data were preserved.
- Gates: production build, lint, high/critical dependency audit gate, automated
  keyboard/media/layout/axe checks, visual review and local mobile Lighthouse.

Implementation details: the palette host uses root `--stage-*` variables while
Titanium chrome uses independent `--t-*` variables. The URL itself is the external
state store. Morphing runs in the persistent corner mark; the central detailed
mark anchors the intro and the shared project object carries the enter transition.
This keeps the complete detailed mark out of path interpolation. No canvas or
WebGL renderer is needed for the current intro. Fonts use bundled Geist/Geist
Mono and the Bible scene's serif stack, without a third-party font request.

The Logscope write-up remains unpublished and no private repo link is exposed.
The old Logscope recording was unusable and was replaced after inspection.
BibleLM's supplied recording shows current, unreleased polish, as its capture
notes explicitly document. MP4 is preferred over WebM after an actual VP9
decoder failure was caught in browser QA.

### Validation

- Clean `npm ci --ignore-scripts`, lint and production build passed.
- All 14 Playwright checks passed, including every project at 360×640,
  768×1024, 1440×900 and landscape 844×390, plus normal and reduced motion.
- axe reported no WCAG A/AA violations across all stages, every selectable
  specimen swatch, About and the command palette. This is automated coverage,
  not a claim of a manual assistive-technology audit.
- All three videos decoded and advanced. Visibility pausing, explicit pause,
  swipe, wheel, history, dialog behavior and logo transitions were exercised.
- Final local Lighthouse mobile simulation: 100 performance, 100 accessibility,
  100 best practices, 100 SEO; FCP/LCP 0.9 seconds, TBT 0 ms, CLS 0.
- Initial home JavaScript measured 103.9 kB gzip, under the 150 kB target.
- The deployment audit gate passes with no high or critical findings. There
  are 12 remaining low/moderate toolchain findings; no forced major downgrades
  were applied.
- `CNAME`, resume PDF and the Experience data were unchanged. Real phone and
  Safari checks remain outside this desktop browser validation.

The deployment workflow now runs lint and browser/accessibility checks before
uploading the Pages artifact. Documentation-only pushes are ignored.

## Decisions to confirm

| # | Question | Default if no answer |
|---|---|---|
| 1 | Replace the current scrolling site, or add the Stage as `/` and keep the old sections reachable? | Replace. Resume content moves to the About modal plus `resume.pdf` |
| 2 | Which five projects? | Nexis, BibleLM, Logscope (apps); Ferrite, Nexis design (design families). See "Content" |
| 3 | Logscope is private, so no repo link | "Write-up" link to `logscope-showcase` once it has a remote; until then show media only |
| 4 | Constellation: CSS 3D or Three.js? | CSS 3D + canvas 2D. No Three.js (bundle, mobile cost) |
| 5 | Experience must stay in step with the resume (AGENTS.md) | Keep the data, render it only inside the About modal |

## Architecture

Keep: React 19, Vite, framer-motion (LazyMotion), GSAP, Tailwind 4, Radix dialog, cmdk palette, sonner. Drop: scrolling sections (Projects, Experience, Skills as page bands).

```
src/
  App.jsx                  shell: <Intro/> -> <Stage/>, <Rail/>, <AboutModal/>, palette host
  stage/
    projects.js            single source of truth: id, kind, palette, tagline, tags, links, media
    useStage.js            state machine: intro | stage(id) | transitioning; syncs URL
    Intro.jsx              Constellation
    Stage.jsx              full-screen active project, owns theme morph
    Rail.jsx               bottom tabs 1-5 (side rail on landscape phones)
    scenes/                one component per project's hero moment
      NexisScene.jsx  BibleLmScene.jsx  LogscopeScene.jsx
      FerriteScene.jsx  NexisDesignScene.jsx   (specimens)
    Specimen.jsx           click-to-retheme swatch + type sample
  brand/Heptagram.jsx      inline SVG mark, see "Heptagram"
  lib/theme.js             applies a palette as CSS variables on :root with a transition
```

### Routing and state
- Hash routes, since GitHub Pages has no rewrites: `#/nexis`, `#/biblelm`, ... and `#/` for the intro. `public/404.html` already exists as the fallback.
- `useStage` is a small reducer. URL is the source of truth; `hashchange` drives state, so back/forward and deep links work.
- Existing `#nexis` redirect to `nexisdev.org` in `App.jsx` must go: Nexis becomes a real stage. Replace with a plain "Launch" link.
- Input: arrow keys, 1-5, Esc (back to intro), swipe (pointer events), wheel with a debounce.

### Theme morph
- Each project defines a palette object (bg, fg, accent, font stack, radius). `theme.js` writes CSS variables on `:root`; a 600 ms CSS transition on `background`, `color`, `border-color` does the morph.
- Background layer is a separate element cross-faded per scene (gradient, grain, shader), so the morph never repaints text.
- Fonts: preload only the active and adjacent projects' fonts; Geist (already bundled) is the fallback.

### Constellation intro
- Five objects absolutely positioned in a perspective container (`perspective: 1200px`), each `transform: translate3d(...)` plus slow CSS keyframe drift.
- Cursor tilt via one rAF loop writing `--rx/--ry` to the container; objects read them with different depth multipliers.
- Hover: object expands in place to a looping preview (muted `<video>` or CSS-animated UI).
- Click: shared-element transition into the stage. Use framer `layoutId` on the object, then fade the stage content in behind it.
- Desktop only for tilt and hover-expand. Mobile gets a static arranged cluster with tap-to-enter.
- The existing hero WebGL shader (`ShaderPanel`, `lib/shaders.js`) can become the intro's ambient background on desktop. Keep it desktop-only per AGENTS.md.

### Content (one sentence + 3 tags per project)
- **Apps**: Nexis, BibleLM, Logscope. Real UI only: recorded loop of the actual app (webm + mp4, poster fallback). Nexis already has screenshots in `src/assets/nexis/`; BibleLM and Logscope need captures (`finished/logscope-showcase/media`, BibleLM `docs/`).
- **Design families**: Ferrite (17 repos, Molten Iron) and Nexis design (Frosted Glass). Living specimen: swatch row plus type sample; clicking a swatch re-themes the whole page. This reuses the palettes in `brand/heptagram/palettes/*.css`.
- Order: Nexis, Ferrite, BibleLM, Nexis design, Logscope (interleaved so the palette morph alternates app, system, app, system, app).
- About modal (corner button, also in the command palette): photo, short bio, experience, skills, resume download, contact form (existing validation + mailto, no backend).

### Accessibility and performance
- `prefers-reduced-motion`: no drift, no tilt, no morph transition; instant swaps with opacity fade only. Already handled by `MotionConfig reducedMotion="user"`, extend to CSS via media query.
- Rail is a `tablist` with roving tabindex; stage is a labelled `tabpanel`; focus moves to the stage heading on change; live region announces the project name.
- Videos: `preload="none"` off-screen, pause on tab hidden, no autoplay under reduced motion (poster only).
- Budget: first view under ~150 kB JS gzip excluding scene chunks; scenes lazy-loaded via `React.lazy`, adjacent scene prefetched.
- `100dvh` and safe-area insets so mobile browser chrome does not clip the rail.

## Heptagram integration

Source of truth: `brand/heptagram/heptagram-{white,black}.svg` (1024x1024). The repo already has copies at `docs/brand/`. Rules from `brand/README.md`: copies not links, mark ends the README.

| Where | Treatment |
|---|---|
| Corner wordmark (top-left, persistent) | Small mark in `currentColor`, replaces the signature in the navbar; click returns to the Constellation. On stage change it re-tints with the palette |
| Constellation center | Large, low-contrast mark as the anchor the five objects orbit. Slow rotation, stroke-draw on first load. This is the site's signature moment |
| Transition | The mark morphs into the next project's emblem (see "Logo morph"), acting as the loading beat while the scene mounts |
| Rail | Mark as the "home" slot to the left of tabs 1-5 |
| Favicon, PWA, OG | Regenerate `public/favicon.svg`, `manifest.json` icons and `og-image.png` from the mark on the Titanium void |
| Loading / 404 | Mark centered on `public/404.html` |
| README footer | Already present; keep |

Implementation: `src/brand/Heptagram.jsx` inlines the SVG path with `fill="currentColor"`, so it inherits the active palette and needs no second file for white/black. Copy the path data from `brand/heptagram/heptagram-white.svg` into the component and add a comment pointing at the source. If the mark changes in `brand/`, update the component and `docs/brand/` together. The mark is a filled path, so the stroke-draw intro is a mask reveal (clip-path wipe or SVG mask), not a stroke animation.

### Logo morph

The heptagram is the one persistent object; it becomes each project's emblem on the way in and returns on the way out. The mark is both the site's identity and the transition itself.

- **Intro to stage**: the clicked Constellation object and the center mark fuse, the mark morphs into that project's emblem (Nexis prompt/caret glyph, BibleLM open-book or page, Logscope log-line stack or cursor, Ferrite ingot/spark, Nexis design glass tile), then scales to the corner slot while the stage fades in.
- **Stage to stage**: emblem A morphs directly to emblem B through the corner/center slot; palette variables change at the same time so shape and color move together.
- **Back to intro**: emblem morphs back into the full heptagram at center, objects re-emerge around it.
- **Idle**: on the intro the mark slowly breathes (the seven points sequentially brighten), and on hover over a Constellation object the nearest point lights up.

Implementation notes:
- The full mark is a dense multi-subpath fill, which interpolates badly. Build a **simplified 7-point heptagram outline** (single closed path, same point count as each emblem path) purely for morphing. At rest, crossfade to the full detailed mark.
- Tooling: GSAP 3.14 is already a dependency and `MorphSVGPlugin` is free since 3.13; use it, with `shapeIndex`/`origin` tuned per pair. Fallback: `flubber` (small) if MorphSVG proves fussy.
- Emblems live in `src/brand/emblems.js` as path data normalized to the same 1024 viewBox and point count. Draw them as simple single-path glyphs so they morph cleanly.
- Duration about 700 ms, eased; runs alongside the 600 ms palette morph. Reduced motion: no morph, direct swap with a 150 ms fade.
- Mobile: same morph (it is a single SVG path, cheap), no tilt or shader.

## Build phases

1. **Foundation**: `projects.js`, hash routing, `useStage`, theme morph, Rail, keyboard and swipe. Placeholder scenes with static screenshots. Verify one-viewport fit at 360x640, 768x1024, 1440x900.
2. **Heptagram + chrome**: `Heptagram.jsx`, simplified morph outline and first two emblems, corner mark, rail home slot, favicon/OG regeneration, About modal (move existing About, Experience, Skills, Contact in).
3. **Scenes**: Nexis (looping capture), then BibleLM, Logscope, then the two specimens with click-to-retheme.
4. **Constellation intro**: objects, drift, tilt, hover-expand, shared-element enter. Mobile static fallback.
5. **Polish and gates**: reduced-motion pass, keyboard/screen-reader pass, Lighthouse mobile, video weight audit, remove dead code (`improvements.md` lists several unused components), `npm run lint` and `npm run build` clean.

Nothing is pushed to `main` without being asked (pushing publishes). Work on a branch; preview with `npm run preview`. Do not touch `CNAME`.

## Risks

- **Asset capture is the long pole.** Real-UI loops for BibleLM and Logscope must be recorded; the build can proceed with screenshots meanwhile.
- **Hash routing vs GitHub Pages**: fine, but link previews show the root OG image for every project. Acceptable; per-project OG would need separate HTML files.
- **Constellation scope creep.** Ship phase 1-3 as a complete, usable site first; the intro is additive.
- **Palette conflict**: AGENTS.md says the site's design family is RAW Titanium. Keep Titanium for the chrome, intro and About; project stages are guests. Update AGENTS.md if this changes.
