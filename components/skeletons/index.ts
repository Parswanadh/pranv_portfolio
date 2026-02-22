/**
 * Skeleton Loading Components
 *
 * Reusable skeleton loading states for async content across the portfolio.
 *
 * @example
 * ```tsx
 * import { ProjectCardSkeleton, PulseLoader } from '@/components/skeletons'
 *
 * {isLoading ? <ProjectCardSkeleton /> : <ProjectCard project={project} />}
 * ```
 */

export {
  ProjectCardSkeleton,
  ChatMessageSkeleton,
  DemoSkeleton,
  TextSkeleton,
  AgentCardSkeleton,
  PulseLoader,
  InlineLoader,
  FullPageLoader,
  GridSkeleton,
  TypingIndicator,
} from './LoadingSkeleton'

export type { PulseLoaderSize } from './LoadingSkeleton'
