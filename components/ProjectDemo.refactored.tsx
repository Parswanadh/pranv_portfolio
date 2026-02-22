'use client'

import { useEffect, useState, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'
import { DemoSkeleton } from '@/components/skeletons/LoadingSkeleton'
import type { ProjectDemoProps, CodeSnippet } from './project-demo/types'
import { DEMO_CONTENT } from './project-demo/demo-content'
import { WhisperSTTDemo, CLITourDemo, AutoGitDemo, MultimodalDemo } from './project-demo/demos'

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SyntaxHighlightedCode({ snippet }: { snippet: CodeSnippet }) {
  const getHighlightColor = (line: string): string => {
    if (line.startsWith('import') || line.startsWith('from')) return 'text-log-info'
    if (line.includes('class ')) return 'text-accent-secondary'
    if (line.includes('def ') || line.includes('async') || line.includes('return')) return 'text-log-success'
    if (line.trim().startsWith('#')) return 'text-text-tertiary italic'
    if (line.includes('=')) return 'text-log-warning'
    return 'text-text-primary'
  }

  return (
    <div className="relative">
      {snippet.title && (
        <div className="absolute -top-6 left-0 text-xs text-text-secondary font-mono">
          {snippet.title}
        </div>
      )}
      <pre className="text-xs font-mono overflow-x-auto p-4 bg-bg-secondary rounded border border-border-default">
        {snippet.code.split('\n').map((line, i) => (
          <div key={i} className={getHighlightColor(line)}>
            <span className="text-text-tertiary select-none mr-4">{String(i + 1).padStart(2, '0')}</span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProjectDemo({
  projectId,
  demoType = 'interactive',
  title,
  height = '400px',
  showControls = true,
  autoPlay = false
}: ProjectDemoProps) {
  const content = DEMO_CONTENT[projectId]
  const Icon = content.icon
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsPlaying(autoPlay)
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [projectId, autoPlay])

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const renderDemo = () => {
    switch (projectId) {
      case 'whisper-stt':
      case 'parshu-stt':
        return <WhisperSTTDemo isPlaying={isPlaying} onToggle={togglePlay} />

      case 'cli-tour':
      case 'pro-code':
        return <CLITourDemo />

      case 'multimodal-adapter':
      case 'gpt-oss-vision':
        return <MultimodalDemo />

      case 'auto-git-publisher':
        return <AutoGitDemo />

      default:
        return <div className="text-text-tertiary">Demo not available</div>
    }
  }

  const renderCodeDemo = () => {
    const snippet = content.codeSnippets[0]
    return (
      <div className="space-y-4">
        <SyntaxHighlightedCode snippet={snippet} />
        {showControls && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-h-[44px] w-full py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded transition-colors text-sm active:scale-95 touch-manipulation"
          >
            {isPlaying ? 'Hide Details' : 'View Implementation'}
          </button>
        )}
      </div>
    )
  }

  const renderVisualDemo = () => {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
        <div className="w-24 h-24 rounded-full bg-bg-elevated border-2 border-accent-primary flex items-center justify-center">
          <Icon className="w-12 h-12 text-accent-primary" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-text-primary">{title || content.title}</h3>
          <p className="text-sm text-text-secondary max-w-md">{content.description}</p>
        </div>

        <div className="flex gap-4">
          {content.codeSnippets.map((snippet, i) => (
            <div key={i} className="px-3 py-1 bg-bg-secondary rounded border border-border-default">
              <span className="text-xs text-text-tertiary font-mono">{snippet.language}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg border border-border-default bg-bg-secondary overflow-hidden"
      style={{ height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-accent-primary" />
          <div>
            <h3 className="text-sm font-medium text-text-primary">{title || content.title}</h3>
            <p className="text-xs text-text-tertiary capitalize">{demoType} Demo</p>
          </div>
        </div>

        {showControls && (projectId === 'whisper-stt' || projectId === 'parshu-stt') && demoType === 'interactive' && (
          <button
            onClick={togglePlay}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-bg-elevated rounded transition-colors touch-manipulation"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>

      {/* Demo Content */}
      <div className="p-4 h-[calc(100%-60px)] overflow-auto">
        {isLoading ? (
          <DemoSkeleton title={title || content.title} />
        ) : (
          <>
            {demoType === 'code' && renderCodeDemo()}
            {demoType === 'interactive' && renderDemo()}
            {demoType === 'visual' && renderVisualDemo()}
          </>
        )}
      </div>
    </div>
  )
}
