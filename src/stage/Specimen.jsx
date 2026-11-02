// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useState } from 'react'
import { applyTheme } from '../lib/theme'
export default function Specimen({ project, colors }) {
  const [selected, setSelected] = useState(project.palette.accent)
  return <div className={`specimen specimen-${project.id}`}>
    <div className="specimen-topline"><span>{project.id === 'ferrite' ? 'MOLTEN IRON' : 'FROSTED GLASS'}</span><span>01 / SYSTEM</span></div>
    <div className="specimen-type" aria-hidden="true">Aa<span>0123456789</span></div>
    <p className="specimen-sample">{project.id === 'ferrite' ? 'Less tool. More craft.' : 'A little clarity goes a long way.'}</p>
    <div className="specimen-controls" role="group" aria-label="Choose the stage accent">
      {colors.map(color => <button key={color.hex} style={{ '--swatch': color.hex }} aria-label={`Use ${color.name} accent`} aria-pressed={selected === color.hex} onClick={() => {
        setSelected(color.hex); applyTheme({ ...project.palette, accent: color.hex })
      }}><span /><small>{color.name}</small></button>)}
    </div>
    <p className="specimen-note">Select a swatch. Feel the system change.</p>
  </div>
}
