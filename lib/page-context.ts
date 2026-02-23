/**
 * Page Context System for Iris
 *
 * Maps routes to contextual information for dynamic prompts
 * Enables page-aware responses and contextual suggestions
 */

export interface PageContext {
  route: string
  title: string
  description: string
  relevantTopics: string[]
  navigationHints: string[]
  suggestedActions: string[]
}

export const PAGE_CONTEXTS: Record<string, PageContext> = {
  '/': {
    route: '/',
    title: 'Home',
    description: 'The main landing page featuring Pranav\'s profile, featured projects, and active agents',
    relevantTopics: ['overview', 'introduction', 'summary', 'featured work', 'portfolio'],
    navigationHints: [
      'Click "View Projects" to see all work',
      'Click "Chat with Iris" for guided tour',
      'Featured projects highlight key work',
    ],
    suggestedActions: [
      'explore projects',
      'meet the agents',
      'view Pranav\'s background',
      'get contact information',
    ],
  },
  '/projects': {
    route: '/projects',
    title: 'Projects',
    description: 'A comprehensive list of Pranav\'s projects spanning A.I., embedded systems, and robotics',
    relevantTopics: ['portfolio', 'work', 'coding', 'development', 'all projects'],
    navigationHints: [
      'Click any project card for details',
      'Projects organized by category and status',
      'Status shows: Production-Ready, Active Development, or Completed',
    ],
    suggestedActions: [
      'browse PRO_CODE',
      'learn about GPT-OSS Vision',
      'explore Parshu-STT',
      'view AUTO-GIT details',
    ],
  },
  '/projects/[slug]': {
    route: '/projects/[slug]',
    title: 'Project Detail',
    description: 'Detailed view of a specific project with description, tech stack, and implementation details',
    relevantTopics: ['project details', 'implementation', 'technology', 'code', 'case study'],
    navigationHints: [
      'Tech stack listed at the bottom',
      'Project period shows development timeline',
      'Case study shows problem and solution',
      'Status indicates current state',
    ],
    suggestedActions: [
      'ask about implementation details',
      'request similar projects',
      'return to projects list',
      'view source code',
    ],
  },
  '/agents': {
    route: '/agents',
    title: 'AI Agents',
    description: 'Showcase of autonomous A.I. agents including WhisperSTT, CLI-Tour, and Data Agent',
    relevantTopics: ['agents', 'A.I. tools', 'autonomous systems', 'demos', 'interactive'],
    navigationHints: [
      'Each agent has a live demo',
      'Try the sample prompts for each agent',
      'Agents use different A.I. models',
      'Click agent cards for full details',
    ],
    suggestedActions: [
      'try agent demos',
      'learn about WhisperSTT',
      'explore CLI-Tour',
      'ask about agent architecture',
    ],
  },
  '/about': {
    route: '/about',
    title: 'About',
    description: 'Extended biography, education, skills, and philosophy',
    relevantTopics: ['bio', 'biography', 'background', 'education', 'skills', 'philosophy'],
    navigationHints: [
      'Contact information at the top',
      'Technical skills organized by category',
      'Philosophy section at the bottom',
      'Resume link available',
    ],
    suggestedActions: [
      'view resume',
      'contact Pranav',
      'learn about education',
      'see technical skills',
    ],
  },
  '/contact': {
    route: '/contact',
    title: 'Contact',
    description: 'Contact surface with email, GitHub, LinkedIn, and phone',
    relevantTopics: ['email', 'reach out', 'hire', 'collaborate', 'connect'],
    navigationHints: [
      'Email is the primary contact method',
      'GitHub for code repositories',
      'LinkedIn for professional networking',
      'Phone available for calls',
    ],
    suggestedActions: [
      'send an email',
      'connect on LinkedIn',
      'view GitHub profile',
      'call directly',
    ],
  },
  '/leadership': {
    route: '/leadership',
    title: 'Leadership',
    description: 'Leadership experience and roles including VYOM space-tech club',
    relevantTopics: ['leadership', 'roles', 'positions', 'experience', 'VYOM'],
    navigationHints: [
      'Shows VYOM space-tech club involvement',
      'Leadership roles at Amrita',
      'Timeline of positions held',
    ],
    suggestedActions: [
      'learn about VYOM',
      'view leadership timeline',
      'see club achievements',
    ],
  },
  '/research': {
    route: '/research',
    title: 'Research',
    description: 'Research publications and academic papers',
    relevantTopics: ['papers', 'publications', 'research', 'academics', 'writing'],
    navigationHints: [
      'Each paper has a detailed page',
      'Abstract and methodology available',
      'Download full PDFs',
      'Citation information provided',
    ],
    suggestedActions: [
      'read paper abstracts',
      'view methodology',
      'download publications',
      'see citation details',
    ],
  },
  '/tools': {
    route: '/tools',
    title: 'Tools',
    description: 'Tools and utilities built by Pranav',
    relevantTopics: ['tools', 'utilities', 'software', 'applications', 'downloads'],
    navigationHints: [
      'Each tool has a description',
      'Download links available',
      'Usage instructions included',
    ],
    suggestedActions: [
      'explore tools',
      'download utilities',
      'read documentation',
    ],
  },
  '/resume': {
    route: '/resume',
    title: 'Resume',
    description: 'Professional resume and CV',
    relevantTopics: ['resume', 'CV', 'experience', 'qualifications'],
    navigationHints: [
      'Downloadable PDF version',
      'Skills and experience listed',
      'Education and projects included',
    ],
    suggestedActions: [
      'download resume',
      'view projects',
      'contact for opportunities',
    ],
  },
}

/**
 * Get page context for current route
 */
export function getPageContext(pathname: string): PageContext | null {
  // Exact match first
  if (PAGE_CONTEXTS[pathname]) {
    return PAGE_CONTEXTS[pathname]
  }

  // Pattern matching for dynamic routes
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return PAGE_CONTEXTS['/projects/[slug]']
  }

  // Pattern matching for research papers
  if (pathname.startsWith('/research/') && pathname !== '/research') {
    return PAGE_CONTEXTS['/research']
  }

  // Pattern matching for tools
  if (pathname.startsWith('/tools/') && pathname !== '/tools') {
    return PAGE_CONTEXTS['/tools']
  }

  // Fallback to home
  return PAGE_CONTEXTS['/']
}

/**
 * Get dynamic system prompt based on page context
 */
export function getContextualSystemPrompt(basePrompt: string, pathname: string): string {
  const context = getPageContext(pathname)

  if (!context) {
    return basePrompt
  }

  return `${basePrompt}

CURRENT PAGE CONTEXT:
You are currently on the ${context.title} page.
Page description: ${context.description}

Relevant topics for this page:
${context.relevantTopics.map(t => `- ${t}`).join('\n')}

Suggested actions you can offer:
${context.suggestedActions.map(a => `- ${a}`).join('\n')}

Navigation hints:
${context.navigationHints.map(h => `- ${h}`).join('\n')}`
}
