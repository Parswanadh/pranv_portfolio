'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, Terminal, GitBranch, FileCode, CheckCircle, AlertCircle } from 'lucide-react'

interface AgentLog {
  agent: string
  message: string
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
}

interface DemoStep {
  name: string
  duration: number
  agent: string
  logs: string[]
}

export function AutoGitLiveDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [generatedCode, setGeneratedCode] = useState<string[]>([])
  const [repoCreated, setRepoCreated] = useState(false)

  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const steps: DemoStep[] = [
    {
      name: 'Initializing',
      duration: 1000,
      agent: 'Orchestrator',
      logs: [
        'Initializing AUTO-GIT multi-agent system...',
        'Loading agent configurations...',
        'Establishing inter-agent communication channels...',
        'Agent pipeline ready.'
      ]
    },
    {
      name: 'Discovering Papers',
      duration: 3000,
      agent: 'PaperScout',
      logs: [
        'Searching arXiv for latest research papers...',
        'Found 127 relevant papers in "Multi-Agent Systems" category',
        'Analyzing novelty scores...',
        'Selected paper: "Attention Is All You Need" (2301.07041)',
        'Novelty score: 94/100 - Proceeding with implementation'
      ]
    },
    {
      name: 'Extracting Methodology',
      duration: 4000,
      agent: 'Researcher',
      logs: [
        'Downloading PDF from arXiv...',
        'Extracting text content from PDF...',
        'Identifying key methodology sections...',
        'Found 3 core algorithms: Self-Attention, Multi-Head Attention, Position Encoding',
        'Extracting mathematical formulations...',
        'Methodology extraction complete.'
      ]
    },
    {
      name: 'Planning Architecture',
      duration: 3000,
      agent: 'Planner',
      logs: [
        'Analyzing research methodology...',
        'Designing software architecture...',
        'Tech stack selected: PyTorch, Transformers, FastAPI',
        'Creating project structure plan...',
        'Identifying dependencies: torch, transformers, numpy, fastapi',
        'Architecture plan generated successfully.'
      ]
    },
    {
      name: 'Generating Code',
      duration: 5000,
      agent: 'Coder',
      logs: [
        'Creating project directory structure...',
        'Generating main model implementation...',
        'Writing multi-head attention module...',
        'Implementing feed-forward networks...',
        'Creating training script...',
        'Writing inference pipeline...',
        'Generating API endpoints...',
        'Creating configuration files...',
        'Writing README documentation...',
        'Code generation complete. 15 files created.'
      ]
    },
    {
      name: 'Validating & Testing',
      duration: 2000,
      agent: 'Validator',
      logs: [
        'Running syntax checks...',
        'Validating import statements...',
        'Running unit tests...',
        'Test coverage: 87%',
        'All tests passed successfully.'
      ]
    },
    {
      name: 'Creating Repository',
      duration: 1500,
      agent: 'Orchestrator',
      logs: [
        'Connecting to GitHub API...',
        'Creating repository: PranavAmara05/transformer-impl-230107041',
        'Initializing git repository...',
        'Committing generated code...',
        'Pushing to remote repository...',
        'Repository created successfully!'
      ]
    }
  ]

  const addLog = (agent: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setLogs(prev => [...prev, {
      agent,
      message,
      timestamp: new Date(),
      type,
    }])
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const startDemo = async () => {
    setIsRunning(true)
    setLogs([])
    setCurrentStep(0)
    setProgress(0)
    setGeneratedCode([])
    setRepoCreated(false)

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      setCurrentStep(i)

      // Add logs progressively for this step
      for (let j = 0; j < step.logs.length; j++) {
        const logType = j === step.logs.length - 1 ? 'success' : 'info'
        addLog(step.agent, step.logs[j], logType)
        await sleep(step.duration / step.logs.length)
      }

      // Update progress
      const stepProgress = ((i + 1) / steps.length) * 100
      setProgress(stepProgress)

      // Simulate code generation during Coder step
      if (step.agent === 'Coder') {
        const codeSnippets = [
          'class MultiHeadAttention(nn.Module):',
          '    def __init__(self, d_model=512, num_heads=8):',
          '        super().__init__()',
          '        self.d_model = d_model',
          '        self.num_heads = num_heads',
          '        self.d_k = d_model // num_heads',
          '        self.W_q = nn.Linear(d_model, d_model)',
          '        self.W_k = nn.Linear(d_model, d_model)',
          '        self.W_v = nn.Linear(d_model, d_model)',
          '        self.W_o = nn.Linear(d_model, d_model)',
          '',
          '    def forward(self, query, key, value):',
          '        batch_size = query.size(0)',
          '        # Linear projections in batch',
          '        Q = self.W_q(query)',
          '        K = self.W_k(key)',
          '        V = self.W_v(value)',
          '        # ... attention computation'
        ]
        for (const snippet of codeSnippets) {
          setGeneratedCode(prev => [...prev, snippet])
          await sleep(200)
        }
      }

      // Mark repository as created on final step
      if (i === steps.length - 1) {
        setRepoCreated(true)
      }

      await sleep(500)
    }

    setIsRunning(false)
  }

  const resetDemo = () => {
    setIsRunning(false)
    setLogs([])
    setCurrentStep(0)
    setProgress(0)
    setGeneratedCode([])
    setRepoCreated(false)
  }

  return (
    <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-mono text-lg font-bold text-text-primary flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent-primary" />
            AUTO-GIT Live Demo
          </h3>
          <p className="text-sm text-text-tertiary mt-1">
            Multi-agent research-to-code pipeline in action
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          {isRunning ? (
            <>
              <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-accent-primary">Running</span>
            </>
          ) : repoCreated ? (
            <>
              <CheckCircle className="w-4 h-4 text-log-success" />
              <span className="text-log-success">Complete</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-text-tertiary" />
              <span className="text-text-tertiary">Idle</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary mb-2">
            <span>{steps[currentStep]?.name}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-accent-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Terminal Output */}
        <div className="bg-black rounded-lg p-4 font-mono text-xs h-80 overflow-y-auto border border-border-tertiary">
          {logs.length === 0 && (
            <div className="text-text-tertiary">
              <span className="text-accent-primary">$</span> auto-git --demo<br />
              <span className="text-text-tertiary">Waiting to start...</span><br />
              <span className="text-text-tertiary">Click "Start Demo" to see AUTO-GIT in action</span>
            </div>
          )}
          {logs.map((log, index) => {
            const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
              hour12: false,
              minute: '2-digit',
              second: '2-digit',
              hour: 'numeric',
            })
            const colorClass = {
              info: 'text-text-secondary',
              success: 'text-log-success',
              warning: 'text-log-warning',
              error: 'text-log-error',
            }[log.type]

            const agentColor = {
              'Orchestrator': 'text-accent-primary',
              'PaperScout': 'text-log-info',
              'Researcher': 'text-log-warning',
              'Planner': 'text-accent-secondary',
              'Coder': 'text-log-success',
              'Validator': 'text-purple-400',
            }[log.agent] || 'text-text-secondary'

            return (
              <div key={index} className="mb-1">
                <span className="text-text-tertiary">[{time}]</span>{' '}
                <span className={`font-bold ${agentColor}`}>[{log.agent}]</span>{' '}
                <span className={colorClass}>{log.message}</span>
              </div>
            )
          })}
          <div ref={terminalRef} />
        </div>

        {/* Code Preview */}
        <div className="bg-bg-tertiary rounded-lg p-4 font-mono text-xs h-80 overflow-y-auto border border-border-tertiary">
          {generatedCode.length === 0 ? (
            <div className="text-text-tertiary flex flex-col items-center justify-center h-full">
              <FileCode className="w-12 h-12 mb-2 opacity-50" />
              <span>Generated code will appear here</span>
            </div>
          ) : (
            <pre className="text-text-secondary">
              {generatedCode.map((line, i) => (
                <div key={i}>
                  <span className="text-text-tertiary select-none mr-4">{String(i + 1).padStart(2, '0')}</span>
                  {line}
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        {!isRunning ? (
          <button
            onClick={startDemo}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" />
            Start Demo
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:bg-bg-tertiary transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary text-text-primary font-mono text-sm rounded hover:bg-bg-elevated transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Reset
            </button>
          </>
        )}
      </div>

      {/* Repository Link */}
      {repoCreated && (
        <div className="bg-bg-tertiary border border-log-success rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-log-success" />
              <div>
                <div className="text-sm font-mono text-text-primary">Repository Created Successfully!</div>
                <div className="text-xs text-text-tertiary font-mono">PranavAmara05/transformer-impl-230107041</div>
              </div>
            </div>
            <a
              href="https://github.com/PranavAmara05/transformer-impl-230107041"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
            >
              <GitBranch className="w-4 h-4" />
              View Repository
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border-default">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent-primary">50+</div>
            <div className="text-xs font-mono text-text-tertiary">Papers Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent-primary">23</div>
            <div className="text-xs font-mono text-text-tertiary">Repos Created</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent-primary">87%</div>
            <div className="text-xs font-mono text-text-tertiary">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="mt-4 pt-4 border-t border-border-default">
        <div className="text-xs font-mono text-text-tertiary mb-3">ACTIVE AGENTS</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {['Orchestrator', 'PaperScout', 'Researcher', 'Planner', 'Coder', 'Validator'].map((agent) => {
            const isActive = steps[currentStep]?.agent === agent && isRunning
            const hasCompleted = currentStep > steps.findIndex(s => s.agent === agent)
            return (
              <div
                key={agent}
                className={`px-2 py-2 rounded border text-center font-mono text-xs ${
                  isActive
                    ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                    : hasCompleted
                    ? 'bg-log-success/10 border-log-success text-log-success'
                    : 'bg-bg-tertiary border-border-tertiary text-text-tertiary'
                }`}
              >
                {agent}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
