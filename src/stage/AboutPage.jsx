// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useState, useSyncExternalStore } from 'react'
import { ArrowLeft, ArrowUpRight, Copy, Check, EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'
import FlexCarousel from '../components/gallery/FlexCarousel'
import { projects } from './projects'
import { emblems } from '../brand/emblems'
import profile480 from '../assets/profile-480.webp'
import profile960 from '../assets/profile-960.webp'
import photo01 from '../assets/about/photo-01.svg'
import photo02 from '../assets/about/photo-02.svg'
import photo03 from '../assets/about/photo-03.svg'
import photo04 from '../assets/about/photo-04.svg'
import './about.css'

// Replace these local placeholders with Ryan's own photos and descriptions.
const photos = [photo01, photo02, photo03, photo04].map((src, index) => ({
  src, title: `Frame ${String(index + 1).padStart(2, '0')}`,
  subtitle: 'Personal photo coming soon', alt: `Placeholder for personal photo ${index + 1}`,
}))
const email = 'rwetz00@gmail.com'
// Four academic years ending at May 2027 graduation; position is computed from today.
const degree = { start: new Date('2023-08-21T00:00:00-05:00'), end: new Date('2027-05-15T00:00:00-05:00') }
const years = ['Freshman', 'Sophomore', 'Junior', 'Senior']
const campusTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' })

const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = callback => {
  const query = motionQuery()
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function useNow(interval) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(timer)
  }, [interval])
  return now
}

function DegreeProgress() {
  const now = useNow(60_000)
  const span = degree.end - degree.start
  const progress = Math.min(1, Math.max(0, (now - degree.start) / span))
  const months = Math.max(0, Math.round((degree.end - now) / (1000 * 60 * 60 * 24 * 30.44)))
  const remaining = progress >= 1 ? 'Graduated' : months <= 1 ? 'Graduating this month' : `About ${months} months to graduation`
  return <div className="degree">
    <div className="degree-heading"><span>Computer Science, minor in AI</span><span>{remaining}</span></div>
    <div className="degree-track" role="meter" aria-label="Progress through my degree" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-valuetext={`${Math.round(progress * 100)} percent, ${remaining.toLowerCase()}`}>
      <span className="degree-fill" style={{ '--progress': progress }} />
      <span className="degree-marker" style={{ '--progress': progress }} />
    </div>
    <ol className="degree-years">{years.map((year, index) => <li key={year} data-current={Math.floor(progress * 4) === index || undefined}>{year}</li>)}<li>May 2027</li></ol>
  </div>
}

function CampusClock() {
  const now = useNow(15_000)
  return <p className="campus-clock"><span className="campus-dot" aria-hidden="true" />Campus time in Fargo <time dateTime={now.toISOString()}>{campusTime.format(now)}</time></p>
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])
  return <button type="button" className="about-copy" onClick={() => {
    navigator.clipboard?.writeText(email).then(() => { setCopied(true); toast('Email address copied') }, () => toast('Copy failed. The address is ' + email))
  }}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? 'Copied' : 'Copy address'}</button>
}

export default function AboutPage({ returnProject }) {
  const reduced = useSyncExternalStore(subscribe, () => motionQuery().matches)
  useEffect(() => { document.getElementById('about-title')?.focus({ preventScroll: true }) }, [])
  return <article className="about-page" aria-labelledby="about-title">
    <a className="about-back" href={returnProject ? `#/${returnProject}` : '#/'}><ArrowLeft aria-hidden="true" /> Back to selected work</a>
    <section id="about" className="about-hero">
      <div className="about-intro">
        <p className="about-kicker">A little context</p>
        <h1 id="about-title" tabIndex={-1}>Hi, I’m Ryan<span>.</span></h1>
        <p className="about-lead">I build tools for the terminal, the everyday, and the things I can’t stop thinking about.</p>
        <div className="about-page-bio">
          <p>I’m in my senior year at North Dakota State University, studying Computer Science with a minor in Artificial Intelligence. I’m working toward graduation in May 2027.</p>
        </div>
      </div>
      <figure className="about-portrait">
        <img src={profile960} srcSet={`${profile480} 480w, ${profile960} 960w`} sizes="(max-width: 760px) 70vw, 380px" alt="Portrait of Ryan Wetzstein" width="480" height="640" />
        <figcaption><span>NDSU</span><span>Class of 2027</span></figcaption>
      </figure>
    </section>
    <section className="about-now" aria-label="Where things stand">
      <DegreeProgress />
      <CampusClock />
    </section>
    <section className="about-building" aria-labelledby="building-title">
      <h2 id="building-title">What I’m building</h2>
      <ul>{projects.map(project => <li key={project.id}>
        <a href={`#/${project.id}`} style={{ '--object-accent': project.palette.accent }}>
          <svg viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg>
          <span><strong>{project.name}</strong><small>{project.kind}</small></span>
        </a>
      </li>)}</ul>
    </section>
    <section id="contact" className="about-page-contact" aria-labelledby="contact-title">
      <div><p className="about-kicker">Get in touch</p><h2 id="contact-title">Let’s make something.</h2><p className="about-contact-note">Write about a project, an opportunity, or something you’re building.</p></div>
      <div>
        <div className="about-email-row">
          <a className="about-email" href={`mailto:${email}`}>{email} <ArrowUpRight aria-hidden="true" /></a>
          <CopyEmail />
        </div>
        <div className="about-socials">
          <a href={`mailto:${email}`}><EnvelopeSimple aria-hidden="true" /> Email</a>
          <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer"><GithubLogo aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" /></a>
          <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer"><LinkedinLogo aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <section className="about-gallery" aria-labelledby="about-gallery-title">
      <div className="about-gallery-heading"><h2 id="about-gallery-title">A few frames.</h2><p>Personal photos coming soon.</p></div>
      <div className="about-photos">
        {!reduced && <FlexCarousel items={photos} preset="liquid" intro="none" cardHeight={.76} radius={16} fit="portrait" captions={false} autoplay={false} captureWheel={false} focusOnClick={false} />}
        <ul className="photo-fallback" aria-label="Personal photo placeholders">{photos.map(photo => <li key={photo.src}><img src={photo.src} alt={photo.alt} width="600" height="760" /></li>)}</ul>
      </div>
      {!reduced && <p className="about-gallery-hint">Drag to explore, or focus the gallery and use the arrow keys.</p>}
    </section>
  </article>
}
