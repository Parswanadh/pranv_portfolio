'use client'

import { motion } from 'framer-motion'

/**
 * LoadingSkeleton Components
 *
 * A collection of skeleton loading states for async content across the portfolio.
 * Uses shimmer animations to indicate loading state while maintaining layout structure.
 *
 * @example
 * ```tsx
 * import { ProjectCardSkeleton, ChatMessageSkeleton } from '@/components/skeletons/LoadingSkeleton'
 *
 * {isLoading ? <ProjectCardSkeleton /> : <ActualProjectCard />}
 * ```
 */

// ============================================================================
// PROJECT CARD SKELETON
// ============================================================================

export function ProjectCardSkeleton() {
  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="h-6 bg-bg-tertiary rounded w-3/4 skeleton-shimmer" />
        <div className="h-5 bg-bg-tertiary rounded w-20 shrink-0 skeleton-shimmer" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-bg-tertiary rounded w-full skeleton-shimmer" />
        <div className="h-4 bg-bg-tertiary rounded w-5/6 skeleton-shimmer" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border-default">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-bg-tertiary rounded w-16 skeleton-shimmer" />
          <div className="h-3 bg-bg-tertiary rounded w-20 skeleton-shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 bg-bg-tertiary rounded w-12 skeleton-shimmer" />
          <div className="h-5 bg-bg-tertiary rounded w-12 skeleton-shimmer" />
          <div className="h-5 bg-bg-tertiary rounded w-12 skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CHAT MESSAGE SKELETON
// ============================================================================

export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar skeleton */}
      <div className="w-8 h-8 rounded-full bg-bg-tertiary flex-shrink-0 skeleton-shimmer" />

      {/* Message content skeleton */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-bg-tertiary rounded w-32 skeleton-shimmer" />
        <div className="h-4 bg-bg-tertiary rounded w-full skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
        <div className="h-4 bg-bg-tertiary rounded w-4/5 skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  )
}

// ============================================================================
// DEMO SKELETON
// ============================================================================

export function DemoSkeleton({ title = "Loading Demo..." }: { title?: string }) {
  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-bg-tertiary skeleton-shimmer" />
          <div>
            <div className="h-4 bg-bg-tertiary rounded w-32 skeleton-shimmer" />
            <div className="h-3 bg-bg-tertiary rounded w-20 mt-1 skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-bg-tertiary rounded skeleton-shimmer" />
          <div className="w-8 h-8 bg-bg-tertiary rounded skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 h-64 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-tertiary skeleton-shimmer" />
          <div className="h-4 bg-bg-tertiary rounded w-48 mx-auto skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
          <p className="text-sm text-text-tertiary font-mono">{title}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TEXT SKELETON
// ============================================================================

interface TextSkeletonProps {
  lines?: number
  className?: string
}

export function TextSkeleton({ lines = 3, className = "" }: TextSkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-bg-tertiary rounded animate-pulse skeleton-shimmer"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// AGENT CARD SKELETON
// ============================================================================

export function AgentCardSkeleton() {
  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-bg-tertiary skeleton-shimmer" />
          <div>
            <div className="h-4 bg-bg-tertiary rounded w-24 skeleton-shimmer" />
            <div className="h-3 bg-bg-tertiary rounded w-12 mt-1 skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
          </div>
        </div>
        <div className="h-5 bg-bg-tertiary rounded w-16 skeleton-shimmer" />
      </div>

      {/* Description skeleton */}
      <div className="px-4 py-2 bg-bg-tertiary">
        <div className="h-3 bg-bg-secondary rounded w-full skeleton-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-4">
        <div>
          <div className="h-3 bg-bg-tertiary rounded w-20 mb-2 skeleton-shimmer" />
          <div className="h-24 bg-bg-tertiary rounded w-full skeleton-shimmer" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-bg-tertiary rounded flex-1 skeleton-shimmer" style={{ animationDelay: '0.2s' }} />
          <div className="h-10 bg-bg-tertiary rounded flex-1 skeleton-shimmer" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PULSE LOADER
// ============================================================================

export type PulseLoaderSize = 'sm' | 'md' | 'lg'

interface PulseLoaderProps {
  size?: PulseLoaderSize
  className?: string
}

export function PulseLoader({ size = "md", className = "" }: PulseLoaderProps) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizes[size]} rounded-full bg-accent-primary`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// INLINE LOADER (for buttons, etc.)
// ============================================================================

interface InlineLoaderProps {
  text?: string
  className?: string
}

export function InlineLoader({ text = "Loading...", className = "" }: InlineLoaderProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PulseLoader size="sm" />
      <span className="text-sm text-text-secondary">{text}</span>
    </div>
  )
}

// ============================================================================
// FULL PAGE LOADER
// ============================================================================

interface FullPageLoaderProps {
  message?: string
}

export function FullPageLoader({ message = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[9999]">
      <div className="text-center space-y-6">
        <PulseLoader size="lg" />
        <p className="text-text-secondary font-mono text-sm">{message}</p>
      </div>
    </div>
  )
}

// ============================================================================
// GRID SKELETON (for multiple cards)
// ============================================================================

interface GridSkeletonProps {
  count?: number
  cols?: 1 | 2 | 3
  skeleton?: 'project' | 'agent'
}

export function GridSkeleton({
  count = 6,
  cols = 2,
  skeleton = 'project'
}: GridSkeletonProps) {
  const gridCols: Record<1 | 2 | 3, string> = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'xl:grid-cols-3'
  }

  const SkeletonComponent = skeleton === 'project' ? ProjectCardSkeleton : AgentCardSkeleton

  return (
    <div className={`grid grid-cols-1 ${gridCols[cols]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// TYPING INDICATOR (for chat)
// ============================================================================

export function TypingIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent-primary"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
