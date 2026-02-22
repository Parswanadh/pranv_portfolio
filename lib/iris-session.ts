/**
 * Iris Session Management
 *
 * localStorage-based session persistence for conversation history,
 * user preferences, and navigation tracking
 */

export interface IrisMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  pageContext?: string
}

export interface IrisSession {
  id: string
  startTime: number
  lastActivity: number
  messages: IrisMessage[]
  topicsDiscussed: string[]
  userPreferences: {
    soundEnabled: boolean
    voice: string
  }
  navigationHistory: string[]
}

export interface IrisPreferences {
  soundEnabled: boolean
  voice: string
  autoPlay: boolean
  showTranscript: boolean
}

const SESSION_STORAGE_KEY = 'iris_session'
const PREFERENCES_KEY = 'iris_preferences'
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

/**
 * Get or create current session
 */
export function getSession(): IrisSession {
  if (typeof window === 'undefined') {
    return createSession()
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    if (stored) {
      const session = JSON.parse(stored) as IrisSession

      // Check if session is still valid
      const now = Date.now()
      if (now - session.lastActivity < SESSION_TIMEOUT) {
        return session
      }
    }
  } catch (e) {
    console.error('Failed to parse session:', e)
  }

  // Create new session
  return createSession()
}

/**
 * Create a new session
 */
function createSession(): IrisSession {
  return {
    id: generateSessionId(),
    startTime: Date.now(),
    lastActivity: Date.now(),
    messages: [],
    topicsDiscussed: [],
    userPreferences: getPreferences(),
    navigationHistory: [],
  }
}

/**
 * Save session to localStorage
 */
export function saveSession(session: IrisSession): void {
  if (typeof window === 'undefined') return

  try {
    session.lastActivity = Date.now()
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch (e) {
    console.error('Failed to save session:', e)
  }
}

/**
 * Add message to session
 */
export function addMessageToSession(
  role: 'user' | 'assistant',
  content: string,
  pageContext?: string
): IrisSession {
  const session = getSession()

  const message: IrisMessage = {
    role,
    content,
    timestamp: Date.now(),
    pageContext,
  }

  session.messages.push(message)

  // Limit message history (keep last 50)
  if (session.messages.length > 50) {
    session.messages = session.messages.slice(-50)
  }

  // Update topics discussed (only for user messages)
  if (role === 'user') {
    const topics = extractTopics(content)
    for (const topic of topics) {
      if (!session.topicsDiscussed.includes(topic)) {
        session.topicsDiscussed.push(topic)
      }
    }
  }

  saveSession(session)
  return session
}

/**
 * Get user preferences
 */
export function getPreferences(): IrisPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences()
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (stored) {
      const saved = JSON.parse(stored) as Partial<IrisPreferences>
      return { ...defaultPreferences(), ...saved }
    }
  } catch (e) {
    console.error('Failed to parse preferences:', e)
  }

  return defaultPreferences()
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<IrisPreferences>): void {
  if (typeof window === 'undefined') return

  try {
    const current = getPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to save preferences:', e)
  }
}

/**
 * Get conversation history for API
 */
export function getConversationHistory(limit = 10): Array<{
  role: 'user' | 'assistant'
  content: string
}> {
  const session = getSession()
  const recent = session.messages.slice(-limit)

  return recent.map(({ role, content }) => ({ role, content }))
}

/**
 * Add page to navigation history
 */
export function addToNavigationHistory(path: string): void {
  const session = getSession()

  // Add if not same as last
  const lastPath = session.navigationHistory[session.navigationHistory.length - 1]
  if (lastPath !== path) {
    session.navigationHistory.push(path)

    // Keep last 20
    if (session.navigationHistory.length > 20) {
      session.navigationHistory = session.navigationHistory.slice(-20)
    }

    saveSession(session)
  }
}

/**
 * Get topics discussed for context
 */
export function getTopicsDiscussed(): string[] {
  return getSession().topicsDiscussed
}

/**
 * Get session duration in minutes
 */
export function getSessionDuration(): number {
  const session = getSession()
  return Math.floor((Date.now() - session.startTime) / 60000)
}

/**
 * Check if this is a new visitor
 */
export function isNewVisitor(): boolean {
  if (typeof window === 'undefined') return false

  return !localStorage.getItem(SESSION_STORAGE_KEY)
}

/**
 * Extract topics from message
 */
function extractTopics(message: string): string[] {
  const topics: string[] = []
  const lowerMessage = message.toLowerCase()

  const topicKeywords: Record<string, string[]> = {
    projects: ['project', 'work', 'code', 'built', 'created', 'developed', 'portfolio'],
    agents: ['agent', 'ai', 'bot', 'assistant', 'tool', 'autonomous'],
    research: ['research', 'paper', 'publication', 'academic', 'study'],
    contact: ['contact', 'email', 'reach', 'hire', 'collaborate', 'connect'],
    about: ['about', 'bio', 'background', 'who are', 'tell me about'],
    skills: ['skill', 'technology', 'stack', 'language', 'framework'],
    leadership: ['leadership', 'club', 'vyom', 'role', 'position'],
  }

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      if (!topics.includes(topic)) {
        topics.push(topic)
      }
    }
  }

  return topics
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Clear session (for logout/reset)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(SESSION_STORAGE_KEY)
}

/**
 * Clear messages only (keep session and preferences)
 */
export function clearMessages(): void {
  if (typeof window === 'undefined') return

  const session = getSession()
  session.messages = []
  saveSession(session)
}

/**
 * Reset session with new ID and timestamp but keep preferences
 */
export function resetSession(): IrisSession {
  if (typeof window === 'undefined') {
    return createSession()
  }

  const currentSession = getSession()
  const preferences = currentSession.userPreferences

  // Create new session with preserved preferences
  const newSession: IrisSession = {
    id: generateSessionId(),
    startTime: Date.now(),
    lastActivity: Date.now(),
    messages: [],
    topicsDiscussed: [],
    userPreferences: preferences,
    navigationHistory: [],
  }

  saveSession(newSession)
  return newSession
}

/**
 * Get session info for display
 */
export interface SessionInfo {
  id: string
  duration: number
  durationText: string
  messageCount: number
  topicsCount: number
  hasHistory: boolean
  currentPage: string
  topics: string[]
}

export function getSessionInfo(): SessionInfo {
  const session = getSession()
  const duration = Date.now() - session.startTime
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)

  let durationText = ''
  if (minutes > 0) {
    durationText = `${minutes}m ${seconds}s ago`
  } else if (seconds > 0) {
    durationText = `${seconds}s ago`
  } else {
    durationText = 'Just now'
  }

  return {
    id: session.id,
    duration,
    durationText,
    messageCount: session.messages.length,
    topicsCount: session.topicsDiscussed.length,
    hasHistory: session.messages.length > 1, // More than just greeting
    currentPage: session.navigationHistory[session.navigationHistory.length - 1] || '/',
    topics: session.topicsDiscussed,
  }
}

/**
 * Get conversation summary
 */
export function getConversationSummary(): string {
  const session = getSession()
  const topics = session.topicsDiscussed

  if (topics.length === 0) {
    return 'New conversation'
  }

  const topicLabels: Record<string, string> = {
    projects: 'Projects',
    agents: 'AI Agents',
    research: 'Research',
    contact: 'Contact',
    about: 'About',
    skills: 'Skills',
    leadership: 'Leadership',
  }

  const labels = topics.slice(0, 3).map(t => topicLabels[t] || t).join(', ')
  const remaining = topics.length - 3

  if (remaining > 0) {
    return `${labels} +${remaining}`
  }

  return labels
}

/**
 * Default preferences
 */
function defaultPreferences(): IrisPreferences {
  return {
    soundEnabled: true,
    voice: 'aura-asteria-en',
    autoPlay: true,
    showTranscript: true,
  }
}
