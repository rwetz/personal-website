export default function Resume() {
  return (
    <section id="resume" className="py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">
          Resume
        </h2>
        <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10 mx-auto" />
        <p className="text-[var(--color-muted)] text-lg max-w-xl mx-auto mb-8">
          Want to know more about my experience and education? Download my full
          resume below.
        </p>
        <a
          href="/resume.pdf"
          download
          className="inline-block px-8 py-4 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-lg hover:bg-[var(--color-accent-light)] hover:text-[var(--color-surface)] transition-colors duration-200"
        >
          Download Resume (PDF)
        </a>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Place your resume.pdf in the <code className="font-mono bg-[var(--color-surface-3)] px-1 py-0.5 rounded">/public</code> folder
        </p>
      </div>
    </section>
  )
}
