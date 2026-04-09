# Website Improvement Log

All 15 improvements have been implemented. This file tracks what was done and the outcome.

---

## Completed

### 1. ✅ Scroll-spy active link highlighting in Navbar
**File:** `src/components/Navbar.jsx`
`IntersectionObserver` watches each section. The matching nav link turns accent-colored and gets an underline indicator as the user scrolls. Works for both the desktop glass pill and the mobile dropdown.

### 2. ✅ Scroll-reveal animations on section entry
**Files:** All section components
`framer-motion` `whileInView` + `viewport={{ once: true }}` fade-up animations on each section. Staggered children on Projects cards and Skills badges.

### 3. ✅ Mobile hamburger menu
**File:** `src/components/Navbar.jsx`
Hamburger icon (≡) appears on screens below `md`. Toggles a dropdown with all nav links. Auto-closes on link click or viewport resize to desktop. CloseIcon (✕) replaces the hamburger while open.

### 4. ✅ Project card image previews
**File:** `src/components/Projects.jsx`
Optional `image` field on each project object. When present, renders as a `rounded-t-xl` banner above the card content.

### 5. ✅ Real profile photo in About
**File:** `src/components/About.jsx`
Replaced the 👤 emoji placeholder with `src/assets/profile.jpg`, cropped into a circle with `object-cover rounded-full`.

### 6. ✅ Animated skill badges
**File:** `src/components/Skills.jsx`
`framer-motion` stagger container — each badge fades and slides up with a 0.05s delay between them.

### 7. ✅ Contact form
**File:** `src/components/Contact.jsx`
Formspree-ready `<form>` with name, email, and message fields. Managed state, loading/success/error feedback. Swap the `FORMSPREE_ENDPOINT` constant with your Formspree form ID to activate.

### 8. ✅ Featured project badge
**File:** `src/components/Projects.jsx`
`featured: true` flag on any project object renders a "Featured" badge and gives the card an accent-colored glow border.

### 9. ✅ Custom favicon
**File:** `public/favicon.svg`
Replaced the default Vite lightning bolt with a violet rounded-square "R" icon matching the site accent color.

### 10. ✅ Meta tags / SEO
**File:** `index.html`
Added `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`), and Twitter Card tags. Add a real `public/og-image.png` for link previews.

### 11. ✅ Section dividers
**Files:** `src/App.jsx`
Subtle SVG wave dividers between alternating sections (About→Projects, Projects→Skills, etc.) using matching background fills for smooth transitions.

### 12. ✅ ASCII typewriter text effect in Hero
**File:** `src/components/Hero.jsx`, `src/components/ASCIIText.jsx`
Replaced the plain "Hello, I'm / Ryan" text with a Three.js-powered ASCII art effect (from reactbits.dev). The text waves, reacts to mouse movement with 3D rotation, and hue-shifts with cursor position.

### 13. ✅ Back-to-top button
**File:** `src/App.jsx`
Fixed `bottom-6 right-6` button appears after scrolling 400px. Smooth-scrolls to `#hero`. Fades in/out with a CSS transition.

### 14. ✅ Light/dark mode toggle
**File:** `src/components/Navbar.jsx`
Sun/Moon icon button in the top-right of the navbar. Toggles `html.light` class and persists preference to `localStorage`. GlassSurface and all CSS variables respond to the class change instantly.

### 15. ✅ Code-split PixelBlast (lazy load)
**File:** `src/components/Hero.jsx`
`React.lazy` + `Suspense` defers loading of the Three.js PixelBlast background so the main bundle stays smaller and the page becomes interactive sooner.

---

## Extra additions (beyond the original list)

- **Geist font** — applied globally via Google Fonts; Geist Mono used for code/mono elements
- **Signature logo in Navbar** — `src/assets/signature.png` replaces the text "Ryan" wordmark; inverts automatically in dark mode
- **GlassSurface component** (reactbits.dev) — applied to hero CTA buttons and the navbar nav-link pill
- **PixelBlast background** (reactbits.dev) — animated violet pixel-dither canvas behind the hero
- **ASCIIText component** (reactbits.dev) — Three.js ASCII shader replaces the hero heading text
- **Removed unused Vite defaults** — `App.css`, `react.svg`, `vite.svg`, `hero.png` deleted
