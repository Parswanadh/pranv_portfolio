'use client'

import { X, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react'
import type { SpeakingState, SessionInfo } from './types'

interface IrisHeaderProps {
  speakingState: SpeakingState
  soundEnabled: boolean
  onToggleSound: () => void
  onClose: () => void
  onClearConversation: () => void
  sessionInfo: SessionInfo
  pathname?: string
}

export function IrisHeader({
  speakingState,
  soundEnabled,
  onToggleSound,
  onClose,
  onClearConversation,
  sessionInfo,
  pathname,
}: IrisHeaderProps) {
  const getSpeakingStateText = () => {
    switch (speakingState) {
      case 'idle': return 'Ready to help'
      case 'listening': return 'Listening...'
      case 'processing': return 'Thinking...'
      case 'reasoning': return 'Formulating response...'
      case 'speaking': return 'Speaking...'
      default: return 'Ready'
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-border-default">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <span className="text-white font-bold">I</span>
          </div>
          {speakingState !== 'idle' && (
            <div className="absolute -bottom-0.5 -right-0.5 flex items-end gap-0.5 h-3">
              {[1,2,3,4,5].map((i) => (
                <div
                  key={i}
                  className="w-0.5 bg-accent-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s`, height: `${6 + Math.random() * 6}px` }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-mono font-bold text-text-primary flex items-center gap-2 text-sm">
              Iris
              {speakingState === 'speaking' && (
                <Sparkles className="w-3 h-3 text-accent-primary animate-pulse" />
              )}
            </h3>
            <button
              onClick={onClearConversation}
              className="min-h-[32px] flex items-center gap-1 px-2 py-1 text-xs text-accent-primary hover:text-accent-secondary transition-colors flex-shrink-0 rounded hover:bg-bg-elevated touch-manipulation"
              title="Start new chat"
            >
              <RotateCcw className="w-3 h-3" />
              New Chat
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary mt-0.5">
            <span>{getSpeakingStateText()}</span>
            {sessionInfo.hasHistory && (
              <>
                <span className="text-border-default">•</span>
                <span className="truncate" title={`Session started: ${sessionInfo.durationText}`}>
                  {sessionInfo.durationText}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleSound}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-bg-elevated rounded transition-colors touch-manipulation"
          aria-label={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-bg-elevated rounded transition-colors touch-manipulation"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
