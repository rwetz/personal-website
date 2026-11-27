// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useState, useSyncExternalStore } from 'react'
import { ArrowLeft, Copy, Check, EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
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

// Placeholder frames until Ryan adds his own photos: swap each src, title and alt.
const photos = [photo01, photo02, photo03, photo04].map((src, index) => ({
  src, title: `Frame ${String(index + 1).padStart(2, '0')}`, alt: `Photo placeholder ${index + 1}`,
}))
const email = 'rwetz00@gmail.com'
const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = callback => {
  const query = motionQuery()
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
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
        <h1 id="about-title" tabIndex={-1}>Hi, I’m Ryan<span>.</span></h1>
        <div className="about-page-bio">
          <p>I’m a senior at North Dakota State University, studying computer science with a minor in AI. I graduate in May 2027.</p>
        </div>
      </div>
      <figure className="about-portrait">
        <img src={profile960} srcSet={`${profile480} 480w, ${profile960} 960w`} sizes="(max-width: 760px) 70vw, 380px" alt="Portrait of Ryan Wetzstein" width="480" height="640" />
        <figcaption><span>NDSU</span><span>Class of 2027</span></figcaption>
      </figure>
    </section>
    <section className="about-building" aria-labelledby="building-title">
      <h2 id="building-title">Projects</h2>
      <ul>{projects.map(project => <li key={project.id}>
        <a href={`#/${project.id}`} style={{ '--object-accent': project.palette.accent }}>
          <svg viewBox="0 0 1024 1024" aria-hidden="true"><path d={emblems[project.id]} fill="currentColor" fillRule="evenodd" /></svg>
          <span><strong>{project.name}</strong><small>{project.kind}</small></span>
        </a>
      </li>)}</ul>
    </section>
    <section id="contact" className="about-page-contact" aria-labelledby="contact-title">
      <div><h2 id="contact-title">Contact</h2></div>
      <div>
        <div className="about-email-row">
          <a className="about-email" href={`mailto:${email}`}>{email}</a>
          <CopyEmail />
        </div>
        <div className="about-socials">
          <a href={`mailto:${email}`}><EnvelopeSimple aria-hidden="true" /> Email</a>
          <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer"><GithubLogo aria-hidden="true" /> GitHub</a>
          <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer"><LinkedinLogo aria-hidden="true" /> LinkedIn</a>
        </div>
      </div>
    </section>
    <section className="about-gallery" aria-labelledby="about-gallery-title">
      <h2 id="about-gallery-title">Photos</h2>
      <div className="about-photos">
        {!reduced && <FlexCarousel items={photos} preset="liquid" intro="none" cardHeight={.76} radius={16} fit="portrait" captions={false} autoplay={false} captureWheel={false} focusOnClick={false} />}
        <ul className="photo-fallback" aria-label="Photos">{photos.map(photo => <li key={photo.src}><img src={photo.src} alt={photo.alt} width="600" height="760" /></li>)}</ul>
      </div>
    </section>
  </article>
}
