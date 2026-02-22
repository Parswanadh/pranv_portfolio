import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getContextualSuggestions, getTopicBasedSuggestions } from '@/lib/proactive-suggestions'
import { EXAMPLE_QUESTIONS } from '../constants'
import type { Suggestion } from '../types'

export function useIrisSuggestions(
  messagesLength: number,
  topicsLength: number,
  sessionInfo: { topics: string[] }
) {
  const pathname = usePathname()
  const [suggestions, setSuggestions] = useState<Suggestion[]>(EXAMPLE_QUESTIONS)

  useEffect(() => {
    if (messagesLength <= 1) {
      setSuggestions(EXAMPLE_QUESTIONS)
    } else {
      setSuggestions(getContextualSuggestions(pathname || '/'))
    }
  }, [pathname, messagesLength])

  useEffect(() => {
    if (messagesLength > 2 && topicsLength > 0) {
      const topicSuggestions = getTopicBasedSuggestions(sessionInfo.topics)
      setSuggestions(topicSuggestions)
    }
  }, [messagesLength, topicsLength, sessionInfo.topics])

  return suggestions
}
