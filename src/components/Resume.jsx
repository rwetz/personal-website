import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { GraduationCap, Briefcase, Code2, Music, Download } from "lucide-react";
import GlassSurface from "./GlassSurface";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// ── Timeline data ──────────────────────────────────────────────────────────
const timeline = [
  {
    type: "education",
    icon: GraduationCap,
    period: "2023 — Present",
    title: "B.S. Computer Science",
    org: "North Dakota State University",
    points: [
      "Coursework: Data Structures, Algorithms, Operating Systems, ML, Computer Architecture",
      "Active in CS student org & hackathons",
    ],
  },
  {
    type: "education",
    icon: GraduationCap,
    period: "2023 — Present",
    title: "Minor in Artificial Intelligence",
    org: "North Dakota State University",
    points: [
      "Focused coursework in machine learning, neural networks, and intelligent systems",
      "Hands-on work with PyTorch, TensorFlow, and modern ML pipelines",
    ],
  },
  {
    type: "project",
    icon: Code2,
    period: "2025",
    title: "Music Genre Convolutional Neural Network",
    org: "School project",
    points: [
      "A convolutional neural network pipeline for music genre classification.",
      "Raw audio files are converted to mel-spectrogram images, which are then used to train and compare three CNN architectures. Includes training curves, confusion matrices, and automatic best-model saving.",
    ],
  },
  // {
  //   type: "work",
  //   icon: Briefcase,
  //   period: "Summer 2026",
  //   title: "Software / ML Side Work",
  //   org: "Independent",
  //   points: [
  //     "Trained CNNs and small transformers for personal experiments",
  //     "Built CLI tooling for music processing and dataset preparation",
  //   ],
  // },
  {
    type: "hobby",
    icon: Music,
    period: "Hobby",
    title: "Music Production",
    org: "Independent",
    points: [
      "Multi-instrumentalist, producer, sound designer",
      "Released tracks featured on this site's music page",
    ],
  },
];

const TYPE_COLOR = {
  education: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  project: "text-sky-300 bg-sky-500/10 border-sky-500/20",
  work: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  hobby: "text-rose-300 bg-rose-500/10 border-rose-500/20",
};

// ── Highlights data ────────────────────────────────────────────────────────
const highlights = [
  {
    stat: "4+",
    label: "Years coding",
    caption: "Started young, never stopped",
  },
  {
    stat: "20+",
    label: "Public repositories",
    caption: "Open source, side projects, experiments",
  },
  {
    stat: "5",
    label: "Languages day-to-day",
    caption: "Python, TS, C, C#, Java",
  },
  {
    stat: "∞",
    label: "Cups of coffee",
    caption: "Fuel for late-night commits",
  },
];

const strengths = [
  {
    title: "Full-stack web",
    desc: "React, Next.js, Node, Tailwind. Comfortable from CSS Houdini to API design.",
  },
  {
    title: "Machine learning",
    desc: "CNNs, transformers, classical ML. Both PyTorch and TensorFlow.",
  },
  {
    title: "Creative coding",
    desc: "WebGL, audio synthesis, generative visuals. The DAW on this site is a small example.",
  },
  {
    title: "Systems-aware",
    desc: "C and low-level work means I think about memory, latency, and data flow.",
  },
];

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
  );
}

function TimelineEntry({ entry, idx }) {
  const Icon = entry.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="relative pl-12 pb-10 last:pb-0"
    >
      {/* Vertical line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)]/40 to-transparent" />
      {/* Icon node */}
      <div
        className={`absolute left-0 top-0 w-8 h-8 rounded-full border flex items-center justify-center ${TYPE_COLOR[entry.type]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs font-mono text-[var(--color-muted)] tracking-wider mb-1">
          {entry.period}
        </div>
        <h4 className="text-base font-semibold text-[var(--color-text)]">
          {entry.title}
        </h4>
        <div className="text-sm text-[var(--color-accent-light)] mb-2">
          {entry.org}
        </div>
        <ul className="space-y-1">
          {entry.points.map((p, i) => (
            <li
              key={i}
              className="text-sm text-[var(--color-muted)] leading-relaxed flex gap-2"
            >
              <span className="text-[var(--color-accent)] mt-1">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Resume() {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(undefined);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w > 0) setWidth(w - 32);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="resume" className="py-24 px-6 bg-[var(--color-surface-2)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">
            // 06
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">
            Resume
          </h2>
          <div className="accent-bar" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <Tabs defaultValue="timeline" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="pdf" className="hidden sm:inline-flex">
                  PDF
                </TabsTrigger>
              </TabsList>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>

            {/* Timeline tab */}
            <TabsContent value="timeline">
              <div className="max-w-2xl">
                {timeline.map((entry, idx) => (
                  <TimelineEntry key={idx} entry={entry} idx={idx} />
                ))}
              </div>
            </TabsContent>

            {/* Highlights tab */}
            <TabsContent value="highlights">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="p-5 rounded-xl bg-[var(--color-surface-3)] border border-white/5 hover:border-[var(--color-accent-dark)]/40 transition-colors"
                  >
                    <div className="text-3xl font-bold text-[var(--color-accent-light)] mb-1">
                      {h.stat}
                    </div>
                    <div className="text-sm font-medium text-[var(--color-text)] mb-1">
                      {h.label}
                    </div>
                    <div className="text-xs text-[var(--color-muted)] leading-relaxed">
                      {h.caption}
                    </div>
                  </motion.div>
                ))}
              </div>

              <h4 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-4">
                Strengths
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {strengths.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="p-5 rounded-xl bg-[var(--color-surface-3)] border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">
                        {String(i + 1).padStart(2, "0")}
                      </Badge>
                      <h5 className="text-base font-semibold text-[var(--color-text)]">
                        {s.title}
                      </h5>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                      {s.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* PDF tab */}
            <TabsContent value="pdf">
              <div className="max-w-2xl mx-auto">
                <div
                  ref={containerRef}
                  className="rounded-2xl border border-white/10 bg-[var(--color-surface-3)] p-4 flex flex-col items-center overflow-hidden"
                >
                  <Document
                    file="/resume.pdf"
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<PdfSkeleton />}
                    error={
                      <div className="py-20 text-[var(--color-muted)] text-sm">
                        Failed to load resume.
                      </div>
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
                <div className="mt-6 flex justify-center">
                  <a href="/resume.pdf" download>
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
                      className="px-10 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <span className="text-[var(--color-accent-light)] font-semibold text-base whitespace-nowrap">
                        Download Resume (PDF)
                      </span>
                    </GlassSurface>
                  </a>
                </div>
                <p className="text-xs text-[var(--color-muted)]/60 font-mono text-center mt-3">
                  Last updated: April 2026
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
