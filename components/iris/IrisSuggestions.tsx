'use client'

import { ArrowRight } from 'lucide-react'
import { EXAMPLE_QUESTIONS, QUICK_ACTIONS } from './constants'
import type { Suggestion } from './types'
import { FolderOpen, FileText, Mail, Sparkles as SparklesIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface IrisSuggestionsProps {
  suggestions: Suggestion[]
  isLoading: boolean
  messagesLength: number
  onSuggestionClick: (suggestion: Suggestion | any) => void
  setInput: (input: string) => void
}

const ICON_MAP = {
  FolderOpen,
  FileText,
  Mail,
}

interface IrisOnboardingProps {
  setInput: (input: string) => void
}

export function IrisOnboarding({ setInput }: IrisOnboardingProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="bg-bg-elevated rounded-lg p-4 border border-border-default">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon className="w-4 h-4 text-accent-primary" />
          <h4 className="text-sm font-semibold text-text-primary">What can I do?</h4>
        </div>
        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            <span>Explore projects like <span className="text-accent-primary font-mono">PRO_CODE</span> and <span className="text-accent-primary font-mono">AUTO-GIT</span></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            <span>Answer questions about skills and experience</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            <span>Guide you to different sections of the portfolio</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-primary mt-0.5">•</span>
            <span>Tell you about research and leadership work</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-elevated rounded-lg p-4 border border-border-default">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = ICON_MAP[action.icon as keyof typeof ICON_MAP]
            return (
              <button
                key={action.path}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-1.5 p-3 bg-bg-tertiary rounded-lg hover:bg-bg-primary hover:border-accent-primary border border-transparent transition-all group"
              >
                <Icon className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" />
                <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors text-center">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs text-text-tertiary font-mono mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion.prompt || suggestion.text)}
              className="px-3 py-1.5 bg-bg-elevated text-text-secondary text-xs font-mono rounded-full hover:bg-bg-tertiary hover:text-accent-primary transition-colors border border-border-default hover:border-accent-primary/50"
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function IrisSuggestions({ suggestions, isLoading, messagesLength, onSuggestionClick, setInput }: IrisSuggestionsProps) {
  if (messagesLength === 1 && !isLoading) {
    return <IrisOnboarding setInput={setInput} />
  }

  if (suggestions.length > 0 && !isLoading && messagesLength > 1) {
    return (
      <div className="px-4 py-2 border-t border-border-default">
        <p className="text-xs text-text-tertiary font-mono mb-2">Suggested:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(suggestion)}
              className="text-xs px-2 py-1 bg-bg-tertiary text-text-secondary rounded hover:bg-bg-elevated transition-colors flex items-center gap-1"
            >
              {(suggestion.prompt || suggestion.text).length > 25
                ? (suggestion.prompt || suggestion.text).substring(0, 25) + '...'
                : (suggestion.prompt || suggestion.text)}
              <ArrowRight className="w-3 h-3 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}
