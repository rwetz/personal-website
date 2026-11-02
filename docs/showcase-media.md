# Showcase media

Only real application output appears in app scenes. No private source, notes,
credentials or benchmark corpora are included.

| Scene | Source | Site assets |
|---|---|---|
| Nexis | Existing `nexis-suite/nexis-showcase-video/assets/clips/terminal.mp4`; welcome poster already in this repository | `nexis.mp4`, `nexis.webm`, `nexis-thumb.webp` |
| BibleLM | Supplied 30-second recording and seven screenshots from the concurrent BibleLM polish work. Provenance: `apps/biblelm/docs/media/README.md`, also summarized in `docs/biblelm-media.md` | `biblelm.mp4`, `biblelm.webm`, `biblelm.webp`, `biblelm-thumb.webp`; supplemental screenshots retained |
| Logscope | Existing Windows release binary, running through ConPTY and xterm on 1 November 2026. Synthetic stream at 15 lines/second; no private logs | `logscope.mp4`, `logscope.webm`, `logscope.webp`, `logscope-thumb.webp` |
| Ateru | Current dated browser captures under `apps/ateru/docs/audits/2026-10-28/yearly-scenes/`: Chronicle Wrapped, studio breakdown and appearance. These are the actual app UI with a sample library and local artwork stand-ins | `ateru.webp`, `ateru-studio.webp`, `ateru-appearance.webp`, `ateru-thumb.webp` |
| Halcyra | Real synthesizer screenshot from `audio/halcyra/docs/main.png` | `halcyra.webp`, `halcyra-thumb.webp` |

All listed assets live under `src/assets/showcase/`, except the Nexis welcome
poster in `src/assets/nexis/`. `npm run thumbnails` regenerates the small intro
images from the full-size posters.

The old Logscope demo was rejected after visual inspection: it showed a missing
Linux executable and Bash interpreting the query language. The new 16-second
recording shows a live stream, `level=error`, `svc=db`, and `timeout OR refused`.
It records the existing application's actual terminal output, not a recreated UI.
There was no Rust build and no change to the private repository.

Videos are silent, looped, and encoded as fast-start H.264 MP4 plus VP9 WebM.
MP4 is preferred because a browser advertised VP9 support but failed decoding
it during QA. An error on MP4 retries WebM. Only the active scene mounts video;
desktop hover mounts a preview only on intent. Reduced motion defaults to posters
with an explicit Play action. Hidden tabs pause playback, and manual pause is
preserved on return.

BibleLM includes public-domain artwork with credits in the recorded UI and its
own art/data provenance documents. Its supplied media includes unreleased polish,
so it represents the current working tree rather than the v2.1.0 installer.
The BibleLM video was re-recorded on 2 November 2026 at native 3840 × 2160.
Both encodes are 30 seconds with 48 actual browser captures retained at their
capture times in a 30 fps stream; transitions are sampled at about 1.6 fps.
The poster and supplemental screenshots remain at 1280 × 720.

Logscope has no public repository link. Its write-up stays unpublished until
separately authorized; do not link the private source from this public site.

Ateru and Halcyra also have no private-source links. Ateru is identified as in
development, with no App Store/download claim. Its captures are browser previews
with sample data, not a claim of native device acceptance. The retired four-tab
Ateru captures in `docs/screenshots/` and `docs/ui-comparison/` were deliberately
excluded. The gallery displays the current Chronicle, studio and appearance UI
and can open each capture at full size. Halcyra shows the real Synth page rather
than a simulated instrument or invented audio performance.


BibleLM’s decorative background uses [React Bits Dither](https://reactbits.dev/backgrounds/dither),
vendored from DavidHDev/react-bits commit `4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4`.
Source and the upstream MIT + Commons Clause license are retained under
`src/components/backgrounds/`. Local changes keep settings updates in effects
respond to live reduced-motion changes, and preserve the canvas context across StrictMode effect remounts. The waves use the project palette’s
accent directly, render a still frame under reduced motion, stop while hidden,
and release GPU resources when leaving the page. No Three.js dependency is added.


The remaining backgrounds and micro interactions come from the same pinned React
Bits commit and retain the upstream license beside the source:

| Page / UI | React Bits component | Treatment |
|---|---|---|
| Home | Letter Glitch | Classic hex charset, `#61dca3` / `#61b3dc`, `#2b4539` base, spacing 0.1, density/base opacity 1, glitch amount 0.85, flow 0 |
| Nexis | Grainient | Cool project palette, restrained animated grain |
| Ateru | Threads | Coral threads behind real phone captures |
| Halcyra | Ghost Fibers | Blue fibers only; decorative SVG instrument diagrams removed |
| Logscope | Faulty Terminal | Amber `#ffb347` dots, matching the supplied customization screenshot |
| First visit | Call Chip | Actual poster decode, local font readiness and current background-module warmup; no video preload or simulated timer-based completion |
| Project dock | Rubber Segment | Stretch/squash thumb adapted to the existing accessible tabs and routing |

All effects are lazy-loaded, only the active page mounts a canvas, and GPU programs,
buffers, textures, observers and animation callbacks are cleaned up on unmount.
Local adaptations also handle live motion-preference changes and StrictMode effect
remounts. The first-visit chip is nonblocking, bounds failed warmup attempts, and
remembers successful warmup in session storage. Icons and motion reuse the site's
existing Phosphor and Framer Motion dependencies.

## Borderless pages and About (2026-11-02)

Project captures now float over the animated backgrounds without enclosing media
panels, backdrop outlines, or dock outlines. Ateru's phone sizes are unchanged.
BibleLM's mouse radius is `0.22`, down from the component default of `1`.

Logscope uses the supplied Faulty Terminal settings: scale 1.6, digit size 1.25,
speed 0.85, brightness 0.8, glow 0.6, persistence 0.5, mouse strength 0.5, mouse
glow 0.55, scramble 0.5, scanlines 0.5, glitch/flicker/noise 1, chromatic
aberration 0, curvature 0.07, vignette 0.25, mouse reaction and load animation on,
pause and light mode off. The viewport layer uses 40% opacity to keep copy readable.

About is a full page at `#/about`. Its [Flex Carousel](https://reactbits.dev/components/flex-carousel)
is vendored from the official `https://reactbits.dev/r/FlexCarousel-JS-CSS.json`
registry fetched on 2026-11-02. Source and upstream license live under
`src/components/gallery/`. OGL is loaded with the About chunk; no Three.js is added.
Local changes remove upstream demo photos, pause drawing while the document is
hidden, and retain an HTML gallery if WebGL cannot initialize. Reduced motion
uses that static gallery and responds to preference changes immediately.

The four SVGs in `src/assets/about/` are deliberately labeled placeholders,
authorized by Ryan until he supplies personal photos. They do not represent real
events or photographs. Replace their imports, alt text and carousel captions in
`src/stage/AboutPage.jsx` together when the photos arrive. No stock photos or
project screenshots are presented as personal photos.
