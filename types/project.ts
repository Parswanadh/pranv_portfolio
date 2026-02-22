export interface Project {
  slug: string
  title: string
  category: string
  status: string
  description: string
  longDescription?: string
  metrics?: ProjectMetrics
  techStack: string[]
  github?: string
  live?: string
  images?: string[]
  year?: string
  period?: string
}

export interface ProjectMetrics {
  label: string
  value: string
  icon?: string
}

export interface ProjectCaseStudy {
  challenge: string
  solution: string
  results: string
}
