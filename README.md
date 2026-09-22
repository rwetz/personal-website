# Personal Website

Single-page portfolio for Ryan Wetzstein, built with React 19 and Vite, deployed to GitHub Pages at [ryanwetzstein.com](https://ryanwetzstein.com).

## Sections (top to bottom)

1. **Hero** — name, status badge, primary actions, and three decorative WebGL shader panels (desktop only)
2. **Projects** — Nexis as a full-width featured card with a screenshot, then four supporting projects in a 2×2 grid
3. **About** — photo and bio
4. **Experience** — work history, kept in step with the résumé
5. **Skills** — grouped chips; hover or keyboard focus opens a tooltip with years and a note
6. **Let's connect** — availability, preferred roles, location
7. **Contact** — email / GitHub / LinkedIn cards plus a validated form that opens the visitor's mail client

`#nexis` redirects to [nexisdev.org](https://nexisdev.org), where Nexis now lives.

## Stack

| Category | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 plus design tokens and layout classes in `src/index.css` |
| UI primitives | shadcn/ui on `radix-ui` (command, dialog, tooltip, sonner are in use) |
| Command palette | `cmdk` |
| Toasts | `sonner` |
| Animation | Framer Motion (`LazyMotion` + `m`), CSS transitions/keyframes |
| Shaders | Hand-written WebGL2 fragment shaders (`src/lib/shaders.js`) |
| Icons | `lucide-react`, Devicon (CDN, pinned with SRI) |
| Font | Inter Variable, self-hosted via `@fontsource-variable/inter` |

## Structure

```
├── public/
│   ├── 404.html / 404.js   # GitHub Pages 404 that echoes the missed path
│   ├── og-image.png        # 1200×630 social preview
│   ├── icons.svg           # footer social icons sprite
│   ├── manifest.json
│   └── resume.pdf
├── src/
│   ├── assets/             # WebP images (profile, Nexis logo + screenshot), signature
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── Hero.jsx, Projects.jsx, About.jsx, Experience.jsx, Skills.jsx, Contact.jsx
│   │   ├── Navbar.jsx      # scroll-spy + mobile menu
│   │   ├── PillNav.jsx     # desktop nav capsule (CSS circle-wipe)
│   │   ├── SignatureCard.jsx
│   │   ├── ShaderPanel.jsx # WebGL2 canvas, pauses off-screen, still frame under reduced motion
│   │   ├── CommandPaletteHost.jsx  # owns ⌘K state, lazy-loads CommandPalette.jsx
│   │   └── CommandPalette.jsx
│   ├── lib/
│   │   ├── motion-features.js  # framer-motion features, loaded in their own chunk
│   │   ├── shaders.js
│   │   └── utils.ts            # cn() helper
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── index.html              # CSP, meta/OG tags, skip link
```

## Conventions

- **Layout:** every section's content sits in `.page-container` (1200px, centred, 24px gutters). Sections own vertical padding only.
- **Type:** section headers use `.section-eyebrow`, `.section-title`, `.section-lede`; small uppercase labels use `.micro-label`. Nothing renders below 12px.
- **Colour:** text greys must pass WCAG AA — use `--m-subtle` (`#6b7079`) as the lightest text colour; `--m-border-strong` is for borders only.
- **Motion:** use `m.*` components, not `motion.*` (`LazyMotion` runs in strict mode and will throw). `MotionConfig reducedMotion="user"` and a global `prefers-reduced-motion` rule cover everything else.
- **Images:** WebP with explicit `width`/`height`; below-the-fold images get `loading="lazy"`.

## Features

- **⌘K / Ctrl+K command palette** — jump to sections, copy email, download résumé, open external links. Loaded on first use.
- **Accessible by default** — skip link, visible focus rings, keyboard-reachable tooltips, labelled form fields with inline errors and focus-on-first-error, 44px touch targets.
- **Security** — Content-Security-Policy via `<meta>`, pinned CDN stylesheet with Subresource Integrity, no inline scripts.

## Dev

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # production build to dist/
npm run lint     # eslint
npm run deploy   # build and publish dist/ to the gh-pages branch
```
