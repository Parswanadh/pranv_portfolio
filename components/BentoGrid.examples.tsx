/**
 * Bento Grid System - Usage Examples
 *
 * This file demonstrates how to use the BentoGrid system throughout the portfolio.
 *
 * BASIC USAGE:
 * ```tsx
 * import { BentoGrid } from '@/components/BentoGrid'
 *
 * <BentoGrid items={[...]} />
 * ```
 *
 * BENTO ITEM STRUCTURE:
 * ```tsx
 * {
 *   id: string           // Unique identifier
 *   content: ReactNode   // Content to render
 *   size: BentoSize      // 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'hero'
 *   className?: string   // Additional classes
 * }
 * ```
 *
 * SIZE DEFINITIONS:
 * - small:  1x1 (sm: 1x1, md: 1x1)
 * - medium: 1x1 (sm: 1x1, md: 2x1)
 * - large:  1x2 (sm: 1x2, md: 2x2)
 * - wide:   2x1 (sm: 2x1, md: 2x1)
 * - tall:   1x2 (sm: 1x2, md: 1x2)
 * - hero:   2x2 (sm: 2x2, md: 2x2)
 *
 * RESPONSIVE BREAKPOINTS:
 * - Mobile: 1 column grid
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 4 columns
 *
 * EXAMPLE 1: Simple Grid
 * ```tsx
 * <BentoGrid
 *   items={[
 *     {
 *       id: 'card-1',
 *       size: 'small',
 *       content: <div>Content 1</div>
 *     },
 *     {
 *       id: 'card-2',
 *       size: 'medium',
 *       content: <div>Content 2</div>
 *     },
 *   ]}
 * />
 * ```
 *
 * EXAMPLE 2: Using Pre-built Cards
 * ```tsx
 * import { BentoHeroCard, BentoWideCard, BentoSmallCard } from '@/components/BentoCard'
 * import { projects } from '@/lib/data/projects'
 *
 * <BentoGrid
 *   items={[
 *     BentoHeroCard(projects[0], [
 *       { label: 'Metric 1', value: 'Value' },
 *       { label: 'Metric 2', value: 'Value' },
 *     ]),
 *     BentoWideCard(projects[1], 'Highlight text'),
 *     BentoSmallCard({ project: projects[2] }),
 *   ]}
 * />
 * ```
 *
 * EXAMPLE 3: Info Cards
 * ```tsx
 * import { BentoInfoCard } from '@/components/BentoCard'
 * import { TrendingUp, Users, Code2 } from 'lucide-react'
 *
 * <BentoGrid
 *   items={[
 *     BentoInfoCard({
 *       id: 'stat-1',
 *       title: 'Total Projects',
 *       value: '25+',
 *       icon: Code2,
 *       size: 'small',
 *     }),
 *     BentoInfoCard({
 *       id: 'stat-2',
 *       title: 'Active Users',
 *       value: '1.2K',
 *       icon: Users,
 *       size: 'small',
 *       trend: { value: '+12%', positive: true },
 *     }),
 *   ]}
 * />
 * ```
 *
 * EXAMPLE 4: CTA Cards
 * ```tsx
 * import { BentoCtaCard } from '@/components/BentoCard'
 * import { ArrowRight, BookOpen } from 'lucide-react'
 *
 * <BentoGrid
 *   items={[
 *     BentoCtaCard({
 *       id: 'cta-1',
 *       title: 'View All Projects',
 *       description: 'Explore the complete portfolio',
 *       href: '/projects',
 *       icon: ArrowRight,
 *       size: 'wide',
 *     }),
 *     BentoCtaCard({
 *       id: 'cta-2',
 *       title: 'Read Research',
 *       description: 'Deep dive into methodology',
 *       href: '/research',
 *       icon: BookOpen,
 *       size: 'medium',
 *     }),
 *   ]}
 * />
 * ```
 *
 * EXAMPLE 5: Custom Content
 * ```tsx
 * import Image from 'next/image'
 *
 * <BentoGrid
 *   items={[
 *     {
 *       id: 'profile',
 *       size: 'large',
 *       content: (
 *         <div className="h-full flex items-center justify-center bg-bg-secondary rounded-xl p-6">
 *           <Image
 *             src="/profile.webp"
 *             alt="Profile"
 *             width={300}
 *             height={300}
 *             sizes="(max-width: 640px) 200px, 300px"
 *             className="rounded-full"
 *           />
 *         </div>
 *       ),
 *     },
 *     {
 *       id: 'bio',
 *       size: 'wide',
 *       content: (
 *         <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated rounded-xl p-6">
 *           <h2 className="text-2xl font-bold">Name</h2>
 *           <p className="text-text-secondary">Bio text here</p>
 *         </div>
 *       ),
 *     },
 *   ]}
 * />
 * ```
 *
 * EXAMPLE 6: Dynamic Grid with Conditional Sizing
 * ```tsx
 * <BentoGrid
 *   items={projects.map((project, index) => {
 *     if (index === 0) {
 *       return BentoHeroCard(project, metrics)
 *     }
 *     if (index === 1) {
 *       return BentoWideCard(project, 'Featured')
 *     }
 *     if (index === 2) {
 *       return BentoTallCard({ project })
 *     }
 *     return BentoSmallCard({ project })
 *   })}
 * />
 * ```
 *
 * CUSTOMIZATION:
 *
 * 1. Custom Styling:
 * ```tsx
 * <BentoGrid
 *   items={[...]}
 *   className="max-w-7xl mx-auto" // Custom container classes
 * />
 * ```
 *
 * 2. Custom Card Styling:
 * ```tsx
 * {
 *   id: 'custom',
 *   size: 'medium',
 *   className: 'border-accent-primary', // Custom card classes
 *   content: <div>Custom styled card</div>
 * }
 * ```
 *
 * ACCESSIBILITY:
 * - All cards should have proper headings
 * - Links should have descriptive text
 * - Interactive elements should have proper ARIA labels
 * - Color contrast meets WCAG AA standards
 *
 * PERFORMANCE:
 * - Grid uses CSS Grid for optimal performance
 * - Animations use Framer Motion for GPU acceleration
 * - Images should use Next.js Image component
 * - Consider lazy loading for large grids
 *
 * DESIGN PATTERNS:
 *
 * 1. Hero Section Layout:
 *    - Profile Image (large) + Name (wide) + Status (small)
 *    - Bio (wide) + CTA (medium) + Stats (medium)
 *
 * 2. Projects Section Layout:
 *    - Featured (hero) + Wide (wide) + Tall (tall)
 *    - Small cards for remaining items
 *
 * 3. Stats Section Layout:
 *    - All small cards in a 2x2 or 4x1 grid
 *    - Or mix small + wide for emphasis
 *
 * 4. Content Section Layout:
 *    - Main content (large) + Sidebar (tall)
 *    - Related items (small/medium)
 *
 * BEST PRACTICES:
 * - Use hero size for most important content
 * - Use wide for horizontal content (timelines, stats)
 * - Use tall for vertical content (lists, code)
 * - Use small for compact info (status, badges)
 * - Use medium for balanced content
 * - Keep grid layout consistent across pages
 * - Maintain visual hierarchy with card sizes
 * - Use gradients and borders to distinguish cards
 * - Add hover effects for interactive cards
 * - Ensure responsive behavior on all devices
 *
 * MIGRATION FROM STANDARD GRID:
 *
 * Before:
 * ```tsx
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </div>
 * ```
 *
 * After:
 * ```tsx
 * <BentoGrid
 *   items={items.map((item, index) => {
 *     const size = index === 0 ? 'hero' :
 *                  index === 1 ? 'wide' :
 *                  index === 2 ? 'tall' : 'small'
 *     return {
 *       id: item.id,
 *       size,
 *       content: <Card key={item.id} {...item} />
 *     }
 *   })}
 * />
 * ```
 */

import { BentoGrid, BentoItem } from './BentoGrid'

export type { BentoItem } from './BentoGrid'
export { BentoGrid } from './BentoGrid'
export {
  BentoHeroCard,
  BentoWideCard,
  BentoTallCard,
  BentoSmallCard,
  BentoMediumCard,
  BentoInfoCard,
  BentoCtaCard,
} from './BentoCard'
