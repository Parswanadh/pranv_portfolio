/**
 * Navigation Intent Detection
 *
 * Intelligent navigation detection using pattern matching
 * Enables implicit navigation when user expresses intent to visit pages
 */

export interface NavigationIntent {
  target: string | null
  confidence: number
  reason: string
  suggestion?: {
    text: string
    prompt: string
    action: 'navigate'
  }
}

interface NavigationPattern {
  regex: RegExp
  target: string
  priority: number
}

const NAVIGATION_PATTERNS: NavigationPattern[] = [
  // Projects (highest priority - must check BEFORE about patterns)
  // Explicit navigation commands - high confidence
  {
    regex: /^(take me|show me|go to|navigate|open|view|let's see)\s+(to\s+)?projects?\b/i,
    target: '/projects',
    priority: 10,
  },
  {
    regex: /\b(explore|browse)( your)?\s*projects?\b/i,
    target: '/projects',
    priority: 10,
  },
  // "Tell me about your projects" - specific pattern with negative lookahead
  // Must come BEFORE generic /about patterns
  {
    regex: /\b(tell me about|what are|what's|see|view|look at|list)( all)?( your| his| the)?\s*projects?(?!.*about (you|pranav|him|yourself))\b/i,
    target: '/projects',
    priority: 9,
  },
  {
    regex: /\b(what (projects?|work) (do you|does he|does pranav) have|what (projects?|work) have you done|what have you (built|created)|show me your work)\b/i,
    target: '/projects',
    priority: 9,
  },
  // Note: Generic "tell me about [topic]" without specific keywords won't trigger navigation
  // This allows the AI to answer the question without auto-navigating

  // Agents
  // Only EXPLICIT navigation commands
  {
    regex: /^(take me|show me|go to|navigate|open|view)\s+(to\s+)?agents?\b/i,
    target: '/agents',
    priority: 9,
  },
  {
    regex: /\bmeet the agents?\b/i,
    target: '/agents',
    priority: 9,
  },
  // Lower priority for implicit mentions
  {
    regex: /\b(see|view|tell me about|what are)( your)?\s*agents?\b/i,
    target: '/agents',
    priority: 2, // Reduced from 9 - won't meet confidence threshold
  },
  {
    regex: /\bwhat agents? do you have\b/i,
    target: '/agents',
    priority: 2, // Reduced from 9 - won't meet confidence threshold
  },
  {
    regex: /\b(A\.I\. tools?|AI tools?|artificial intelligence)\b/i,
    target: '/agents',
    priority: 2, // Reduced from 8 - won't meet confidence threshold
  },

  // About - CRITICAL: These patterns must NOT match "tell me about your projects"
  // Order matters: More specific patterns first, with negative lookaheads
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*about(?! (your|the|his|those|these)?\s*projects?\b)\b/i,
    target: '/about',
    priority: 8,
  },
  {
    regex: /\b(more )?about (?!.*projects?\b)(you|pranav|him|yourself)\b/i,
    target: '/about',
    priority: 8,
  },
  {
    regex: /\b(who (are is|is) pranav|tell me (only )?about pranav(?! and his projects)|what is pranav's background)\b/i,
    target: '/about',
    priority: 8,
  },
  {
    regex: /\b(bio|biography|background)( page)?\b/i,
    target: '/about',
    priority: 8,
  },
  {
    regex: /\blearn more about (?!.*projects)\s*you\b/i,
    target: '/about',
    priority: 8,
  },

  // Contact
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*contact\b/i,
    target: '/contact',
    priority: 7,
  },
  {
    regex: /\bhow (can i|do i) (contact|reach|get in touch with)( you|pranav)\b/i,
    target: '/contact',
    priority: 7,
  },
  {
    regex: /\b(email|mail|get in touch|reach out)\b/i,
    target: '/contact',
    priority: 7,
  },
  {
    regex: /\b(hire|collaborate|work together)\b/i,
    target: '/contact',
    priority: 7,
  },

  // Research
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*research\b/i,
    target: '/research',
    priority: 6,
  },
  {
    regex: /\b(papers?|publications?|academic work|research papers?)\b/i,
    target: '/research',
    priority: 6,
  },
  {
    regex: /\b(read (your )?(research|papers?))\b/i,
    target: '/research',
    priority: 6,
  },

  // Leadership
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*leadership\b/i,
    target: '/leadership',
    priority: 5,
  },
  {
    regex: /\bleadership (roles?|experience|positions?|history)\b/i,
    target: '/leadership',
    priority: 5,
  },
  {
    regex: /\bvyom\b/i,
    target: '/leadership',
    priority: 5,
  },

  // Tools
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*tools\b/i,
    target: '/tools',
    priority: 4,
  },
  {
    regex: /\bwhat tools? have you (built|created|made)\b/i,
    target: '/tools',
    priority: 4,
  },
  {
    regex: /\butilities?\b/i,
    target: '/tools',
    priority: 4,
  },

  // Resume
  {
    regex: /\b(take me|show me|go to|navigate|open|view)?\s*resume\b/i,
    target: '/resume',
    priority: 3,
  },
  {
    regex: /\b(CV|curriculum vitae)\b/i,
    target: '/resume',
    priority: 3,
  },

  // Home
  {
    regex: /\b(take me |show me |go to |navigate |back to )?home\b/i,
    target: '/',
    priority: 2,
  },
  {
    regex: /\bstart (over|again)\b/i,
    target: '/',
    priority: 2,
  },
  {
    regex: /\bmain page|landing page\b/i,
    target: '/',
    priority: 2,
  },
]

/**
 * Generate a user-friendly navigation suggestion
 */
function generateNavigationSuggestion(target: string): NavigationIntent['suggestion'] {
  const suggestions: Record<string, { text: string; prompt: string }> = {
    '/projects': { text: 'View Projects', prompt: 'Take me to projects' },
    '/agents': { text: 'Meet the Agents', prompt: 'Show me the agents' },
    '/about': { text: 'About Pranav', prompt: 'Tell me about Pranav' },
    '/contact': { text: 'Get in Touch', prompt: 'Take me to contact' },
    '/research': { text: 'View Research', prompt: 'Show me your research' },
    '/leadership': { text: 'Leadership', prompt: 'Take me to leadership' },
    '/tools': { text: 'View Tools', prompt: 'Show me your tools' },
    '/resume': { text: 'View Resume', prompt: 'Take me to resume' },
    '/': { text: 'Go Home', prompt: 'Take me home' },
  }

  const suggestion = suggestions[target]
  if (!suggestion) return undefined

  return {
    text: suggestion.text,
    prompt: suggestion.prompt,
    action: 'navigate',
  }
}

/**
 * Detect navigation intent from user message
 */
export function detectNavigationIntent(message: string): NavigationIntent {
  const normalizedMessage = message.toLowerCase().trim()

  // Check each pattern
  let bestMatch: NavigationIntent = {
    target: null,
    confidence: 0,
    reason: 'No navigation intent detected',
  }

  for (const { regex, target, priority } of NAVIGATION_PATTERNS) {
    if (regex.test(normalizedMessage)) {
      // Calculate confidence based on match specificity
      const confidence = calculateConfidence(normalizedMessage, regex, priority)

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          target,
          confidence,
          reason: `Matched pattern: "${regex.source}"`,
          suggestion: generateNavigationSuggestion(target),
        }
      }
    }
  }

  return bestMatch
}

/**
 * Calculate confidence score for a match
 */
function calculateConfidence(message: string, pattern: RegExp, priority: number): number {
  let confidence = priority * 10

  // Boost for explicit navigation phrases
  if (/^(take me|show me|go to|navigate|open|view)/i.test(message)) {
    confidence += 20
  }

  // Boost for question format (shows intent)
  if (message.includes('?')) {
    confidence += 5
  }

  // Boost for exact phrase matches at start of message
  const match = message.match(pattern)
  if (match && match.index === 0) {
    confidence += 10
  }

  // Ensure confidence doesn't exceed 100
  return Math.min(confidence, 100)
}

/**
 * Check if navigation should happen based on intent and current page
 *
 * CONSENSUAL NAVIGATION: We now return false for auto-navigation.
 * Instead, navigation suggestions are shown to the user to choose.
 *
 * Only EXPLICIT navigation commands (high confidence) should trigger auto-navigation.
 * Implicit mentions get suggestions instead.
 */
export function shouldNavigate(
  intent: NavigationIntent,
  currentPath: string
): { shouldNavigate: boolean; delay: number } {
  // Don't navigate if no intent
  if (!intent.target) {
    return { shouldNavigate: false, delay: 0 }
  }

  // Don't navigate if already on target page
  if (intent.target === currentPath) {
    return { shouldNavigate: false, delay: 0 }
  }

  // CONSENSUAL: Only auto-navigate for VERY EXPLICIT commands (confidence >= 90)
  // Lower confidence queries get a suggestion instead
  if (intent.confidence < 90) {
    return { shouldNavigate: false, delay: 0 }
  }

  // Navigate with delay for TTS to complete
  return { shouldNavigate: true, delay: 1500 }
}

/**
 * Extract specific project mentions
 */
export function extractProjectMention(message: string): string | null {
  const projectKeywords = [
    { pattern: /\bpro[ -_]?code\b/i, name: 'PRO_CODE', slug: 'pro-code' },
    { pattern: /\bgpt[ -_]?oss\b/i, name: 'GPT-OSS Vision', slug: 'gpt-oss-vision' },
    { pattern: /\bauto[ -_]?git\b/i, name: 'AUTO-GIT', slug: 'auto-git-publisher' },
    { pattern: /\bparshu[ -_]?stt\b/i, name: 'Parshu-STT', slug: 'parshu-stt' },
    { pattern: /\bwhisper\b/i, name: 'WhisperSTT', slug: 'whisper-stt' },
    { pattern: /\bcli[ -_]?tour\b/i, name: 'CLI-Tour', slug: 'cli-tour' },
    { pattern: /\bmultimodal[ -_]?adapter\b/i, name: 'Multimodal Adapter', slug: 'multimodal-adapter' },
  ]

  for (const { pattern, slug } of projectKeywords) {
    if (pattern.test(message)) {
      return slug
    }
  }

  return null
}
