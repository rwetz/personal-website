# Creative pass: critique and plan

Branch `redesign/creative-pass`. Same criteria are used before and after, scored 1–10.

## Criteria

1. **Immersion**: does each project feel like stepping into its own world?
2. **Motion between worlds**: does moving from one project to the next feel like travel, or like a page swap?
3. **Background as an instrument**: are the WebGL backgrounds felt, discoverable and interactive, or just wallpaper?
4. **Home as a preview of the worlds**: does home foreshadow the theme switching?
5. **About**: does it feel finished, personal and part of the same site?
6. **404**: is it memorable, on brand, and still useful?
7. **Small screens and accessibility**: does any of it cost mobile, reduced motion or the a11y suite?

## Before

| # | Score | Notes |
|---|---|---|
| 1 | 7 | Theme, fonts, header and dock all change per project. That part is strong. But every project uses the same composition: copy at left, media at right. The worlds change colour without changing shape. |
| 2 | 4 | A hard cut. The old canvas unmounts, the new one pops in, and only the page colours crossfade. Nothing marks the move from one world to the next. |
| 3 | 4 | The effects respond to the cursor and to clicks (tear, swirl, ripple, pulse, glitch), but they run at 30–55% opacity behind a dense layout. Nothing says you can play with them. Nexis's Grainient is barely visible. |
| 4 | 6 | The gallery is clean and readable. The tiles are all the same grey chrome, though, and the project colour shows only in a tiny arrow. Home gives no hint that each project re-themes the site. |
| 5 | 4 | The hero is good. The rest is four grey "Personal photo" placeholders taking most of the page, then a contact block. There is no background, so it's the only page outside the "world" system. A real headshot (`profile-960.webp`) sits unused in the repo. Little personality. |
| 6 | 3 | Static text page with a link list. The existing plan (`docs/404-game-plan.md`) is a heptagram endless runner, which is still a dinosaur clone in a new costume. |
| 7 | 8 | Good. Mobile reflows, reduced motion is honoured, and the tests are thorough. Code health: three stacked CSS files override each other (`stage.css` → `identities.css` → `refinements.css`), with dead selectors and unused `SceneArtwork` / `AboutModal`. |

## Plan

### Project worlds

- **Iris transition.** The new world's background opens as a circle from the dock tab you chose (or from screen centre when you use the keyboard or a swipe). Travel, not a swap. Turns into a plain fade under reduced motion.
- **Immerse mode.** An "Immerse" button on each project fades the copy and the chrome. The background rises to full strength and the media takes the whole stage. A small hint says what the background does ("drag to swirl", "click to ripple"…). This makes "projects take up the whole page" literal and makes the backgrounds something you can find and play with.
- **Depth.** On fine pointers with motion allowed, the media tilts a few degrees towards the cursor and the background drifts the other way, so foreground and world read as layers.
- **Neighbour peeks.** On wide screens, slim edge links name the previous and next project in their own accent colour, which makes the sequence visible.
- **Stronger backgrounds.** Raise the effect opacity where it reads as muddy (Nexis, BibleLM), but never behind copy at a strength that hurts reading.

### Home

- Hovering or focusing a tile tints the Letter Glitch field to that project's accent, and the tile picks up an accent edge. Home now previews the theme switch. It's a flat colour blend, not a gradient.

### About

- Use the real headshot in the hero.
- A live degree progress bar: today's position between Fall 2023 and May 2027 graduation, with months remaining computed from the date.
- A campus-time clock (NDSU, Fargo, Central Time).
- Copy-email button alongside the mailto link, with a toast.
- A "Things I'm building" strip of the five emblems linking to each project. That's work, not resume content.
- About gets its own world: a large, slowly turning heptagram line drawing that parallaxes with the pointer. It stays static under reduced motion.
- Photos stay as the existing Flex Carousel and placeholders, now placed below the personal content.

### 404: "Lost in the Constellation"

The home gallery is called the Constellation, so the lost visitor is lost *in* it.

- The page opens with **404** spelled out in stars. Back to work stays visible at all times.
- **One button, orbit and release.** Your heptagram orbits a star. Tap, click or press Space to let go, and it flies off on the tangent. Pass through another star's ring and you're captured into its orbit. Miss and drift off-screen, and the signal is lost.
- **The worlds are the levels.** Every seven stars you cross into the next sector: Nexis, Ateru, BibleLM, Halcyra, Logscope. The game re-themes its stars, field and colours the same way the site does. Later sectors bring tighter rings, faster orbits, counter-rotation and drifting stars.
- Score is stars reached. The best score is stored locally with a fallback, and there are no network calls.
- Vanilla Canvas 2D with a fixed timestep and a seeded generator (`?seed=`). It pauses on hidden or blurred tabs and has a visible pause button. Its own Vite entry emits `dist/404.html`, so portfolio routes never load game code.
- Reduced motion: no trail or particles, and the camera moves only when you're captured. Every message and control is HTML. The canvas is decorative and announcements go through a live region.

### Kept unchanged

Resume and experience data, `CNAME`, hash routing contract, project slots, typography rules, real-media only, the rubber dock and warmup chip.

## After

| # | Before | After | Notes |
|---|---|---|---|
| 1 | 7 | 8.5 | Immerse turns any project into a full-page world. Depth tilt links the screen to its field, and edge peeks name the neighbours in their own colours. **Still true:** all five use the same copy-left/media-right composition when not immersed. |
| 2 | 4 | 8 | Each world opens as an iris from the tab, tile or edge link you used, with a thin accent ring travelling ahead of it. Keyboard and swipe travel open from the centre. **Still true:** the outgoing field cuts out under the iris instead of dissolving, and the copy uses one shared entrance for every project. |
| 3 | 4 | 7.5 | In Immerse the field runs at 85% and a hint says what it does ("Click to send a ripple"). Nexis and BibleLM are stronger everywhere. **Still true:** outside Immerse nothing hints that the fields are interactive, and phones (≤540px) don't get Immerse. |
| 4 | 6 | 7.5 | Hovering or focusing a tile washes the glitch field in that project's colour, so home now previews the re-theme. Tiles get an accent edge and glow. **Still true:** Ateru's red wash is the loudest of the five. |
| 5 | 4 | 8 | Real portrait, a live degree meter (Freshman → May 2027, months remaining), campus time in Fargo, a five-emblem "What I'm building" strip, copy-email, and its own world (an engraved heptagram turning slowly). Placeholders now come last. **Still true:** the photos are still placeholders. |
| 6 | 3 | 9 | *Lost in the Constellation*: 404 spelled in stars, a one-button orbit-and-release game, and five project worlds as levels, each with its own field pattern, ring style and emblem stars. Home is the heptagram at star 35. Seeded, bot-verified as winnable, and it pauses on blur. Its own 5 kB entry loads the 8 kB game only when you press Play, with no React. **Still true:** GitHub Pages' real 404 path can only be checked after deploy, because `vite preview` falls back to the SPA. |
| 7 | 8 | 8 | 27/27 browser and axe tests pass, 3 of them new (Immerse, About, the 404 game in idle/paused/over states). Axe caught two real issues during the pass: faded chrome in Immerse failed contrast, and the pause overlay blocked the HUD. Both are fixed. **Debt went up a little:** a fourth CSS layer (`worlds.css`), and `SceneArtwork` / `AboutModal` are still unused. |

## Second-pass candidates

1. Give each project its own composition when not immersed: Ateru's phones fanned at centre stage, Logscope as a full-width terminal, BibleLM as a two-page spread. This is the biggest remaining gap in criterion 1.
2. Let the outgoing world dissolve or pixel-scatter beneath the iris instead of cutting.
3. Immerse on phones as a floating control, and a one-time "this field is interactive" hint outside Immerse.
4. Fold `stage.css` → `identities.css` → `refinements.css` → `worlds.css` into one ordered sheet, and delete `SceneArtwork` and `AboutModal`.
5. Real photos for About.

## Pass two

What changed:

- **Compositions.** On screens at least 1100 × 700, four worlds take the shape of their app. Nexis keeps the canonical split. Ateru leads with its phones fanned like cards, with the copy on the right. BibleLM is an open book: the copy is a centred verso, the demo the recto, with an accent spine between. Halcyra is a rack unit: the copy is a faceplate across the top and the synth fills the bay below. Logscope gives the terminal the screen, and the copy becomes its status line. Smaller screens keep the stacked layout they had.
- **Dissolve.** The world you leave stays mounted for 1.1 s and blurs, desaturates and fades under the incoming iris. It keeps its React key, so no field is torn down and rebuilt. Under reduced motion it is removed at once.
- **Immerse.** Entering or leaving now morphs the media into place with a view transition where the browser supports one. Every composition collapses to one cell, so Immerse works for all of them.
- **Phones.** Immerse is a round floating control above the dock, and its hint sits at the top of the stage.
- **Discovery.** Once per browser session, the first project you open says what its field does ("Move to bend the fibers…") and suggests Immerse, then fades. It is skipped under reduced motion.
- **Debt.** Deleted `SceneArtwork`, `AboutModal` and about 55 lines of CSS for decorations that no longer render.

| # | Pass one | Pass two | Notes |
|---|---|---|---|
| 1 | 8.5 | 9.5 | The worlds now change shape, not just colour: a fan of phones, a book spread, a rack unit and a terminal. **Still true:** Nexis uses the shared split, on purpose, as the baseline. |
| 2 | 8 | 9 | The old world dissolves beneath the new one's iris, and Immerse morphs instead of jumping. **Still true:** the copy uses one shared entrance for every project. |
| 3 | 7.5 | 8.5 | A first-visit note says what the field does, and phones get Immerse. **Still true:** the note appears once per session, by design. |
| 4 | 7.5 | 7.5 | Unchanged. |
| 5 | 8 | 8 | Unchanged. Needs your photos. |
| 6 | 9 | 9 | Unchanged. |
| 7 | 8 | 8.5 | 28/28 tests pass, one of them new (compositions at 1440 × 900, phone Immerse with an axe scan). Less dead code. **Still true:** four stacked stylesheets. Merging them is a mechanical refactor best done on its own. |
