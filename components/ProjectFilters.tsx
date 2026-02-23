'use client'

import { useState } from 'react'
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { ProjectFilters as ProjectFiltersType } from '@/lib/useProjectFilters'

// Extract unique values from projects
const CATEGORIES = [
  'AI Tools',
  'Multimodal AI',
  'Agentic AI',
  'Productivity Tools',
  'Generative AI',
  'Research',
  'Embedded Systems',
  'Robotics',
  'Space Tech',
]

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

const STATUSES = [
  'Production-Ready',
  'Active',
  'Active Development',
  'Ongoing',
  'Research Completed',
  'Completed',
]

// Status display labels
const STATUS_LABELS: Record<string, string> = {
  'Production-Ready': 'Deployed',
  'Active': 'In Progress',
  'Active Development': 'In Progress',
  'Ongoing': 'In Progress',
  'Research Completed': 'Published',
  'Completed': 'Deployed',
}

const TECH_STACK = [
  'Python',
  'Electron 28',
  'Groq API',
  'LangGraph',
  'arXiv API',
  'PyTorch',
  'SBERT',
  'Whisper V3',
  'GROQ API',
  'LLM',
  'Ollama',
  'CLI',
  'Transformers',
  'Raspberry Pi',
  'YOLO',
  'OpenCV',
  'Computer Vision',
  'Arduino',
  'Servo Motors',
  'Physics',
  'Simulation',
  'CAD',
  'Tkinter',
  'FFmpeg',
  'PyQt6',
  'Typer',
  'Rich',
  'ChromaDB',
  'Sentence Transformers',
  'LLaVA 7B',
  'GPT-OSS 20B',
  'Q-Former',
  'Remote CLIP',
]

interface ProjectFiltersProps {
  filters: ProjectFiltersType
  onFilterChange: (filters: ProjectFiltersType) => void
  resultCount: number
  totalCount: number
}

export function ProjectFilters({
  filters,
  onFilterChange,
  resultCount,
  totalCount,
}: ProjectFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleCategory = (cat: string) => {
    const newCategories = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat]
    onFilterChange({ ...filters, category: newCategories })
  }

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFilterChange({ ...filters, status: newStatuses })
  }

  const toggleTech = (tech: string) => {
    const newTech = filters.techStack.includes(tech)
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech]
    onFilterChange({ ...filters, techStack: newTech })
  }

  const clearAll = () => {
    onFilterChange({
      search: '',
      category: [],
      status: [],
      techStack: [],
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.category.length > 0 ||
    filters.status.length > 0 ||
    filters.techStack.length > 0

  const totalSelected =
    filters.category.length + filters.status.length + filters.techStack.length

  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg p-4 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent-primary" />
          <h3 className="font-mono font-bold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="text-xs px-2 py-1 bg-accent-primary/20 text-accent-primary rounded-full">
              {resultCount} of {totalCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm font-mono text-text-tertiary hover:text-accent-primary transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border-default rounded font-mono text-sm focus:ring-2 focus:ring-accent-primary focus:border-accent-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Expandable filters toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {isExpanded ? 'Hide' : 'Show'} filters
        {totalSelected > 0 && (
          <span className="text-text-tertiary">
            ({totalSelected} selected)
          </span>
        )}
      </button>

      {/* Expandable filters */}
      {isExpanded && (
        <div className="mt-6 space-y-6 animate-slide-up">
          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono text-text-tertiary mb-3 uppercase tracking-wider">
              Domain
            </h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded text-sm font-mono transition-all min-h-[44px] min-w-[44px] ${
                    filters.category.includes(cat)
                      ? 'bg-accent-primary text-bg-primary shadow-lg shadow-accent-primary/25'
                      : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent hover:border-border-default'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-xs font-mono text-text-tertiary mb-3 uppercase tracking-wider">
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-2 rounded text-sm font-mono transition-all min-h-[44px] min-w-[44px] ${
                    filters.status.includes(status)
                      ? 'bg-accent-primary text-bg-primary shadow-lg shadow-accent-primary/25'
                      : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent hover:border-border-default'
                  }`}
                >
                  {STATUS_LABELS[status] || status}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-mono text-text-tertiary mb-3 uppercase tracking-wider">
              Technology
            </h4>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-4 py-2 rounded text-sm font-mono transition-all min-h-[44px] min-w-[44px] ${
                    filters.techStack.includes(tech)
                      ? 'bg-accent-primary text-bg-primary shadow-lg shadow-accent-primary/25'
                      : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent hover:border-border-default'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters summary */}
          {totalSelected > 0 && (
            <div className="pt-4 border-t border-border-default">
              <div className="flex flex-wrap gap-2">
                {filters.category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs font-mono"
                  >
                    {CATEGORY_LABELS[cat] || cat}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="hover:text-bg-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.status.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs font-mono"
                  >
                    {STATUS_LABELS[status] || status}
                    <button
                      onClick={() => toggleStatus(status)}
                      className="hover:text-bg-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs font-mono"
                  >
                    {tech}
                    <button
                      onClick={() => toggleTech(tech)}
                      className="hover:text-bg-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
