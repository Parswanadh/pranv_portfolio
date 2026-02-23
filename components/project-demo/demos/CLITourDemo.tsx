'use client'

import { useState, useEffect, useRef } from 'react'

export function CLITourDemo() {
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output', content: string }>>([
    { type: 'output', content: 'Welcome to CLI-Tour! Type "help" for available commands.' }
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const commands: Record<string, string> = {
    help: 'Available commands: help, tour, list, status, clear',
    tour: 'Starting interactive tour... Press any key to continue.',
    list: 'Projects: krishi-setu, ipo-insights, assistive-navigation, distraction-monitoring, llm-aws-deployment',
    status: 'System: Online | Memory: 42% | CPU: 12%',
    clear: '__CLEAR__'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setHistory(prev => [...prev, { type: 'input', content: input }])

    const cmd = input.toLowerCase().trim()
    const response = commands[cmd] || `Command not found: ${cmd}. Type "help" for assistance.`

    setTimeout(() => {
      if (response === '__CLEAR__') {
        setHistory([{ type: 'output', content: 'Terminal cleared.' }])
      } else {
        setHistory(prev => [...prev, { type: 'output', content: response }])
      }
    }, 300)

    setInput('')
  }

  return (
    <div className="bg-black rounded-lg border border-border-default overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border-b border-border-default">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs text-text-tertiary font-mono">bash</span>
      </div>

      <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
        {history.map((line, i) => (
          <div key={i} className="mb-2">
            {line.type === 'input' ? (
              <div className="text-accent-primary">
                <span className="text-log-success">user@portfolio</span>
                <span className="text-text-tertiary">:</span>
                <span className="text-log-info">~</span>
                <span className="text-text-tertiary">$ </span>
                {line.content}
              </div>
            ) : (
              <div className="text-text-secondary">{line.content}</div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-log-success font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-text-primary font-mono text-sm outline-none"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  )
}
