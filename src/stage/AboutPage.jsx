// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect, useSyncExternalStore } from 'react'
import { ArrowLeft, ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import FlexCarousel from '../components/gallery/FlexCarousel'
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
const motionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = callback => {
  const query = motionQuery()
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

export default function AboutPage({ returnProject }) {
  const reduced = useSyncExternalStore(subscribe, () => motionQuery().matches)
  useEffect(() => { document.getElementById('about-title')?.focus({ preventScroll: true }) }, [])
  return <article className="about-page" aria-labelledby="about-title">
    <a className="about-back" href={returnProject ? `#/${returnProject}` : '#/'}><ArrowLeft aria-hidden="true" /> Back to selected work</a>
    <section id="about" className="about-hero">
      <div>
        <p className="about-kicker">A little context</p>
        <h1 id="about-title" tabIndex={-1}>Hi, I’m Ryan<span>.</span></h1>
        <p className="about-lead">I build tools for the terminal, the everyday, and the things I can’t stop thinking about.</p>
      </div>
      <div className="about-page-bio">
        <p>I’m in my senior year at North Dakota State University, studying Computer Science with a minor in Artificial Intelligence. I’m working toward graduation in May 2027.</p>
        <p className="about-school">NDSU <span aria-hidden="true">·</span> Class of 2027</p>
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
    <section id="contact" className="about-page-contact" aria-labelledby="contact-title">
      <div><p className="about-kicker">Get in touch</p><h2 id="contact-title">Let’s make something.</h2></div>
      <div>
        <a className="about-email" href="mailto:rwetz00@gmail.com">rwetz00@gmail.com <ArrowUpRight aria-hidden="true" /></a>
        <div className="about-socials">
          <a href="mailto:rwetz00@gmail.com"><EnvelopeSimple aria-hidden="true" /> Email</a>
          <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer"><GithubLogo aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" /></a>
          <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer"><LinkedinLogo aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  </article>
}
