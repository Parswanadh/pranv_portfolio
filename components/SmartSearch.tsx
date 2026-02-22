'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Sparkles, Zap } from 'lucide-react'
import { searchContent, type ContentItem } from '@/lib/embeddings'

interface SearchResult {
  item: {
    id: string
    title: string
    description: string
    url: string
    type: string
  }
  score: number
}

export function SmartSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Toggle search with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Shift+K or Cmd+Shift+K to toggle smart search
      if (
        (e.key === 'k' || e.key === 'K') &&
        (e.shiftKey || (e.metaKey && e.shiftKey) || (e.ctrlKey && e.shiftKey))
      ) {
        e.preventDefault()
        setIsOpen((open) => !open)
        setQuery('')
        setResults([])
        setSelectedIndex(0)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen])

  const handleResultClick = useCallback(
    (result: SearchResult) => () => {
      setIsOpen(false)
      setQuery('')
      setResults([])
      router.push(result.item.url)
    },
    [router]
  )

  // Debounced search
  useEffect(() => {
    const performSearch = async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsSearching(true)

      try {
        const searchResults = await searchContent(searchQuery, 8)
        setResults(searchResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
        setSelectedIndex(0)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleResultClick(results[selectedIndex])()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, handleResultClick])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return '🚀'
      case 'page':
        return '📄'
      case 'skill':
        return '⚡'
      default:
        return '📌'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'text-accent-primary'
      case 'page':
        return 'text-text-secondary'
      case 'skill':
        return 'text-yellow-500'
      default:
        return 'text-text-tertiary'
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Dialog */}
      <div className="relative w-full max-w-2xl bg-bg-secondary border border-border-default rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-primary" />
            <h3 className="font-mono text-sm font-bold text-text-primary">Smart Search</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, pages, skills... (e.g., 'AI projects')"
              className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-default rounded-lg font-mono text-sm focus:ring-2 focus:ring-accent-primary focus:outline-none transition-all"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="mt-2 flex items-center gap-4 text-xs font-mono text-text-tertiary">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded border border-border-default">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded border border-border-default">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded border border-border-default">Esc</kbd>
              Close
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((result, index) => (
                <button
                  key={result.item.id}
                  onClick={handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedIndex === index
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'hover:bg-bg-elevated text-text-secondary border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getTypeIcon(result.item.type)}</span>
                        <span className={`text-xs font-mono uppercase ${getTypeColor(result.item.type)}`}>
                          {result.item.type}
                        </span>
                      </div>
                      <div className="text-sm font-mono font-semibold text-text-primary truncate">
                        {result.item.title}
                      </div>
                      <div className="text-xs font-mono text-text-tertiary truncate mt-1">
                        {result.item.description}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div
                        className={`text-xs font-mono font-bold ${
                          result.score > 5
                            ? 'text-green-500'
                            : result.score > 2
                            ? 'text-yellow-500'
                            : 'text-text-tertiary'
                        }`}
                      >
                        {Math.min(Math.round(result.score * 20), 100)}%
                      </div>
                      {result.score > 5 && <Zap className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 && !isSearching ? (
            <div className="px-4 py-8 text-center">
              <div className="text-text-tertiary mb-2">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              </div>
              <p className="font-mono text-sm text-text-tertiary">No results found</p>
              <p className="font-mono text-xs text-text-tertiary mt-1">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : !isSearching ? (
            <div className="px-4 py-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-accent-primary opacity-50" />
              <p className="font-mono text-sm text-text-secondary mb-2">Smart Semantic Search</p>
              <p className="font-mono text-xs text-text-tertiary">
                Search across projects, pages, and skills using AI-powered understanding
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['AI', 'Python', 'Robotics', 'Computer Vision'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-bg-tertiary border border-border-default rounded-full font-mono text-xs text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-border-default bg-bg-tertiary">
            <p className="text-xs font-mono text-text-tertiary">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
