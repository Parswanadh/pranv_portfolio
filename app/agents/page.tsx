'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgentDemo from '@/components/AgentDemo'
import { MagneticButton } from '@/components/MagneticButton'
import { BentoGrid, BentoItem } from '@/components/BentoGrid'
import { Cpu, Github, BookOpen, Network, Zap } from 'lucide-react'
import { GridSkeleton } from '@/components/skeletons/LoadingSkeleton'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagneticWrapper } from '@/components/MagneticWrapper'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

const agents = [
  {
    id: 'whisper-stt',
    name: 'WhisperSTT',
    description: 'AI speech-to-text assistant using Whisper V3 Turbo with hybrid local/GROQ processing.',
    version: '1.0.0',
    status: 'online' as const,
    demoType: 'live' as const,
    capabilities: ['Real-time transcription', 'Audio preprocessing', 'Format conversion'],
  },
  {
    id: 'cli-tour',
    name: 'CLI-Tour',
    description: 'Terminal AI assistant specialized in project management and development workflows.',
    version: '1.0.0',
    status: 'online' as const,
    demoType: 'live' as const,
    capabilities: ['Project navigation', 'Command generation', 'Git workflows'],
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    description: 'Multimodal Research AI Agent specializing in comprehensive data analysis and insights.',
    version: '1.0.0',
    status: 'online' as const,
    demoType: 'live' as const,
    capabilities: ['Multimodal analysis', 'Visualization', 'Pattern recognition'],
  },
]

export default function AgentsPage() {
  const [isLoading, setIsLoading] = useState(false)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <Cpu className="w-8 h-8 text-accent-primary self-center" />
              <h1 className="font-mono text-4xl font-bold text-text-primary">
                /agents
              </h1>
            </div>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              An army of autonomous agents working together to solve complex problems.
              Each agent is specialized, with clear responsibilities and handoff protocols.
            </p>
          </div>

          {/* Agent Demos - Bento Grid */}
          {isLoading ? (
            <div className="mb-16">
              <GridSkeleton count={3} cols={3} skeleton="agent" />
            </div>
          ) : (
            <BentoGrid
              items={[
                // Large hero card for first agent
                {
                  id: agents[0].id,
                  size: 'large',
                  content: (
                    <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default hover:border-accent-primary rounded-xl p-6 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                          <Cpu className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-log-success animate-pulse" />
                          <span className="text-xs font-mono text-log-success">{agents[0].status}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-text-primary font-mono mb-2">{agents[0].name}</h3>
                      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{agents[0].description}</p>
                      <div className="mb-4">
                        <p className="text-xs text-text-tertiary font-mono mb-2">Capabilities</p>
                        <div className="flex flex-wrap gap-2">
                          {agents[0].capabilities.map((cap, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <AgentDemo
                        name={agents[0].name}
                        description={agents[0].description}
                        version={agents[0].version}
                        status={agents[0].status}
                        demoType={agents[0].demoType}
                      />
                    </div>
                  ),
                },
                // Wide card for architecture info
                {
                  id: 'architecture-info',
                  size: 'wide',
                  content: (
                    <MagneticWrapper strength={0.06}>
                      <Link
                        href="/research"
                        className="group block h-full"
                      >
                        <div className="h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/30 hover:border-accent-primary rounded-xl p-6 transition-all duration-300 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Network className="w-6 h-6 text-accent-primary" />
                              <h3 className="text-lg font-bold text-text-primary font-mono">Agent Architecture</h3>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-4">
                              Event-driven coordination model with 6-tier agent system for complex problem solving.
                            </p>
                            <ul className="space-y-1.5 text-xs text-text-secondary">
                              <li className="flex items-start gap-2">
                                <span className="text-accent-primary">▹</span>
                                <span>Orchestration Tier: Task decomposition</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-accent-primary">▹</span>
                                <span>Development Tier: Frontend, backend, systems</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-accent-primary">▹</span>
                                <span>Quality Tier: Code review & testing</span>
                              </li>
                            </ul>
                          </div>
                          <div className="flex items-center gap-2 mt-4 text-accent-primary group-hover:gap-3 transition-all">
                            <span className="text-sm font-mono font-semibold">Read Research</span>
                            <BookOpen className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    </MagneticWrapper>
                  ),
                },
                // Small stats card
                {
                  id: 'agent-stats',
                  size: 'small',
                  content: (
                    <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-5 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-accent-primary" />
                        <span className="text-xs text-text-tertiary font-mono">Active Agents</span>
                      </div>
                      <p className="text-3xl font-bold text-text-primary font-mono">{agents.length}</p>
                      <p className="text-xs text-text-secondary mt-1">All systems operational</p>
                    </div>
                  ),
                },
                // Medium cards for remaining agents
                ...agents.slice(1).map((agent) => ({
                  id: agent.id,
                  size: 'medium' as const,
                  content: (
                    <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border border-border-default hover:border-accent-primary rounded-xl p-6 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-log-success animate-pulse" />
                          <span className="text-xs font-mono text-log-success">{agent.status}</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-text-primary font-mono mb-2">{agent.name}</h3>
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{agent.description}</p>
                      <div className="mb-3">
                        <p className="text-[10px] text-text-tertiary font-mono mb-1.5">Capabilities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.capabilities.map((cap, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary rounded text-text-secondary font-mono">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <AgentDemo
                        name={agent.name}
                        description={agent.description}
                        version={agent.version}
                        status={agent.status}
                        demoType={agent.demoType}
                      />
                    </div>
                  ),
                })),
              ]}
              className="mb-16"
            />
          )}

          {/* Agent Architecture */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-8 mb-12">
            <h2 className="font-mono text-2xl font-bold text-text-primary mb-6">
              Agent Architecture
            </h2>
            <div className="font-serif text-text-secondary space-y-4 leading-relaxed">
              <p>
                Based on research from Manus AI, Devin, and Claude Code best practices,
                this multi-agent system uses an event-driven coordination model:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Orchestration Tier:</strong> Task decomposition and delegation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Development Tier:</strong> Frontend, backend, systems, animation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Quality Tier:</strong> Code review, accessibility, performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Perspective Tier:</strong> Multi-viewpoint criticism and UX review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Reasoning Tier:</strong> Sequential thinking and debugging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary">▹</span>
                  <span><strong>Testing Tier:</strong> Unit tests and E2E with Playwright</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Links - Bento Grid */}
          <BentoGrid
            items={[
              {
                id: 'github-link',
                size: 'wide',
                content: (
                  <MagneticWrapper strength={0.06}>
                    <a
                      href="https://github.com/PranavAmara05"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full"
                    >
                      <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default hover:border-accent-primary rounded-xl p-6 transition-all duration-300 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center shrink-0">
                          <Github className="w-7 h-7 text-text-secondary group-hover:text-accent-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono text-base font-bold text-text-primary mb-1">Source Code</h3>
                          <p className="font-mono text-sm text-text-tertiary">View all projects on GitHub</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                          <span className="text-text-tertiary group-hover:text-accent-primary">→</span>
                        </div>
                      </div>
                    </a>
                  </MagneticWrapper>
                ),
              },
              {
                id: 'research-link',
                size: 'wide',
                content: (
                  <MagneticWrapper strength={0.06}>
                    <Link
                      href="/research"
                      className="group block h-full"
                    >
                      <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default hover:border-accent-primary rounded-xl p-6 transition-all duration-300 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-7 h-7 text-text-secondary group-hover:text-accent-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono text-base font-bold text-text-primary mb-1">Research Paper</h3>
                          <p className="font-mono text-sm text-text-tertiary">Deep dive into methodology</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                          <span className="text-text-tertiary group-hover:text-accent-primary">→</span>
                        </div>
                      </div>
                    </Link>
                  </MagneticWrapper>
                ),
              },
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
