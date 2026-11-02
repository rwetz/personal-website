// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import MediaScene from '../MediaScene'
import mp4 from '../../assets/showcase/nexis.mp4'
import webm from '../../assets/showcase/nexis.webm'
export default function NexisScene({ project }) { return <MediaScene project={project} mp4={mp4} webm={webm} /> }
