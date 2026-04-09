import { motion } from 'framer-motion'

// Edit these with your real links and email
const contactLinks = [
  {
    icon: 'gmail-icon',
    href: 'mailto:rwetz00@gmail.com',
    display: 'rwetz00@gmail.com',
    external: false,
  },
  {
    icon: 'github-icon',
    href: 'https://github.com/rwetz',
    display: 'github.com/rwetz',
    external: true,
  },
  {
    icon: 'linkedin-icon',
    href: 'https://linkedin.com/in/ryan-wetzstein',
    display: 'linkedin.com/in/ryan-wetzstein',
    external: true,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Contact</h2>
        <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
        <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12">
          I&apos;m always open to new opportunities, collaborations, or just a
          friendly chat. Reach out through any of the links below.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6">
        {contactLinks.map(({ icon, href, display, external }, i) => (
          <motion.a
            key={icon}
            href={href}
            target={external ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            className="flex-1 flex flex-col gap-3 p-6 rounded-xl bg-[var(--color-surface-2)] border border-white/5 hover:border-[var(--color-accent)]/40 transition-colors duration-200 group"
          >
            <svg width="28" height="28" aria-hidden="true">
              <use href={`/icons.svg#${icon}`} />
            </svg>
            <span className="text-[var(--color-text)] group-hover:text-[var(--color-accent-light)] transition-colors text-sm truncate">
              {display}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
