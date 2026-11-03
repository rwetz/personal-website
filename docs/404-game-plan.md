# 404 game: Lost Signal

Status: superseded. The shipped 404 is "Lost in the Constellation" (`404.html`, `src/lost/`), an orbit-and-release game across the five project worlds. See `docs/redesign-critique.md`. The accessibility, entry and testing requirements below still apply.

## The idea

A small endless runner on the missing-page screen. A pixel rendition of Ryan's
heptagram rolls along a faint baseline and hops over broken brackets, missing
blocks and gaps in the signal. Quiet RAW Titanium colors, one action, instant
restart. It should feel like a tiny part of this portfolio, not a dinosaur clone.

The page starts with **404 / Lost signal**, a short explanation, **Back to work**
and **Play**. The game never starts automatically. The return link remains visible
during play and after a collision. No fabricated error logs, accounts or audio.

## Play

- Space, Arrow Up, or a large touch button jumps. A short press makes a short hop;
  holding extends it slightly. Prevent page scrolling only while the game owns focus.
- One obstacle family at first. Add alternating short and tall blocks only after
  the player has cleared several obstacles.
- Speed rises gently, then caps. Spawn spacing is based on the current speed and
  jump time so every generated sequence is possible. Collision boxes are slightly
  smaller than the visible art. A jump pressed just before landing is buffered.
- Distance is the score. Store the personal best locally, with an in-memory
  fallback when storage is unavailable. No network calls or leaderboard.
- A collision freezes the scene and offers **Try again** and **Back to work**.
  Pause when the tab is hidden, on window blur, or through a visible Pause button.

## Delivery

1. Build a separate, lightweight 404 entry with semantic HTML around a Canvas 2D
   game. Generate the pixel mark from the existing heptagram geometry. No WebGL,
   physics package, game framework or external image downloads.
2. Add that entry to Vite's build and verify it emits `dist/404.html`. GitHub Pages
   serves this for missing paths. Use absolute asset paths so `/missing/nested/path`
   works, and preserve the site's `CNAME`.
3. Share the game component with an explicit `#/404` preview route for review.
   Unknown hash routes may show the same screen later, but that changes today's
   home-fallback contract and must be done deliberately with updated routing tests.
4. Lazy-load game code only after Play. Use a fixed simulation timestep with a
   capped catch-up budget, a seeded obstacle generator for testing, and a canvas
   sized for its container and device pixel ratio.
5. Keep normal portfolio entry points free of game code. Ship the 404 entry and
   its assets in the same Pages artifact as the portfolio.

## Accessibility and small screens

The missing-page message, home link, instructions, score and controls are HTML.
The decorative canvas is hidden from assistive technology. Announce start,
pause, collision and final score, never every frame. There is no focus trap or
keyboard shortcut outside the game. At least 44px touch targets, visible focus,
and enough contrast on all controls.

Reduced motion opens the static error page. Play stays an explicit opt-in and
uses a stationary camera, no parallax, shake, flashes or trails. The useful action,
returning to the site, never depends on playing. An unsupported canvas leaves the
complete static 404 page available.

## Checks before shipping

- A real missing URL returns HTTP 404 and renders usable HTML with working assets.
- The normal home, project and About routes keep working, including direct links.
- Keyboard, pointer and touch can start, jump, pause and restart without moving
  portfolio navigation or scrolling the page unintentionally.
- The same seed and inputs produce the same collision and score; test jump
  buffering, maximum-speed obstacle spacing and restart state.
- Hidden tabs and unmounts stop the animation loop; repeated restarts create no
  extra loops or listeners. Storage failure does not break Play.
- Check 360px mobile, short landscape and desktop; run accessibility scans on
  idle, playing, paused and game-over states.

## Scope

First version: one runner, one biome, two block heights, score, best, pause and
restart. Leave sound, collectibles, skins, power-ups and online scores out. Build
the core loop first, tune its feel in the browser, then wire the real 404 entry.
