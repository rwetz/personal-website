// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { useEffect } from 'react'
import { User, Briefcase, FolderSimple, Wrench, Envelope, Copy, DownloadSimple, ArrowSquareOut } from '@phosphor-icons/react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { toast } from '@/components/ui/sonner'

const EMAIL = 'rwetz00@gmail.com'

const navigate = [
  { id: 'projects',   label: 'Projects',   icon: FolderSimple, hash: '#projects'   },
  { id: 'about',      label: 'About',      icon: User,         hash: '#about'      },
  { id: 'experience', label: 'Experience', icon: Briefcase,    hash: '#experience' },
  { id: 'skills',     label: 'Skills',     icon: Wrench,       hash: '#skills'     },
  { id: 'contact',    label: 'Contact',    icon: Envelope,         hash: '#contact'    },
]

export default function CommandPalette({ open, onClose }) {
  // Cmd+K toggle handled in App.jsx; here just close on hash change
  useEffect(() => {
    const onHash = () => onClose()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [onClose])

  const go = (hash) => () => { window.location.hash = hash; onClose() }
  const copyEmail = async () => {
    onClose()
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast.success('Email copied to clipboard', { description: EMAIL })
    } catch {
      toast.error('Couldn’t copy. The address is ' + EMAIL)
    }
  }
  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = '/resume.pdf'
    a.download = 'Ryan_Wetzstein_Resume.pdf'
    a.click()
    onClose()
  }
  const openExternal = (url) => () => { window.open(url, '_blank', 'noopener,noreferrer'); onClose() }

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

        <CommandGroup heading="Actions">
          <CommandItem onSelect={copyEmail}>
            <Copy /> <span>Copy email address</span>
          </CommandItem>
          <CommandItem onSelect={downloadResume}>
            <DownloadSimple /> <span>Download resume</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="External">
          <CommandItem onSelect={openExternal('https://nexisdev.org')}>
            <ArrowSquareOut /> <span>Nexis</span>
          </CommandItem>
          <CommandItem onSelect={openExternal('https://github.com/rwetz')}>
            <ArrowSquareOut /> <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={openExternal('https://linkedin.com/in/ryan-wetzstein')}>
            <ArrowSquareOut /> <span>LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
