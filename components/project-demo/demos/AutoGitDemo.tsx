'use client'

import { useState } from 'react'
import { Rocket, Pause } from 'lucide-react'

export function AutoGitDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<Array<{ agent: string; message: string; type: string }>>([])
  const [progress, setProgress] = useState(0)
  const [repoUrl, setRepoUrl] = useState<string | null>(null)

  const startDemo = async () => {
    setIsRunning(true)
    setLogs([])
    setProgress(0)
    setRepoUrl(null)

    const demoLogs = [
      { agent: 'Orchestrator', message: 'Initializing AUTO-GIT system...', type: 'info' },
      { agent: 'PaperScout', message: 'Searching arXiv for papers...', type: 'info' },
      { agent: 'PaperScout', message: 'Found: "Attention Is All You Need"', type: 'success' },
      { agent: 'Researcher', message: 'Extracting methodology...', type: 'info' },
      { agent: 'Planner', message: 'Planning architecture...', type: 'info' },
      { agent: 'Coder', message: 'Generating model code...', type: 'info' },
      { agent: 'Validator', message: 'Running tests...', type: 'info' },
      { agent: 'Validator', message: 'All tests passed!', type: 'success' },
      { agent: 'Orchestrator', message: 'Creating GitHub repository...', type: 'info' },
      { agent: 'Orchestrator', message: 'Repo created: github.com/balcha/attention-impl', type: 'success' },
    ]

    for (let i = 0; i < demoLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setLogs(prev => [...prev, demoLogs[i]])
      setProgress(((i + 1) / demoLogs.length) * 100)
    }

    setRepoUrl('https://github.com/balcha/attention-impl')
    setIsRunning(false)
  }

  return (
    <div className="space-y-4">
      {isRunning && (
        <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-accent-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="bg-black rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto border border-border-default">
        {logs.length === 0 && (
          <div className="text-text-tertiary">
            <span className="text-accent-primary">$</span> auto-git --start<br/>
            <span className="text-text-tertiary">Ready to process research papers...</span>
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="text-accent-primary">[{log.agent}]</span>{' '}
            <span className={
              log.type === 'success' ? 'text-log-success' :
              log.type === 'error' ? 'text-log-error' :
              'text-text-secondary'
            }>
              {log.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={startDemo}
            disabled={logs.length > 0 && !repoUrl}
            className="flex-1 py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Rocket size={16} />
            {logs.length > 0 && repoUrl ? 'Demo Complete' : 'Start Demo'}
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="flex-1 py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded transition-colors flex items-center justify-center gap-2"
          >
            <Pause size={16} />
            Running...
          </button>
        )}
      </div>

      {repoUrl && (
        <div className="p-4 bg-bg-secondary rounded border border-log-success">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-primary">
              <span className="text-log-success">Repository created successfully!</span>
            </div>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-accent-primary hover:underline"
            >
              View Repo &rarr;
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
