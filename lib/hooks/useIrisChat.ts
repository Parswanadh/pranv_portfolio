/**
 * useIrisChat - Custom hook for Iris chat state management
 *
 * Consolidates all Iris chat state and logic into a single hook
 * to reduce component complexity and improve re-render performance.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { addMessageToSession, clearMessages, getConversationHistory, getSessionInfo, resetSession } from '@/lib/iris-session'

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

type SpeakingState = 'idle' | 'listening' | 'processing' | 'reasoning' | 'speaking'

interface IrisChatState {
  isOpen: boolean
  messages: Message[]
  input: string
  isLoading: boolean
  speakingState: SpeakingState
  soundEnabled: boolean
  mounted: boolean
  showClearConfirm: boolean
}

interface IrisChatActions {
  setIsOpen: (open: boolean) => void
  setInput: (input: string) => void
  sendMessage: () => Promise<void>
  toggleSound: () => void
  startNewChat: () => void
  clearConversation: () => void
  dismissConfirm: () => void
}

export function useIrisChat(): { state: IrisChatState; actions: IrisChatActions; refs: { audioRef: React.RefObject<HTMLAudioElement>; messagesEndRef: React.RefObject<HTMLDivElement> } } {
  const pathname = usePathname()
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Consolidated state
  const [state, setState] = useState<IrisChatState>({
    isOpen: false,
    messages: [],
    input: '',
    isLoading: false,
    speakingState: 'idle',
    soundEnabled: true,
    mounted: false,
    showClearConfirm: false,
  })

  // Initialize
  useEffect(() => {
    setState(prev => ({ ...prev, mounted: true }))

    // Load conversation history
    const history = getConversationHistory(10)
    if (history.length > 0) {
      setState(prev => ({ ...prev, messages: history }))
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages.length])

  // Custom event listeners
  useEffect(() => {
    const handleOpenIris = () => setState(prev => ({ ...prev, isOpen: true }))
    const handleIrisQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setState(prev => ({ ...prev, isOpen: true, input: customEvent.detail || '' }))
    }

    window.addEventListener('open-iris', handleOpenIris)
    window.addEventListener('iris-question', handleIrisQuestion)

    return () => {
      window.removeEventListener('open-iris', handleOpenIris)
      window.removeEventListener('iris-question', handleIrisQuestion)
    }
  }, [])

  // Actions
  const actions: IrisChatActions = {
    setIsOpen: useCallback((open: boolean) => {
      setState(prev => ({ ...prev, isOpen: open }))
    }, []),

    setInput: useCallback((input: string) => {
      setState(prev => ({ ...prev, input }))
    }, []),

    sendMessage: useCallback(async () => {
      if (!state.input.trim()) return

      const userMessage = state.input
      setState(prev => ({
        ...prev,
        input: '',
        isLoading: true,
        speakingState: 'processing',
        messages: [
          ...prev.messages,
          { role: 'user', content: userMessage, timestamp: Date.now() },
          { role: 'assistant', content: '', timestamp: Date.now() }
        ]
      }))

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'You are Iris, a helpful assistant.' },
              ...getConversationHistory(10),
              { role: 'user', content: userMessage }
            ]
          })
        })

        if (!response.ok) throw new Error('API request failed')

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Response not readable')

        const decoder = new TextDecoder()
        let fullMessage = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim()
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) fullMessage += parsed.content
              } catch { /* Skip */ }
            }
          }
          buffer = lines[lines.length - 1]
        }

        // Save to session
        addMessageToSession('user', userMessage, pathname || "/")
        addMessageToSession('assistant', fullMessage, pathname || "/")

        setState(prev => ({
          ...prev,
          messages: prev.messages.map((msg, i) =>
            i === prev.messages.length - 1
              ? { ...msg, content: fullMessage }
              : msg
          ),
          isLoading: false,
          speakingState: 'idle'
        }))

      } catch (error) {
        console.error('Error:', error)
        setState(prev => ({
          ...prev,
          messages: prev.messages.slice(0, -1).concat({
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: Date.now()
          }),
          isLoading: false,
          speakingState: 'idle'
        }))
      }
    }, [state.input, pathname]),

    toggleSound: useCallback(() => {
      setState(prev => {
        const newSoundEnabled = !prev.soundEnabled
        // Save preference
        if (typeof window !== 'undefined') {
          localStorage.setItem('irisSoundEnabled', String(newSoundEnabled))
        }
        return { ...prev, soundEnabled: newSoundEnabled }
      })
    }, []),

    startNewChat: useCallback(() => {
      resetSession()
      setState(prev => ({
        ...prev,
        messages: [{
          role: 'assistant',
          content: 'Hello! I\'m Iris, Pranav\'s AI assistant. How can I help you today?',
          timestamp: Date.now(),
        }],
        showClearConfirm: false
      }))
    }, []),

    clearConversation: useCallback(() => {
      const sessionInfo = getSessionInfo()
      if (sessionInfo.hasHistory) {
        setState(prev => ({ ...prev, showClearConfirm: true }))
      } else {
        resetSession()
        setState(prev => ({
          ...prev,
          messages: [{
            role: 'assistant',
            content: 'Hello! I\'m Iris, Pranav\'s AI assistant. How can I help you today?',
            timestamp: Date.now(),
          }],
          showClearConfirm: false
        }))
      }
    }, []),

    dismissConfirm: useCallback(() => {
      setState(prev => ({ ...prev, showClearConfirm: false }))
    }, []),
  }

  return {
    state,
    actions,
    refs: { audioRef, messagesEndRef }
  }
}
