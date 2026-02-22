'use client'

import { useState } from 'react'
import { Play, RotateCw, Copy, Check } from 'lucide-react'
import { InlineLoader } from '@/components/skeletons/LoadingSkeleton'

interface AgentDemoProps {
  name: string
  description: string
  version: string
  status: 'online' | 'offline' | 'maintenance'
  initialPrompt?: string
  demoType?: 'live' | 'recorded' | 'simulated'
}

const SAMPLE_PROMPTS = {
  'Research Agent': 'Analyze the latest trends in multimodal AI',
  'Code Agent': 'Generate a React component for a card layout',
  'Data Agent': 'Summarize the key findings from this dataset',
  'WhisperSTT': 'How do I integrate Whisper with my audio recording pipeline?',
  'CLI-Tour': 'Help me understand the project structure and recommend next steps',
}

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  'WhisperSTT': `You are WhisperSTT, a specialized AI assistant for a speech-to-text tool using Whisper V3 Turbo.

Key features:
- Hybrid architecture supporting both local processing and GROQ-powered cloud modes
- Real-time audio transcription with streaming capabilities
- Optimized for speed and accuracy with V3 Turbo model
- Handles multiple audio formats and languages
- Includes noise reduction and diarization support

When users ask questions:
- Focus on practical integration guidance
- Explain the hybrid local/GROQ processing modes
- Provide code examples for audio pipeline integration
- Discuss performance optimization strategies
- Help with format conversion and preprocessing`,

  'CLI-Tour': `You are CLI-Tour, a terminal AI assistant specialized in project management and development workflows.

Your capabilities:
- Navigate and explain complex project structures
- Recommend best practices for code organization
- Assist with dependency management and build processes
- Provide shell commands and automation scripts
- Help with Git workflows and version control
- Guide testing strategies and debugging approaches

When helping users:
- Provide clear, copy-pasteable terminal commands
- Explain the "why" behind recommendations
- Suggest optimizations for development workflow
- Help identify potential issues before they occur`,

  'Data Agent': `You are a Multimodal Research AI Agent specializing in comprehensive data analysis.

Your expertise includes:
- Processing and analyzing diverse data formats (text, images, audio, video)
- Extracting insights from multimodal datasets
- Generating visualizations and summary reports
- Identifying patterns and correlations across data types
- Providing research methodology recommendations
- Synthesizing findings from multiple sources

When analyzing data:
- Provide structured, actionable insights
- Highlight key trends and anomalies
- Suggest further research directions
- Consider limitations and confidence levels
- Present findings in clear, accessible language`,
}

export default function AgentDemo({
  name,
  description,
  version,
  status,
  initialPrompt = '',
  demoType = 'simulated',
}: AgentDemoProps) {
  const [input, setInput] = useState(initialPrompt)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const samplePrompts = SAMPLE_PROMPTS[name as keyof typeof SAMPLE_PROMPTS] || `Try the ${name}`

  const handleRun = async () => {
    if (!input.trim()) return

    setIsRunning(true)
    setOutput('')
    setError(null)

    try {
      // Get the system prompt for this agent type
      const systemPrompt = AGENT_SYSTEM_PROMPTS[name] || `You are ${name}, an AI assistant. Version: ${version}. ${description}`

      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      // Read the streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response is not readable')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let isDone = false

      // Collect complete message from stream
      while (!isDone) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Process all complete lines except the last one (may be incomplete)
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              isDone = true
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                // Stream the content character by character for visual effect
                await simulateStream(parsed.content)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }

        // Keep the last potentially incomplete line in buffer
        buffer = lines[lines.length - 1]
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
      setOutput(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
    }

    setIsRunning(false)
  }

  const simulateStream = async (text: string) => {
    const chunks = text.split('')
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 10))
      setOutput(prev => prev + chunk)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-log-success'
      case 'offline': return 'bg-log-error'
      case 'maintenance': return 'text-log-warning'
    }
  }

  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'online' ? 'animate-pulse' : ''}`} />
          <div>
            <h3 className="font-mono text-sm font-bold">{name}</h3>
            <p className="font-mono text-xs text-text-tertiary">v{version}</p>
          </div>
        </div>
        <span className="font-mono text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary">
          {demoType}
        </span>
      </div>

      {/* Description */}
      <div className="px-4 py-2 bg-bg-tertiary">
        <p className="font-mono text-xs text-text-secondary">{description}</p>
      </div>

      {/* Demo Interface */}
      <div className="p-4 space-y-4">
        {/* Input */}
        <div>
          <label htmlFor={`prompt-${name}`} className="block font-mono text-xs text-text-tertiary mb-2">
            &gt; PROMPT
          </label>
          <textarea
            id={`prompt-${name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full h-24 bg-bg-primary border border-border-default rounded p-3 font-mono text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:border-accent-primary"
            disabled={isRunning}
          />
        </div>

        {/* Actions */}
        <div className="flex items-stretch gap-2">
          <button
            onClick={handleRun}
            disabled={!input.trim() || isRunning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Play className="w-4 h-4 shrink-0" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <RotateCw className="w-4 h-4 shrink-0" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setInput(samplePrompts)}
            disabled={isRunning}
            className="flex items-center px-4 py-3 bg-bg-tertiary text-text-secondary font-mono text-sm rounded hover:bg-bg-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-left"
          >
            <span className="text-text-tertiary shrink-0">Try:</span>
            <span className="truncate">&quot;{samplePrompts}&quot;</span>
          </button>
        </div>

        {/* Output */}
        {isRunning && !output && (
          <div className="bg-bg-primary border border-border-default rounded p-4">
            <InlineLoader text="Agent is processing..." />
          </div>
        )}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-xs text-text-tertiary">
                &gt; OUTPUT
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors min-h-[44px] min-w-[44px]"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className={`bg-bg-primary border rounded p-3 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto ${error ? 'border-log-error text-log-error' : 'border-border-default text-text-primary'}`}>
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
