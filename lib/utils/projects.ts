import { projects } from '@/lib/data/projects'
import type { Project } from '@/types/project'

export function getAllProjectSlugs(): string[] {
  return projects.map(p => p.slug)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

export function projectExists(slug: string): boolean {
  return projects.some(p => p.slug === slug)
}
