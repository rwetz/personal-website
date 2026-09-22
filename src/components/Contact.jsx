// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useRef, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowUpRight, Copy, Envelope, GithubLogo, LinkedinLogo, PaperPlaneTilt } from '@phosphor-icons/react'
import { toast } from '@/components/ui/sonner'

const EMAIL = 'rwetz00@gmail.com'

const contactLinks = [
  { label: 'Email',    href: `mailto:${EMAIL}`,                        display: EMAIL,                             Icon: Envelope,     isEmail: true  },
  { label: 'GitHub',   href: 'https://github.com/rwetz',               display: 'github.com/rwetz',                Icon: GithubLogo,   isEmail: false },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ryan-wetzstein', display: 'linkedin.com/in/ryan-wetzstein',  Icon: LinkedinLogo, isEmail: false },
]

/* Folded in from the old dark "Let's connect" band, which broke the page's single light tone. */
const availability = [
  { term: 'Available from', detail: 'Fall 2026' },
  { term: 'Looking for',    detail: 'SWE and ML / AI internships' },
  { term: 'Based in',       detail: 'Fargo, ND · remote-friendly' },
]

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const nameRef    = useRef(null)
  const emailRef   = useRef(null)
  const messageRef = useRef(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter an email like name@example.com'
    if (!form.message.trim()) e.message = 'Required'
    else if (form.message.trim().length < 10)    e.message = 'Add a little more: at least 10 characters'
    setErrors(e)
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate()
    const firstInvalid = ['name', 'email', 'message'].find(k => found[k])
    if (firstInvalid) {
      // Errors sit inline under each field; move focus to the first one.
      const refs = { name: nameRef, email: emailRef, message: messageRef }
      refs[firstInvalid].current?.focus()
      return
    }
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body    = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    toast.success('Opening your email client…')
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast.success('Email copied', { description: EMAIL })
    } catch {
      toast.error('Couldn’t copy. Select the address and copy it manually.')
    }
  }

  const clearError = (field) => setErrors(er => ({ ...er, [field]: undefined }))

  const inputStyle = (hasError) => ({
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    fontSize: 15,
    color: '#181d26',
    background: '#ffffff',
    border: `1px solid ${hasError ? '#b91c1c' : '#d3d6db'}`,
    borderRadius: 10,
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  })

  return (
    <section
      id="contact"
      className="dot-grid section"
    >
      <div className="page-container">

        {/* Heading */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ marginBottom: 64 }}
        >
          <p className="section-eyebrow"><span className="section-index">05</span>Contact</p>
          <h2 className="section-title">Let’s talk.</h2>
          <p className="section-lede">
            Open to internships, collaborations, and good conversations. I reply to every message.
          </p>
          <dl className="availability">
            {availability.map(({ term, detail }) => (
              <div key={term}>
                <dt className="micro-label">{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </m.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Left: contact links as divided rows rather than boxed cards */}
          <ul className="contact-list">
            {contactLinks.map(({ label, href, display, Icon, isEmail }, i) => (
              <m.li
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              >
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <Icon size={22} aria-hidden="true" style={{ color: 'var(--m-subtle)', flexShrink: 0 }} />
                  {/* Email keeps its text clear of the copy button that sits beside the arrow */}
                  <span style={{ minWidth: 0, paddingRight: isEmail ? 56 : 0 }}>
                    <span className="micro-label" style={{ display: 'block', marginBottom: 2 }}>{label}</span>
                    <span style={{ display: 'block', fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {display}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="contact-arrow" aria-hidden="true" />
                </a>
                {/* Sibling of the link, not a child: a button inside <a> is invalid HTML */}
                {isEmail && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="contact-copy"
                  >
                    <Copy size={18} aria-hidden="true" />
                  </button>
                )}
              </m.li>
            ))}
          </ul>

          {/* Right: message form */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#181d26', margin: '0 0 24px' }}>
              Send a message
            </h3>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label htmlFor="contact-name" className="micro-label" style={{ display: 'block', marginBottom: 6 }}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    ref={nameRef}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={e => { setForm(prev => ({ ...prev, name: e.target.value })); clearError('name') }}
                    placeholder="Mateo Alvarez…"
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <p id="contact-name-error" style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="micro-label" style={{ display: 'block', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    ref={emailRef}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    type="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={form.email}
                    onChange={e => { setForm(prev => ({ ...prev, email: e.target.value })); clearError('email') }}
                    placeholder="mateo@example.com…"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p id="contact-email-error" style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="micro-label" style={{ display: 'block', marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                    ref={messageRef}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={e => { setForm(prev => ({ ...prev, message: e.target.value })); clearError('message') }}
                  placeholder="What’s on your mind…"
                  style={{ ...inputStyle(!!errors.message), resize: 'vertical' }}
                />
                {errors.message && <p id="contact-message-error" style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>{errors.message}</p>}
              </div>
              <div>
                <button type="submit" className="btn-primary">
                  <PaperPlaneTilt size={16} aria-hidden="true" />
                  Send via email
                </button>
              </div>
            </form>
          </m.div>
        </div>
      </div>
    </section>
  )
}
