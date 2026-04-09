import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Resume from './components/Resume'
import Contact from './components/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Resume />
        <Contact />
      </main>
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[var(--color-muted)]">Built with React + Vite + Tailwind CSS</span>
          <div className="flex items-center gap-5">
            <a href="mailto:rwetz00@gmail.com" aria-label="Email" className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              <svg width="20" height="20"><use href="/icons.svg#gmail-icon" /></svg>
            </a>
            <a href="https://github.com/rwetz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              <svg width="20" height="20"><use href="/icons.svg#github-icon" /></svg>
            </a>
            <a href="https://linkedin.com/in/ryan-wetzstein" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              <svg width="20" height="20"><use href="/icons.svg#linkedin-icon" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
