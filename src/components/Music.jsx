import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
// Portfolio card — real-time Web Audio waveform (#66) + gradient bars (#bonus)
// ---------------------------------------------------------------------------
function PortfolioCard({ title, description, tags, audioSrc, index }) {
  const audioRef    = useRef(null);
  const canvasRef   = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef      = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Memoized static bar heights, unique per card (#63)
  const staticBars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, k) =>
        Math.abs(
          Math.sin((k + index * 3) * 0.75) * 16 +
          Math.cos((k + index * 2) * 0.35) * 8
        )
      ),
    [index]
  );

  // Set up AudioContext + AnalyserNode once per audio element (#66)
  const setupAudio = () => {
    if (audioCtxRef.current) return;
    const ctx   = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.82;
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const startViz = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const draw = () => {
      const w   = canvas.offsetWidth;
      const h   = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      const ctx2d = canvas.getContext("2d");
      const data  = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);

      ctx2d.clearRect(0, 0, w, h);

      const count = data.length;
      const barW  = (w / count) * 0.6;
      const step  = w / count;

      for (let i = 0; i < count; i++) {
        const barH = Math.max(2, (data[i] / 255) * h);
        const x    = i * step;
        const y    = h - barH;

        const grad = ctx2d.createLinearGradient(0, h, 0, y);
        grad.addColorStop(0, "rgba(91,33,182,0.85)");
        grad.addColorStop(0.5, "rgba(124,58,237,0.95)");
        grad.addColorStop(1, "rgba(167,139,250,1)");
        ctx2d.fillStyle = grad;

        if (ctx2d.roundRect) {
          ctx2d.beginPath();
          ctx2d.roundRect(x, y, barW, barH, 2);
          ctx2d.fill();
        } else {
          ctx2d.fillRect(x, y, barW, barH);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopViz = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const handleEnter = () => {
    if (!audioRef.current) return;
    setupAudio();
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        setPlaying(true);
        startViz();
      })
      .catch(() => {});
  };

  const handleLeave = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    stopViz();
    setPlaying(false);
  };

  useEffect(() => () => {
    stopViz();
    audioCtxRef.current?.close();
  }, []);

  const gradId = `wg-${index}`;

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

      {/* Waveform container */}
      <div className="w-full h-16 rounded-lg bg-[var(--color-surface-2)] mb-4 overflow-hidden relative">
        {/* Static gradient SVG — visible when idle */}
        <svg
          viewBox="0 0 240 40"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor="#5b21b6" stopOpacity="0.7" />
              <stop offset="50%"  stopColor="#7c3aed" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
            </linearGradient>
          </defs>
          {staticBars.map((h, k) => (
            <rect
              key={k}
              x={k * 5 + 1}
              y={20 - h}
              width="3"
              height={h * 2}
              fill={`url(#${gradId})`}
              rx="1"
            />
          ))}
        </svg>

        {/* Real-time canvas — visible when playing */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed flex-1 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] font-mono">
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

export default function Music() {
  return (
    <div>
      {/* ── Hero (#60: balanced height) ──────────────────────────────────── */}
      <section className="relative min-h-[60vh] md:min-h-[50vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
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
              Original compositions and productions. Hover to preview.
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
