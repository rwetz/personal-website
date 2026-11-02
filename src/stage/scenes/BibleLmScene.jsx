// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import MediaScene from '../MediaScene'
import '@fontsource/unifrakturmaguntia/latin-400.css'
import '@fontsource-variable/eb-garamond'
import mp4 from '../../assets/showcase/biblelm.mp4'
import webm from '../../assets/showcase/biblelm.webm'
export default function BibleLmScene({ project }) { return <MediaScene project={project} mp4={mp4} webm={webm} /> }
