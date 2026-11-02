// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import MediaScene from '../MediaScene'
import mp4 from '../../assets/showcase/logscope.mp4'
import webm from '../../assets/showcase/logscope.webm'
export default function LogscopeScene({ project }) { return <MediaScene project={project} mp4={mp4} webm={webm} /> }
