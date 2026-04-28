import { useEffect } from 'react'
import { User, FolderKanban, Zap, FileText, Mail, Music, Piano, Copy, Download, Sparkles, BookOpen, Activity, ExternalLink } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { toast } from '@/components/ui/sonner'

const EMAIL = 'rwetz00@gmail.com'

const navigate = [
  { id: 'about',    label: 'About',    icon: User,         hash: '#about' },
  { id: 'now',      label: 'Now',      icon: Sparkles,     hash: '#now' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, hash: '#projects' },
  { id: 'skills',   label: 'Skills',   icon: Zap,          hash: '#skills' },
  { id: 'stats',    label: 'GitHub Stats', icon: Activity, hash: '#stats' },
  { id: 'resume',   label: 'Resume',   icon: FileText,     hash: '#resume' },
  { id: 'inspiration', label: 'Inspiration', icon: BookOpen, hash: '#inspiration' },
  { id: 'contact',  label: 'Contact',  icon: Mail,         hash: '#contact' },
]

const tools = [
  { id: 'music', label: 'Music page',  icon: Music, hash: '#music' },
  { id: 'daw',   label: 'Open DAW',    icon: Piano, hash: '#daw' },
]

export default function CommandPalette({ open, onClose }) {
  // Cmd+K toggle handled in App.jsx; here just close on hash change
  useEffect(() => {
    const onHash = () => onClose()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [onClose])

  const go = (hash) => () => { window.location.hash = hash; onClose() }
  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    toast.success('Email copied to clipboard', { description: EMAIL })
    onClose()
  }
  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = '/resume.pdf'
    a.download = ''
    a.click()
    onClose()
  }
  const openExternal = (url) => () => { window.open(url, '_blank'); onClose() }

  return (
    <CommandDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {navigate.map(({ id, label, icon: Icon, hash }) => (
            <CommandItem key={id} onSelect={go(hash)}>
              <Icon /> <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tools">
          {tools.map(({ id, label, icon: Icon, hash }) => (
            <CommandItem key={id} onSelect={go(hash)}>
              <Icon /> <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={copyEmail}>
            <Copy /> <span>Copy email address</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={downloadResume}>
            <Download /> <span>Download resume</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="External">
          <CommandItem onSelect={openExternal('https://github.com/rwetz')}>
            <ExternalLink /> <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={openExternal('https://linkedin.com/in/ryan-wetzstein')}>
            <ExternalLink /> <span>LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
