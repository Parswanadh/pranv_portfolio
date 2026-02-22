import { type ContentItem } from './content-indexer'

export interface SearchSuggestion {
  text: string
  type: 'keyword' | 'project' | 'page' | 'skill'
  count?: number
}

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  // Keywords
  { text: 'AI', type: 'keyword' },
  { text: 'Machine Learning', type: 'keyword' },
  { text: 'Computer Vision', type: 'keyword' },
  { text: 'Robotics', type: 'keyword' },
  { text: 'IoT', type: 'keyword' },
  { text: 'Python', type: 'keyword' },
  { text: 'PyTorch', type: 'keyword' },
  { text: 'Embedded Systems', type: 'keyword' },

  // Projects
  { text: 'PRO_CODE', type: 'project' },
  { text: 'GPT-OSS Vision', type: 'project' },
  { text: 'AUTO-GIT Publisher', type: 'project' },
  { text: 'Parshu-STT', type: 'project' },

  // Pages
  { text: 'Projects', type: 'page' },
  { text: 'Agents', type: 'page' },
  { text: 'About', type: 'page' },
  { text: 'Contact', type: 'page' },
]

export function getSearchSuggestions(query: string, limit = 5): SearchSuggestion[] {
  const lowerQuery = query.toLowerCase()

  if (!query.trim()) {
    return SEARCH_SUGGESTIONS.slice(0, limit)
  }

  return SEARCH_SUGGESTIONS
    .filter((suggestion) => suggestion.text.toLowerCase().includes(lowerQuery))
    .slice(0, limit)
}

export function getSearchHighlight(text: string, query: string): {
  before: string
  match: string
  after: string
} | null {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) {
    return null
  }

  return {
    before: text.slice(0, index),
    match: text.slice(index, index + query.length),
    after: text.slice(index + query.length),
  }
}

export function formatScore(score: number): string {
  const percentage = Math.min(Math.round(score * 20), 100)

  if (percentage >= 80) {
    return `${percentage}% (Excellent)`
  } else if (percentage >= 60) {
    return `${percentage}% (Good)`
  } else if (percentage >= 40) {
    return `${percentage}% (Fair)`
  } else {
    return `${percentage}% (Poor)`
  }
}

export function getTypeEmoji(type: string): string {
  switch (type) {
    case 'project':
      return '🚀'
    case 'page':
      return '📄'
    case 'skill':
      return '⚡'
    case 'section':
      return '📌'
    default:
      return '📄'
  }
}

export function getTypeLabel(type: string): string {
  switch (type) {
    case 'project':
      return 'Project'
    case 'page':
      return 'Page'
    case 'skill':
      return 'Skill'
    case 'section':
      return 'Section'
    default:
      return 'Content'
  }
}
