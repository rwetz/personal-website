import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Headphones, Hammer, MapPin, Coffee } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const items = [
  {
    icon: Hammer,
    label: 'Building',
    title: 'Focusing on AI/ML personal projects',
    desc: 'Sticking my feet in the water in my free time.',
    tags: ['AI', 'Python', 'ML'],
  },
  // {
  //   icon: BookOpen,
  //   label: 'Reading',
  //   title: 'Designing Data-Intensive Applications',
  //   desc: 'Kleppmann. The book everyone tells you to read; turns out they\'re right.',
  //   tags: ['systems', 'databases'],
  // },
  {
    icon: Headphones,
    label: 'Listening',
    title: 'A lot of Breaking Benjamin lately',
    desc: 'Plus my own works-in-progress on the music page.',
    tags: ['Rock', 'Nu Metal', 'Heavy'],
  },
  {
    icon: Sparkles,
    label: 'Learning',
    title: 'Rust, slowly but properly',
    desc: 'Borrow checker is humbling. Tooling is incredible.',
    tags: ['Rust', 'WASM'],
  },
  {
    icon: MapPin,
    label: 'Located',
    title: 'Fargo, ND',
    desc: 'GO BISON! I love this place.',
    tags: ['NDSU', 'Home of da Herd'],
  },
  {
    icon: Coffee,
    label: 'Drinking',
    title: 'Energy Drinks',
    desc: 'I prefer Monster right now, but I\'m not opposed to a good Reign every once in a while.',
    tags: ['caffeine'],
  },
]

export default function Now() {
  return (
    <section id="now" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 02</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Now</h2>
          <div className="accent-bar" />
          <p className="text-[var(--color-muted)] text-base max-w-xl mb-10">
            A live snapshot of what I&apos;m up to, inspired by{' '}
            <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-light)] hover:underline">/now pages</a>.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ icon: Icon, label, title, desc, tags }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="group relative p-5 rounded-xl bg-[var(--color-surface-2)] border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 overflow-hidden"
            >
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', filter: 'blur(24px)' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">{label}</span>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text)] mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-3">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xs font-mono text-[var(--color-muted)]/60 mt-8 text-center"
        >
          Last updated: April 2026
        </motion.p>
      </div>
    </section>
  )
}
