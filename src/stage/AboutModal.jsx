// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { Dialog } from 'radix-ui'
import About from '../components/About'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
export default function AboutModal({ onClose }) {
  return (
    <Dialog.Root open onOpenChange={open => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="about-overlay" />
        <Dialog.Content className="showcase-about" aria-describedby={undefined} onCloseAutoFocus={event => {
          event.preventDefault(); document.getElementById('about-trigger')?.focus()
        }}>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/devicon.min.css" integrity="sha384-6iv3tXABd3c9DYulXujJl8n22ahn/12f45MomxoPv6jBX4LBE4gNJjfkx5mAKIqR" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          <div className="showcase-about-header">
            <Dialog.Title>About Ryan</Dialog.Title>
            <a href="/resume.pdf" download>Download resume ↗</a>
            <Dialog.Close aria-label="Close about">Close ×</Dialog.Close>
          </div>
          <About /><Experience /><Skills /><Contact />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
