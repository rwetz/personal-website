// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import Specimen from '../Specimen'
const colors = [{ name: 'Glacier', hex: '#8dbce8' }, { name: 'Coral', hex: '#ef927c' }, { name: 'Frost', hex: '#f0f3f7' }]
export default function NexisDesignScene({ project }) { return <Specimen project={project} colors={colors} /> }
