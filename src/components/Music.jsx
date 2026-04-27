import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
import Dither from "./Dither";
import signatureImg from "../assets/signature.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

// ---------------------------------------------------------------------------

const soundcloudTracks = [
  {
    title: "fally*s",
    artist: "yescairo",
    // visual=false → compact waveform player (#61)
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1246395475&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
  {
    title: "love it (bet)",
    artist: "TH5NKY5U",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2202118263&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
  {
    title: "Seasalt𒀯",
    artist: "yescairo",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1410696142&color=%2332252a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
];

const youtubeVideos = [
  { title: "Delinquency", description: "2022", embedId: "sSkXq6nFepE" },
  { title: "Artisan",     description: "2022", embedId: "vd5d0_9r_lc" },
];

const portfolioTracks = [
  {
    title: "1",
    description: "2026",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track1.mp3",
  },
  {
    title: "2",
    description: "2025",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track2.mp3",
  },
  {
    title: "3",
    description: "2026",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track3.mp3",
  },
  {
    title: "4",
    description: "2026",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track4.mp3",
  },
  {
    title: "5",
    description: "2026",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track5.mp3",
  },
  {
    title: "6",
    description: "2026",
    tags: ["Original", "Produced"],
    audioSrc: "/audio/track6.mp3",
  },
];

// ---------------------------------------------------------------------------
// Lite YouTube embed — thumbnail shown until user clicks (#62)
// ---------------------------------------------------------------------------
function LiteYouTube({ embedId, title }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="aspect-video w-full relative bg-black overflow-hidden cursor-pointer group"
      onClick={() => setActive(true)}
    >
      {!active ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${embedId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-200" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <iframe
          title={`YouTube video: ${title}`}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portfolio card — Wavesurfer.js real waveform from audio file
// ---------------------------------------------------------------------------
function PortfolioCard({ title, description, tags, audioSrc, index }) {
  const waveContainerRef = useRef(null);
  const wsRef            = useRef(null);
  const [playing, setPlaying]   = useState(false);
  const [ready, setReady]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);

  useEffect(() => {
    if (!waveContainerRef.current) return;

    const style = getComputedStyle(document.documentElement)
    const ws = WaveSurfer.create({
      container: waveContainerRef.current,
      waveColor: style.getPropertyValue('--color-accent').trim() || '#7c3aed',
      progressColor: style.getPropertyValue('--color-accent-light').trim() || '#a78bfa',
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 64,
      normalize: true,
      backend: "WebAudio",
      url: audioSrc,
      fetchParams: { cache: "force-cache" },
    });

    ws.on("ready", () => {
      setReady(true);
      setDuration(ws.getDuration());
    });
    ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("play",  () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("finish", () => {
      setPlaying(false);
      setCurrentTime(0);
    });

    wsRef.current = ws;
    return () => ws.destroy();
  }, [audioSrc]);

  const togglePlay = () => {
    wsRef.current?.playPause();
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      {...fadeUp(index * 0.1)}
      className="flex flex-col bg-[var(--color-surface-3)] rounded-xl p-6 border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-all duration-200"
    >
      {/* Waveform */}
      <div
        ref={waveContainerRef}
        className="w-full rounded-lg bg-[var(--color-surface-2)] mb-3 overflow-hidden cursor-pointer"
        onClick={togglePlay}
      />

      {/* Controls row */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={togglePlay}
          disabled={!ready}
          aria-label={playing ? "Pause" : "Play"}
          className="w-9 h-9 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <rect x="1" y="1" width="4" height="10" rx="1" />
              <rect x="7" y="1" width="4" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <polygon points="2,1 11,6 2,11" />
            </svg>
          )}
        </button>
        <span className="text-xs font-mono text-[var(--color-muted)] tabular-nums">
          {fmt(currentTime)} / {ready ? fmt(duration) : "--:--"}
        </span>
        {playing && (
          <span className="ml-auto text-xs text-[var(--color-accent-light)] font-mono animate-pulse">
            ♪ playing
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] font-mono">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------

function SectionHeader({ number, title, delay = 0 }) {
  return (
    <motion.div {...fadeUp(delay)}>
      <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">
        // {String(number).padStart(2, "0")}
      </span>
      <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">{title}</h2>
      <div className="accent-bar" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------

function hexToRgbFloat(hex) {
  const h = hex.replace('#', '').trim()
  if (h.length !== 6) return [0.486, 0.227, 0.929]
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function getAccentFloat() {
  return hexToRgbFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
  )
}

export default function Music() {
  const [ditherColor, setDitherColor] = useState(() => getAccentFloat())

  useEffect(() => {
    const obs = new MutationObserver(() => setDitherColor(getAccentFloat()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div>
      {/* ── Hero (#60: balanced height) ──────────────────────────────────── */}
      <section className="relative min-h-[60vh] md:min-h-[50vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Dither
            waveColor={ditherColor}
            waveSpeed={0.04}
            waveFrequency={2.5}
            waveAmplitude={0.35}
            colorNum={4}
            pixelSize={3}
            enableMouseInteraction={true}
            mouseRadius={0.8}
          />
        </div>

        <a
          href="#hero"
          aria-label="Back to portfolio"
          className="absolute top-6 left-6 z-10 hover:opacity-70 transition-opacity"
        >
          <img src={signatureImg} alt="Ryan Wetzstein" className="h-8 w-auto invert" />
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
          <h1
            className="text-5xl sm:text-6xl font-bold text-[var(--color-text)] mb-4"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Music
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-md">
            Producing, recording, and exploring sound.
          </p>
        </motion.div>
      </section>

      {/* ── SoundCloud (#61: visual=false compact player) ─────────────────── */}
      <section id="soundcloud" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader number={1} title="SoundCloud" />
          <p className="text-[var(--color-muted)] text-lg max-w-xl mb-12 -mt-4">
            Songs produced by me. For a full list of all public songs produced
            by me see my &ldquo;prod. wetz&rdquo; playlist on SoundCloud.
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
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  loading="lazy"
                  src={embedUrl}
                  className="w-full"
                />
                <div className="px-5 py-4">
                  <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
                  <span className="text-xs text-[var(--color-accent-light)] font-mono">{artist}</span>
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

      {/* ── YouTube (#62: lite embed — thumbnail until click) ─────────────── */}
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
                <LiteYouTube embedId={embedId} title={title} />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
                  <p className="text-[var(--color-muted)] text-sm">{description}</p>
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

      {/* ── Portfolio (#63 useMemo, #66 Web Audio, gradient waveform) ────── */}
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
