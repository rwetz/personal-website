// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import Specimen from '../Specimen'
const colors = [{ name: 'Phosphor', hex: '#e5a64b' }, { name: 'Bone', hex: '#e6d9bc' }, { name: 'Copper', hex: '#a96b38' }]
export default function FerriteScene({ project }) { return <Specimen project={project} colors={colors} /> }
