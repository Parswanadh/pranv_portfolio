'use client'

import Link from 'next/link'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import { BentoItem } from './BentoGrid'
import { Project } from './ProjectCard'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Code, Zap, Award } from 'lucide-react'

// ============================================================================
// HERO CARD - Large featured project with emphasis
// ============================================================================

interface BentoHeroCardProps {
  project: Project
  metrics?: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function BentoHeroCard({ project, metrics = [] }: BentoHeroCardProps): BentoItem {
  // Defensive check for undefined/null project
  if (!project) {
    return {
      id: 'empty-hero',
      size: 'hero',
      content: null,
    }
  }

  return {
    id: project.slug,
    size: 'hero',
    content: (
      <MagneticWrapper strength={0.06}>
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          <motion.div
            className="relative h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default hover:border-accent-primary rounded-xl p-6 md:p-8 transition-all duration-300 overflow-hidden flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(245,166,35,0.15)_1px,transparent_0)] [background-size:16px_16px]" />
            </div>

            {/* Status badge */}
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1.5 bg-accent-primary/20 text-accent-primary rounded-lg text-xs font-mono font-semibold border border-accent-primary/30">
                {project.status}
              </span>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-4">
                {/* Category tag */}
                <div className="inline-flex items-center gap-2">
                  <span className="px-2 py-1 bg-bg-tertiary rounded text-xs font-mono text-text-secondary">
                    {project.category}
                  </span>
                  <span className="text-xs text-text-tertiary font-mono">{project.year}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono leading-tight">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-lg">
                  {project.description}
                </p>
              </div>

              {/* Metrics grid */}
              {metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                  {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-bg-tertiary/50 rounded-lg p-3 border border-border-default">
                      <div className="flex items-center gap-2 mb-1">
                        {metric.icon && <metric.icon className="w-3.5 h-3.5 text-accent-primary" />}
                        <span className="text-xs text-text-tertiary font-mono">{metric.label}</span>
                      </div>
                      <div className="text-lg font-bold text-text-primary font-mono">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-default">
                <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
                  <span>{project.period}</span>
                </div>
                <div className="flex items-center gap-2 text-accent-primary group-hover:gap-3 transition-all">
                  <span className="text-sm font-mono font-semibold">View Project</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </MagneticWrapper>
    ),
  }
}

// ============================================================================
// WIDE CARD - Horizontal emphasis card
// ============================================================================

interface BentoWideCardProps {
  project: Project
  highlight?: string
}

export function BentoWideCard({ project, highlight }: BentoWideCardProps): BentoItem {
  // Defensive check for undefined/null project
  if (!project) {
    return {
      id: 'empty-wide',
      size: 'wide',
      content: null,
    }
  }

  return {
    id: project.slug,
    size: 'wide',
    content: (
      <MagneticWrapper strength={0.06}>
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          <motion.div
            className="relative h-full bg-bg-secondary border border-border-default hover:border-accent-primary rounded-xl p-4 md:p-6 transition-all duration-300 overflow-hidden flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-tertiary font-mono mt-1">{project.category}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono whitespace-nowrap shrink-0">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Highlight badge */}
              {highlight && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-accent-primary" />
                  <span className="text-xs font-mono text-accent-primary font-semibold">{highlight}</span>
                </div>
              )}

              {/* Tech stack */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {project.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="text-xs px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">
                    {t}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-xs text-text-tertiary font-mono">+{project.techStack.length - 4}</span>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      </MagneticWrapper>
    ),
  }
}

// ============================================================================
// TALL CARD - Vertical emphasis card
// ============================================================================

export function BentoTallCard({ project }: { project: Project }): BentoItem {
  // Defensive check for undefined/null project
  if (!project) {
    return {
      id: 'empty-tall',
      size: 'tall',
      content: null,
    }
  }

  return {
    id: project.slug,
    size: 'tall',
    content: (
      <MagneticWrapper strength={0.06}>
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          <motion.div
            className="relative h-full bg-bg-secondary border border-border-default hover:border-accent-primary rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Icon/number */}
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center border border-accent-primary/30">
                <Code className="w-6 h-6 text-accent-primary" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono leading-tight mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-4 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary font-mono">{project.category}</span>
                <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono">
                  {project.status}
                </span>
              </div>

              <div className="pt-3 border-t border-border-default">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 5).map((t) => (
                    <span key={t} className="text-xs px-1.5 py-0.5 bg-bg-tertiary rounded text-text-secondary font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </MagneticWrapper>
    ),
  }
}

// ============================================================================
// SMALL CARD - Compact card
// ============================================================================

interface BentoSmallCardProps {
  project: Project
  icon?: React.ComponentType<{ className?: string }>
}

export function BentoSmallCard({ project, icon: Icon = Code }: BentoSmallCardProps): BentoItem {
  // Defensive check for undefined/null project
  if (!project) {
    return {
      id: 'empty-small',
      size: 'small',
      content: null,
    }
  }

  return {
    id: project.slug,
    size: 'small',
    content: (
      <MagneticWrapper strength={0.06}>
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          <motion.div
            className="relative h-full bg-bg-secondary border border-border-default hover:border-accent-primary rounded-xl p-4 md:p-5 transition-all duration-300 flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent-primary" />
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-bg-elevated rounded text-text-secondary font-mono whitespace-nowrap">
                {project.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono leading-tight mb-2 line-clamp-2">
              {project.title}
            </h3>

            <p className="text-xs text-text-secondary line-clamp-2 mb-auto">
              {project.description}
            </p>

            <div className="mt-3 pt-3 border-t border-border-default">
              <span className="text-[10px] text-text-tertiary font-mono">{project.category}</span>
            </div>
          </motion.div>
        </Link>
      </MagneticWrapper>
    ),
  }
}

// ============================================================================
// MEDIUM CARD - Balanced card
// ============================================================================

export function BentoMediumCard({ project }: { project: Project }): BentoItem {
  // Defensive check for undefined/null project
  if (!project) {
    return {
      id: 'empty-medium',
      size: 'medium',
      content: null,
    }
  }

  return {
    id: project.slug,
    size: 'medium',
    content: (
      <MagneticWrapper strength={0.06}>
        <Link
          href={`/projects/${project.slug}`}
          className="group block h-full"
        >
          <motion.div
            className="relative h-full bg-bg-secondary border border-border-default hover:border-accent-primary rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-text-tertiary font-mono mt-1">{project.category}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono whitespace-nowrap shrink-0">
                {project.status}
              </span>
            </div>

            <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-auto">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">
                    {t}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-xs text-text-tertiary font-mono">+{project.techStack.length - 3}</span>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      </MagneticWrapper>
    ),
  }
}

// ============================================================================
// INFO CARD - For non-project content (stats, status, etc.)
// ============================================================================

interface BentoInfoCardProps {
  id: string
  title: string
  value: string | number
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  size?: 'small' | 'medium' | 'wide'
  trend?: {
    value: string
    positive: boolean
  }
}

export function BentoInfoCard({ id, title, value, description, icon: Icon, size = 'small', trend }: BentoInfoCardProps): BentoItem {
  const content = (
    <motion.div
      className="relative h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border border-border-default rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-2">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent-primary" />
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-mono font-semibold ${trend.positive ? 'text-log-success' : 'text-log-error'}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-text-tertiary font-mono mb-1">{title}</p>
        <p className="text-2xl font-bold text-text-primary font-mono">{value}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </motion.div>
  )

  return {
    id,
    size,
    content,
  }
}

// ============================================================================
// CTA CARD - Call to action card
// ============================================================================

interface BentoCtaCardProps {
  id: string
  title: string
  description: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  size?: 'small' | 'medium' | 'wide'
}

export function BentoCtaCard({ id, title, description, href, icon: Icon, size = 'medium' }: BentoCtaCardProps): BentoItem {
  const content = (
    <MagneticWrapper strength={0.06}>
      <Link href={href} className="group block h-full">
        <motion.div
          className="relative h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/30 hover:border-accent-primary rounded-xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(245,166,35,0.3)_1px,transparent_0)] [background-size:20px_20px]" />
          </div>

          <div className="relative z-10">
            {Icon && (
              <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-accent-primary" />
              </div>
            )}
            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </div>

          <div className="relative z-10 flex items-center gap-2 mt-4 text-accent-primary group-hover:gap-3 transition-all">
            <span className="text-sm font-mono font-semibold">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </Link>
    </MagneticWrapper>
  )

  return {
    id,
    size,
    content,
  }
}
