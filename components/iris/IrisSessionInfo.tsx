'use client'

import { getPageName } from '@/lib/proactive-suggestions'
import { getConversationSummary } from '@/lib/iris-session'

interface IrisSessionInfoProps {
  hasHistory: boolean
  topics: string[]
  pathname?: string
}

export function IrisSessionInfo({ hasHistory, topics, pathname }: IrisSessionInfoProps) {
  if (!hasHistory) return null

  return (
    <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">On:</span>
          <span className="font-mono text-accent-primary">{getPageName(pathname || '/')}</span>
        </div>
        {topics.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Discussing:</span>
            <span className="text-text-tertiary">{getConversationSummary()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
