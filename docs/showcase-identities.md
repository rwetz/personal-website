# App identities

The showcase presents five actual projects: Nexis, Ateru, BibleLM, Halcyra and
Logscope. The two former design-family specimens have been replaced. Home and
About remain RAW Titanium and Geist Sans; a project owns the complete visible
project canvas, including its header and rail.

| App | Owning design source | Treatment |
|---|---|---|
| Nexis | `nexis-suite/Nexis/src/main.tsx`, `src/styles/globals.css` | Geist interface, Space Grotesk display, flat workspace panels, smooth transitions and a rainbow terminal emblem |
| Ateru | `apps/ateru/app/src/theme/tokens/color.ts`, `type.ts`, `appearance.ts` | Exact neutral black tiers and coral, rounded heavy display type and pill controls; actual sample-library UI gallery |
| BibleLM | `apps/biblelm/docs/DESIGN.md`, `src/app/theme.ts` | Nocturne lamp black, bone and gilt; UnifrakturMaguntia display, EB Garamond prose, thin print rules, dithered cross and book emblem |
| Halcyra | `audio/halcyra/source/ui/Theme.h` | Neutral instrument panels, blue accent, strong wordmark, restrained waveform decoration and real Synth capture |
| Logscope | Actual terminal demo and `finished/logscope/docs/TUI-DESIGN.md` | Plain terminal rules, restrained monospace title, readable sans interface and actual recorded output |

App fonts load with lazy scenes. Home, About, labels and footer use Geist Sans.
Ateru requests SF Pro Rounded where available; Apple browsers can use the native
`ui-rounded` face. Nunito Sans is bundled as the rounded fallback elsewhere. No
proprietary Apple font files are redistributed. Font licenses accompany the
deployment under `public/font-licenses/`.

The shape morph remains GSAP MorphSVG. Nexis's terminal frame, prompt and cursor
use the app's spectrum colors, with a slow hue cycle in ordinary motion mode.
BibleLM's open-book mark has curved leaves, a distinct spine, engraved text
lines and a cross. An 8×8 ordered-print mask adds grain toward the lower page
edges while keeping the upper outline solid and readable at the actual 40px
size. The solid portion of that mask animates with the morph, so leaving the
book resolves out of dither.
The detailed heptagram returns at home. A Ferrite rhombus silhouette remains
reserved in the emblem data for a future actual Ferrite app; it is not a sixth
project or a restored design-family slot.

Reduced motion swaps shapes and dither directly, leaves the rainbow static,
removes drift/tilt, and keeps recordings paused until the visitor explicitly
plays one. Decorative crosses, waveform lines and glyphs are hidden from
assistive technology.

## Visual references

- [Developer portfolio collection](https://dribbble.com/tags/developer-portfolio):
  used to explore type hierarchy, more generous spacing and product-led imagery.
- [Montgomery by Taras Migulko](https://dribbble.com/shots/27613722-MONTGOMERY-Webflow-view):
  a useful reference for an editorial type hierarchy and clear positioning.
- [Minimalist personal website by Andrei Hudovich](https://dribbble.com/shots/26624656-Minimalist-personal-website-for-a-freelancer):
  a reference for restrained presentation and giving the work room to breathe.
- [Vercel Geist](https://vercel.com/font): Geist Sans is the portfolio's neutral
  voice. Its mono sibling belongs to code/terminal contexts, not site furniture.

These are direction references. No portfolio templates, imagery, personal claims
or statistics were copied from the references.

## Local validation

All 15 browser checks pass across 360×640, 768×1024, 1440×900 and 844×390,
including actual project font loading, normal/reduced motion, the dither mask,
capture dialogs, gallery selection, real video decoding and caption visibility.
axe scans pass on every project, the capture dialog, each About section and the
command palette. Lint and the production build pass.

The final local mobile Lighthouse run scored 100 for performance, accessibility,
best practices and SEO: FCP/LCP 0.9 seconds, TBT 0 ms, CLS 0.001. The dependency
audit has no high/critical findings; the 12 existing low/moderate tooling findings
remain. Real-device Safari/native acceptance is not claimed by these checks.
