import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function Resume() {
  const [numPages, setNumPages] = useState(null)
  const containerRef = useRef(null)

  return (
    <section id="resume" className="py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">// 04</span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">Resume</h2>
          <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="max-w-2xl mx-auto w-full"
        >
          <div
            ref={containerRef}
            className="mb-6 rounded-2xl border border-white/10 bg-[var(--color-surface-3)] p-4 flex flex-col items-center overflow-hidden"
          >
            <Document
              file="/resume.pdf"
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="py-20 text-[var(--color-muted)] text-sm">Loading resume…</div>
              }
              error={
                <div className="py-20 text-[var(--color-muted)] text-sm">Failed to load resume.</div>
              }
            >
              {Array.from({ length: numPages ?? 0 }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  className="mb-4 last:mb-0 rounded-lg overflow-hidden shadow-lg"
                  width={containerRef.current ? containerRef.current.clientWidth - 32 : undefined}
                  renderTextLayer
                  renderAnnotationLayer
                />
              ))}
            </Document>
          </div>

          <div className="flex justify-center">
            <a
              href="/resume.pdf"
              download
              className="inline-block px-8 py-4 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-lg hover:bg-[var(--color-accent-light)] hover:text-[var(--color-surface)] transition-colors duration-200"
            >
              Download Resume (PDF)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
