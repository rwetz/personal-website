import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import GlassSurface from './GlassSurface'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

function PdfSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3 py-4 px-2 animate-pulse">
      <div className="h-6 w-3/4 rounded bg-white/5" />
      <div className="h-4 w-full rounded bg-white/5" />
      <div className="h-4 w-5/6 rounded bg-white/5" />
      <div className="h-4 w-4/5 rounded bg-white/5" />
      <div className="h-4 w-full rounded bg-white/5 mt-2" />
      <div className="h-4 w-3/4 rounded bg-white/5" />
      <div className="h-6 w-1/2 rounded bg-white/5 mt-4" />
      <div className="h-4 w-full rounded bg-white/5" />
      <div className="h-4 w-5/6 rounded bg-white/5" />
    </div>
  )
}

export default function Resume() {
  const [numPages, setNumPages] = useState(null)
  const [width, setWidth] = useState(undefined)
  const containerRef = useRef(null)

  // Measure after paint to avoid 0-width on first render
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w > 0) setWidth(w - 32)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

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
          <div className="accent-bar" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="max-w-2xl mx-auto w-full"
        >
          {/* PDF viewer — hidden on mobile */}
          <div className="hidden sm:block">
            <div
              ref={containerRef}
              className="mb-6 rounded-2xl border border-white/10 bg-[var(--color-surface-3)] p-4 flex flex-col items-center overflow-hidden"
            >
              <Document
                file="/resume.pdf"
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<PdfSkeleton />}
                error={
                  <div className="py-20 text-[var(--color-muted)] text-sm">Failed to load resume.</div>
                }
              >
                {Array.from({ length: numPages ?? 0 }, (_, i) => (
                  <Page
                    key={i + 1}
                    pageNumber={i + 1}
                    className="mb-4 last:mb-0 rounded-lg overflow-hidden shadow-lg"
                    width={width}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                ))}
              </Document>
            </div>
          </div>

          {/* Mobile message */}
          <div className="sm:hidden mb-6 rounded-2xl border border-white/10 bg-[var(--color-surface-3)] p-8 flex flex-col items-center gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent-light)]" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <p className="text-[var(--color-muted)] text-sm">Tap below to view or download the resume.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <a href="/resume.pdf" download className="w-full sm:w-auto">
              <GlassSurface
                width="auto"
                height={52}
                borderRadius={12}
                distortionScale={-180}
                brightness={60}
                opacity={0.9}
                blur={10}
                backgroundOpacity={0.15}
                saturation={1.4}
                className="w-full sm:w-auto px-10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className="text-[var(--color-accent-light)] font-semibold text-base whitespace-nowrap">
                  Download Resume (PDF)
                </span>
              </GlassSurface>
            </a>
            <p className="text-xs text-[var(--color-muted)]/60 font-mono">Last updated: April 2026</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
