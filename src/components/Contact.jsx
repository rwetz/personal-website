// Edit these with your real links and email
const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:your@email.com',
    display: 'your@email.com',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/yourusername',
    display: 'github.com/yourusername',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    display: 'linkedin.com/in/yourusername',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">
        Contact
      </h2>
      <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
      <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12">
        I&apos;m always open to new opportunities, collaborations, or just a
        friendly chat. Reach out through any of the links below.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        {contactLinks.map(({ label, href, display }) => (
          <a
            key={label}
            href={href}
            target={label !== 'Email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="flex-1 flex flex-col gap-1 p-6 rounded-xl bg-[var(--color-surface-2)] border border-white/5 hover:border-[var(--color-accent)]/40 transition-colors duration-200 group"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-light)]">
              {label}
            </span>
            <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent-light)] transition-colors text-sm truncate">
              {display}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
