import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  getPreferences,
  savePreferences,
  getConversationHistory,
  addToNavigationHistory,
  clearMessages,
  resetSession,
  getSessionInfo,
} from '@/lib/iris-session'
import { getDynamicGreeting } from '@/lib/proactive-suggestions'
import type { Message, SessionInfo } from '../types'

export function useIrisSession(mounted: boolean) {
  const pathname = usePathname()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>(getSessionInfo())
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    if (!mounted) return

    const prefs = getPreferences()
    setSoundEnabled(prefs.soundEnabled)
  }, [mounted])

  const updateSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled)
    savePreferences({ soundEnabled: enabled })
  }, [])

  const clearConversation = useCallback(() => {
    clearMessages()
    setSessionInfo(getSessionInfo())
  }, [])

  const startNewSession = useCallback(() => {
    resetSession()
    setSessionInfo(getSessionInfo())
  }, [])

  return {
    sessionInfo,
    setSessionInfo,
    soundEnabled,
    updateSoundEnabled,
    clearConversation,
    startNewSession,
  }
}

export function useInitialMessages(mounted: boolean, pathname: string) {
  const [messages, setMessages] = useState<Message[]>([])

  // Load conversation history only on initial mount
  useEffect(() => {
    if (!mounted) return

    if (messages.length === 0) {
      const history = getConversationHistory(10)
      if (history.length > 0) {
        setMessages(history)
      } else {
        setMessages([{
          role: 'assistant',
          content: getDynamicGreeting(),
          timestamp: Date.now(),
        }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // Track navigation separately
  useEffect(() => {
    if (!mounted) return

    if (pathname) {
      addToNavigationHistory(pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted])

  return { messages, setMessages }
}
