import { getAllProjectSlugs, getProjectBySlug, projectExists } from '@/lib/utils/projects'
import { projects } from '@/lib/data/projects'
import type { Project } from '@/types/project'

// Mock the projects data to control test data
const mockProjects = [
  {
    slug: 'project-1',
    title: 'Test Project 1',
    description: 'First test project',
    category: 'web',
    status: 'completed',
    techStack: ['React', 'TypeScript'],
    year: '2023',
    period: 'Q1',
  },
  {
    slug: 'project-2',
    title: 'Test Project 2',
    description: 'Second test project',
    category: 'backend',
    status: 'in-progress',
    techStack: ['Node.js', 'Express'],
    year: '2023',
    period: 'Q2',
  },
  {
    slug: 'project-3',
    title: 'Test Project 3',
    description: 'Third test project',
    category: 'mobile',
    status: 'planning',
    techStack: ['React Native'],
    year: '2024',
    period: 'Q1',
  },
]

vi.mock('@/lib/data/projects', () => ({
  projects: mockProjects,
}))

describe('utils/projects', () => {
  describe('getAllProjectSlugs', () => {
    it('should return all project slugs', () => {
      const slugs = getAllProjectSlugs()

      expect(slugs).toHaveLength(mockProjects.length)
      expect(slugs).toEqual(['project-1', 'project-2', 'project-3'])
    })

    it('should return empty array when no projects exist', () => {
      vi.mocked(projects).length = 0

      const slugs = getAllProjectSlugs()

      expect(slugs).toHaveLength(0)
      expect(slugs).toEqual([])
    })

    it('should maintain original project order', () => {
      const slugs = getAllProjectSlugs()

      expect(slugs[0]).toBe('project-1')
      expect(slugs[1]).toBe('project-2')
      expect(slugs[2]).toBe('project-3')
    })
  })

  describe('getProjectBySlug', () => {
    it('should return project when slug exists', () => {
      const project = getProjectBySlug('project-2')

      expect(project).toBeDefined()
      expect(project?.slug).toBe('project-2')
      expect(project?.title).toBe('Test Project 2')
      expect(project?.category).toBe('backend')
    })

    it('should return undefined when slug does not exist', () => {
      const project = getProjectBySlug('nonexistent-project')

      expect(project).toBeUndefined()
    })

    it('should be case sensitive', () => {
      const project = getProjectBySlug('Project-2')

      expect(project).toBeUndefined()
    })

    it('should handle empty string slug', () => {
      const project = getProjectBySlug('')

      expect(project).toBeUndefined()
    })

    it('should handle null or undefined slug', () => {
      expect(() => getProjectBySlug(null as any)).not.toThrow()
      expect(() => getProjectBySlug(undefined as any)).not.toThrow()
    })
  })

  describe('projectExists', () => {
    it('should return true for existing project', () => {
      const exists = projectExists('project-1')

      expect(exists).toBe(true)
    })

    it('should return false for non-existing project', () => {
      const exists = projectExists('nonexistent-project')

      expect(exists).toBe(false)
    })

    it('should be case sensitive', () => {
      const exists = projectExists('Project-1')

      expect(exists).toBe(false)
    })

    it('should return false for empty string', () => {
      const exists = projectExists('')

      expect(exists).toBe(false)
    })

    it('should handle null or undefined', () => {
      expect(projectExists(null as any)).toBe(false)
      expect(projectExists(undefined as any)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle projects with special characters in slugs', () => {
      const specialProject = {
        slug: 'project-with-dash_and_special!chars',
        title: 'Special Project',
        description: 'Project with special characters',
        category: 'special',
        status: 'completed',
        techStack: ['Special Tech'],
        year: '2023',
        period: 'Q1',
      }

      vi.mocked(projects).push(specialProject)

      const project = getProjectBySlug('project-with-dash_and_special!chars')
      expect(project).toBeDefined()
      expect(project?.slug).toBe('project-with-dash_and_special!chars')

      const exists = projectExists('project-with-dash_and_special!chars')
      expect(exists).toBe(true)

      const slugs = getAllProjectSlugs()
      expect(slugs).toContain('project-with-dash_and_special!chars')
    })

    it('should handle duplicate slugs gracefully', () => {
      // Add a duplicate slug (though this shouldn't happen in real data)
      vi.mocked(projects).push({
        ...mockProjects[0],
        slug: 'project-1', // Duplicate
        title: 'Duplicate Project',
      })

      const slugs = getAllProjectSlugs()
      expect(slugs.filter(s => s === 'project-1')).toHaveLength(2)

      const project = getProjectBySlug('project-1') // Returns first match
      expect(project?.title).toBe('Test Project 1')

      const exists = projectExists('project-1')
      expect(exists).toBe(true)
    })

    it('should handle very large slugs', () => {
      const largeSlug = 'x'.repeat(1000)
      const largeProject = {
        slug: largeSlug,
        title: 'Large Project',
        description: 'Project with very long slug',
        category: 'test',
        status: 'completed',
        techStack: ['Test'],
        year: '2023',
        period: 'Q1',
      }

      vi.mocked(projects).push(largeProject)

      const project = getProjectBySlug(largeSlug)
      expect(project).toBeDefined()
      expect(project?.slug).toBe(largeSlug)
    })
  })
})