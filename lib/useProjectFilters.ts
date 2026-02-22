'use client'

import { useState, useMemo, useEffect } from 'react'

export interface ProjectFilters {
  search: string
  category: string[]
  status: string[]
  techStack: string[]
}

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

export function useProjectFilters(projects: Project[]) {
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    category: [],
    status: [],
    techStack: [],
  })

  // Load filters from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const search = params.get('search') || ''
    const category = params.getAll('category')
    const status = params.getAll('status')
    const techStack = params.getAll('techStack')

    setFilters({
      search,
      category,
      status,
      techStack,
    })
  }, [])

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    filters.category.forEach((c) => params.append('category', c))
    filters.status.forEach((s) => params.append('status', s))
    filters.techStack.forEach((t) => params.append('techStack', t))

    const queryString = params.toString()
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [filters])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.techStack.some((t) => t.toLowerCase().includes(searchLower)) ||
          project.category.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(project.category)) {
          return false
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(project.status)) {
          return false
        }
      }

      // Tech filter
      if (filters.techStack.length > 0) {
        if (!filters.techStack.some((t) => project.techStack.includes(t))) {
          return false
        }
      }

      return true
    })
  }, [projects, filters])

  const clearFilters = () => {
    setFilters({
      search: '',
      category: [],
      status: [],
      techStack: [],
    })
  }

  return {
    filters,
    setFilters,
    filteredProjects,
    clearFilters,
  }
}
