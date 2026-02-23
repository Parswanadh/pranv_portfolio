'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectFilters } from '@/components/ProjectFilters'
import { useProjectFilters } from '@/lib/useProjectFilters'
import { Filter } from 'lucide-react'
import { projects } from '@/lib/data/projects'
import { GridSkeleton } from '@/components/skeletons/LoadingSkeleton'

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { filters, setFilters, filteredProjects, clearFilters } = useProjectFilters(projects)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mono text-4xl font-bold text-text-primary mb-4">
              Featured Projects
            </h1>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              Here are some projects I've built to solve real-world problems across web platforms,
              data analytics, robotics, computer vision, and cloud infrastructure.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-secondary border border-border-default rounded-lg p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent-primary mb-1">5</div>
              <div className="text-sm font-mono text-text-secondary">Projects Completed</div>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent-primary mb-1">5</div>
              <div className="text-sm font-mono text-text-secondary">Domains Explored</div>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent-primary mb-1">100%</div>
              <div className="text-sm font-mono text-text-secondary">Practical Focus</div>
            </div>
          </div>

          {/* Filters */}
          <ProjectFilters
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProjects.length}
            totalCount={projects.length}
          />

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-tertiary" />
              <p className="text-sm font-mono text-text-tertiary">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            </div>
            {filteredProjects.length !== projects.length && (
              <button
                onClick={clearFilters}
                className="text-sm font-mono text-accent-primary hover:text-accent-secondary transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <GridSkeleton count={6} cols={2} skeleton="project" />
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-secondary border border-border-default rounded-lg">
              <Filter className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="font-mono text-xl text-text-primary mb-2">
                No projects found
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-accent-primary text-bg-primary rounded font-mono text-sm hover:bg-accent-secondary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}