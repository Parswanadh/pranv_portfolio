'use client'

import * as React from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk'
import { useRouter } from 'next/navigation'
import {
  Home,
  FolderKanban,
  Cpu,
  Wrench,
  FileText,
  Users,
  BookOpen,
  Mail,
  Search,
  ArrowRight,
  Github,
  Linkedin,
} from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

interface Command {
  id: string
  label: string
  icon: React.ElementType
  shortcut?: string
  keywords?: string[]
  action: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  // Toggle command palette with keyboard shortcut
  React.useEffect(() => {
    console.log('[CommandPalette] Event listener attached - Ctrl+K/Cmd+K should work now')

    const down = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K (ensure not in input field)
      const target = e.target as HTMLElement
      const isInputElement = target.tagName === 'INPUT' ||
                           target.tagName === 'TEXTAREA' ||
                           target.isContentEditable

      // Only trigger if not in an input field and the correct keys are pressed
      if (!isInputElement &&
          (e.key === 'k' || e.key === 'K') &&
          (e.metaKey || e.ctrlKey) &&
          !e.shiftKey) {
        console.log('[CommandPalette] Ctrl+K/Cmd+K detected, toggling palette')
        e.preventDefault()
        e.stopPropagation()
        setOpen((prev) => !prev)
      }
    }

    // Add event listener to window with capture to ensure it runs before other handlers
    // Use window instead of document to catch all keyboard events
    window.addEventListener('keydown', down, { capture: true, passive: false } as AddEventListenerOptions)

    // Cleanup function to remove event listener
    return () => {
      console.log('[CommandPalette] Event listener removed')
      window.removeEventListener('keydown', down, { capture: true } as EventListenerOptions)
    }
  }, [])

  // Listen for custom event to open from other components
  React.useEffect(() => {
    const handleToggle = () => {
      setOpen((prev) => !prev)
    }

    window.addEventListener('toggle-command-palette', handleToggle)
    return () => window.removeEventListener('toggle-command-palette', handleToggle)
  }, [])

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-home',
      label: 'Go to Home',
      icon: Home,
      shortcut: 'G then H',
      keywords: ['home', 'landing', 'start'],
      action: () => router.push('/'),
    },
    {
      id: 'nav-projects',
      label: 'View Projects',
      icon: FolderKanban,
      shortcut: 'G then P',
      keywords: ['projects', 'work', 'portfolio'],
      action: () => router.push('/projects'),
    },
    {
      id: 'nav-agents',
      label: 'Meet the Agents',
      icon: Cpu,
      shortcut: 'G then A',
      keywords: ['agents', 'ai', 'tools'],
      action: () => router.push('/agents'),
    },
    {
      id: 'nav-tools',
      label: 'View Tools',
      icon: Wrench,
      shortcut: 'G then T',
      keywords: ['tools', 'utilities'],
      action: () => router.push('/tools'),
    },
    {
      id: 'nav-resume',
      label: 'Download Resume',
      icon: FileText,
      shortcut: 'G then R',
      keywords: ['resume', 'cv', 'download'],
      action: () => router.push('/resume'),
    },
    {
      id: 'nav-leadership',
      label: 'Leadership',
      icon: Users,
      shortcut: 'G then L',
      keywords: ['leadership', 'vyom', 'club'],
      action: () => router.push('/leadership'),
    },
    {
      id: 'nav-research',
      label: 'Research',
      icon: BookOpen,
      shortcut: 'G then S',
      keywords: ['research', 'papers', 'publications'],
      action: () => router.push('/research'),
    },
    {
      id: 'nav-about',
      label: 'About',
      icon: Users,
      shortcut: 'G then B',
      keywords: ['about', 'bio', 'me'],
      action: () => router.push('/about'),
    },
    {
      id: 'nav-contact',
      label: 'Contact',
      icon: Mail,
      shortcut: 'G then C',
      keywords: ['contact', 'email', 'reach out'],
      action: () => router.push('/contact'),
    },
  ]

  // Add Iris commands
  const irisCommands: Command[] = [
    {
      id: 'iris-open',
      label: 'Open Iris Chat',
      icon: Search,
      keywords: ['iris', 'chat', 'assistant', 'ai'],
      action: () => {
        setOpen(false)
        window.dispatchEvent(new CustomEvent('open-iris'))
      },
    },
    {
      id: 'iris-ask-skills',
      label: 'Ask: "What are your skills?"',
      icon: Search,
      keywords: ['skills', 'expertise', 'technologies'],
      action: () => {
        setOpen(false)
        window.dispatchEvent(new CustomEvent('open-iris'))
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('iris-question', {
              detail: 'What are your top skills?',
            })
          )
        }, 100)
      },
    },
    {
      id: 'iris-ask-projects',
      label: 'Ask: "Tell me about your projects"',
      icon: Search,
      keywords: ['projects', 'work'],
      action: () => {
        setOpen(false)
        window.dispatchEvent(new CustomEvent('open-iris'))
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('iris-question', {
              detail: 'Tell me about your projects',
            })
          )
        }, 100)
      },
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* DialogTitle for accessibility - required by Radix UI */}
      <DialogPrimitive.Title id="command-palette-title" className="sr-only">
        Command Palette
      </DialogPrimitive.Title>

      {/* DialogDescription for accessibility */}
      <DialogPrimitive.Description id="command-palette-description" className="sr-only">
        Search for commands, navigate to pages, and access quick actions
      </DialogPrimitive.Description>

      <CommandInput
        placeholder="Type a command or search..."
        aria-describedby="command-palette-description"
        aria-labelledby="command-palette-title"
      />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation Group */}
        <CommandGroup heading="Navigation">
          {commands.map((command) => {
            const Icon = command.icon
            return (
              <CommandItem key={command.id} onSelect={command.action}>
                <Icon className="w-4 h-4 mr-2 text-text-secondary" />
                <span>{command.label}</span>
                {command.shortcut && (
                  <span className="ml-auto text-xs font-mono text-text-tertiary">
                    {command.shortcut}
                  </span>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Iris Commands Group */}
        <CommandGroup heading="Iris AI Assistant">
          {irisCommands.map((command) => {
            const Icon = command.icon
            return (
              <CommandItem key={command.id} onSelect={command.action}>
                <Icon className="w-4 h-4 mr-2 text-accent-primary" />
                <span>{command.label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-text-tertiary" />
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Quick Actions Group */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              setOpen(false)
              window.open('https://github.com/PranavAmara05', '_blank')
            }}
          >
            <Github className="w-4 h-4 mr-2" />
            <span>Open GitHub</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setOpen(false)
              window.open(
                'https://www.linkedin.com/in/amara-pranav',
                '_blank'
              )
            }}
          >
            <Linkedin className="w-4 h-4 mr-2" />
            <span>Open LinkedIn</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setOpen(false)
              window.location.href = 'mailto:prnvamara@gmail.com'
            }}
          >
            <Mail className="w-4 h-4 mr-2" />
            <span>Send Email</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
