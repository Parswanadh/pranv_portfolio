/**
 * Navigation Configuration
 *
 * Centralized navigation data for Header component.
 * Extracted for better maintainability and easier updates.
 */

export interface NavItem {
  name: string
  href: string
  icon?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
  icon: string
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Work',
    icon: 'Folder',
    items: [
      { name: 'Projects', href: '/projects', icon: 'Folder' },
      { name: 'Agents', href: '/agents', icon: 'Cpu' },
      { name: 'Tools', href: '/tools', icon: 'Wrench' },
    ],
  },
  {
    label: 'About',
    icon: 'Users',
    items: [
      { name: 'Resume', href: '/resume', icon: 'FileText' },
      { name: 'Leadership', href: '/leadership', icon: 'Users' },
      { name: 'Research', href: '/research', icon: 'BookOpen' },
    ],
  },
]

export const ALWAYS_VISIBLE_ITEMS: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
]

export const HEADER_ACTIONS = {
  RESUME: {
    href: '/resume',
    label: 'Resume',
    icon: 'Download',
    ariaLabel: 'View Resume',
  },
  COMMAND_PALETTE: {
    ariaLabel: 'Open command palette (Command+K)',
    placeholder: 'Search...',
    shortcut: '⌘K',
  },
}
