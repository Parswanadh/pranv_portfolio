'use client'

import { BentoItem } from './BentoGrid'
import { Cpu, Zap } from 'lucide-react'
import { MagneticWrapper } from './MagneticWrapper'
import AgentDemo from './AgentDemo'

export interface Agent {
  id: string
  name: string
  description: string
  version: string
  status: 'online' | 'offline' | 'maintenance'
  demoType: 'live' | 'recorded' | 'simulated'
  capabilities: string[]
}

interface BentoAgentCardProps {
  agent: Agent
  size?: 'large' | 'medium' | 'small'
}

/**
 * BentoAgentCard - Creates bento-styled cards for agent displays
 *
 * @example
 * ```tsx
 * import { BentoAgentCard } from '@/components/BentoAgentCard'
 *
 * <BentoGrid
 *   items={[
 *     BentoAgentCard({ agent: agents[0], size: 'large' }),
 *     BentoAgentCard({ agent: agents[1], size: 'medium' }),
 *   ]}
 * />
 * ```
 */
export function BentoAgentCard({ agent, size = 'medium' }: BentoAgentCardProps): BentoItem {
  const statusColor = {
    online: 'bg-log-success',
    offline: 'bg-log-error',
    maintenance: 'bg-log-warning',
  }[agent.status]

  const statusText = {
    online: 'text-log-success',
    offline: 'text-log-error',
    maintenance: 'text-log-warning',
  }[agent.status]

  if (size === 'large') {
    return {
      id: agent.id,
      size: 'large',
      content: (
        <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default hover:border-accent-primary rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
              <span className={`text-xs font-mono ${statusText}`}>{agent.status}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary font-mono mb-2">{agent.name}</h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">{agent.description}</p>

            {/* Capabilities */}
            <div className="mb-4">
              <p className="text-xs text-text-tertiary font-mono mb-2">Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-bg-tertiary rounded text-text-secondary font-mono">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Demo */}
          <div className="mt-auto">
            <AgentDemo
              name={agent.name}
              description={agent.description}
              version={agent.version}
              status={agent.status}
              demoType={agent.demoType}
            />
          </div>
        </div>
      ),
    }
  }

  if (size === 'small') {
    return {
      id: agent.id,
      size: 'small',
      content: (
        <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border border-border-default hover:border-accent-primary rounded-xl p-3 md:p-5 transition-all duration-300 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${statusColor} animate-pulse`} />
              <span className={`text-[10px] font-mono ${statusText}`}>{agent.status}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text-primary font-mono mb-1">{agent.name}</h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-auto">{agent.description}</p>

          <div className="mt-3 pt-3 border-t border-border-default">
            <p className="text-[10px] text-text-tertiary font-mono">v{agent.version}</p>
          </div>
        </div>
      ),
    }
  }

  // Medium size (default)
  return {
    id: agent.id,
    size: 'medium',
    content: (
      <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border border-border-default hover:border-accent-primary rounded-xl p-4 md:p-6 transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
            <span className={`text-xs font-mono ${statusText}`}>{agent.status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-text-primary font-mono mb-2">{agent.name}</h3>
          <p className="text-xs text-text-secondary mb-3 line-clamp-2">{agent.description}</p>

          {/* Capabilities */}
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
        </div>

        {/* Demo */}
        <div className="mt-auto">
          <AgentDemo
            name={agent.name}
            description={agent.description}
            version={agent.version}
            status={agent.status}
            demoType={agent.demoType}
          />
        </div>
      </div>
    ),
  }
}
