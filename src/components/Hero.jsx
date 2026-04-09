export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <p className="text-sm font-mono text-[var(--color-accent-light)] mb-4 tracking-widest uppercase">
        Hello, I&apos;m
      </p>
      <h1 className="text-6xl sm:text-7xl font-bold text-[var(--color-text)] tracking-tight mb-4">
        Ryan
      </h1>
      <p className="text-xl sm:text-2xl text-[var(--color-muted)] max-w-xl mb-10">
        A passionate developer building clean, modern web experiences.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="#projects"
          className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-light)] hover:text-[var(--color-surface)] transition-colors duration-200"
        >
          View Projects
        </a>
        <a
          href="/resume.pdf"
          download
          className="px-6 py-3 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent-light)] font-medium hover:bg-[var(--color-accent)]/20 transition-colors duration-200"
        >
          Download Resume
        </a>
      </div>
    </section>
  )
}
