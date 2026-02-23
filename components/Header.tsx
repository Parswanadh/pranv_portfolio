'use client'

import { useState, useEffect, useRef } from 'react'
import { Terminal, Menu, ChevronDown, ChevronUp, Search, Folder, Cpu, Wrench, FileText, Users, BookOpen, Download } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  name: string
  href: string
  icon?: typeof Folder
}

interface NavGroup {
  label: string
  items: NavItem[]
  icon: typeof ChevronDown
}

const navGroups: NavGroup[] = [
  {
    label: 'Work',
    icon: Folder,
    items: [
      { name: 'Projects', href: '/projects', icon: Folder },
      { name: 'Agents', href: '/agents', icon: Cpu },
      { name: 'Tools', href: '/tools', icon: Wrench },
    ],
  },
  {
    label: 'About',
    icon: Users,
    items: [
      { name: 'Resume', href: '/resume', icon: FileText },
      { name: 'Leadership', href: '/leadership', icon: Users },
      { name: 'Research', href: '/research', icon: BookOpen },
    ],
  },
]

const alwaysVisibleItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const [openMobileGroups, setOpenMobileGroups] = useState<Set<string>>(new Set())
  const dropdownRefs = useRef<(HTMLLIElement | null)[]>([])
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'))
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefs.current.every(ref => ref && !ref.contains(event.target as Node))) {
        setOpenDropdowns(new Set())
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup timeout on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setOpenMobileGroups(new Set())
  }, [pathname])

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        // Close other dropdowns when opening a new one
        newSet.clear()
        newSet.add(label)
      }
      return newSet
    })
  }

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, label: string) => {
    const isOpen = openDropdowns.has(label)

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        toggleDropdown(label)
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setOpenDropdowns(new Set())
          e.currentTarget.focus()
        }
        break
      case 'ArrowDown':
        if (!isOpen) {
          e.preventDefault()
          toggleDropdown(label)
        }
        break
    }
  }

  const toggleMobileGroup = (label: string) => {
    setOpenMobileGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-bg-primary/90 backdrop-blur-sm border-b border-border-default shadow-lg pointer-events-auto">
        {/* Desktop Navigation */}
        <nav className="hidden min-[768px]:flex items-center justify-between px-6 py-3" aria-label="Main navigation">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity pointer-events-auto">
              <Terminal className="w-5 h-5 text-accent-primary" />
              <span className="font-mono text-sm text-text-secondary">
                <span className="text-accent-primary">&lt;</span>pranav<span className="text-accent-primary">/&gt;</span>
              </span>
            </Link>
          </div>

          {/* Main Navigation */}
          <ul className="flex items-center gap-1" role="menubar">
            {alwaysVisibleItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-md font-mono text-sm transition-colors duration-150 min-h-[44px] flex items-center pointer-events-auto ${
                    isActive(item.href)
                      ? 'text-accent-primary bg-bg-elevated'
                      : 'text-text-primary hover:bg-bg-elevated'
                  }`}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {navGroups.map((group, groupIndex) => {
              const isDropdownOpen = openDropdowns.has(group.label)
              const hasActiveItem = group.items.some(item => isActive(item.href))

              return (
                <li
                  key={group.label}
                  className="relative"
                  role="none"
                  ref={(el) => { dropdownRefs.current[groupIndex] = el }}
                  onMouseEnter={() => {
                    // Clear any pending close timeout
                    if (hoverTimeoutRef.current) {
                      clearTimeout(hoverTimeoutRef.current)
                      hoverTimeoutRef.current = null
                    }
                    // Open dropdown on hover
                    setOpenDropdowns(prev => new Set(Array.from(prev).concat(group.label)))
                  }}
                  onMouseLeave={() => {
                    // Add small delay to allow moving mouse into dropdown
                    hoverTimeoutRef.current = setTimeout(() => {
                      setOpenDropdowns(prev => {
                        const newSet = new Set(prev)
                        newSet.delete(group.label)
                        return newSet
                      })
                    }, 150)
                  }}
                >
                  <button
                    id={`${group.label.toLowerCase()}-button`}
                    onClick={() => toggleDropdown(group.label)}
                    onKeyDown={(e) => handleDropdownKeyDown(e, group.label)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md font-mono text-sm transition-colors duration-150 min-h-[44px] pointer-events-auto ${
                      hasActiveItem && !isDropdownOpen
                        ? 'text-accent-primary bg-bg-elevated'
                        : 'text-text-primary hover:bg-bg-elevated'
                    }`}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    role="menuitem"
                    aria-controls={`${group.label.toLowerCase()}-dropdown`}
                  >
                    {group.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      id={`${group.label.toLowerCase()}-dropdown`}
                      className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary border border-border-accent rounded-lg shadow-xl overflow-hidden pointer-events-auto"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`${group.label}-button`}
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 border-l-2 min-h-[44px] pointer-events-auto ${
                              isActive(item.href)
                                ? 'bg-bg-elevated border-accent-primary text-accent-primary'
                                : 'border-transparent hover:bg-bg-tertiary text-text-primary'
                            }`}
                            role="menuitem"
                            aria-current={isActive(item.href) ? 'page' : undefined}
                          >
                            {Icon && <Icon className="w-4 h-4 text-text-secondary flex-shrink-0" aria-hidden="true" />}
                            <span className="font-mono text-sm">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Resume Download */}
            <Link
              href="/resume"
              className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-text-secondary hover:text-accent-primary hover:bg-bg-elevated transition-colors rounded min-h-[44px] pointer-events-auto"
              aria-label="View Resume"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Resume</span>
            </Link>

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary border border-border-default rounded-md hover:border-accent-primary transition-colors duration-150 group min-h-[44px] pointer-events-auto"
              aria-label="Open command palette (Command+K)"
            >
              <Search className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" aria-hidden="true" />
              <span className="font-mono text-xs text-text-tertiary hidden lg:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-bg-elevated rounded text-xs text-text-tertiary font-mono border border-border-default">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 pointer-events-auto">
            <Terminal className="w-5 h-5 text-accent-primary" />
            <span className="font-mono text-sm text-text-secondary">
              <span className="text-accent-primary">&lt;</span>pranav<span className="text-accent-primary">/&gt;</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Resume Download */}
            <Link
              href="/resume"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 hover:bg-bg-elevated transition-colors duration-150 rounded active:scale-95 touch-manipulation pointer-events-auto"
              aria-label="View Resume"
            >
              <Download className="w-5 h-5 text-text-secondary" />
            </Link>

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 hover:bg-bg-elevated transition-colors duration-150 rounded focus:ring-2 focus:ring-accent-primary focus:outline-none active:scale-95 touch-manipulation pointer-events-auto"
              aria-label="Open command palette"
            >
              <Search className="w-5 h-5 text-text-primary" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 hover:bg-bg-elevated transition-colors duration-150 rounded focus:ring-2 focus:ring-accent-primary focus:outline-none active:scale-95 touch-manipulation pointer-events-auto"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav id="mobile-menu" className="md:hidden border-t border-border-default bg-bg-primary" role="navigation" aria-label="Mobile navigation">
            <ul>
              {/* Always Visible Items */}
              {alwaysVisibleItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-6 py-3 font-mono text-sm transition-colors duration-150 border-l-2 min-h-[44px] flex items-center touch-manipulation pointer-events-auto ${
                      isActive(item.href)
                        ? 'bg-bg-elevated border-accent-primary text-accent-primary'
                        : 'border-transparent hover:bg-bg-tertiary text-text-primary'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Grouped Items with Expandable Sections */}
              {navGroups.map((group) => {
                const isGroupOpen = openMobileGroups.has(group.label)
                const hasActiveItem = group.items.some(item => isActive(item.href))

                return (
                  <li key={group.label} className="border-t border-border-default">
                    <button
                      onClick={() => toggleMobileGroup(group.label)}
                      className="w-full flex items-center justify-between px-6 py-3 hover:bg-bg-tertiary transition-colors duration-150 min-h-[44px] touch-manipulation pointer-events-auto"
                      aria-expanded={isGroupOpen}
                      aria-controls={`mobile-menu-${group.label.toLowerCase()}`}
                    >
                      <span className={`font-mono text-sm ${hasActiveItem ? 'text-accent-primary' : 'text-text-primary'}`}>
                        {group.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {isGroupOpen ? (
                          <ChevronUp className="w-4 h-4 text-text-secondary" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-secondary" aria-hidden="true" />
                        )}
                      </div>
                    </button>

                    {isGroupOpen && (
                      <div
                        id={`mobile-menu-${group.label.toLowerCase()}`}
                        className="bg-bg-tertiary border-t border-border-default"
                        role="group"
                        aria-label={`${group.label} submenu`}
                      >
                        {group.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-6 py-3 pl-12 font-mono text-sm transition-colors duration-150 border-l-2 min-h-[44px] touch-manipulation pointer-events-auto ${
                                isActive(item.href)
                                  ? 'bg-bg-elevated border-accent-primary text-accent-primary'
                                  : 'border-transparent hover:bg-bg-secondary text-text-primary'
                              }`}
                              aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                              {Icon && <Icon className="w-4 h-4 text-text-secondary flex-shrink-0" aria-hidden="true" />}
                              {item.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
