import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Wrench, FileText, Download } from 'lucide-react'

const tools = [
  {
    slug: 'cli-toolkit',
    title: 'CLI Toolkit',
    description: 'Collection of command-line utilities for developer productivity.',
    type: 'CLI',
    language: 'Python',
    stars: 234,
  },
  {
    slug: 'vscode-extensions',
    title: 'VS Code Extensions',
    description: 'Custom extensions for enhanced editing experience.',
    type: 'Extension',
    language: 'TypeScript',
    stars: 567,
  },
  {
    slug: 'code-generator',
    title: 'Code Generator',
    description: 'AI-powered boilerplate and scaffolding tool.',
    type: 'Web',
    language: 'TypeScript',
    stars: 891,
  },
  {
    slug: 'config-manager',
    title: 'Config Manager',
    description: 'Unified configuration management for development environments.',
    type: 'CLI',
    language: 'Rust',
    stars: 123,
  },
  {
    slug: 'log-analyzer',
    title: 'Log Analyzer',
    description: 'Intelligent log parsing and anomaly detection.',
    type: 'CLI',
    language: 'Go',
    stars: 456,
  },
  {
    slug: 'api-client',
    title: 'API Client Generator',
    description: 'Generate typed API clients from OpenAPI specs.',
    type: 'Tool',
    language: 'TypeScript',
    stars: 789,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-accent-primary" />
              <h1 className="font-mono text-4xl font-bold text-text-primary">
                /tools
              </h1>
            </div>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              Open-source tools and scripts built for learning and productivity. Python automation utilities,
              embedded systems helpers, and developer productivity extensions.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-bg-secondary border border-border-default rounded-lg p-6 hover:border-accent-primary transition-colors duration-250"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="font-mono text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                      {tool.title}
                    </h2>
                    <p className="text-sm text-text-secondary mb-3">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-text-tertiary">
                  <div className="flex gap-3">
                    <span className="px-2 py-1 bg-bg-tertiary rounded">{tool.type}</span>
                    <span className="px-2 py-1 bg-bg-tertiary rounded">{tool.language}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{tool.stars}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-accent-primary">6</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Tools Built</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-accent-primary">500+</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Downloads</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-accent-primary">5</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Languages</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-accent-primary">100%</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Open Source</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
