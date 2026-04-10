import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Dither from "./Dither";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

// ---------------------------------------------------------------------------
// Placeholder data — fill in with real content
// ---------------------------------------------------------------------------

const soundcloudTracks = [
  {
    title: "fally*s",
    artist: "yescairo",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1246395475&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  },
  {
    title: "love it (bet)",
    artist: "TH5NKY5U",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2202118263&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  },
  {
    title: "Seasalt𒀯",
    artist: "yescairo",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1410696142&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  },
];

const youtubeVideos = [
  {
    title: "Delinquency",
    description: "2022",
    embedId: "sSkXq6nFepE",
  },
  {
    title: "Artisan",
    description: "2022",
    embedId: "vd5d0_9r_lc",
  },
];

const portfolioTracks = [
  {
    title: "1",
    description: "Here's a look into what I've been up to recently.",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track1.mp3",
  },
  {
    title: "2",
    description: "These are original compositions.",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track2.mp3",
  },
  {
    title: "3",
    description: "More music coming soon.",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track3.mp3",
  },
];

// ---------------------------------------------------------------------------

function PortfolioCard({ title, description, tags, audioSrc, index }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleEnter = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };

  const handleLeave = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  };

  const bars = Array.from({ length: 40 }, (_, k) =>
    Math.abs(
      Math.sin((k + index * 3) * 0.8) * 16 +
        Math.cos((k + index * 2) * 0.3) * 8,
    ),
  );

  return (
    <motion.div
      {...fadeUp(index * 0.1)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      className="flex flex-col bg-[var(--color-surface-3)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-accent-dark)]/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <audio ref={audioRef} src={audioSrc} preload="none" />

      {/* Waveform — brightens and bounces when playing */}
      <div className="w-full h-16 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center mb-4 overflow-hidden">
        <svg
          viewBox="0 0 200 40"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {bars.map((h, k) => (
            <rect
              key={k}
              x={k * 5 + 1}
              y={20 - h}
              width="3"
              height={h * 2}
              fill="var(--color-accent-light)"
              rx="1"
              style={{
                opacity: playing ? 1 : 0.3,
                transition: "opacity 0.3s ease",
                ...(playing && {
                  animation: `waveBar ${0.4 + (k % 5) * 0.08}s ease-in-out infinite alternate`,
                  animationDelay: `${(k % 7) * 0.04}s`,
                }),
              }}
            />
          ))}
        </svg>
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
        {title}
      </h3>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1 mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] font-mono"
          >
            {tag}
          </span>
        ))}
        {playing && (
          <span className="ml-auto text-xs text-[var(--color-accent-light)] font-mono animate-pulse">
            ♪ playing
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeader({ number, title, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)}>
      <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">
        // {String(number).padStart(2, "0")}
      </span>
      <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">
        {title}
      </h2>
      <div className="accent-bar" />
    </motion.div>
  );
}


export default function Music() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Dither
            waveColor={[0.486, 0.227, 0.929]}
            waveSpeed={0.04}
            waveFrequency={2.5}
            waveAmplitude={0.35}
            colorNum={4}
            pixelSize={3}
            enableMouseInteraction={true}
            mouseRadius={0.8}
          />
        </div>

        {/* Signature — back to portfolio */}
        <a
          href="#hero"
          aria-label="Back to portfolio"
          className="absolute top-6 left-6 z-10 hover:opacity-70 transition-opacity"
        >
          <img
            src="/src/assets/signature.png"
            alt="Ryan"
            className="h-8 w-auto invert"
          />
        </a>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest mb-3">
            ryan wetzstein
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Music
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-md">
            Producing, recording, and exploring sound.
          </p>
        </motion.div>
      </section>

      {/* ── SoundCloud ───────────────────────────────────────────────────── */}
      <section id="soundcloud" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader number={1} title="SoundCloud" />
          <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12 -mt-4">
            Songs produced by me. For a full list of all public songs produced
            by me see my "prod. wetz" playlist on soundcloud.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {soundcloudTracks.map(({ title, artist, embedUrl }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.1)}
                className="flex flex-col bg-[var(--color-surface-3)] rounded-xl overflow-hidden border border-white/5 hover:border-[var(--color-accent-dark)]/60 hover:-translate-y-1 transition-all duration-200"
              >
                <iframe
                  title={`SoundCloud player: ${title}`}
                  width="100%"
                  height="300"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  loading="lazy"
                  src={embedUrl}
                  className="w-full"
                />
                <div className="px-5 py-4">
                  <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
                    {title}
                  </h3>
                  <span className="text-xs text-[var(--color-accent-light)] font-mono">
                    {artist}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-8 flex justify-center">
            <a
              href="https://soundcloud.com/wwwetz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors font-mono"
            >
              View all on SoundCloud →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── YouTube ──────────────────────────────────────────────────────── */}
      <section id="youtube" className="py-24 px-6 bg-[var(--color-surface-2)]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader number={2} title="YouTube" />
          <div className="grid gap-6 sm:grid-cols-2">
            {youtubeVideos.map(({ title, description, embedId }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.1)}
                className="flex flex-col bg-[var(--color-surface-3)] rounded-xl overflow-hidden border border-white/5 hover:border-[var(--color-accent-dark)]/60 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="aspect-video w-full">
                  <iframe
                    title={`YouTube video: ${title}`}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${embedId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
                    {title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-8 flex justify-center">
            <a
              href="https://www.youtube.com/@wetzxx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent-light)] transition-colors font-mono"
            >
              View all on YouTube →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Portfolio ────────────────────────────────────────────────────── */}
      <section id="music-portfolio" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader number={3} title="Portfolio" />
          <motion.div {...fadeUp(0.1)}>
            <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12 -mt-4">
              Original compositions and productions.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioTracks.map((track, i) => (
              <PortfolioCard key={track.title} {...track} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center">
          <a
            href="#hero"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </footer>
    </div>
  );
}
