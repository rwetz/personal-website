import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Send } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

const EMAIL = 'rwetz00@gmail.com'

const contactLinks = [
  {
    label:   'Email',
    href:    `mailto:${EMAIL}`,
    display: EMAIL,
    isEmail: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label:   'GitHub',
    href:    'https://github.com/rwetz',
    display: 'github.com/rwetz',
    isEmail: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label:   'LinkedIn',
    href:    'https://linkedin.com/in/ryan-wetzstein',
    display: 'linkedin.com/in/ryan-wetzstein',
    isEmail: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Required'
    else if (form.message.trim().length < 10)    e.message = 'At least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) { toast.error('Please fix the errors below'); return }
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body    = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    toast.success('Opening your email client…')
  }

  const inputStyle = (hasError) => ({
    display: 'block',
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    color: '#181d26',
    background: '#ffffff',
    border: `1px solid ${hasError ? '#dc2626' : '#dddddd'}`,
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  })

  return (
    <section
      id="contact"
      style={{ backgroundColor: '#ffffff', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ marginBottom: 64 }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
            Contact
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: '0 0 12px' }}>
            Let's work together.
          </h2>
          <p style={{ fontSize: 14, color: '#333840', margin: 0 }}>
            Open to internships, collaborations, or just a conversation. Reach out any time.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Left: contact links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {contactLinks.map(({ label, href, display, isEmail, icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '20px 24px',
                  background: '#ffffff',
                  border: '1px solid #dddddd',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: '#181d26',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#9297a0' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dddddd' }}
              >
                <span style={{ color: '#9297a0', flexShrink: 0 }}>{icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: '#333840', minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#9297a0', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                    {label}
                  </span>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {display}
                  </span>
                </span>
                {isEmail && (
                  <button
                    onClick={ev => {
                      ev.preventDefault()
                      ev.stopPropagation()
                      navigator.clipboard.writeText(EMAIL)
                      toast.success('Email copied', { description: EMAIL })
                    }}
                    aria-label="Copy email"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9297a0', padding: 4 }}
                  >
                    <Copy style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </motion.a>
            ))}
          </div>

          {/* Right: message form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, color: '#181d26', marginBottom: 24 }}>
              Send a message
            </p>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#41454d', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })) }}
                    placeholder="Your name"
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#41454d', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })) }}
                    placeholder="your@email.com"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#41454d', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: undefined })) }}
                  placeholder="What's on your mind?"
                  style={{ ...inputStyle(!!errors.message), resize: 'vertical' }}
                />
                {errors.message && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.message}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
                    background: '#181d26',
                    color: '#ffffff',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Send style={{ width: 14, height: 14 }} />
                  Send via email
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
