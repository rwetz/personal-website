import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EMAIL = 'rwetz00@gmail.com'

const contactLinks = [
  {
    icon: 'gmail-icon',
    href: `mailto:${EMAIL}`,
    display: EMAIL,
    external: false,
    isEmail: true,
    hoverColor: '#EA4335',
    label: 'Email',
  },
  {
    icon: 'github-icon',
    href: 'https://github.com/rwetz',
    display: 'github.com/rwetz',
    external: true,
    isEmail: false,
    hoverColor: '#ffffff',
    label: 'GitHub',
  },
  {
    icon: 'linkedin-icon',
    href: 'https://linkedin.com/in/ryan-wetzstein',
    display: 'linkedin.com/in/ryan-wetzstein',
    external: true,
    isEmail: false,
    hoverColor: '#0A66C2',
    label: 'LinkedIn',
  },
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
    <div className="relative ml-auto">
      <button
        onClick={handle}
        aria-label="Copy email address"
        className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )}
      </button>
      {/* Screen reader live region */}
      <span aria-live="polite" className="sr-only">{copied ? 'Email copied to clipboard' : ''}</span>
      {/* Visual toast */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-1 px-2 py-0.5 rounded bg-[var(--color-accent)] text-white text-xs font-mono whitespace-nowrap pointer-events-none"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

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
        </motion.div>

        {/* CTA heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10"
        >
          <p className="text-2xl font-semibold text-[var(--color-text)] mb-2">
            Let&apos;s work together.
          </p>
          <p className="text-[var(--color-muted)] text-lg max-w-xl">
            Open to internships, collaborations, or just a chat. Reach out any time.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          {contactLinks.map(({ icon, href, display, external, isEmail, hoverColor, label }, i) => (
            <motion.a
              key={icon}
              href={href}
              target={external ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              className="flex-1 flex flex-col gap-3 p-6 rounded-xl bg-[var(--color-surface-2)] border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 group"
            >
              <motion.svg
                width="28"
                height="28"
                aria-hidden="true"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                style={{ color: 'var(--color-muted)', transition: 'color 0.2s' }}
                className="group-hover:text-[var(--brand-hover)]"
                onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={e => { e.currentTarget.style.color = '' }}
              >
                <use href={`/icons.svg#${icon}`} />
              </motion.svg>
              <span className="flex items-center gap-1 text-[var(--color-text)] group-hover:text-[var(--color-accent-light)] transition-colors text-sm">
                <span className="truncate sm:whitespace-normal sm:overflow-visible sm:text-clip">{display}</span>
                {isEmail && <CopyButton text={EMAIL} />}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="max-w-2xl"
        >
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">Send a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono text-[var(--color-muted)] mb-1.5 tracking-wider">NAME</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-3)] border border-white/10 text-[var(--color-text)] placeholder-[var(--color-muted)]/50 text-sm outline-none focus:border-[var(--color-accent)]/60 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono text-[var(--color-muted)] mb-1.5 tracking-wider">EMAIL</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-3)] border border-white/10 text-[var(--color-text)] placeholder-[var(--color-muted)]/50 text-sm outline-none focus:border-[var(--color-accent)]/60 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono text-[var(--color-muted)] mb-1.5 tracking-wider">MESSAGE</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="What's on your mind?"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-3)] border border-white/10 text-[var(--color-text)] placeholder-[var(--color-muted)]/50 text-sm outline-none focus:border-[var(--color-accent)]/60 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-dark)] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]"
            >
              Send via email
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
