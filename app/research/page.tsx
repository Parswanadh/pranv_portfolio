import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BookOpen, FileText, Quote } from 'lucide-react'

const publications = [
  {
    slug: 'multi-agent-orchestration',
    title: 'Multi-Agent Orchestration for Autonomous Task Execution',
    authors: 'A. Pranav, [Co-authors TBD]',
    venue: 'NeurIPS Workshop on Agent Systems',
    year: '2024',
    status: 'In Preparation',
    abstract: `This paper presents a novel framework for coordinating multiple autonomous agents
    through event-driven orchestration. We demonstrate how specialized agents can collaborate
    on complex tasks while maintaining clear boundaries and handoff protocols.`,
    citations: 0,
  },
  {
    slug: 'quantum-graph-visualization',
    title: 'Quantum Graph Visualization: Interactive Knowledge Networks',
    authors: '[Authors TBD]',
    venue: 'IEEE VIS',
    year: '2024',
    status: 'Planned',
    abstract: `We introduce a WebGL-based graph visualization system for representing large-scale
    knowledge networks. Our approach enables interactive exploration of complex relationships
    through GPU-accelerated rendering and physics-based layouts.`,
    citations: 0,
  },
  {
    slug: 'terminal-computing-paradigm',
    title: 'The Terminal Computing Paradigm: Text-First Interfaces for AI Systems',
    authors: 'A. Pranav, [Collaborators TBD]',
    venue: 'ACM CHI',
    year: '2023',
    status: 'Planned',
    abstract: `This paper explores the resurgence of terminal-based interfaces in the context of
    AI-powered development tools. We argue that text-first interfaces offer unique advantages
    for human-AI collaboration.`,
    citations: 0,
  },
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-accent-primary" />
              <h1 className="font-mono text-4xl font-bold text-text-primary">
                /research
              </h1>
            </div>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              Research publications at the intersection of AI systems, human-computer interaction,
              and visualization. Building tools that augment human intelligence.
            </p>
          </div>

          {/* Publications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {publications.map((pub) => (
              <Link
                key={pub.slug}
                href={`/research/${pub.slug}`}
                className="group bg-bg-secondary border border-border-default rounded-lg p-6 hover:border-accent-primary transition-colors duration-250"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="font-mono text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                      {pub.title}
                    </h2>
                    <p className="text-sm text-text-secondary mb-1">{pub.authors}</p>
                    <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
                      <span>{pub.venue}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    pub.status === 'Published' ? 'bg-log-success/20 text-log-success' : 'bg-log-warning/20 text-log-warning'
                  }`}>
                    {pub.status}
                  </span>
                </div>

                <p className="font-serif text-sm text-text-secondary line-clamp-3 mb-4">
                  {pub.abstract}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-text-tertiary">
                  <div className="flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    <span>{pub.citations} citations</span>
                  </div>
                  <span className="text-accent-primary group-hover:underline">Read more →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Research Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <FileText className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-text-primary">3</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Publications</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <Quote className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-text-primary">0</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Total Citations</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-accent-primary">h-index 0</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Impact</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <p className="font-mono text-3xl font-bold text-text-primary">0</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Top Venues</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
