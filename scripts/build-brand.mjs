// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { detailedMark } from '../src/brand/mark.js'

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="160" fill="#090b10"/><path d="${detailedMark}" fill="#f3f5f7" fill-rule="evenodd" transform="translate(184 184) scale(.64)"/></svg>`
await writeFile(new URL('../public/favicon.svg', import.meta.url), icon)
await writeFile(new URL('../assets/logo.svg', import.meta.url), icon)
for (const size of [192, 512]) {
  await sharp(Buffer.from(icon)).resize(size, size).png().toFile(fileURLToPath(new URL(`../public/icon-${size}.png`, import.meta.url)))
}
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#090b10"/><path d="${detailedMark}" fill="#8494a9" fill-rule="evenodd" transform="translate(60 150) scale(.32)"/><path d="M430 120V510" stroke="#343d4b"/><g font-family="Arial,sans-serif"><text x="490" y="180" fill="#8494a9" font-size="17" letter-spacing="3">SOFTWARE &amp; DESIGN</text><text x="490" y="277" fill="#f3f5f7" font-size="55">Ryan Wetzstein</text><text x="490" y="355" fill="#c7d0dd" font-size="30">Small details. Entire worlds.</text><text x="490" y="467" fill="#8494a9" font-size="18">ryanwetzstein.com</text></g></svg>`
await sharp(Buffer.from(og)).png().toFile(fileURLToPath(new URL('../public/og-image.png', import.meta.url)))
console.log('Generated heptagram favicon, maskable icons and 1200×630 OG image.')
