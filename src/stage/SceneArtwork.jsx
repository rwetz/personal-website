// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useId } from 'react'

// Decorative diagrams describe the instrument, never pretend to be live telemetry.
export default function SceneArtwork({ project }) {
  const id = useId().replace(/:/g, '')
  if (project === 'halcyra') return <div className="synth-artwork">
    <svg className="wavetable-field" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id={`${id}-grid`} width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth=".5" /></pattern></defs>
      <rect width="1200" height="800" fill={`url(#${id}-grid)`} className="schematic-grid" />
      <g className="wavetable-stack" fill="none" stroke="currentColor" strokeWidth="1.2">
        {Array.from({ length: 15 }, (_, i) => <path key={i} transform={`translate(${i * 14},${i * -12})`} d="M430 670C480 670 480 500 530 500S580 670 630 670S680 500 730 500S780 670 830 670S880 500 930 500" />)}
      </g>
      <g className="synth-dial" transform="translate(160 490)" fill="none" stroke="currentColor">
        <circle r="108" strokeDasharray="1 9" strokeWidth="9" /><circle r="83" strokeWidth="1" /><path d="M-59 59A83 83 0 1 1 59 59" strokeWidth="4" /><path d="M0-68V-42M-132 0H-116M132 0H116M0 132V116" strokeWidth="2" />
      </g>
      <path className="signal-route" d="M0 150H160V245H330V150H590M1050 0V220H1200M0 735H330" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  </div>

  if (project === 'logscope') return <div className="log-artwork">
    <svg className="index-field" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id={`${id}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" /></pattern></defs>
      <rect width="1200" height="800" fill={`url(#${id}-dots)`} className="schematic-grid" />
      <g fill="none" stroke="currentColor" strokeWidth="1" className="log-routes">
        {[110, 170, 230, 290, 350].map((y, i) => <path key={y} d={`M0 ${y}H${170 + i * 30}L${340 + i * 14} 440H560`} />)}
        <path d="M560 440H690V550H1200M690 440H1200M690 440V330H1200" />
        <rect x="510" y="400" width="100" height="80" rx="4" /><path d="M535 420H585M535 440H585M535 460H570" />
      </g>
      <g className="log-waterfall" fill="currentColor">{Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 26} y={750 - ((i * 37) % 100)} width="9" height={25 + ((i * 37) % 100)} opacity={.25 + (i % 4) * .18} />)}</g>
      <g className="index-brackets" fill="none" stroke="currentColor" strokeWidth="2"><path d="M60 580H30V660H60M1140 100H1170V180H1140" /></g>
    </svg>
  </div>
  return null
}
