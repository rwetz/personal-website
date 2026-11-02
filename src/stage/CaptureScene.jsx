// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useState } from 'react'
import { Dialog } from 'radix-ui'

export default function CaptureScene({ project, captures, portrait = false, onReady }) {
  const [selected, setSelected] = useState(0)
  const capture = captures[selected]
  const companion = captures[(selected + 1) % captures.length]
  return <div className={`capture-scene ${portrait ? 'capture-portrait' : 'capture-landscape'}`}>
    <Dialog.Root>
      <div className="capture-body">
        {portrait && <img className="capture-companion" src={companion.src} alt="" aria-hidden="true" />}
        <Dialog.Trigger asChild>
          <button className="capture-open" aria-label={`Enlarge ${project.name} ${capture.label} capture`}>
            <img className="capture-image" src={capture.src} alt={capture.alt} width={capture.width} height={capture.height}
              onLoad={event => {
                const image = event.currentTarget
                image.decode().then(() => onReady?.()).catch(() => {})
              }} />
            <span className="capture-zoom" aria-hidden="true">↗</span>
          </button>
        </Dialog.Trigger>
      </div>
      {captures.length > 1 && <div className="capture-controls">
        <div role="group" aria-label={`${project.name} captures`}>
          {captures.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}
        </div>
      </div>}
      <Dialog.Portal>
        <Dialog.Overlay className="capture-overlay" />
        <Dialog.Content className="capture-lightbox" aria-describedby={undefined}>
          <div className="capture-lightbox-header"><Dialog.Title>{project.name} / {capture.label}</Dialog.Title><Dialog.Close aria-label="Close capture">Close ×</Dialog.Close></div>
          <img src={capture.src} alt={capture.alt} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
}
