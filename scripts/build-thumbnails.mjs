// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import sharp from 'sharp'
for (const [id, path] of Object.entries({ nexis: 'src/assets/showcase/nexis.webp', biblelm: 'src/assets/showcase/biblelm.webp', logscope: 'src/assets/showcase/logscope.webp', ateru: 'src/assets/showcase/ateru.webp', halcyra: 'src/assets/showcase/halcyra.webp' })) {
  await sharp(path).resize({ width: 460, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`src/assets/showcase/${id}-thumb.webp`)
}
console.log('Generated small Constellation thumbnails from real app posters.')
