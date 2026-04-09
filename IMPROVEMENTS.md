# Site Improvements

## High Priority

### 1. Scroll-reveal animations on section content
As the user scrolls, cards and text fade/slide up into view. Framer Motion is already installed — just wrap section content in `<motion.div>` with `whileInView`. Makes the page feel alive without being distracting.

### 2. Active project cards with real content
The Projects section has placeholder data. Fill in real projects with actual descriptions, tags, and links. Even 1–2 real projects with a GitHub link is more compelling than 3 placeholder cards.

### 3. Subtle section number labels
Add a small `// 01`, `// 02` etc. label in mono text above each section `<h2>`. Common on polished dev portfolios — orients the reader and adds personality without cluttering.

---

## Medium Priority

### 4. Framer Motion page-load entrance animation
Stagger the Hero elements (name → subtitle → buttons) on first load with a short fade-in. Gives a polished first impression. Framer Motion is already a dependency so this is low-effort.

### 5. Project card hover — lift effect
Add `hover:-translate-y-1 transition-transform duration-200` to project cards. Small touch that makes them feel interactive and clickable.

### 6. Skills — icons next to skill names
Right now skills are plain text pills. Adding a small SVG logo next to each skill (React, Python, etc.) adds visual interest. Devicons are available as a CDN font or individual SVGs.

### 7. Footer — social links
The footer just says "Built with React + Vite + Tailwind CSS". Adding the Gmail/GitHub/LinkedIn icon links from the Contact section makes it a natural second entry point at the bottom of the page.

### 8. "Open to work" badge in Hero or About
A small pill badge ("Available for internships") near your name or bio draws recruiter attention immediately. Can be a simple `<span>` with a pulsing green dot — one line of Tailwind.

### 9. Navbar hide-on-scroll-down / show-on-scroll-up
Navbar slides up out of view when scrolling down (more reading space) and reappears when scrolling up. Only a few extra lines in Navbar using the existing scroll listener. Very common on polished portfolios.

---

## Polish

### 10. Meta tags for sharing
`index.html` likely has minimal meta tags. Adding `og:title`, `og:description`, and an `og:image` makes the site preview well when shared on LinkedIn or in a message.

### 11. Consistent section max-width
`About` and `Skills` apply `max-w-5xl mx-auto` directly on the `<section>`, while `Projects` and `Resume` apply it to an inner `<div>`. Standardize to an inner wrapper in every section to avoid subtle alignment differences.

### 12. Contact section — copy-to-clipboard on email
Add a small clipboard icon next to the email address that copies it on click. Saves the user from having to open their mail client just to grab the address.
