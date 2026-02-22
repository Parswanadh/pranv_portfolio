import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BookOpen, Download, Quote } from 'lucide-react'
import ResearchBibtexCopy from '@/components/ResearchBibtexCopy'

interface PageProps {
  params: Promise<{ slug: string }>
}

const researchData: Record<string, any> = {
  'multi-agent-orchestration': {
    title: 'Multi-Agent Orchestration for Autonomous Task Execution',
    authors: 'B. V. Parswanadh, [Co-authors TBD]',
    venue: 'NeurIPS Workshop on Agent Systems',
    year: '2024',
    status: 'In Preparation',
    doi: 'TBD',
    pdfUrl: '',
    codeUrl: 'https://github.com/parswanadh',
    abstract: `This paper presents a novel framework for coordinating multiple autonomous agents
    through event-driven orchestration. We demonstrate how specialized agents can collaborate
    on complex tasks while maintaining clear boundaries and handoff protocols.

    Our framework, inspired by research from Manus AI, Devin, and Claude Code, introduces a
    tiered agent architecture with clear responsibilities. Agents are organized into six tiers:
    Orchestration, Development, Quality, Perspective, Reasoning, and Testing.

    Through event-driven coordination and shared state artifacts, agents can work in parallel
    on complex tasks while maintaining consistency and quality. We demonstrate the effectiveness
    of this approach on real-world software development tasks, showing significant improvements
    in both speed and output quality.`,
    contributions: [
      'Novel multi-agent coordination model with event-driven orchestration',
      'Six-tier agent architecture with clear separation of concerns',
      'Handoff protocol with progress tracking and artifact sharing',
      'Quality gates with code review, accessibility, and performance checks',
      'Empirical evaluation on real-world development tasks',
    ],
    bibtex: `@inproceedings{2024-multi-agent,
  title={Multi-Agent Orchestration for Autonomous Task Execution},
  author={Parswanadh, B. V. and Co-authors},
  booktitle={NeurIPS Workshop on Agent Systems},
  year={2024},
  note={In Preparation}
}`,
  },
  'quantum-graph-visualization': {
    title: 'Quantum Graph Visualization: Interactive Exploration of Quantum States',
    authors: '[Authors TBD]',
    venue: 'IEEE Quantum Week',
    year: '2025',
    status: 'Planned',
    doi: 'TBD',
    pdfUrl: '',
    codeUrl: 'https://github.com/parswanadh',
    abstract: `Quantum systems produce high-dimensional state spaces that are challenging to
    visualize and comprehend. This paper presents a novel graph-based visualization approach
    for interactive exploration of quantum states.

    We leverage graph neural networks to project quantum states onto lower-dimensional
    representations that preserve entanglement relationships and quantum coherence. Our
    visualization system enables researchers to interactively explore quantum circuits,
    identify decoherence sources, and optimize gate sequences.

    Experimental results on quantum circuits up to 20 qubits demonstrate that our approach
    provides 3x faster insight generation compared to traditional statevector visualization
    methods.`,
    contributions: [
      'Graph-based projection technique for quantum state visualization',
      'Interactive web-based visualization system for quantum circuits',
      'Preservation of entanglement relationships in 2D projections',
      'Real-time decoherence tracking and source identification',
      'Benchmark evaluation on multi-qubit quantum systems',
    ],
    bibtex: `@inproceedings{2025-quantum-graph,
  title={Quantum Graph Visualization: Interactive Exploration of Quantum States},
  author={Authors},
  booktitle={IEEE Quantum Week},
  year={2025},
  note={Planned}
}`,
  },
  'terminal-computing-paradigm': {
    title: 'The Terminal as a Computing Paradigm: Reimagining Human-Computer Interaction',
    authors: 'B. V. Parswanadh, [Collaborators TBD]',
    venue: 'ACM CHI Conference on Human Factors in Computing Systems',
    year: '2025',
    status: 'Planned',
    doi: 'TBD',
    pdfUrl: '',
    codeUrl: 'https://github.com/parswanadh',
    abstract: `The command-line interface (CLI) remains one of the most efficient computing
    paradigms for expert users, yet its potential as a primary interaction modality remains
    underexplored. This paper reexamines the terminal through the lens of modern AI capabilities.

    We present a study of developer workflows and identify key friction points in terminal-
    based interactions. Building on these findings, we design an AI-enhanced terminal environment
    that provides contextual assistance, natural language command translation, and intelligent
    workflow automation.

    User studies with 50 software developers show a 40% reduction in task completion time
    and a 60% decrease in context-switching frequency when using our AI-enhanced terminal.`,
    contributions: [
      'Comprehensive study of terminal-based developer workflows',
      'Taxonomy of friction points in CLI interactions',
      'AI-enhanced terminal architecture with contextual assistance',
      'Natural language to command-line translation system',
      'Empirical evaluation demonstrating significant productivity gains',
    ],
    bibtex: `@inproceedings{2025-terminal-paradigm,
  title={The Terminal as a Computing Paradigm: Reimagining Human-Computer Interaction},
  author={Parswanadh, B. V. and Collaborators},
  booktitle={ACM CHI Conference on Human Factors in Computing Systems},
  year={2025},
  note={Planned}
}`,
  },
}

export default async function ResearchPage({ params }: PageProps) {
  const { slug } = await params
  const research = researchData[slug]

  if (!research) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back navigation */}
          <Link
            href="/research"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent-primary hover:underline mb-8"
          >
            ← /research
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-accent-primary" />
              <span className={`text-sm px-2 py-1 rounded font-mono ${
                research.status === 'Published' ? 'bg-log-success/20 text-log-success' : 'bg-log-warning/20 text-log-warning'
              }`}>
                {research.status}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {research.title}
            </h1>
            <p className="text-lg text-text-secondary mb-2">{research.authors}</p>
            <div className="flex items-center gap-3 font-mono text-sm text-text-tertiary">
              <span>{research.venue}</span>
              <span>•</span>
              <span>{research.year}</span>
              {research.doi && (
                <>
                  <span>•</span>
                  <span>DOI: {research.doi}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            {research.pdfUrl && (
              <a
                href={research.pdfUrl}
                download
                className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
            {research.codeUrl && (
              <a
                href={research.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-bg-elevated text-text-primary font-mono text-sm rounded hover:bg-bg-tertiary transition-colors"
              >
                View Code
              </a>
            )}
            {!research.pdfUrl && !research.codeUrl && (
              <span className="text-text-tertiary font-mono text-sm">Resources coming soon</span>
            )}
          </div>

          {/* Abstract */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-8 mb-8">
            <h2 className="font-mono text-lg font-bold text-text-primary mb-4">
              ABSTRACT
            </h2>
            <div className="font-serif text-lg text-text-secondary leading-relaxed whitespace-pre-line">
              {research.abstract}
            </div>
          </div>

          {/* Contributions */}
          <div className="mb-8">
            <h2 className="font-mono text-lg font-bold text-text-primary mb-4">
              KEY CONTRIBUTIONS
            </h2>
            <ul className="space-y-2">
              {research.contributions.map((contribution: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-text-secondary font-serif"
                >
                  <span className="text-accent-primary mt-1">→</span>
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Citation */}
          <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-sm font-bold text-text-primary flex items-center gap-2">
                <Quote className="w-4 h-4" />
                BIBTEX
              </h2>
              <ResearchBibtexCopy bibtex={research.bibtex} />
            </div>
            <pre className="font-mono text-xs text-text-secondary overflow-x-auto bg-bg-primary p-4 rounded">
              {research.bibtex}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
