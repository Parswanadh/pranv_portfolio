import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(toolsData).map((slug) => ({
    slug,
  }))
}

const toolsData: Record<string, any> = {
  'cli-toolkit': {
    name: 'CLI Toolkit',
    description: 'Collection of command-line utilities for developer productivity.',
    type: 'CLI',
    language: 'Python',
    stars: 234,
    features: [
      'File operations automation',
      'Batch processing capabilities',
      'Cross-platform support',
      'Regex pattern matching'
    ],
    install: 'pip install cli-toolkit',
    github: 'https://github.com/parshu/cli-toolkit',
  },
  'vscode-extensions': {
    name: 'VS Code Extensions',
    description: 'Custom extensions for enhanced editing experience.',
    type: 'Extension',
    language: 'TypeScript',
    stars: 567,
    features: [
      'Syntax highlighting',
      'Code snippets',
      'Integrated terminal',
      'Git integration'
    ],
    install: 'code --install-extension my-extension',
    github: 'https://github.com/parshu/vscode-extension',
  },
  'code-generator': {
    name: 'Code Generator',
    description: 'AI-powered boilerplate and scaffolding tool.',
    type: 'Web',
    language: 'TypeScript',
    stars: 891,
    features: [
      'Template-based generation',
      'Customizable schemas',
      'Multi-framework support',
      'CLI and Web UI'
    ],
    install: 'npm install -g @parshu/code-gen',
    github: 'https://github.com/parshu/code-generator',
  },
  'config-manager': {
    name: 'Config Manager',
    description: 'Unified configuration management for development environments.',
    type: 'CLI',
    language: 'Rust',
    stars: 123,
    features: [
      'Environment variable management',
      'Config validation',
      'Secret encryption',
      'Team sharing'
    ],
    install: 'cargo install config-manager',
    github: 'https://github.com/parshu/config-manager',
  },
  'log-analyzer': {
    name: 'Log Analyzer',
    description: 'Intelligent log parsing and anomaly detection.',
    type: 'CLI',
    language: 'Go',
    stars: 456,
    features: [
      'Pattern matching',
      'Error aggregation',
      'Real-time monitoring',
      'Alert system'
    ],
    install: 'go install github.com/parshu/log-analyzer@latest',
    github: 'https://github.com/parshu/log-analyzer',
  },
  'api-client': {
    name: 'API Client Generator',
    description: 'Generate typed API clients from OpenAPI specs.',
    type: 'Tool',
    language: 'TypeScript',
    stars: 789,
    features: [
      'OpenAPI 3.0 support',
      'Type generation',
      'Request validation',
      'Response mocking'
    ],
    install: 'npm install -g @parshu/api-client-gen',
    github: 'https://github.com/parshu/api-client-gen',
  },
}

export default async function ToolPage({ params }: PageProps) {
  const slug = (await params).slug
  const tool = toolsData[slug]

  if (!tool) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/tools" className="inline-flex items-center gap-2 font-mono text-sm text-accent-primary hover:underline mb-8">
            ← /tools
          </Link>

          <div className="bg-bg-secondary border border-border-default rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-mono text-3xl font-bold text-text-primary mb-2">{tool.name}</h1>
                <p className="font-serif text-lg text-text-secondary">{tool.description}</p>
              </div>
              <span className="text-sm px-3 py-1 bg-bg-elevated rounded text-text-secondary font-mono">
                {tool.type}
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono text-sm text-text-tertiary mb-6">
              <span>{tool.language}</span>
              <span>•</span>
              <span className="flex items-center gap-1">★ {tool.stars}</span>
              <span>•</span>
              <a href={tool.github} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">
                GitHub
              </a>
            </div>

            <div className="mb-6">
              <h3 className="font-mono text-sm text-text-tertiary mb-3">INSTALL</h3>
              <code className="block bg-bg-primary border border-border-default rounded p-3 font-mono text-sm text-text-primary">
                {tool.install}
              </code>
            </div>

            <div>
              <h3 className="font-mono text-sm text-text-tertiary mb-3">FEATURES</h3>
              <ul className="space-y-2">
                {tool.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary font-serif">
                    <span className="text-accent-primary mt-1">▹</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
