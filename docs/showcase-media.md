# Showcase media

Only real application output appears in app scenes. No private source, notes,
credentials or benchmark corpora are included.

| Scene | Source | Site assets |
|---|---|---|
| Nexis | Existing `nexis-suite/nexis-showcase-video/assets/clips/terminal.mp4`; welcome poster already in this repository | `nexis.mp4`, `nexis.webm`, `nexis-thumb.webp` |
| BibleLM | Supplied 30-second recording and seven screenshots from the concurrent BibleLM polish work. Provenance: `apps/biblelm/docs/media/README.md`, also summarized in `docs/biblelm-media.md` | `biblelm.mp4`, `biblelm.webm`, `biblelm.webp`, `biblelm-thumb.webp`; supplemental screenshots retained |
| Logscope | Existing Windows release binary, running through ConPTY and xterm on 1 November 2026. Synthetic stream at 15 lines/second; no private logs | `logscope.mp4`, `logscope.webm`, `logscope.webp`, `logscope-thumb.webp` |
| Ferrite / Nexis design | Canonical palette sheets from `brand/heptagram/palettes/` | `ferrite.svg`, `nexis-design.svg` |

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

Logscope has no public repository link. Its write-up stays unpublished until
separately authorized; do not link the private source from this public site.
