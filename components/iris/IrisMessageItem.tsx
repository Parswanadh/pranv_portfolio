'use client'

import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Message } from './types'

interface IrisMessageItemProps {
  msg: Message
  onSuggestionClick?: (suggestion: Message['suggestion']) => void
}

export const IrisMessageItem = memo(({ msg, onSuggestionClick }: IrisMessageItemProps) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className="flex flex-col max-w-[85%]">
      <div
        className={`p-3 rounded-lg ${
          msg.role === 'user'
            ? 'bg-accent-primary text-bg-primary'
            : 'bg-bg-elevated text-text-primary'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
      {msg.suggestion && msg.role === 'assistant' && onSuggestionClick && (
        <button
          onClick={() => onSuggestionClick(msg.suggestion)}
          className="mt-2 ml-3 px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs rounded hover:bg-accent-primary/20 transition-colors flex items-center gap-2 self-start"
        >
          {msg.suggestion.text}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
))

IrisMessageItem.displayName = 'IrisMessageItem'
