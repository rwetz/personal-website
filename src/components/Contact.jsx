import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'

const EMAIL = 'rwetz00@gmail.com'

const contactLinks = [
  { icon: 'gmail-icon',    href: `mailto:${EMAIL}`,                            display: EMAIL,                         external: false, isEmail: true,  hoverColor: '#EA4335', label: 'Email' },
  { icon: 'github-icon',   href: 'https://github.com/rwetz',                   display: 'github.com/rwetz',            external: true,  isEmail: false, hoverColor: '#ffffff', label: 'GitHub' },
  { icon: 'linkedin-icon', href: 'https://linkedin.com/in/ryan-wetzstein',     display: 'linkedin.com/in/ryan-wetzstein', external: true, isEmail: false, hoverColor: '#0A66C2', label: 'LinkedIn' },
]

function CopyEmailButton() {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(EMAIL)
        toast.success('Email copied', { description: EMAIL })
      }}
      aria-label="Copy email address"
      className="ml-auto p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Required'
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors below')
      return
    }
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    toast.success('Opening your email client…')
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
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 08</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Contact</h2>
          <div className="accent-bar" />
        </motion.div>

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
                onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={e => { e.currentTarget.style.color = '' }}
              >
                <use href={`/icons.svg#${icon}`} />
              </motion.svg>
              <span className="flex items-center gap-1 text-[var(--color-text)] group-hover:text-[var(--color-accent-light)] transition-colors text-sm">
                <span className="truncate sm:whitespace-normal sm:overflow-visible sm:text-clip">{display}</span>
                {isEmail && <CopyEmailButton />}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="max-w-2xl"
        >
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">Send a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name">NAME</Label>
                <Input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })) }}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={errors.name ? 'border-rose-500/60 focus-visible:ring-rose-500/20' : ''}
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="contact-email">EMAIL</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })) }}
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                  className={errors.email ? 'border-rose-500/60 focus-visible:ring-rose-500/20' : ''}
                />
                {errors.email && <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="contact-message">MESSAGE</Label>
              <Textarea
                id="contact-message"
                rows={5}
                value={form.message}
                onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: undefined })) }}
                placeholder="What's on your mind?"
                aria-invalid={!!errors.message}
                className={errors.message ? 'border-rose-500/60 focus-visible:ring-rose-500/20' : ''}
              />
              {errors.message && <p className="text-xs text-rose-400 mt-1.5">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-dark)] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-light)]"
            >
              <Send className="w-4 h-4" />
              Send via email
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
