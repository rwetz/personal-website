import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const skillGroups = [
  {
    category: "AI / Machine Learning",
    skills: [
      {
        name: "Python",
        icon: "devicon-python-plain",
        color: "#3572A5",
        level: "Beginner",
        years: "3 yrs",
        note: "I've been steadily getting better and better with Python",
      },
      {
        name: "PyTorch",
        icon: "devicon-pytorch-plain",
        color: "#EE4C2C",
        level: "Beginner",
        years: "0.5 yrs",
        note: "Just scratched the surface with this recently",
      },
      {
        name: "TensorFlow",
        icon: "devicon-tensorflow-original",
        color: "#FF6F00",
        level: "Beginner",
        years: "0.5 yrs",
        note: "Just scratched the surface with this recently",
      },
      {
        name: "NumPy",
        icon: "devicon-numpy-plain",
        color: "#4DABCF",
        level: "Beginner",
        years: "1 yr",
        note: "I've used it here and there",
      },
    ],
  },
  {
    category: "Languages",
    skills: [
      {
        name: "C",
        icon: "devicon-c-plain",
        color: "#A8B9CC",
        level: "Beginner",
        years: "0.5 yrs",
        note: "Systems courses so far, and I love it. Can't wait to learn C++",
      },
      {
        name: "C#",
        icon: "devicon-csharp-plain",
        color: "#178600",
        level: "Beginner",
        years: "2 yrs",
        note: "Mostly .NET stuff",
      },
      {
        name: "Java",
        icon: "devicon-java-plain",
        color: "#B07219",
        level: "Intermediate",
        years: "3 yrs",
        note: "OOP coursework and foundational programming principles.",
      },
      {
        name: "TypeScript",
        icon: "devicon-typescript-plain",
        color: "#2B7489",
        level: "Beginner",
        years: "2 yrs",
        note: "Coursework mainly. My favorite for web work.",
      },
      {
        name: "JavaScript",
        icon: "devicon-javascript-plain",
        color: "#F1E05A",
        level: "Beginner",
        years: "3 yrs",
        note: "Coursework mainly. My second favorite for web work.",
      },
      {
        name: "SQL",
        icon: "devicon-mysql-plain",
        color: "#E38C00",
        level: "Beginner",
        years: "2 yrs",
        note: "Postgres, queries + schema design",
      },
      {
        name: "HTML + CSS",
        icon: "devicon-html5-plain",
        color: "#E34C26",
        level: "Intermediate",
        years: "5 yrs",
        note: "Been making websites for coursework since High School with these two.",
      },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      {
        name: "React",
        icon: "devicon-react-original",
        color: "#61DAFB",
        level: "Beginner",
        years: "0.5 yrs",
        note: "Hooks, Suspense, RSC",
      },
      {
        name: "Node.js",
        icon: "devicon-nodejs-plain",
        color: "#339933",
        level: "Beginner",
        years: "2 yrs",
        note: "APIs, tooling, scripts",
      },
      {
        name: "Next.js",
        icon: "devicon-nextjs-plain",
        color: "#ffffff",
        level: "Beginner",
        years: "0.5 yrs",
        note: "App Router preferred",
      },
      {
        name: "Tailwind CSS",
        icon: "devicon-tailwindcss-plain",
        color: "#38B2AC",
        level: "Beginner",
        years: "1 yr",
        note: "v4 with @theme — this site uses it",
      },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      {
        name: "Git",
        icon: "devicon-git-plain",
        color: "#F05032",
        level: "Beginner",
        years: "4 yrs",
        note: "Rebase > merge, mostly",
      },
      {
        name: "GitHub",
        icon: "devicon-github-original",
        color: "#ffffff",
        level: "Beginner",
        years: "4 yrs",
        note: "Been using for coursework as well as personal project management",
      },
      {
        name: "VS Code",
        icon: "devicon-vscode-plain",
        color: "#007ACC",
        level: "Beginner",
        years: "2 yrs",
        note: "Just what I\'m accustomed to currently",
      },
      {
        name: "Vite",
        icon: "devicon-vitejs-plain",
        color: "#646CFF",
        level: "Beginner",
        years: "1 yr",
        note: "Coursework experience",
      },
    ],
  },
];

const LEVEL_COLOR = {
  Advanced: "text-emerald-300",
  Intermediate: "text-amber-300",
  Beginner: "text-sky-300",
};

function SkillPill({ name, icon, color, level, years, note }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.span
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-3)] text-[var(--color-text)] text-sm border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors duration-200 cursor-default"
        >
          <i
            className={`${icon} text-base transition-colors duration-200`}
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
            }}
          />
          {name}
        </motion.span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px]">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider ${LEVEL_COLOR[level] ?? "text-[var(--color-muted)]"}`}
          >
            {level}
          </span>
          <span className="text-[10px] font-mono text-[var(--color-muted)]">
            ·
          </span>
          <span className="text-[10px] font-mono text-[var(--color-muted)]">
            {years}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text)] leading-snug">{note}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function Skills() {
  return (
    <TooltipProvider delayDuration={150}>
      <section id="skills" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">
              // 04
            </span>
            <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">
              Skills
            </h2>
            <div className="accent-bar" />
            <p className="text-sm text-[var(--color-muted)] mb-8 -mt-4">
              Hover any pill for details.
            </p>
          </motion.div>

          <div className="space-y-10">
            {skillGroups.map(({ category, skills }, groupIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: groupIdx * 0.08,
                }}
              >
                <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-4">
                  {category}
                </h3>
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.04,
                        delayChildren: groupIdx * 0.08,
                      },
                    },
                    hidden: {},
                  }}
                >
                  {skills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                    >
                      <SkillPill {...skill} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
