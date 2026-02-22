/**
 * Proactive Suggestions for Iris
 *
 * Dynamic greetings and contextual suggestions based on page and session state
 */

import { isNewVisitor } from './iris-session'

export interface Suggestion {
  text: string
  action: 'navigate' | 'chat' | 'info'
  target?: string
  prompt?: string // Optional - only needed for chat actions
}

/**
 * Get dynamic greeting based on time and session
 */
export function getDynamicGreeting(): string {
  const hour = new Date().getHours()

  let timeGreeting = ''
  if (hour < 12) {
    timeGreeting = 'Good morning'
  } else if (hour < 17) {
    timeGreeting = 'Good afternoon'
  } else {
    timeGreeting = 'Good evening'
  }

  const firstVisit = isNewVisitor()

  if (firstVisit) {
    return `${timeGreeting}! I'm Iris, Balcha's AI assistant.

I can help you:
• Explore his projects (PRO_CODE, AUTO-GIT, Parshu-STT)
• Answer questions about his skills and experience
• Guide you to different sections
• Tell you about his research and leadership

Try asking: "What are Balcha's top skills?" or "Tell me about his projects"`
  }

  return `${timeGreeting}. Welcome back! Is there something specific you'd like to explore, or shall I show you what's new?`
}

/**
 * Get contextual suggestions for current page
 */
export function getContextualSuggestions(pathname: string): Suggestion[] {
  const suggestions: Record<string, Suggestion[]> = {
    '/': [
      { text: 'Tell me about Balcha\'s projects', action: 'chat', prompt: 'Tell me about Balcha\'s projects' },
      { text: 'What A.I. agents has he built?', action: 'chat', prompt: 'What A.I. agents has Balcha built?' },
      { text: 'How can I contact Balcha?', action: 'chat', prompt: 'How can I contact Balcha?' },
      { text: 'View all projects', action: 'navigate', target: '/projects' },
    ],
    '/projects': [
      { text: 'Tell me about PRO_CODE', action: 'chat', prompt: 'Tell me about PRO_CODE' },
      { text: 'What is GPT-OSS Vision?', action: 'chat', prompt: 'What is GPT-OSS Vision?' },
      { text: 'About Parshu-STT', action: 'chat', prompt: 'Tell me about Parshu-STT' },
      { text: 'About Balcha', action: 'navigate', target: '/about' },
    ],
    '/about': [
      { text: 'View your projects', action: 'navigate', target: '/projects' },
      { text: 'Tell me about your education', action: 'chat', prompt: 'Tell me about your education' },
      { text: 'Get in touch', action: 'navigate', target: '/contact' },
      { text: 'View your resume', action: 'navigate', target: '/resume' },
    ],
    '/agents': [
      { text: 'How do agents work?', action: 'chat', prompt: 'How do your agents work?' },
      { text: 'Tell me about WhisperSTT', action: 'chat', prompt: 'Tell me about WhisperSTT' },
      { text: 'View all projects', action: 'navigate', target: '/projects' },
      { text: 'Read research', action: 'navigate', target: '/research' },
    ],
    '/contact': [
      { text: 'Send an email', action: 'info' },
      { text: 'Connect on LinkedIn', action: 'info' },
      { text: 'View GitHub', action: 'info' },
      { text: 'Back to home', action: 'navigate', target: '/' },
    ],
    '/research': [
      { text: 'Tell me about your papers', action: 'chat', prompt: 'Tell me about your research papers' },
      { text: 'View methodology', action: 'chat', prompt: 'What is your research methodology?' },
      { text: 'See projects', action: 'navigate', target: '/projects' },
      { text: 'About Balcha', action: 'navigate', target: '/about' },
    ],
    '/leadership': [
      { text: 'Tell me about VYOM', action: 'chat', prompt: 'Tell me about VYOM' },
      { text: 'View projects', action: 'navigate', target: '/projects' },
      { text: 'About Balcha', action: 'navigate', target: '/about' },
      { text: 'Contact', action: 'navigate', target: '/contact' },
    ],
    '/tools': [
      { text: 'What tools have you built?', action: 'chat', prompt: 'What tools have you built?' },
      { text: 'View all projects', action: 'navigate', target: '/projects' },
      { text: 'Meet the agents', action: 'navigate', target: '/agents' },
      { text: 'Home', action: 'navigate', target: '/' },
    ],
    '/resume': [
      { text: 'View projects', action: 'navigate', target: '/projects' },
      { text: 'Contact for opportunities', action: 'navigate', target: '/contact' },
      { text: 'About Balcha', action: 'navigate', target: '/about' },
      { text: 'Leadership', action: 'navigate', target: '/leadership' },
    ],
  }

  // Handle dynamic routes
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return [
      { text: 'Tell me more about this project', action: 'chat', prompt: 'Tell me more about this project' },
      { text: 'View all projects', action: 'navigate', target: '/projects' },
      { text: 'Contact Balcha', action: 'navigate', target: '/contact' },
    ]
  }

  return suggestions[pathname] || suggestions['/']
}

/**
 * Get follow-up suggestion after response
 */
export function getFollowUpSuggestion(pathname: string, lastMessage: string): Suggestion | null {
  const lowerMessage = lastMessage.toLowerCase()

  // After discussing projects, suggest viewing them
  if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
    if (pathname !== '/projects') {
      return {
        text: 'View all projects',
        action: 'navigate',
        target: '/projects',
      }
    }
  }

  // After discussing agents, suggest agents page
  if (lowerMessage.includes('agent') || lowerMessage.includes('a.i.')) {
    if (pathname !== '/agents') {
      return {
        text: 'Meet the agents',
        action: 'navigate',
        target: '/agents',
      }
    }
  }

  // After discussing background, suggest about page
  if (lowerMessage.includes('about') || lowerMessage.includes('bio') || lowerMessage.includes('background')) {
    if (pathname !== '/about') {
      return {
        text: 'Learn more about Balcha',
        action: 'navigate',
        target: '/about',
      }
    }
  }

  // After discussing contact, suggest contact page
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('hire')) {
    if (pathname !== '/contact') {
      return {
        text: 'Get in touch',
        action: 'navigate',
        target: '/contact',
      }
    }
  }

  return null
}

/**
 * Get suggestions based on topics discussed
 */
export function getTopicBasedSuggestions(topics: string[]): Suggestion[] {
  const suggestions: Suggestion[] = []

  if (topics.includes('projects')) {
    suggestions.push({
      text: 'Tell me about a specific project',
      action: 'chat',
      prompt: 'Which project are you most proud of?'
    })
  }

  if (topics.includes('agents')) {
    suggestions.push({
      text: 'How do the agents work?',
      action: 'chat',
      prompt: 'How do your AI agents work together?'
    })
  }

  if (topics.includes('research')) {
    suggestions.push({
      text: 'What are you researching?',
      action: 'chat',
      prompt: 'What are you currently researching?'
    })
  }

  if (topics.includes('about') || topics.includes('skills')) {
    suggestions.push({
      text: 'What technologies do you use?',
      action: 'chat',
      prompt: 'What technologies and tools do you use?'
    })
  }

  if (topics.includes('contact')) {
    suggestions.push({
      text: 'How can we collaborate?',
      action: 'chat',
      prompt: 'How can we collaborate on a project?'
    })
  }

  // Add generic suggestions if no topic-specific ones
  if (suggestions.length === 0) {
    suggestions.push({
      text: 'What can you tell me?',
      action: 'chat',
      prompt: 'What can you tell me about Balcha?'
    })
  }

  return suggestions.slice(0, 3)
}

/**
 * Get page name from pathname for display
 */
export function getPageName(pathname: string): string {
  const pageNames: Record<string, string> = {
    '/': 'Home',
    '/projects': 'Projects',
    '/about': 'About',
    '/agents': 'Agents',
    '/contact': 'Contact',
    '/research': 'Research',
    '/leadership': 'Leadership',
    '/tools': 'Tools',
    '/resume': 'Resume',
  }

  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return 'Project Details'
  }

  return pageNames[pathname] || 'Page'
}

/**
 * Get proactive opening message based on page context
 */
export function getProactiveOpening(pathname: string, hasInteractedBefore: boolean): string | null {
  if (hasInteractedBefore) {
    return null
  }

  const openings: Record<string, string> = {
    '/': "Hi! I'm here to help you explore Balcha's portfolio. Would you like to see his projects or learn about the A.I. agents he's built?",
    '/projects': "Looking at Balcha's projects! Would you like me to tell you about PRO_CODE, or are you interested in something specific?",
    '/about': "Exploring Balcha's background! Want to hear about his education, or shall we look at his projects?",
    '/agents': "Welcome to the A.I. agents showcase! These agents can help with voice transcription, code navigation, and more. Want to try one?",
    '/contact': "Ready to get in touch! You can email Balcha directly, connect on LinkedIn, or check out his GitHub. What would you like to do?",
    '/research': "Browsing Balcha's research papers! Each paper explores autonomous A.I. systems and multi-agent orchestration. Want to learn more?",
    '/leadership': "Exploring Balcha's leadership journey! He founded VYOM, the space-tech club at Amrita. Want to hear more about it?",
  }

  return openings[pathname] || null
}
