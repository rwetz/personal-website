import { motion } from "framer-motion";
import { BookOpen, Disc3, Film } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const books = [
  {
    title: "Think and Grow Rich!",
    author: "Napoleon Hill",
    why: " The book that I've been heavily interested in recently. ",
  },
  {
    title: "The Bazaar of Bad Dreams",
    author: "Stephen King",
    why: ' Just a "For Fun" book I\'ve been reading recently. ',
  },
];

const albums = [
  {
    title: "Shallow Bay: The Best Of Breaking Benjamin",
    artist: "Breaking Benjamin",
    why: ' "Greatest Hits" albums are always full of bangers. ',
  },
  {
    title: "Wonder What\'s Next (Expanded Edition)",
    artist: "Chevelle",
    why: "Emphasis on the expanded edition.",
  },
  {
    title: "Life Starts Now",
    artist: "Three Days Grace",
    why: " Can you tell I'm a nu metal guy? ",
  },
  {
    title: "Sade Songs In General",
    artist: "Sade",
    why: " Gotta love Sade, the vibes are immaculate. ",
  },
  {
    title: "Unmusique",
    artist: "Lucy Bedroque",
    why: " This album has been on repeat for me since it\'s come out, it turned me into a Lucy Bedroque fan. ",
  },
];

const films = [
  {
    title: "Lord of the Rings Series",
    director: "Peter Jackson",
    why: " Can\'t believe it took me this long to watch these movies I absolutely love them. ",
  },
  {
    title: "Tropic Thunder",
    director: "Ben Stiller",
    why: " Man, oh man. ",
  },
  {
    title: "Shutter Island",
    director: "Martin Scorsese",
    why: " I was in utter awe after this one, one of my new favorite movies. ",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    why: " Interesting. ",
  },
  {
    title: "Silence of the Lambs",
    director: "Jonathan Demme",
    why: " Now I see what all the hype was about. ",
  },
];

const SECTIONS = [
  {
    key: "books",
    label: "Books",
    icon: BookOpen,
    color: "#67e8f9",
    items: books,
    field: "author",
  },
  {
    key: "albums",
    label: "Albums",
    icon: Disc3,
    color: "#f9b8d0",
    items: albums,
    field: "artist",
  },
  {
    key: "films",
    label: "Films",
    icon: Film,
    color: "#fbbf24",
    items: films,
    field: "director",
  },
];

function Item({ item, field, accent }) {
  return (
    <HoverCard openDelay={150} closeDelay={120}>
      <HoverCardTrigger asChild>
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group cursor-default p-4 rounded-lg bg-[var(--color-surface-3)] border border-white/5 hover:border-[var(--color-accent-dark)]/60 transition-colors"
        >
          <div className="text-sm font-medium text-[var(--color-text)] leading-snug mb-1 line-clamp-2">
            {item.title}
          </div>
          <div className="text-xs text-[var(--color-muted)]">{item[field]}</div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--color-text)]">
            {item.title}
          </h4>
          <div
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: accent }}
          >
            {item[field]}
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed pt-1 italic">
            &ldquo;{item.why}&rdquo;
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function Inspiration() {
  return (
    <section id="inspiration" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs font-mono text-[var(--color-accent-light)] tracking-widest">
            // 07
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mt-1 mb-2">
            Inspiration
          </h2>
          <div className="accent-bar" />
          <p className="text-[var(--color-muted)] text-base max-w-xl mb-10">
            The books, albums, and films that I've been into recently
          </p>
        </motion.div>

        <div className="space-y-12">
          {SECTIONS.map(
            ({ key, label, icon: Icon, color, items, field }, secIdx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: secIdx * 0.08 }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}22`, color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--color-accent-light)]">
                    {label}
                  </h3>
                </div>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.04 } },
                    hidden: {},
                  }}
                >
                  {items.map((item) => (
                    <motion.div
                      key={item.title}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.3 },
                        },
                      }}
                    >
                      <Item item={item} field={field} accent={color} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
