/**
 * Voice Optimizer for TTS
 *
 * Optimizes text for Deepgram Aura TTS by applying voice-first patterns
 * Based on 2025-2026 research findings for conversational AI voice interfaces
 */

export interface VoiceOptimizationOptions {
  maxBreathUnitLength?: number
  addThinkingPauses?: boolean
  expandAcronyms?: boolean
  useConversationalStyle?: boolean
  enableParagraphPauses?: boolean  // NEW: Add pauses between paragraphs
}

const ACRONYM_EXPANSIONS: Record<string, string> = {
  // Keep periods for letter-by-letter pronunciation
  'STT': 'S.T.T.',
  'TTS': 'T.T.S.',
  'LLM': 'L.L.M.',
  'RAG': 'R.A.G.',
  'NLP': 'N.L.P.',
  'GPT-OSS': 'G.P.T. O.S.S.',
  'GPT': 'G.P.T.',
  'OSS': 'O.S.S.',

  // Remove periods - pronounced as words in 2025 (not letter-by-letter)
  'AI': 'AI',
  'ML': 'ML',
  'API': 'API',
  'GPU': 'GPU',
  'CPU': 'CPU',
  'UI': 'UI',
  'UX': 'UX',
  'CLI': 'CLI',
  'HTTP': 'HTTP',
  'URL': 'URL',
  'SSO': 'SSO',
  'JWT': 'JWT',
  'OAuth': 'OAuth',
}

/**
 * Main optimization function for voice output
 */
export function optimizeForVoice(
  text: string,
  options: VoiceOptimizationOptions = {}
): string {
  const {
    maxBreathUnitLength = 170,  // Optimal for natural speech with breathing room
    addThinkingPauses = false,   // Disabled by default - creates artificial pauses
    expandAcronyms = true,
    useConversationalStyle = true,
    enableParagraphPauses = true,    // Enable paragraph pauses for better flow
  } = options

  let optimized = text

  // Remove any remaining markdown (defense in depth)
  optimized = stripMarkdown(optimized)

  // Expand acronyms for better pronunciation
  if (expandAcronyms) {
    optimized = expandKnownAcronyms(optimized)
  }

  // Break into breath units
  optimized = breakIntoBreathUnits(optimized, maxBreathUnitLength)

  // Add thinking pauses for more natural speech
  if (addThinkingPauses) {
    optimized = addStrategicPauses(optimized)
  }

  // Apply conversational patterns
  if (useConversationalStyle) {
    optimized = applyConversationalStyle(optimized)
  }

  // Add paragraph breaks for natural pauses between sections
  if (enableParagraphPauses) {
    optimized = addParagraphPauses(optimized)
  }

  return optimized.trim()
}

/**
 * Strip markdown formatting while preserving paragraph structure
 */
function stripMarkdown(text: string): string {
  // STEP 1: Protect paragraph breaks with temporary marker
  let result = text.replace(/\n\n+/g, '||PARAGRAPH_BREAK||')

  // STEP 2: Remove markdown formatting
  result = result
    // Bold/italic markers
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Headers
    .replace(/^#{1,6}\s+/gm, '')
    // Links - keep text, remove URL
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // List markers - replace with period for natural speech
    .replace(/^[\s]*[-*+]\s+/gm, '. ')
    .replace(/^[\s]*\d+\.\s+/gm, '. ')
    // Clean up extra whitespace (but NOT paragraph breaks)
    .replace(/[ \t]+/g, ' ')  // Only collapse spaces and tabs
    .replace(/\n+/g, ' ')      // Collapse single newlines but keep paragraph marker

  // STEP 3: Restore paragraph breaks with natural pause
  result = result.replace(/\|\|PARAGRAPH_BREAK\|\|/g, '\n\n')

  return result.trim()
}

/**
 * Expand known acronyms for better pronunciation
 */
function expandKnownAcronyms(text: string): string {
  let result = text

  // Sort by length (descending) to match longer acronyms first
  const sortedAcronyms = Object.entries(ACRONYM_EXPANSIONS)
    .sort((a, b) => b[0].length - a[0].length)

  for (const [acronym, expansion] of sortedAcronyms) {
    // Use word boundary to avoid partial matches
    const regex = new RegExp(`\\b${acronym}\\b`, 'g')
    result = result.replace(regex, expansion)
  }

  return result
}

/**
 * Break long sentences into breath units for natural speech
 */
function breakIntoBreathUnits(text: string, maxLength: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  const result: string[] = []

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue

    if (trimmed.length <= maxLength) {
      result.push(trimmed)
      continue
    }

    // Break long sentences at natural pause points
    const clauses = trimmed.split(/(?<=,|;|:)\s+/)
    let currentUnit = ''

    for (const clause of clauses) {
      const testUnit = currentUnit ? `${currentUnit} ${clause}` : clause
      if (testUnit.length <= maxLength) {
        currentUnit = testUnit
      } else {
        if (currentUnit) result.push(currentUnit.trim())
        currentUnit = clause
      }
    }

    if (currentUnit) result.push(currentUnit.trim())
  }

  return result.join(' ')
}

/**
 * Add strategic pauses for natural speech patterns
 * DISABLED - Modern TTS handles pauses naturally. Ellipses create artificial "processed" sound.
 */
function addStrategicPauses(text: string): string {
  // DISABLED - Let TTS engine handle natural pauses
  // Ellipses create artificial robotic timing
  return text
}

/**
 * Add natural pauses between paragraphs for better flow
 */
function addParagraphPauses(text: string): string {
  // Add pause after paragraph breaks (double newline)
  // Use groups of 3 dots for Deepgram to recognize as pause
  return text.replace(/\n\n+/g, (match) => {
    return '\n\n...... '
  })
}

/**
 * Apply conversational voice patterns for natural, human-like speech
 */
function applyConversationalStyle(text: string): string {
  // Convert formal to conversational
  const conversions: [RegExp, string][] = [
    [/I would suggest/gi, 'Let me suggest'],
    [/It is recommended that/gi, 'I recommend'],
    [/Please feel free to/gi, 'Feel free to'],
    [/Do not hesitate to/gi, 'Don\'t hesitate to'],
    [/I am able to/gi, 'I can'],
    [/I have the ability to/gi, 'I can'],
    [/I will be happy to/gi, 'I\'d love to'],
    [/I would be happy to/gi, 'I\'d love to'],
    [/Furthermore/gi, 'Plus'],
    [/Moreover/gi, 'Also'],
    [/Additionally/gi, 'And'],
    [/However/gi, 'But'],
    [/Therefore/gi, 'So'],
    [/Consequently/gi, 'That\'s why'],
    [/In order to/gi, 'To'],
    [/For the purpose of/gi, 'For'],
    [/With regard to/gi, 'About'],
    [/In regards to/gi, 'About'],
    [/In reference to/gi, 'About'],
    [/Please note that/gi, 'Note'],
    [/It should be noted that/gi, ''],
    [/It is important to note that/gi, ''],
    [/It is worth mentioning that/gi, ''],
    [/\b(Here are|Below are|The following are) (the )?(results|details|items)/gi, 'Here are'],
  ]

  let result = text
  for (const [pattern, replacement] of conversions) {
    result = result.replace(pattern, replacement)
  }

  // Add natural fillers and conversational markers
  result = result
    // Fix common robotic patterns
    .replace(/(\.)([A-Z])/g, '$1 $2')  // Ensure space after periods
    // Add breathing pauses naturally
    .replace(/(\w)\s+(and|or|but|so)(\s+)(\w)/gi, '$1 $2$3$4')  // No pause before conjunctions
    // More natural transition phrases
    .replace(/Let me show you/gi, 'Let me show you')
    .replace(/I can show you/gi, 'I can show you')
    .replace(/I can help you/gi, 'I can help')

  return result
}

/**
 * Validate that text is voice-safe (no markdown, reasonable length)
 */
export function validateVoiceText(text: string): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Check for markdown
  if (/[*_`#]|\\[[\]]/.test(text)) {
    issues.push('Contains markdown formatting that may be read literally')
  }

  // Check for very long sentences
  const sentences = text.split(/[.!?]/)
  const longSentences = sentences.filter(s => s.length > 200)
  if (longSentences.length > 0) {
    issues.push(`${longSentences.length} sentence(s) too long for natural speech`)
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}
