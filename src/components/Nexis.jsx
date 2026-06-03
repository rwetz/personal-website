import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import nexisLogoSrc from '../assets/logo (1) (1).png'
import signatureImg from '../assets/signature.png'
import ssWelcome   from '../assets/nexis/welcome.png'
import ssEditor    from '../assets/nexis/editor.png'
import ssAI        from '../assets/nexis/ai.png'
import ssTerminal  from '../assets/nexis/terminal.png'
import ssSettings  from '../assets/nexis/settings.png'
import ssShortcuts from '../assets/nexis/shortcuts.png'
import ssMarkdown  from '../assets/nexis/markdown.png'
import ssFeatures  from '../assets/nexis/features.png'
import {
  ChevronRight, Download, ExternalLink, Star,
  Terminal, FileCode2, Bot, Palette,
  // header icons
  PanelLeft, LayoutGrid, Settings, Keyboard, Search,
  // sidebar rail icons
  Folder, Clock3, GitBranch, Cpu, Network, Layers, TerminalSquare,
  AlignLeft, Code2, FlaskConical, Database, Hammer, GitPullRequest,
  Wand2, Globe, Zap, Bookmark, StickyNote, ScrollText, Server,
  Rocket, History,
  // file tree
  FolderOpen, File, ChevronDown,
  // tabs
  Plus, X, ShieldOff,
  // ai panel
  SendHorizonal, Sparkles,
} from 'lucide-react'

// ── Nexis dark theme tokens ─────────────────────────────────────────────────
// Derived from globals.css .dark: oklch values → hex approximations
const N = {
  bg:        '#1b2232',   // --background
  card:      '#242e3f',   // --card
  hover:     '#2d3a4f',   // --accent (hover bg)
  fg:        '#f0f4f9',   // --foreground
  primary:   '#d8e4ef',   // --primary (active text/icons)
  muted:     '#2c3a50',   // --muted
  mutedFg:   '#8a9db8',   // --muted-foreground
  border:    'rgba(255,255,255,0.09)', // --border
  borderBr:  'rgba(255,255,255,0.13)',
  ring:      '#4d6480',
  green:     '#4ade80',
  red:       '#f87171',
  yellow:    '#fbbf24',
  blue:      '#60a5fa',
  purple:    '#a78bfa',
  teal:      '#2dd4bf',
}

// ── GitHub data hook ─────────────────────────────────────────────────────────
const GH_REPO    = 'https://api.github.com/repos/rwetz/Nexis'
const GH_RELEASE = 'https://api.github.com/repos/rwetz/Nexis/releases/latest'
const GH_HEADERS = { Accept: 'application/vnd.github+json' }
const GH_CACHE_KEY = 'nexis_gh_v1'

function useNexisGithub() {
  const [gh, setGh] = useState({ stars: null, forks: null, version: null, pushed: null })

  useEffect(() => {
    // Return cached data immediately, then still re-fetch in the background
    try {
      const hit = sessionStorage.getItem(GH_CACHE_KEY)
      if (hit) setGh(JSON.parse(hit))
    } catch {}

    Promise.all([
      fetch(GH_REPO,    { headers: GH_HEADERS }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(GH_RELEASE, { headers: GH_HEADERS }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([repo, release]) => {
      const result = {
        stars:   repo?.stargazers_count   ?? null,
        forks:   repo?.forks_count        ?? null,
        version: release?.tag_name        ?? null,
        pushed:  repo?.pushed_at          ?? null,
      }
      try { sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify(result)) } catch {}
      setGh(result)
    }).catch(() => {})
  }, [])

  return gh
}

// ── Logo ─────────────────────────────────────────────────────────────────────
function NexisLogo({ className = 'size-5' }) {
  return <img src={nexisLogoSrc} alt="Nexis" className={className} style={{ borderRadius: '22%' }} />
}

// ── File tree ─────────────────────────────────────────────────────────────────
const INITIAL_TREE = [
  { id: 'nexis',      name: 'nexis',           isDir: true,  depth: 0, open: true,  parent: null },
  { id: 'src',        name: 'src',             isDir: true,  depth: 1, open: true,  parent: 'nexis' },
  { id: 'app',        name: 'app',             isDir: true,  depth: 2, open: true,  parent: 'src' },
  { id: 'App.tsx',    name: 'App.tsx',         isDir: false, depth: 3, parent: 'app' },
  { id: 'Welcome',    name: 'WelcomeScreen.tsx',isDir: false, depth: 3, parent: 'app' },
  { id: 'comp',       name: 'components',      isDir: true,  depth: 2, open: false, parent: 'src' },
  { id: 'modules',    name: 'modules',         isDir: true,  depth: 2, open: false, parent: 'src' },
  { id: 'styles',     name: 'styles',          isDir: true,  depth: 2, open: true,  parent: 'src' },
  { id: 'globals',    name: 'globals.css',     isDir: false, depth: 3, parent: 'styles' },
  { id: 'src-tauri',  name: 'src-tauri',       isDir: true,  depth: 1, open: false, parent: 'nexis' },
  { id: 'pkg',        name: 'package.json',    isDir: false, depth: 1, parent: 'nexis' },
  { id: 'readme',     name: 'README.md',       isDir: false, depth: 1, parent: 'nexis' },
]

const FILE_COLORS = {
  tsx: N.blue, ts: N.blue, jsx: N.blue, js: '#f0db4f',
  css: N.purple, json: N.yellow, md: N.mutedFg,
}
const getFgColor = (name) => {
  const ext = name.split('.').pop()
  return FILE_COLORS[ext] ?? N.mutedFg
}

function FileTree({ selected, onSelect }) {
  const [openDirs, setOpenDirs] = useState(() => {
    const s = new Set()
    INITIAL_TREE.forEach(n => n.isDir && n.open && s.add(n.id))
    return s
  })

  const toggle = (id) => setOpenDirs(s => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  const isVisible = (node) => {
    if (node.depth === 0 || node.depth === 1) return true
    const parent = INITIAL_TREE.find(n => n.id === node.parent)
    if (!parent) return false
    return openDirs.has(parent.id) && isVisible(parent)
  }

  return (
    <div className="py-1 select-none text-xs overflow-y-auto h-full">
      <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: N.mutedFg }}>
        Explorer
      </div>
      {INITIAL_TREE.filter(isVisible).map(node => {
        const isOpen = openDirs.has(node.id)
        const isActive = selected === node.id
        return (
          <div
            key={node.id}
            onClick={() => node.isDir ? toggle(node.id) : onSelect(node.id)}
            className="flex items-center gap-1 rounded mx-1 cursor-pointer transition-colors duration-75"
            style={{
              paddingLeft: `${6 + node.depth * 12}px`,
              paddingTop: 3, paddingBottom: 3, paddingRight: 8,
              background: isActive ? N.hover : 'transparent',
              color: isActive ? N.fg : N.mutedFg,
            }}
          >
            {node.isDir ? (
              <>
                <ChevronDown
                  className="w-3 h-3 shrink-0 transition-transform duration-150"
                  style={{
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    color: N.mutedFg,
                  }}
                />
                {isOpen
                  ? <FolderOpen className="w-3.5 h-3.5 shrink-0" style={{ color: N.blue }} />
                  : <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: N.blue }} />}
              </>
            ) : (
              <>
                <span className="w-3 shrink-0" />
                <File className="w-3 h-3 shrink-0" style={{ color: getFgColor(node.name) }} />
              </>
            )}
            <span
              className="truncate text-[11.5px] leading-none"
              style={{ color: isActive ? N.fg : node.isDir ? N.primary : N.mutedFg }}
            >
              {node.name}
            </span>
            {node.id === 'globals' && (
              <span className="ml-auto text-[9px] px-1 rounded" style={{ background: N.muted, color: N.mutedFg }}>M</span>
            )}
            {node.id === 'App.tsx' && (
              <span className="ml-auto text-[9px] px-1 rounded" style={{ background: N.muted, color: N.mutedFg }}>M</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Sidebar rail ──────────────────────────────────────────────────────────────
const RAIL_ITEMS = [
  { id: 'explorer',     icon: Folder,         label: 'Files' },
  { id: 'recent',       icon: Clock3,         label: 'Recent Files' },
  { id: 'git',          icon: GitBranch,      label: 'Source Control', badge: 2 },
  { id: 'processes',    icon: Cpu,            label: 'Processes' },
  { id: 'ports',        icon: Network,        label: 'Ports' },
  { id: 'profiles',     icon: Layers,         label: 'Profiles' },
  { id: 'repl',         icon: TerminalSquare, label: 'REPL' },
  { id: 'outline',      icon: AlignLeft,      label: 'Outline' },
  { id: 'snippets',     icon: Code2,          label: 'Snippets' },
  { id: 'tests',        icon: FlaskConical,   label: 'Tests' },
  { id: 'database',     icon: Database,       label: 'Database' },
  { id: 'build',        icon: Hammer,         label: 'Build' },
  { id: 'codereview',   icon: GitPullRequest, label: 'Code Review' },
  { id: 'agents',       icon: Bot,            label: 'Agent Queue' },
  { id: 'symbols',      icon: Search,         label: 'Symbol Search' },
  { id: 'refactor',     icon: Wand2,          label: 'AI Refactor' },
  { id: 'share',        icon: Globe,          label: 'Share' },
  { id: 'templates',    icon: Zap,            label: 'Prompt Templates' },
  { id: 'bookmarks',    icon: Bookmark,       label: 'Bookmarks' },
  { id: 'notes',        icon: StickyNote,     label: 'Notes' },
  { id: 'shellsnip',    icon: ScrollText,     label: 'Shell Snippets' },
  { id: 'ssh',          icon: Server,         label: 'SSH' },
  { id: 'release',      icon: Rocket,         label: 'Release' },
]

function SidebarRail({ active, onChange }) {
  return (
    <div
      className="flex items-center shrink-0 border-t"
      style={{ height: 44, background: N.card, borderColor: N.border, padding: '0 4px' }}
    >
      {/* Scrollable icon strip with fade edges */}
      <div className="relative flex-1 min-w-0 overflow-hidden">
        <div
          className="flex items-center gap-px overflow-x-auto py-1"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {RAIL_ITEMS.map(({ id, icon: Icon, label, badge }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                title={label}
                onClick={() => onChange(id)}
                className="relative flex items-center justify-center shrink-0 rounded transition-colors duration-100"
                style={{
                  width: 30, height: 30,
                  background: isActive ? `${N.primary}12` : 'transparent',
                  color: isActive ? N.primary : N.mutedFg,
                }}
              >
                <Icon style={{ width: 13, height: 13 }} strokeWidth={isActive ? 2 : 1.75} />
                {badge > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 flex items-center justify-center text-[8px] font-bold rounded-full leading-none"
                    style={{
                      minWidth: 12, height: 12, padding: '0 2px',
                      background: isActive ? N.primary : `${N.mutedFg}bb`,
                      color: N.bg,
                    }}
                  >
                    {badge}
                  </span>
                )}
                {isActive && (
                  <span
                    className="absolute inset-y-2 left-0 rounded-full"
                    style={{ width: 2, background: N.primary }}
                  />
                )}
              </button>
            )
          })}
        </div>
        {/* Fade right edge to hint scrollability */}
        <div
          className="absolute right-0 inset-y-0 w-6 pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${N.card})` }}
        />
      </div>
      <div className="shrink-0 mx-1 rounded-full" style={{ width: 1, height: 16, background: N.border }} />
      <button
        title="Commit history"
        className="flex items-center justify-center shrink-0 rounded transition-colors"
        style={{ width: 30, height: 30, color: N.mutedFg }}
      >
        <History style={{ width: 13, height: 13 }} strokeWidth={1.75} />
      </button>
    </div>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
const TABS_INITIAL = [
  { id: 1, kind: 'terminal', title: 'zsh',         icon: Terminal,   private: false },
  { id: 2, kind: 'editor',   title: 'App.tsx',     icon: FileCode2,  private: false },
  { id: 3, kind: 'editor',   title: 'globals.css', icon: FileCode2,  private: false },
]

function TabBar({ tabs, activeId, onSelect, onClose }) {
  return (
    <div className="flex items-center min-w-0 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = tab.id === activeId
        return (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className="group flex items-center gap-1.5 shrink-0 border-r cursor-pointer select-none transition-colors"
            style={{
              height: 40, paddingLeft: 12, paddingRight: 8,
              borderColor: N.border,
              background: isActive ? N.bg : N.card,
              borderBottom: isActive ? `1px solid ${N.bg}` : `1px solid ${N.border}`,
              color: isActive ? N.fg : N.mutedFg,
              position: 'relative',
            }}
          >
            {tab.private && <ShieldOff style={{ width: 11, height: 11, color: N.yellow }} />}
            <Icon style={{ width: 13, height: 13, color: isActive ? N.blue : N.mutedFg }} strokeWidth={1.75} />
            <span className="text-[12px]">{tab.title}</span>
            <button
              onClick={e => { e.stopPropagation(); onClose(tab.id) }}
              className="flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: 16, height: 16, color: N.mutedFg }}
            >
              <X style={{ width: 10, height: 10 }} />
            </button>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: N.blue }} />
            )}
          </div>
        )
      })}
      <button
        className="flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:bg-white/10 active:bg-white/15"
        style={{ width: 32, height: 40, color: N.mutedFg }}
        title="New tab"
      >
        <Plus style={{ width: 14, height: 14 }} />
      </button>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────
// Reusable icon button with hover + active states
function HdrBtn({ onClick, title, children, style }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center shrink-0 rounded cursor-pointer transition-colors hover:bg-white/10 active:bg-white/15"
      style={{ width: 28, height: 28, color: N.mutedFg, ...style }}
    >
      {children}
    </button>
  )
}

function Header({ tabs, activeId, onSelect, onClose, onToggleSidebar, onToggleAI }) {
  return (
    <div
      className="flex items-center shrink-0 border-b gap-2 select-none"
      style={{ height: 40, background: N.card, borderColor: N.border, paddingLeft: 8, paddingRight: 4 }}
    >
      {/* macOS traffic lights — hover dims slightly, active shrinks */}
      <div className="flex gap-1.5 shrink-0 pl-1">
        {[['#ff5f57', 'Close'], ['#febc2e', 'Minimize'], ['#28c840', 'Maximize']].map(([bg, label]) => (
          <button
            key={label}
            title={label}
            className="w-3 h-3 rounded-full cursor-pointer transition-all hover:brightness-110 active:scale-90"
            style={{ background: bg }}
          />
        ))}
      </div>

      {/* Sidebar toggle */}
      <HdrBtn onClick={onToggleSidebar} title="Toggle sidebar">
        <PanelLeft style={{ width: 17, height: 17 }} strokeWidth={1.75} />
      </HdrBtn>

      {/* Split button */}
      <HdrBtn title="Split terminal">
        <LayoutGrid style={{ width: 15, height: 15 }} strokeWidth={1.75} />
      </HdrBtn>

      <div className="shrink-0" style={{ width: 1, height: 20, background: N.border }} />

      {/* Tab bar */}
      <TabBar tabs={tabs} activeId={activeId} onSelect={onSelect} onClose={onClose} />

      <div className="flex items-center gap-0.5 shrink-0 ml-1">
        <HdrBtn onClick={onToggleAI} title="Toggle AI panel">
          <Sparkles style={{ width: 15, height: 15 }} strokeWidth={1.75} />
        </HdrBtn>
        <HdrBtn title="Keyboard shortcuts">
          <Keyboard style={{ width: 15, height: 15 }} strokeWidth={1.75} />
        </HdrBtn>
        <HdrBtn title="Settings">
          <Settings style={{ width: 14, height: 14 }} strokeWidth={1.75} />
        </HdrBtn>
      </div>
    </div>
  )
}

// ── Terminal pane ─────────────────────────────────────────────────────────────
const PROMPT_STR = 'ryan@nexis ~/nexis'

const CANNED_CMDS = {
  'help': `Available demo commands:\n  \x1b[33mls\x1b[0m            list files\n  \x1b[33mgit status\x1b[0m    working tree\n  \x1b[33mgit log\x1b[0m       recent commits\n  \x1b[33mnexis -v\x1b[0m      version info\n  \x1b[33mclear\x1b[0m         clear screen`,
  'ls':   `\x1b[34msrc\x1b[0m  \x1b[34msrc-tauri\x1b[0m  \x1b[34mpublic\x1b[0m  package.json  tsconfig.json  README.md  vite.config.ts`,
  'ls -la': `total 56\ndrwxr-xr-x  9 ryan staff   288 Jun  1 14:22 \x1b[34m.\x1b[0m\n-rw-r--r--  1 ryan staff   872 Jun  1 14:20 package.json\n-rw-r--r--  1 ryan staff  4180 Jun  1 09:45 README.md\ndrwxr-xr-x  8 ryan staff   256 Jun  1 14:22 \x1b[34msrc\x1b[0m\ndrwxr-xr-x  4 ryan staff   128 May 21 12:00 \x1b[34msrc-tauri\x1b[0m`,
  'git status': `On branch \x1b[32mmain\x1b[0m\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n\n\t\x1b[31mmodified:   src/app/App.tsx\x1b[0m\n\t\x1b[31mmodified:   src/styles/globals.css\x1b[0m`,
  'git log': `\x1b[33ma9f3c21\x1b[0m (HEAD -> main) add AI diff approval workflow\n\x1b[33mb7d1e09\x1b[0m terminal: persist tab layout across restarts\n\x1b[33mc3a8f44\x1b[0m editor: vim mode + F2 workspace rename\n\x1b[33md5b2901\x1b[0m themes: add Catppuccin Mocha, Nord, Tokyo Night`,
  'pwd': `~/nexis`,
  'whoami': `ryan`,
  'clear': '__clear__',
}

function ansiToJsx(line) {
  const parts = line.split(/(\x1b\[\d+m)/)
  let col = null
  return parts.map((p, i) => {
    const m = p.match(/\x1b\[(\d+)m/)
    if (m) {
      const n = parseInt(m[1])
      col = n === 0 ? null : { 31: N.red, 32: N.green, 33: N.yellow, 34: N.blue, 35: N.purple, 36: N.teal }[n] ?? col
      return null
    }
    return <span key={i} style={col ? { color: col } : undefined}>{p}</span>
  })
}

function TerminalPane({ version = 'v1.13.0' }) {
  const [lines, setLines] = useState(() => [
    { text: `Nexis ${version} — type \x1b[33mhelp\x1b[0m for demo commands`, cmd: false },
    { text: '', cmd: false },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef  = useRef(null)

  // Build commands with live version
  const cmds = useMemo(() => ({
    ...CANNED_CMDS,
    'nexis -v': `Nexis ${version}\nRuntime: Tauri 2 · Rust 1.87 · React 19\nPlatform: ${navigator?.platform || 'darwin'}\nLicense: Apache-2.0`,
  }), [version])

  // Scroll within the terminal container — NOT the page
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const run = useCallback((raw) => {
    const cmd = raw.trim()
    if (!cmd) return
    setHistory(h => [cmd, ...h])
    setHistIdx(-1)
    const out = cmds[cmd] ?? `\x1b[31mbash: ${cmd}: command not found\x1b[0m`
    if (out === '__clear__') { setLines([]); return }
    setLines(prev => [
      ...prev,
      { text: cmd, cmd: true },
      ...out.split('\n').map(t => ({ text: t, cmd: false })),
    ])
  }, [cmds])

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); setInput('') }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx(i => { const n = Math.min(i + 1, history.length - 1); setInput(history[n] ?? ''); return n })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx(i => { const n = Math.max(i - 1, -1); setInput(n === -1 ? '' : history[n]); return n })
    }
  }

  return (
    <div
      className="flex flex-col h-full font-mono text-xs cursor-text"
      style={{ background: '#0f1623', color: N.fg }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-5 whitespace-pre-wrap">
            {line.cmd ? (
              <>
                <span style={{ color: N.green }}>{PROMPT_STR}</span>
                <span style={{ color: N.mutedFg }}> $ </span>
                <span style={{ color: N.fg }}>{line.text}</span>
              </>
            ) : (
              <span>{ansiToJsx(line.text)}</span>
            )}
          </div>
        ))}
        <div className="flex items-center leading-5">
          <span style={{ color: N.green }}>{PROMPT_STR}</span>
          <span style={{ color: N.mutedFg }}> $ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent"
            style={{ color: N.fg, caretColor: N.blue, outline: 'none', boxShadow: 'none' }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}

// ── Editor pane ───────────────────────────────────────────────────────────────
const EDITOR_CONTENT = {
  'App.tsx': `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QuickFilePicker } from "@/components/QuickFilePicker";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { CommandPalette } from "@/components/CommandPalette";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarState } from "./useSidebarState";
import { useDialogCoordinator } from "./useDialogCoordinator";
import {
  FloatingAiPanel,
  hasAnyKey,
  useChatStore,
} from "@/modules/ai";
import { AiComposerProvider } from "@/modules/ai/lib/composer";
import { EditorStack } from "@/modules/editor";
import { FileExplorer } from "@/modules/explorer";
import { Header } from "@/modules/header";
import { FileExplorer, type FileExplorerHandle } from "@/modules/explorer";
import { SidebarRail } from "@/modules/sidebar";
import { StatusBar } from "@/modules/statusbar";
import { TerminalStack } from "@/modules/terminal";
import { useTabs, useWorkspaceCwd } from "@/modules/tabs";

export default function App() {
  const { sidebarOpen, toggleSidebar } = useSidebarState();
  const { tabs, activeId, openFileTab, closeTab } = useTabs();
  const cwd = useWorkspaceCwd();

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header
          tabs={tabs}
          activeId={activeId}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {sidebarOpen && (
              <>
                <ResizablePanel defaultSize="200px" minSize="120px" maxSize="400px">
                  <div className="flex h-full flex-col">
                    <FileExplorer rootPath={cwd} onOpenFile={openFileTab} />
                    <SidebarRail activeView="explorer" />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}
            <ResizablePanel>
              <TerminalStack cwd={cwd} />
            </ResizablePanel>
          </ResizablePanelGroup>
          <FloatingAiPanel />
        </main>
        <StatusBar cwd={cwd} />
      </div>
    </TooltipProvider>
  );
}`,
  'globals.css': `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./fonts.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-sans: 'Inter Variable', sans-serif;
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-border: var(--border);
    --color-primary: var(--primary);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --radius: 0.625rem;
}

:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.148 0.004 228.8);
    --card: oklch(1 0 0);
    --primary: oklch(0.218 0.008 223.9);
    --muted: oklch(0.963 0.002 197.1);
    --muted-foreground: oklch(0.56 0.021 213.5);
    --border: oklch(0.925 0.005 214.3);
    --radius: 0.625rem;
}

.dark {
    --background: oklch(0.148 0.004 228.8);
    --foreground: oklch(0.987 0.002 197.1);
    --card: oklch(0.218 0.008 223.9);
    --primary: oklch(0.925 0.005 214.3);
    --muted: oklch(0.275 0.011 216.9);
    --muted-foreground: oklch(0.723 0.014 214.4);
    --border: oklch(1 0 0 / 10%);
}`,
}

function syntaxHighlight(code, lang) {
  const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  let s = escape(code)

  if (lang === 'tsx' || lang === 'ts') {
    s = s
      .replace(/(\/\/[^\n]*)/g, `<span style="color:${N.mutedFg}">$1</span>`)
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:#a5d6ff">$1</span>`)
      .replace(/\b(import|export|from|default|const|let|var|return|function|type|interface|extends|implements|if|else|for|while|async|await|void|null|undefined|true|false)\b/g,
        `<span style="color:#ff7b72">$1</span>`)
      .replace(/\b([A-Z][A-Za-z0-9]*)\b(?=[\s<({])/g, `<span style="color:#79c0ff">$1</span>`)
      .replace(/(@[a-z]+)/g, `<span style="color:${N.yellow}">$1</span>`)
  } else if (lang === 'css') {
    s = s
      .replace(/(\/\*[\s\S]*?\*\/)/g, `<span style="color:${N.mutedFg}">$1</span>`)
      .replace(/(@[\w-]+)/g, `<span style="color:${N.purple}">$1</span>`)
      .replace(/(--[\w-]+)/g, `<span style="color:${N.teal}">$1</span>`)
      .replace(/(:[\w-]+\([^)]*\)|:\s*[\w#%.-]+)/g, `<span style="color:#a5d6ff">$1</span>`)
      .replace(/([\w-]+)(?=\s*:)/g, `<span style="color:${N.blue}">$1</span>`)
  }
  return s
}

function EditorPane({ file }) {
  const code = EDITOR_CONTENT[file] ?? ''
  const ext = file.split('.').pop()
  const lang = ext === 'tsx' || ext === 'ts' ? 'tsx' : 'css'
  const lines = code.split('\n')

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0f1623' }}>
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1 px-4 py-1.5 text-[11px] border-b shrink-0"
        style={{ background: N.card, borderColor: N.border, color: N.mutedFg }}
      >
        <span>src</span>
        <ChevronRight style={{ width: 11, height: 11 }} />
        <span>{file.includes('globals') ? 'styles' : 'app'}</span>
        <ChevronRight style={{ width: 11, height: 11 }} />
        <span style={{ color: N.fg }}>{file}</span>
      </div>
      {/* Code */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-5">
        <div className="flex gap-3">
          <div className="text-right shrink-0 select-none" style={{ color: N.mutedFg, minWidth: '1.75rem' }}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div className="flex-1 overflow-x-auto">
            {lines.map((line, i) => (
              <div
                key={i}
                style={{ color: N.fg }}
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(line, lang) || ' ' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── AI panel ──────────────────────────────────────────────────────────────────
const AI_MESSAGES = [
  {
    role: 'user',
    text: 'can you extract the tab-open logic in App.tsx into a custom hook?',
  },
  {
    role: 'ai',
    text: "Sure — I'll extract it into `useTabs`. Here's the plan:\n\n• Move `openFileTab`, `closeTab`, and the tabs array into a new hook\n• The hook owns tab state and exposes only the minimal surface App needs\n• No behaviour changes, just reorganised",
    tool: { name: 'str_replace_editor', file: 'src/modules/tabs/useTabs.ts', status: 'done' },
  },
  { role: 'user', text: 'looks good, also add a pinTab function' },
  { role: 'ai', text: "Done — added `pinTab(id)` that converts a preview tab to persistent. I've also updated `TabBar` to call it on double-click.", streaming: false },
]

function AIPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(AI_MESSAGES)

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { role: 'user', text: input.trim() }])
    setInput('')
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: 'Working on it…', streaming: true }])
    }, 600)
  }

  return (
    <div
      className="flex flex-col h-full border-l"
      style={{ width: 272, background: N.card, borderColor: N.border }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ borderColor: N.border }}
      >
        <div className="flex items-center gap-2">
          <Sparkles style={{ width: 14, height: 14, color: N.purple }} />
          <span className="text-xs font-medium" style={{ color: N.fg }}>AI</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: N.muted, color: N.mutedFg }}>
          claude-sonnet-4-6
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div
                  className="rounded-lg rounded-br-sm px-3 py-2 text-xs max-w-[90%]"
                  style={{ background: N.muted, color: N.fg }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs leading-relaxed" style={{ color: N.fg }}>
                  {msg.text.split('\n').map((line, j) => (
                    <div key={j}>{line || <br />}</div>
                  ))}
                </div>
                {msg.tool && (
                  <div
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-[11px] border"
                    style={{ background: `${N.green}08`, borderColor: `${N.green}30`, color: N.mutedFg }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: N.green }} />
                    <span className="font-mono" style={{ color: N.teal }}>{msg.tool.name}</span>
                    <span className="truncate">{msg.tool.file}</span>
                  </div>
                )}
                {msg.streaming && (
                  <div className="flex gap-1">
                    {[0,1,2].map(j => (
                      <div
                        key={j}
                        className="w-1 h-1 rounded-full animate-bounce"
                        style={{ background: N.mutedFg, animationDelay: `${j * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 p-2 border-t" style={{ borderColor: N.border }}>
        <div
          className="flex items-end gap-2 rounded-lg px-3 py-2 text-xs border"
          style={{ background: N.muted, borderColor: N.borderBr }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask AI…"
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-xs leading-relaxed"
            style={{ color: N.fg, caretColor: N.blue, outline: 'none', boxShadow: 'none' }}
          />
          <button
            onClick={send}
            className="shrink-0 flex items-center justify-center rounded transition-colors"
            style={{ width: 22, height: 22, background: N.blue, color: '#fff' }}
          >
            <SendHorizonal style={{ width: 11, height: 11 }} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-1.5" style={{ color: `${N.mutedFg}80` }}>
          @ files &nbsp;·&nbsp; # snippets &nbsp;·&nbsp; /commands
        </p>
      </div>
    </div>
  )
}

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar({ activeTab }) {
  const isEditor = activeTab?.kind === 'editor'
  return (
    <div
      className="relative flex items-center justify-between shrink-0 px-3 text-[11px]"
      style={{ height: 32, background: N.card, color: N.mutedFg }}
    >
      {/* gradient top border */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: 1, background: `linear-gradient(to right, transparent, ${N.border} 30%, ${N.border} 70%, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1" style={{ color: N.blue }}>
          <GitBranch style={{ width: 10, height: 10 }} />
          main
        </span>
        <span>~/nexis{isEditor && activeTab ? `/src/${activeTab.title.includes('globals') ? 'styles' : 'app'}/${activeTab.title}` : ''}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span style={{ color: N.green }}>●</span>
          0 errors
        </span>
        <span
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px]"
          style={{ background: `${N.purple}20`, color: N.purple }}
        >
          <Sparkles style={{ width: 9, height: 9 }} />
          claude-sonnet-4-6
        </span>
      </div>
    </div>
  )
}

// ── Full demo shell ───────────────────────────────────────────────────────────
function NexisDemo({ version = 'v1.13.0' }) {
  const [tabs, setTabs] = useState(TABS_INITIAL)
  const [activeId, setActiveId] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiOpen, setAiOpen] = useState(false)
  const [railView, setRailView] = useState('explorer')
  const [selectedFile, setSelectedFile] = useState('App.tsx')
  const demoRef = useRef(null)

  // Auto-collapse sidebar when demo container is narrow
  useEffect(() => {
    const el = demoRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSidebarOpen(entry.contentRect.width >= 560)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const closeTab = (id) => {
    setTabs(t => {
      const next = t.filter(x => x.id !== id)
      if (activeId === id && next.length) setActiveId(next[next.length - 1].id)
      return next
    })
  }

  const activeTab = tabs.find(t => t.id === activeId)

  const selectFile = (fileId) => {
    setSelectedFile(fileId)
    const name = INITIAL_TREE.find(n => n.id === fileId)?.name
    if (!name || INITIAL_TREE.find(n => n.id === fileId)?.isDir) return
    const existing = tabs.find(t => t.title === name)
    if (existing) { setActiveId(existing.id); return }
    const newId = Date.now()
    setTabs(t => [...t, { id: newId, kind: 'editor', title: name, icon: FileCode2, private: false }])
    setActiveId(newId)
  }

  return (
    <div
      ref={demoRef}
      className="flex flex-col rounded-xl overflow-hidden border shadow-2xl"
      style={{ height: 580, background: N.bg, borderColor: N.borderBr }}
    >
      <Header
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeTab}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        onToggleAI={() => setAiOpen(v => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        {sidebarOpen && (
          <div
            className="flex flex-col border-r shrink-0"
            style={{ width: 192, background: N.bg, borderColor: N.border, overflow: 'clip' }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <FileTree selected={selectedFile} onSelect={selectFile} />
            </div>
            <SidebarRail active={railView} onChange={setRailView} />
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {activeTab?.kind === 'terminal' && <TerminalPane version={version} />}
            {activeTab?.kind === 'editor' && activeTab.title && (
              EDITOR_CONTENT[activeTab.title]
                ? <EditorPane file={activeTab.title} />
                : (
                  <div className="flex h-full items-center justify-center text-xs" style={{ background: '#0f1623', color: N.mutedFg }}>
                    {activeTab.title}
                  </div>
                )
            )}
          </div>
          {aiOpen && <AIPanel />}
        </div>
      </div>

      <StatusBar activeTab={activeTab} />
    </div>
  )
}

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Terminal,
    title: 'Terminal',
    color: N.green,
    bullets: ['Full PTY — PowerShell, cmd, WSL distros', 'Unlimited tabs + split panes', 'Shell integration & history search', 'WebGL xterm.js rendering'],
  },
  {
    icon: FileCode2,
    title: 'Code Editor',
    color: N.blue,
    bullets: ['JS/TS, Python, Rust, HTML, CSS, Markdown, JSON', 'AI inline autocomplete & per-hunk diff approval', 'Vim mode + Prettier formatting', 'Minimap, breadcrumbs, F2 rename'],
  },
  {
    icon: Bot,
    title: 'AI Agent',
    color: N.purple,
    bullets: ['Reads & edits files, runs shell commands', 'Searches the codebase, spawns sub-agents', 'Claude, GPT-4, Gemini, Ollama support', 'Keys stored in OS keychain — zero telemetry'],
  },
  {
    icon: GitBranch,
    title: 'Git & Source Control',
    color: '#f97316',
    bullets: ['Staging, diffs, and commit history', 'Conflict resolution & stash management', 'Worktrees & PR description generation'],
  },
  {
    icon: Code2,
    title: 'Debugger',
    color: N.red,
    bullets: ['DAP-based debugger', 'Breakpoints & debug toolbar', 'Variable inspection & call stack'],
  },
  {
    icon: Zap,
    title: 'Language Intelligence',
    color: N.teal,
    bullets: ['LSP completions & go-to-definition', 'Hover docs & inline diagnostics', 'Symbol search & F2 rename'],
  },
  {
    icon: Layers,
    title: 'Notebooks',
    color: N.yellow,
    bullets: ['Jupyter-style interactive notebooks', 'Run cells inline with rich output', 'Mix code, markdown, and results'],
  },
  {
    icon: Globe,
    title: 'Web Preview',
    color: '#06b6d4',
    bullets: ['Inline browser preview pane', 'Live reload alongside your editor', 'No context switching needed'],
  },
  {
    icon: Server,
    title: 'SSH & Containers',
    color: '#a78bfa',
    bullets: ['Connect to remote machines', 'Full workspace over SSH', 'Container environment support'],
  },
  {
    icon: Cpu,
    title: 'Process & Port Manager',
    color: '#ec4899',
    bullets: ['View all running processes', 'Monitor open ports alongside your workspace', 'Kill or inspect processes inline'],
  },
]

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
const SHORTCUTS = [
  { label: 'New terminal',        keys: ['Ctrl', 'T'] },
  { label: 'New editor tab',      keys: ['Ctrl', 'E'] },
  { label: 'Quick open file',     keys: ['Ctrl', 'P'] },
  { label: 'Command palette',     keys: ['Ctrl', 'Shift', 'P'] },
  { label: 'Split pane',          keys: ['Ctrl', 'D'] },
  { label: 'Open AI agent',       keys: ['Ctrl', 'I'] },
  { label: 'Keyboard shortcuts',  keys: ['Ctrl', 'K'] },
  { label: 'Open settings',       keys: ['Ctrl', ','] },
  { label: 'New window',          keys: ['Ctrl', 'Shift', 'N'] },
  { label: 'Switch workspace',    keys: ['Ctrl', '`'] },
]

// ── Sidebar panels ────────────────────────────────────────────────────────────
const PANELS = [
  'Files', 'Recent Files', 'Source Control', 'Processes', 'Outline',
  'Debugger', 'Tests', 'Build', 'Bookmarks', 'Ports', 'Profiles',
  'REPL', 'Snippets', 'Database', 'Code Review', 'Agent Queue',
  'Symbol Search', 'AI Refactor', 'Prompt Templates', 'Workspace Notes',
  'Shell Snippets', 'SSH', 'Release',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Nexis() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const gh = useNexisGithub()
  const version = gh.version ?? 'v1.13.0'

  const stats = [
    { num: version,   label: 'Latest release' },
    { num: '< 10 MB', label: 'App size'        },
    { num: '0',       label: 'Telemetry'       },
    { num: '3',       label: 'Platforms'       },
    ...(gh.stars != null ? [{ num: gh.stars.toLocaleString(), label: 'GitHub stars' }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>

      {/* ── Nav ── */}
      <nav
        className="dot-grid"
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          borderBottom: '1px solid #dddddd',
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#hero" style={{ display: 'flex', textDecoration: 'none', opacity: 1, transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 0.6 }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 1 }}
          >
            <img src={signatureImg} alt="Ryan Wetzstein" style={{ height: 18, width: 'auto' }} />
          </a>
          <span style={{ color: '#dddddd', fontSize: 18, fontWeight: 300, lineHeight: 1 }}>/</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NexisLogo className="size-5" />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#181d26' }}>Nexis</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="dot-grid" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 20 }}>
              Project
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
              <NexisLogo className="size-12" />
              <h1 style={{ fontSize: 'clamp(40px, 6.5vw, 72px)', fontWeight: 400, color: '#181d26', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
                Nexis
              </h1>
            </div>
            <p style={{ fontSize: 16, color: '#333840', lineHeight: 1.65, maxWidth: 520, margin: '0 0 20px' }}>
              Open-source, AI-native terminal and developer environment built with Tauri and React.
              Under 10 MB, zero telemetry, runs on your own API keys.
            </p>

            {/* Attribution */}
            <div
              style={{
                display: 'inline-flex', flexDirection: 'column', gap: 8,
                padding: '14px 18px',
                background: '#f8fafc',
                border: '1px solid #dddddd',
                borderRadius: 10,
                marginBottom: 36,
                maxWidth: 520,
              }}
            >
              <p style={{ fontSize: 13, color: '#41454d', lineHeight: 1.6, margin: 0 }}>
                Forked from{' '}
                <a href="https://github.com/crynta/terax-ai" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#181d26', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #dddddd' }}>
                  Terax
                </a>
                {' '}by{' '}
                <a href="https://github.com/crynta" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#181d26', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #dddddd' }}>
                  crynta
                </a>
                . I extended the original project with additional features, panels, and AI integrations
                under the{' '}
                <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#ebebeb', padding: '1px 5px', borderRadius: 4 }}>Apache-2.0</span>
                {' '}license.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href="https://github.com/crynta/terax-ai" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#9297a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  terax-ai
                </a>
                <a href="https://github.com/crynta" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#9297a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  crynta
                </a>
                <a href="https://www.youtube.com/channel/UC59t7lAzjS0yA6HTk9Eg34A" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#9297a0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 56 }}>
              <a
                href="https://github.com/rwetz/Nexis"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px',
                  backgroundColor: '#181d26', color: '#ffffff',
                  borderRadius: 12, fontSize: 15, fontWeight: 500,
                  textDecoration: 'none', minHeight: 48,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                View on GitHub
                {gh.stars != null && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star style={{ width: 11, height: 11 }} /> {gh.stars}
                  </span>
                )}
              </a>
              <a
                href="https://github.com/rwetz/Nexis/releases"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px',
                  backgroundColor: '#ffffff', color: '#181d26',
                  border: '1px solid #c8ccd2',
                  borderRadius: 12, fontSize: 15, fontWeight: 500,
                  textDecoration: 'none', minHeight: 48,
                }}
              >
                <Download style={{ width: 15, height: 15 }} />
                Download {version}
              </a>
            </div>

            {/* Stats strip */}
            <div style={{ borderTop: '1px solid #dddddd', paddingTop: 32, display: 'flex', flexWrap: 'wrap', gap: '0' }}>
              {stats.map(({ num, label }, i) => (
                <div
                  key={label}
                  style={{
                    paddingRight: 40, marginRight: 40, paddingBottom: 8,
                    borderRight: i < stats.length - 1 ? '1px solid #dddddd' : 'none',
                  }}
                >
                  <p style={{ fontSize: 28, fontWeight: 400, color: '#181d26', lineHeight: 1, margin: '0 0 6px', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>{num}</p>
                  <p style={{ fontSize: 11, color: '#9297a0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'radial-gradient(circle, #d0d3d8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
              Features
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: 0 }}>
              Everything in one window.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, color, bullets }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #c8ccd2',
                  borderRadius: 10,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: `${color}15`, borderRadius: 8, display: 'flex' }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: '#181d26', margin: 0 }}>{title}</h3>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bullets.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#333840', lineHeight: 1.55 }}>
                      <span style={{ color: '#9297a0', flexShrink: 0, marginTop: 1 }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shortcuts + Panels ── */}
      <section style={{ backgroundColor: '#181d26', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64 }}>

          {/* Shortcuts */}
          <motion.div {...fadeUp(0)}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              Keyboard shortcuts
            </p>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 32px' }}>
              Every action, one keystroke away.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SHORTCUTS.map(({ label, keys }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {keys.map(k => (
                      <kbd
                        key={k}
                        style={{
                          fontSize: 11, fontFamily: 'monospace',
                          padding: '3px 7px', borderRadius: 5,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.14)',
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: 1.4,
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Panels */}
          <motion.div {...fadeUp(0.1)}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              Sidebar panels
            </p>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 32px' }}>
              {PANELS.length} panels. Pin only what you use.
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PANELS.map((panel, i) => (
                <motion.span
                  key={panel}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: i * 0.03 }}
                  style={{
                    fontSize: 12, fontWeight: 400,
                    padding: '5px 12px', borderRadius: 9999,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {panel}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Screenshot showcase ── */}
      <section
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'radial-gradient(circle, #d0d3d8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          padding: '96px 40px',
          borderTop: '1px solid #dddddd',
        }}
      >
          <motion.div {...fadeUp(0)} style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
              In practice
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: 0 }}>
              Built for real workflows.
            </h2>
          </motion.div>

          {/* 2-column showcase grid — full bleed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            {[
              { label: 'Welcome screen',     caption: 'Clean start. Quick access to recent workspaces and projects the moment you open the app.',           accent: N.blue,    img: ssWelcome   },
              { label: 'Code editor',        caption: 'Syntax highlighting, AI inline completions, breadcrumbs, and a minimap — all in one pane.',           accent: N.teal,    img: ssEditor    },
              { label: 'AI agent',           caption: 'Bring your own API key. Claude, GPT-4, Gemini, or a local Ollama model — zero telemetry.',            accent: N.purple,  img: ssAI        },
              { label: 'Terminal',           caption: 'Full PTY with WebGL rendering. Split panes, tab history, and shell integration built in.',             accent: N.green,   img: ssTerminal  },
              { label: 'Markdown viewer',    caption: 'Render README files, docs, and notes inline. No switching to a browser to preview markdown.',         accent: N.mutedFg, img: ssMarkdown  },
              { label: 'Feature browser',    caption: 'Every capability listed and searchable from inside the app. Discover what Nexis can do at a glance.', accent: '#f97316', img: ssFeatures  },
              { label: 'Settings',           caption: 'Granular control over themes, keybinds, AI models, fonts, and workspace behaviour.',                  accent: '#f97316', img: ssSettings  },
              { label: 'Keyboard shortcuts', caption: 'Every command is customizable. Remap anything from a searchable shortcuts panel.',                    accent: N.yellow,  img: ssShortcuts },
            ].map(({ label, caption, accent, img }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: (i % 2) * 0.08 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #c8ccd2',
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                {/* Screenshot — natural height, no crop */}
                <div style={{ background: N.bg, lineHeight: 0 }}>
                  <img
                    src={img}
                    alt={label}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>

                {/* Caption */}
                <div style={{ padding: '24px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#181d26' }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#41454d', lineHeight: 1.6, margin: 0 }}>{caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
      </section>

      {/* ── Interactive demo ── */}
      <section className="dot-grid" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41454d', marginBottom: 12 }}>
              Interactive demo
            </p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#181d26', lineHeight: 1.2, margin: '0 0 12px' }}>
              Try it yourself.
            </h2>
            <p style={{ fontSize: 14, color: '#41454d', margin: 0 }}>
              Click files in the explorer · switch tabs · type commands · toggle the AI panel with ✦
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <NexisDemo version={version} />
          </motion.div>
        </div>
      </section>

      {/* ── CTA — dark ── */}
      <section style={{ backgroundColor: '#181d26', padding: '96px 24px' }}>
        <motion.div
          style={{ maxWidth: 1280, margin: '0 auto' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
            Open source
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.25, margin: '0 0 20px', maxWidth: 520 }}>
            Star the repo, file issues, or open a pull request.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 400, margin: '0 0 36px' }}>
            Apache-2.0 licensed. Contributions of all kinds welcome.
          </p>
          <a
            href="https://github.com/rwetz/Nexis"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 24px',
              backgroundColor: '#ffffff', color: '#181d26',
              borderRadius: 12, fontSize: 16, fontWeight: 500,
              textDecoration: 'none', minHeight: 48,
            }}
          >
            View on GitHub
          </a>
        </motion.div>
      </section>

    </div>
  )
}
