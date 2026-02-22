export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
  suggestion?: {
    text: string
    prompt: string
    action: 'navigate'
    target?: string
  }
}

export type SpeakingState = 'idle' | 'listening' | 'processing' | 'reasoning' | 'speaking'

export interface Suggestion {
  text: string
  prompt?: string
  action: 'chat' | 'navigate' | 'info'
  target?: string
}

export interface SessionInfo {
  hasHistory: boolean
  durationText: string
  topics: string[]
}
