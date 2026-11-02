// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { Dialog } from 'radix-ui'
import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
export default function AboutModal({ onClose }) {
  return (
    <Dialog.Root open onOpenChange={open => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="about-overlay" />
        <Dialog.Content className="showcase-about" aria-describedby={undefined} onCloseAutoFocus={event => {
          event.preventDefault(); document.getElementById('about-trigger')?.focus()
        }}>
          <div className="showcase-about-header">
            <Dialog.Title>About Ryan</Dialog.Title>
            <Dialog.Close aria-label="Close about">Close ×</Dialog.Close>
          </div>
          <section id="about" className="about-summary">
            <p className="about-kicker">A little context</p>
            <h2>Hi, I’m Ryan.</h2>
            <p>I’m in my senior year at North Dakota State University, studying Computer Science with a minor in Artificial Intelligence. I’m working toward graduation in May 2027.</p>
            <div className="school-progress"><span aria-hidden="true" /><span>Senior year</span><span>NDSU · Class of 2027</span></div>
          </section>
          <section id="contact" className="about-contact">
            <p className="about-kicker">Get in touch</p>
            <a className="about-email" href="mailto:rwetz00@gmail.com">rwetz00@gmail.com <ArrowUpRight aria-hidden="true" /></a>
            <div className="about-socials">
              <a href="mailto:rwetz00@gmail.com"><EnvelopeSimple aria-hidden="true" /> Email</a>
              <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer"><GithubLogo aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" /></a>
              <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer"><LinkedinLogo aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
