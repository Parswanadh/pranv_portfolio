'use client'

import { useState, useEffect } from 'react'

interface TerminalBootProps {
  onComplete: () => void
}

interface LogEntry {
  timestamp: string
  message: string
  status: 'info' | 'success' | 'warning' | 'error'
}

const bootLogs: Omit<LogEntry, 'timestamp'>[] = [
  { message: 'INITIALIZING PORTFOLIO SYSTEM...', status: 'info' },
  { message: '> Loading neural graph... OK', status: 'success' },
  { message: '> Mounting project manifests... 24 found', status: 'success' },
  { message: '> Spawning agent processes... 3 active', status: 'success' },
  { message: '> Compiling research corpus... OK', status: 'success' },
  { message: 'SYSTEM READY', status: 'success' },
  { message: '> Welcome, visitor.', status: 'info' },
  { message: '> Press Cmd+K to navigate, or scroll to explore.', status: 'info' },
]

export default function TerminalBoot({ onComplete }: TerminalBootProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [currentLogIndex, setCurrentLogIndex] = useState(0)

  const handleSkip = () => {
    onComplete()
    localStorage.setItem('hasSeenBoot', 'true')
    localStorage.setItem('skipTerminalBoot', 'true')
    // Dispatch event for audio welcome
    window.dispatchEvent(new CustomEvent('terminal-boot-complete'))
  }

  useEffect(() => {
    // Add keyboard listener for skip functionality
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'Escape', 'KeyS'].includes(e.code)) {
        e.preventDefault()
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentLogIndex >= bootLogs.length) {
      const completeTimer = setTimeout(() => {
        onComplete()
        localStorage.setItem('hasSeenBoot', 'true')
        // Dispatch event for audio welcome
        window.dispatchEvent(new CustomEvent('terminal-boot-complete'))
      }, 1500)
      return () => clearTimeout(completeTimer)
    }

    const logTimer = setTimeout(() => {
      const log = bootLogs[currentLogIndex]
      const now = new Date()
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19)

      setLogs(prev => [...prev, { ...log, timestamp }])
      setCurrentLogIndex(prev => prev + 1)
    }, 400 + Math.random() * 300)

    return () => clearTimeout(logTimer)
  }, [currentLogIndex, onComplete])

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'success': return 'text-log-success'
      case 'warning': return 'text-log-warning'
      case 'error': return 'text-log-error'
      default: return 'text-log-info'
    }
  }

  return (
    <div className="fixed inset-0 z-[50] bg-bg-primary flex items-center justify-center p-4">
      {/* PROMINENT SKIP BUTTON - Always visible */}
      <button
        onClick={handleSkip}
        className="fixed bottom-8 right-8 px-6 py-3 bg-accent-primary text-bg-primary font-mono text-sm rounded-lg shadow-lg hover:opacity-90 transition-opacity min-w-[100px] min-h-[44px] flex items-center justify-center gap-2 z-[100000]"
        aria-label="Skip boot animation"
      >
        Skip →
        <span className="text-xs opacity-70">(or press Space/Enter/S)</span>
      </button>

      <div className="w-full max-w-3xl font-mono text-sm">
        <div className="bg-bg-secondary border border-border-accent rounded-lg p-6 space-y-1">
          {logs.map((log, index) => (
            <div key={index} className={`flex gap-2 ${getStatusColor(log.status)}`}>
              <span className="text-text-tertiary">[{log.timestamp}]</span>
              <span>{log.message}</span>
            </div>
          ))}
          {currentLogIndex < bootLogs.length && (
            <div className="flex gap-2 text-accent-primary animate-pulse">
              <span className="text-text-tertiary">[{new Date().toISOString().replace('T', ' ').substring(0, 19)}]</span>
              <span>█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
