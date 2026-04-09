export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">
        About Me
      </h2>
      <div className="w-12 h-1 bg-[var(--color-accent)] rounded mb-10" />
      <div className="flex flex-col md:flex-row items-center gap-12">
        <img
          src="/src/assets/profile.jpg"
          alt="Ryan"
          className="shrink-0 w-40 h-40 rounded-full object-cover border-2 border-[var(--color-accent)]/40"
        />
        <div className="text-[var(--color-muted)] text-lg leading-relaxed text-left space-y-4">
          <p>
            Hi! I&apos;m Ryan — a software developer with a passion for building
            things that live on the internet. I enjoy turning ideas into
            elegant, performant applications.
          </p>
          <p>
            When I&apos;m not coding, you can find me exploring new technologies,
            contributing to open source, or enjoying the outdoors.
          </p>
          <p>
            I&apos;m currently open to new opportunities — feel free to reach out!
          </p>
        </div>
      </div>
    </section>
  )
}
