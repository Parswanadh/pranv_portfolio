import { projects } from './data/projects'

export interface ContentItem {
  id: string
  type: 'project' | 'page' | 'section' | 'skill'
  title: string
  description: string
  content: string
  tags: string[]
  url: string
  timestamp?: number
}

export async function indexContent(): Promise<ContentItem[]> {
  const items: ContentItem[] = []

  // Index projects
  projects.forEach((project) => {
    items.push({
      id: `project-${project.slug}`,
      type: 'project',
      title: project.title,
      description: project.description,
      content: `${project.title}. ${project.description} ${project.techStack.join(' ')} ${project.category}`,
      tags: [...project.techStack, project.category],
      url: `/projects/${project.slug}`,
    })
  })

  // Index pages
  const pages = [
    { path: '/', title: 'Home', description: 'Portfolio homepage showcasing AI and embedded systems projects' },
    { path: '/about', title: 'About', description: 'About Amara Pranav - AI & Embedded Systems Engineer' },
    { path: '/projects', title: 'Projects', description: 'All projects in AI, embedded systems, robotics, and more' },
    { path: '/agents', title: 'Agents', description: 'AI agents showcase and demonstrations' },
    { path: '/contact', title: 'Contact', description: 'Get in touch with Pranav' },
    { path: '/tools', title: 'Tools', description: 'Productivity tools and utilities' },
    { path: '/resume', title: 'Resume', description: 'Download resume and CV' },
    { path: '/leadership', title: 'Leadership', description: 'Leadership experience and initiatives' },
    { path: '/research', title: 'Research', description: 'Research papers and publications' },
  ]

  pages.forEach((page) => {
    items.push({
      id: `page-${page.path}`,
      type: 'page',
      title: page.title,
      description: page.description,
      content: `${page.title}. ${page.description}`,
      tags: [],
      url: page.path,
    })
  })

  // Add skills
  const skills = [
    'AI',
    'Machine Learning',
    'Embedded Systems',
    'Computer Vision',
    'LLMs',
    'IoT',
    'Robotics',
    'Python',
    'PyTorch',
    'TensorFlow',
    'Arduino',
    'Raspberry Pi',
    'OpenCV',
    'Generative AI',
    'Transformers',
    'NLP',
    'Deep Learning',
    'Electronics',
    'Hardware Design',
    'Software Development',
  ]

  skills.forEach((skill) => {
    items.push({
      id: `skill-${skill}`,
      type: 'skill',
      title: skill,
      description: `${skill} expertise and experience`,
      content: skill,
      tags: [skill],
      url: '/projects',
    })
  })

  return items
}
