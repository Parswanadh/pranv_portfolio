'use client'

import Link from 'next/link'
import { MagneticWrapper } from '@/components/MagneticWrapper'

export interface Project {
  slug: string
  title: string
  description: string
  category: string
  status: string
  techStack: string[]
  year: string
  period: string
}

interface ProjectCardProps {
  project: Project
}

// Status display labels
const STATUS_LABELS: Record<string, string> = {
  'Production-Ready': 'Deployed',
  'Active': 'In Progress',
  'Active Development': 'In Progress',
  'Ongoing': 'In Progress',
  'Research Completed': 'Published',
  'Completed': 'Deployed',
}

// Category display labels with emojis
const CATEGORY_LABELS: Record<string, string> = {
  'AI Tools': '🤖 AI Tools',
  'Multimodal AI': '🎨 Multimodal AI',
  'Agentic AI': '🧠 Agentic AI',
  'Productivity Tools': '⚡ Productivity Tools',
  'Generative AI': '✨ Generative AI',
  'Research': '📚 Research',
  'Embedded Systems': '🔌 Embedded Systems',
  'Robotics': '🦾 Robotics',
  'Space Tech': '🚀 Space Tech',
  'Web Development': '🌐 Web Platforms',
  'Data Science': '📊 Data Analytics',
  'Computer Vision': '👁️ Computer Vision',
  'Cloud': '☁️ Cloud & ML',
}

export function ProjectCard({ project }: ProjectCardProps) {
  const displayStatus = STATUS_LABELS[project.status] || project.status
  const displayCategory = CATEGORY_LABELS[project.category] || project.category

  return (
    <MagneticWrapper strength={0.08}>
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6 hover:border-accent-primary transition-all duration-base flex flex-col min-h-[180px] h-full touch-manipulation">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-mono text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight">
                {project.title}
              </h2>
              <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono whitespace-nowrap shrink-0 mt-0.5">
                {displayStatus}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono text-text-tertiary pt-4 border-t border-border-default">
            <div className="flex items-center gap-2">
              <span>{displayCategory}</span>
              <span className="text-border-muted">·</span>
              <span>{project.period}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {project.techStack.slice(0, 3).map((t) => (
                <span key={t} className="px-1.5 py-0.5 bg-bg-tertiary rounded text-text-secondary">
                  {t}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="text-text-tertiary">+{project.techStack.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </MagneticWrapper>
  )
}
