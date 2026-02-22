/**
 * Bento Grid Layout Patterns
 *
 * Pre-defined layout patterns for common use cases.
 * These patterns can be used as starting points and customized as needed.
 */

import { BentoItem } from '@/components/BentoGrid'

/**
 * Hero Section Pattern
 * Perfect for portfolio homepages and landing pages
 *
 * Layout:
 * [Profile (large)]  [Name (wide)]    [Status (small)]
 * [Bio (wide)]       [CTA 1 (med)]    [CTA 2 (med)]
 * [Skills (tall)]    [Location (sm)]  [Contact (sm)]
 */
export function heroSectionPattern(items: {
  profile: BentoItem
  name: BentoItem
  status: BentoItem
  bio: BentoItem
  cta1: BentoItem
  cta2: BentoItem
  skills: BentoItem
  location: BentoItem
  contact: BentoItem
}): BentoItem[] {
  return [
    { ...items.profile, size: 'large' },
    { ...items.name, size: 'wide' },
    { ...items.status, size: 'small' },
    { ...items.bio, size: 'wide' },
    { ...items.cta1, size: 'medium' },
    { ...items.cta2, size: 'medium' },
    { ...items.skills, size: 'tall' },
    { ...items.location, size: 'small' },
    { ...items.contact, size: 'small' },
  ]
}

/**
 * Featured Projects Pattern
 * For showcasing featured/highlighted projects
 *
 * Layout:
 * [Hero Project (hero)]      [Wide Project (wide)]
 * [Tall Project (tall)]      [Wide Project (wide)]
 * [Small 1 (small)]          [Small 2 (small)]
 */
export function featuredProjectsPattern(items: {
  hero: BentoItem
  wide1: BentoItem
  tall: BentoItem
  wide2: BentoItem
  small1: BentoItem
  small2: BentoItem
}): BentoItem[] {
  return [
    { ...items.hero, size: 'hero' },
    { ...items.wide1, size: 'wide' },
    { ...items.tall, size: 'tall' },
    { ...items.wide2, size: 'wide' },
    { ...items.small1, size: 'small' },
    { ...items.small2, size: 'small' },
  ]
}

/**
 * Stats Dashboard Pattern
 * For displaying metrics and statistics
 *
 * Layout:
 * [Main Stat (wide)]   [Stat 2 (small)]   [Stat 3 (small)]
 * [Stat 4 (small)]     [Stat 5 (small)]   [Stat 6 (small)]
 * [Chart (tall)]       [Chart (tall)]
 */
export function statsDashboardPattern(items: {
  main: BentoItem
  stats: BentoItem[]
  charts: BentoItem[]
}): BentoItem[] {
  return [
    { ...items.main, size: 'wide' },
    ...items.stats.slice(0, 2).map(item => ({ ...item, size: 'small' as const })),
    ...items.stats.slice(2, 5).map(item => ({ ...item, size: 'small' as const })),
    ...items.charts.map(item => ({ ...item, size: 'tall' as const })),
  ]
}

/**
 * Team/Grid Pattern
 * For team members, agents, or similar items
 *
 * Layout:
 * [Leader (large)]     [Member 1 (med)]   [Member 2 (med)]
 * [Member 3 (small)]   [Member 4 (small)] [Member 5 (small)]
 * [Member 6 (small)]   [Member 7 (small)] [Member 8 (small)]
 */
export function teamGridPattern(items: {
  leader: BentoItem
  members: BentoItem[]
}): BentoItem[] {
  return [
    { ...items.leader, size: 'large' },
    ...items.members.slice(0, 2).map(item => ({ ...item, size: 'medium' as const })),
    ...items.members.slice(2).map(item => ({ ...item, size: 'small' as const })),
  ]
}

/**
 * Blog/Content Pattern
 * For blog posts, articles, or content cards
 *
 * Layout:
 * [Featured Post (hero)]      [Post 2 (wide)]
 * [Post 3 (tall)]             [Post 4 (medium)]
 * [Post 5 (small)]            [Post 6 (small)]
 */
export function contentGridPattern(items: {
  featured: BentoItem
  posts: BentoItem[]
}): BentoItem[] {
  return [
    { ...items.featured, size: 'hero' },
    { ...items.posts[0], size: 'wide' },
    { ...items.posts[1], size: 'tall' },
    { ...items.posts[2], size: 'medium' },
    { ...items.posts[3], size: 'small' },
    { ...items.posts[4], size: 'small' },
  ]
}

/**
 * Minimalist Pattern
 * Clean, simple layout with equal-sized cards
 *
 * Layout:
 * [Card 1 (medium)]   [Card 2 (medium)]
 * [Card 3 (medium)]   [Card 4 (medium)]
 */
export function minimalistPattern(items: BentoItem[]): BentoItem[] {
  return items.map(item => ({ ...item, size: 'medium' as const }))
}

/**
 * Asymmetric Pattern
 * Highly varied sizes for visual interest
 *
 * Layout:
 * [Item 1 (hero)]      [Item 2 (wide)]
 * [Item 3 (tall)]      [Item 4 (small)]    [Item 5 (small)]
 * [Item 6 (wide)]      [Item 7 (medium)]
 */
export function asymmetricPattern(items: {
  hero: BentoItem
  wide1: BentoItem
  tall: BentoItem
  small1: BentoItem
  small2: BentoItem
  wide2: BentoItem
  medium: BentoItem
}): BentoItem[] {
  return [
    { ...items.hero, size: 'hero' },
    { ...items.wide1, size: 'wide' },
    { ...items.tall, size: 'tall' },
    { ...items.small1, size: 'small' },
    { ...items.small2, size: 'small' },
    { ...items.wide2, size: 'wide' },
    { ...items.medium, size: 'medium' },
  ]
}

/**
 * Helper function to create a responsive grid that adapts
 * the number of columns based on screen size
 */
export function createResponsiveBento(
  items: BentoItem[],
  options?: {
    mobileColumns?: 1 | 2
    tabletColumns?: 2 | 3 | 4
    desktopColumns?: 3 | 4 | 5 | 6
  }
): BentoItem[] {
  // This is a placeholder for future enhancements
  // Currently, responsiveness is handled by CSS Grid
  return items
}

/**
 * Helper to distribute items across available slots
 * Useful when you have more items than slots in a pattern
 */
export function distributeItems(
  items: BentoItem[],
  pattern: ('hero' | 'large' | 'wide' | 'tall' | 'medium' | 'small')[]
): BentoItem[] {
  return pattern.slice(0, items.length).map((size, index) => ({
    ...items[index],
    size,
  }))
}

/**
 * Validation helper to ensure bento grid fits properly
 * Returns true if the grid configuration is valid
 */
export function validateBentoGrid(items: BentoItem[]): {
  valid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Check for duplicate IDs
  const ids = items.map(item => item.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    warnings.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`)
  }

  // Check for empty content
  const emptyItems = items.filter(item => !item.content)
  if (emptyItems.length > 0) {
    warnings.push(`Items with empty content: ${emptyItems.map(i => i.id).join(', ')}`)
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}
