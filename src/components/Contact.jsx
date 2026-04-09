import { useState } from 'react'
import { motion } from 'framer-motion'

const EMAIL = 'rwetz00@gmail.com'

const contactLinks = [
  { icon: 'gmail-icon',    href: `mailto:${EMAIL}`,                          display: EMAIL,                          external: false, isEmail: true  },
  { icon: 'github-icon',   href: 'https://github.com/rwetz',                 display: 'github.com/rwetz',             external: true,  isEmail: false },
  { icon: 'linkedin-icon', href: 'https://linkedin.com/in/ryan-wetzstein',   display: 'linkedin.com/in/ryan-wetzstein',external: true,  isEmail: false },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handle}
      aria-label="Copy email"
      className="ml-auto p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 05</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Contact</h2>
          <div className="accent-bar" />
          <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12">
            I&apos;m always open to new opportunities, collaborations, or just a
            friendly chat. Reach out through any of the links below.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6">
          {contactLinks.map(({ icon, href, display, external, isEmail }, i) => (
            <motion.a
              key={icon}
              href={href}
              target={external ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              className="flex-1 flex flex-col gap-3 p-6 rounded-xl bg-[var(--color-surface-2)] border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 group"
            >
              <svg width="28" height="28" aria-hidden="true">
                <use href={`/icons.svg#${icon}`} />
              </svg>
              <span className="flex items-center gap-1 text-[var(--color-text)] group-hover:text-[var(--color-accent-light)] transition-colors text-sm truncate">
                <span className="truncate">{display}</span>
                {isEmail && <CopyButton text={EMAIL} />}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
