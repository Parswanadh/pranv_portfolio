import {
  getSearchSuggestions,
  getSearchHighlight,
  formatScore,
  getTypeEmoji,
  getTypeLabel,
  SEARCH_SUGGESTIONS,
} from '@/lib/search-utils'

describe('search-utils', () => {
  describe('getSearchSuggestions', () => {
    it('should return default suggestions when query is empty', () => {
      const suggestions = getSearchSuggestions('')

      expect(suggestions).toHaveLength(5) // Default limit
      expect(suggestions.every(s => typeof s.text === 'string')).toBe(true)
      expect(suggestions.every(s => ['keyword', 'project', 'page', 'skill'].includes(s.type))).toBe(true)
    })

    it('should return all suggestions when query is empty and limit is high', () => {
      const suggestions = getSearchSuggestions('', 100)

      expect(suggestions).toHaveLength(SEARCH_SUGGESTIONS.length)
    })

    it('should filter suggestions based on query', () => {
      const suggestions = getSearchSuggestions('React')

      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.every(s => s.text.toLowerCase().includes('react'))).toBe(true)
    })

    it('should be case insensitive', () => {
      const suggestions1 = getSearchSuggestions('ai')
      const suggestions2 = getSearchSuggestions('AI')
      const suggestions3 = getSearchSuggestions('aI')

      expect(suggestions1).toEqual(suggestions2)
      expect(suggestions1).toEqual(suggestions3)
    })

    it('should respect the limit parameter', () => {
      const suggestions = getSearchSuggestions('p', 3)

      expect(suggestions).toHaveLength(3)
    })

    it('should return empty array when no suggestions match', () => {
      const suggestions = getSearchSuggestions('xyz123nonexistent')

      expect(suggestions).toHaveLength(0)
    })

    it('should match partial text in suggestions', () => {
      const suggestions = getSearchSuggestions('Project')

      expect(suggestions.some(s => s.text === 'PRO_CODE')).toBe(true)
      expect(suggestions.some(s => s.type === 'project')).toBe(true)
    })

    it('should return suggestions of different types', () => {
      const suggestions = getSearchSuggestions('Page')

      expect(suggestions.some(s => s.type === 'page')).toBe(true)
      expect(suggestions.some(s => s.type === 'keyword')).toBe(true)
    })
  })

  describe('getSearchHighlight', () => {
    it('should return null when query is not found', () => {
      const result = getSearchHighlight('Hello World', 'foo')

      expect(result).toBeNull()
    })

    it('should return highlight parts when query is found', () => {
      const result = getSearchHighlight('Hello World', 'World')

      expect(result).toEqual({
        before: 'Hello ',
        match: 'World',
        after: '',
      })
    })

    it('should be case insensitive', () => {
      const result = getSearchHighlight('Hello World', 'world')

      expect(result).toEqual({
        before: 'Hello ',
        match: 'World',
        after: '',
      })
    })

    it('should handle multiple matches (returns first)', () => {
      const result = getSearchHighlight('test test test', 'test')

      expect(result).toEqual({
        before: '',
        match: 'test',
        after: ' test test',
      })
    })

    it('should handle empty query', () => {
      const result = getSearchHighlight('Hello World', '')

      expect(result).toBeNull()
    })

    it('should handle query longer than text', () => {
      const result = getSearchHighlight('Hi', 'Hello World')

      expect(result).toBeNull()
    })

    it('should preserve original case in match', () => {
      const result = getSearchHighlight('Hello WORLD', 'world')

      expect(result?.match).toBe('WORLD')
    })

    it('should handle special characters', () => {
      const result = getSearchHighlight('Hello@World', '@World')

      expect(result).toEqual({
        before: 'Hello',
        match: '@World',
        after: '',
      })
    })
  })

  describe('formatScore', () => {
    it('should format excellent scores (80-100%)', () => {
      expect(formatScore(4.0)).toBe('80% (Excellent)')
      expect(formatScore(4.5)).toBe('90% (Excellent)')
      expect(formatScore(5.0)).toBe('100% (Excellent)')
    })

    it('should format good scores (60-79%)', () => {
      expect(formatScore(3.0)).toBe('60% (Good)')
      expect(formatScore(3.5)).toBe('70% (Good)')
      expect(formatScore(3.9)).toBe('78% (Good)')
    })

    it('should format fair scores (40-59%)', () => {
      expect(formatScore(2.0)).toBe('40% (Fair)')
      expect(formatScore(2.5)).toBe('50% (Fair)')
      expect(formatScore(2.9)).toBe('58% (Fair)')
    })

    it('should format poor scores (0-39%)', () => {
      expect(formatScore(0.0)).toBe('0% (Poor)')
      expect(formatScore(1.5)).toBe('30% (Poor)')
      expect(formatScore(1.9)).toBe('38% (Poor)')
    })

    it('should handle scores above 5.0 by capping at 100%', () => {
      expect(formatScore(10.0)).toBe('100% (Excellent)')
      expect(formatScore(6.0)).toBe('100% (Excellent)')
    })

    it('should handle negative scores', () => {
      expect(formatScore(-1.0)).toBe('0% (Poor)')
    })
  })

  describe('getTypeEmoji', () => {
    it('should return correct emoji for project type', () => {
      expect(getTypeEmoji('project')).toBe('🚀')
    })

    it('should return correct emoji for page type', () => {
      expect(getTypeEmoji('page')).toBe('📄')
    })

    it('should return correct emoji for skill type', () => {
      expect(getTypeEmoji('skill')).toBe('⚡')
    })

    it('should return correct emoji for section type', () => {
      expect(getTypeEmoji('section')).toBe('📌')
    })

    it('should return default emoji for unknown types', () => {
      expect(getTypeEmoji('unknown')).toBe('📄')
      expect(getTypeEmoji('')).toBe('📄')
      expect(getTypeEmoji(null as any)).toBe('📄')
      expect(getTypeEmoji(undefined as any)).toBe('📄')
    })
  })

  describe('getTypeLabel', () => {
    it('should return correct label for project type', () => {
      expect(getTypeLabel('project')).toBe('Project')
    })

    it('should return correct label for page type', () => {
      expect(getTypeLabel('page')).toBe('Page')
    })

    it('should return correct label for skill type', () => {
      expect(getTypeLabel('skill')).toBe('Skill')
    })

    it('should return correct label for section type', () => {
      expect(getTypeLabel('section')).toBe('Section')
    })

    it('should return default label for unknown types', () => {
      expect(getTypeLabel('unknown')).toBe('Content')
      expect(getTypeLabel('')).toBe('Content')
      expect(getTypeLabel(null as any)).toBe('Content')
      expect(getTypeLabel(undefined as any)).toBe('Content')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string queries', () => {
      const suggestions = getSearchSuggestions('')
      expect(suggestions).toHaveLength(5)
    })

    it('should handle very long queries', () => {
      const longQuery = 'x'.repeat(100)
      const suggestions = getSearchSuggestions(longQuery)
      expect(suggestions).toHaveLength(0)
    })

    it('should handle unicode characters', () => {
      const suggestions = getSearchSuggestions('café')
      expect(suggestions).toBeInstanceOf(Array)
    })

    it('should handle mixed case searches', () => {
      const suggestions1 = getSearchSuggestions('ai')
      const suggestions2 = getSearchSuggestions('AI')
      expect(suggestions1).toEqual(suggestions2)
    })
  })
})