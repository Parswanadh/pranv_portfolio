'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { TypingIndicator } from '@/components/skeletons/LoadingSkeleton'
import { addToNavigationHistory, getSessionInfo } from '@/lib/iris-session'
import type { Message } from './iris/types'
import { IrisHeader } from './iris/IrisHeader'
import { IrisMessageItem } from './iris/IrisMessageItem'
import { IrisInput } from './iris/IrisInput'
import { IrisSuggestions } from './iris/IrisSuggestions'
import { IrisClearConfirm } from './iris/IrisClearConfirm'
import { IrisSessionInfo } from './iris/IrisSessionInfo'
import { useIrisSession, useInitialMessages } from './iris/hooks/useIrisSession'
import { useIrisAudio } from './iris/hooks/useIrisAudio'
import { useIrisSuggestions } from './iris/hooks/useIrisSuggestions'

export default function IrisAssistant() {
  const pathname = usePathname()
  const router = useRouter()

  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Session & Messages
  const [mounted, setMounted] = useState(false)
  const { messages, setMessages } = useInitialMessages(mounted, pathname || '/')
  const {
    sessionInfo,
    setSessionInfo,
    soundEnabled,
    updateSoundEnabled,
    clearConversation,
    startNewSession,
  } = useIrisSession(mounted)

  // Audio
  const { audioRef, speakingState, setSpeakingState, playAudio } = useIrisAudio(null)

  // Suggestions
  const suggestions = useIrisSuggestions(
    messages.length,
    sessionInfo.topics.length,
    sessionInfo
  )

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update session info every 30 seconds
  useEffect(() => {
    if (!mounted) return

    const updateInfo = () => setSessionInfo(getSessionInfo())
    updateInfo()

    const interval = setInterval(updateInfo, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, messages.length])

  // Custom event listeners
  useEffect(() => {
    const handleOpenIris = () => setIsOpen(true)
    window.addEventListener('open-iris', handleOpenIris)
    return () => window.removeEventListener('open-iris', handleOpenIris)
  }, [])

  useEffect(() => {
    const handleIrisQuestion = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsOpen(true)
      setInput(customEvent.detail || '')
    }
    window.addEventListener('iris-question', handleIrisQuestion)
    return () => window.removeEventListener('iris-question', handleIrisQuestion)
  }, [])

  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Chat logic
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: Date.now() },
      { role: 'assistant', content: '', timestamp: Date.now() }
    ])
    setSpeakingState('processing')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: require('./iris/constants').BASE_IRIS_SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
        })
      })

      if (!response.ok) throw new Error('API request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response is not readable')

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
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1]
      }

      // Update assistant message with streaming text
      const assistantIndex = messages.length + 1
      const chars = fullMessage.split('')
      const BATCH_SIZE = 5

      for (let i = 0; i < chars.length; i += BATCH_SIZE) {
        const nextIndex = Math.min(i + BATCH_SIZE, chars.length)
        const displayedText = chars.slice(0, nextIndex).join('')

        setMessages(prev => {
          const updated = [...prev]
          updated[assistantIndex] = {
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

      setSpeakingState('idle')
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }])
      setSpeakingState('idle')
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion?.action === 'navigate') {
      if (suggestion.target) {
        router.push(suggestion.target)
      } else {
        setInput(suggestion.prompt || suggestion.text)
      }
    } else {
      setInput(suggestion.prompt || suggestion.text)
    }
  }

  const handleClearConversation = () => {
    if (sessionInfo.hasHistory) {
      setShowClearConfirm(true)
    } else {
      clearConversation()
      setMessages([{
        role: 'assistant',
        content: require('@/lib/proactive-suggestions').getDynamicGreeting(),
        timestamp: Date.now(),
      }])
    }
  }

  const confirmClearConversation = () => {
    clearConversation()
    setMessages([{
      role: 'assistant',
      content: require('@/lib/proactive-suggestions').getDynamicGreeting(),
      timestamp: Date.now(),
    }])
    setShowClearConfirm(false)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && mounted && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 md:bottom-8 md:right-8 z-[99999] bg-accent-primary text-bg-primary rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer focus:ring-2 focus:ring-accent-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-bg-primary active:scale-95 touch-manipulation"
          aria-label="Chat with Iris"
          style={{
            pointerEvents: 'auto',
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px'
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 z-[10001] w-auto md:w-96 max-h-[60vh] md:max-h-[600px] max-w-full bg-bg-secondary/90 backdrop-blur-md border border-border-default/50 rounded-lg shadow-xl flex flex-col">
          <IrisHeader
            speakingState={speakingState}
            soundEnabled={soundEnabled}
            onToggleSound={() => updateSoundEnabled(!soundEnabled)}
            onClose={() => setIsOpen(false)}
            onClearConversation={handleClearConversation}
            sessionInfo={sessionInfo}
            pathname={pathname}
          />

          <IrisSessionInfo
            hasHistory={sessionInfo.hasHistory}
            topics={sessionInfo.topics}
            pathname={pathname}
          />

          <IrisClearConfirm
            isOpen={showClearConfirm}
            onConfirm={confirmClearConversation}
            onNewSession={() => {
              startNewSession()
              setMessages([{
                role: 'assistant',
                content: require('@/lib/proactive-suggestions').getDynamicGreeting(),
                timestamp: Date.now(),
              }])
              setShowClearConfirm(false)
            }}
            onDismiss={() => setShowClearConfirm(false)}
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <IrisMessageItem key={i} msg={msg} onSuggestionClick={handleSuggestionClick} />
            ))}
            {false && ( // isLoading
              <div className="flex justify-start">
                <div className="bg-bg-elevated p-3 rounded-lg flex items-center gap-2">
                  <TypingIndicator />
                  <p className="text-sm text-text-tertiary">Iris is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <IrisSuggestions
            suggestions={suggestions}
            isLoading={false}
            messagesLength={messages.length}
            onSuggestionClick={handleSuggestionClick}
            setInput={setInput}
          />

          <IrisInput
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            isLoading={false}
          />

          <audio ref={audioRef} />
        </div>
      )}
    </>
  )
}

// Add missing imports
import { usePathname, useRouter } from 'next/navigation'
