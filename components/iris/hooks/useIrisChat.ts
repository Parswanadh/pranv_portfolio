import { useState, useCallback, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { optimizeForVoice } from '@/lib/voice-optimizer'
import { getContextualSystemPrompt } from '@/lib/page-context'
import { detectNavigationIntent, shouldNavigate } from '@/lib/navigation-intent'
import {
  getSession,
  addMessageToSession,
  getConversationHistory,
  addToNavigationHistory,
} from '@/lib/iris-session'
import type { Message, SpeakingState } from '../types'

interface UseIrisChatProps {
  soundEnabled: boolean
  pathname: string
  onSpeakingStateChange: (state: SpeakingState) => void
  onPlayAudio: (text: string) => Promise<void>
}

export function useIrisChat({
  soundEnabled,
  pathname,
  onSpeakingStateChange,
  onPlayAudio,
}: UseIrisChatProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const assistantMessageIndexRef = useRef<number>(-1)

  const handleSendMessage = useCallback(async (input: string, setInput: (val: string) => void) => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => {
      const updated: Message[] = [
        ...prev,
        { role: 'user', content: userMessage, timestamp: Date.now() },
        { role: 'assistant', content: '', timestamp: Date.now() }
      ]
      assistantMessageIndexRef.current = updated.length - 1
      return updated
    })
    setIsLoading(true)
    onSpeakingStateChange('processing')

    const navIntent = detectNavigationIntent(userMessage)

    try {
      const systemPrompt = getContextualSystemPrompt(
        require('../constants').BASE_IRIS_SYSTEM_PROMPT,
        pathname
      )
      const session = getSession()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...getConversationHistory(10),
            { role: 'user', content: userMessage }
          ],
          context: {
            topicsDiscussed: session.topicsDiscussed,
            currentPage: pathname,
            navigationHistory: session.navigationHistory,
            sessionDuration: Date.now() - session.startTime,
          }
        })
      })

      if (!response.ok) throw new Error('API request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response is not readable')

      const decoder = new TextDecoder()
      let fullMessage = ''
      let buffer = ''
      let isDone = false

      while (!isDone) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              isDone = true
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) fullMessage += parsed.content
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
        buffer = lines[lines.length - 1]
      }

      const optimizedMessage = optimizeForVoice(fullMessage, {
        maxBreathUnitLength: 150,
        addThinkingPauses: false,
        expandAcronyms: true,
        useConversationalStyle: true,
        enableParagraphPauses: true,
      })

      addMessageToSession('user', userMessage, pathname)
      addMessageToSession('assistant', fullMessage, pathname)

      setIsLoading(false)

      if (soundEnabled && optimizedMessage) {
        onSpeakingStateChange('speaking')
        onPlayAudio(optimizedMessage)
      }

      const chars = fullMessage.split('')
      const BATCH_SIZE = 5

      for (let i = 0; i < chars.length; i += BATCH_SIZE) {
        const nextIndex = Math.min(i + BATCH_SIZE, chars.length)
        const displayedText = chars.slice(0, nextIndex).join('')

        setMessages(prev => {
          const updated = [...prev]
          updated[assistantMessageIndexRef.current] = {
            role: 'assistant',
            content: displayedText,
            timestamp: Date.now()
          }
          return updated
        })

        if (i < chars.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 15))
        }
      }

      onSpeakingStateChange('idle')

      const navDecision = shouldNavigate(navIntent, pathname)
      if (navIntent.target && navIntent.confidence >= 50 && !navDecision.shouldNavigate) {
        setMessages(prev => {
          const updated = [...prev]
          updated[assistantMessageIndexRef.current] = {
            ...updated[assistantMessageIndexRef.current],
            suggestion: navIntent.suggestion
          }
          return updated
        })
      } else if (navDecision.shouldNavigate && navIntent.target) {
        if (soundEnabled) {
          setPendingNavigation(navIntent.target)
        } else {
          setTimeout(() => {
            router.push(navIntent.target!)
          }, 500)
        }
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        if (updated[assistantMessageIndexRef.current]?.content === '') {
          updated.splice(assistantMessageIndexRef.current, 1)
        }
        updated.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now()
        })
        return updated
      })
      setIsLoading(false)
      onSpeakingStateChange('idle')
    }
  }, [soundEnabled, pathname, onSpeakingStateChange, onPlayAudio, router])

  return {
    messages,
    setMessages,
    isLoading,
    pendingNavigation,
    setPendingNavigation,
    handleSendMessage,
  }
}
