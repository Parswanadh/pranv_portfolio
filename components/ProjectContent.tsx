'use client'

import { CheckCircle2, Code2, Zap, Shield, Cpu, Database, Globe, Rocket, Settings, Lightbulb, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface ProjectContentProps {
  title: string
  longDescription?: string
  howItWorks?: string
  keyFeatures?: string[]
  techStack: string[]
  status: string
  category: string
}

export function ProjectContent({
  title,
  longDescription,
  howItWorks,
  keyFeatures = [],
  techStack,
  status,
  category
}: ProjectContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'Agentic AI': Rocket,
      'AI Tools': Cpu,
      'Multimodal AI': Globe,
      'Productivity Tools': Zap,
      'Research': Lightbulb,
      'Embedded Systems': Settings,
      'Robotics': Code2,
      'Space Tech': Rocket,
      'Generative AI': Database,
    }
    return icons[cat] || Code2
  }

  const CategoryIcon = getCategoryIcon(category)

  const getFeatureIcon = (index: number) => {
    const icons = [
      CheckCircle2, Zap, Shield, Globe, Code2, Database, Settings, Lightbulb
    ]
    return icons[index % icons.length]
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border-default">
        <div className="flex items-center gap-3 mb-4">
          <CategoryIcon className="w-5 h-5 text-accent-primary" />
          <span className="text-sm font-medium text-text-secondary">{category}</span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-primary/10 text-accent-primary">
            {status}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h1>
      </div>

      {/* Overview Section */}
      {longDescription && (
        <section className="mb-8">
          <button
            onClick={() => toggleSection('overview')}
            className="flex items-center justify-between w-full text-left group"
          >
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent-primary" />
              Overview
            </h2>
            <ArrowRight
              className={`w-5 h-5 text-text-secondary transition-transform ${
                expandedSection === 'overview' ? 'rotate-90' : ''
              }`}
            />
          </button>
          <div className={`mt-4 text-text-secondary leading-relaxed ${
            expandedSection === 'overview' || !expandedSection ? 'block' : 'hidden'
          }`}>
            <p className="whitespace-pre-line">{longDescription}</p>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {howItWorks && (
        <section className="mb-8">
          <button
            onClick={() => toggleSection('how-it-works')}
            className="flex items-center justify-between w-full text-left group"
          >
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent-secondary" />
              How It Works
            </h2>
            <ArrowRight
              className={`w-5 h-5 text-text-secondary transition-transform ${
                expandedSection === 'how-it-works' ? 'rotate-90' : ''
              }`}
            />
          </button>
          <div className={`mt-4 text-text-secondary leading-relaxed ${
            expandedSection === 'how-it-works' || !expandedSection ? 'block' : 'hidden'
          }`}>
            <p className="whitespace-pre-line">{howItWorks}</p>
          </div>
        </section>
      )}

      {/* Key Features Section */}
      {keyFeatures.length > 0 && (
        <section className="mb-8">
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left group"
          >
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-primary" />
              Key Features
            </h2>
            <ArrowRight
              className={`w-5 h-5 text-text-secondary transition-transform ${
                expandedSection === 'features' ? 'rotate-90' : ''
              }`}
            />
          </button>
          <div className={`mt-4 grid gap-3 ${
            expandedSection === 'features' || !expandedSection ? 'grid' : 'hidden'
          }`}>
            {keyFeatures.map((feature, index) => {
              const FeatureIcon = getFeatureIcon(index)
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-bg-secondary/50 border border-border-default hover:border-accent-primary/50 transition-colors"
                >
                  <FeatureIcon className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{feature}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      <section className="mb-8">
        <button
          onClick={() => toggleSection('tech-stack')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent-secondary" />
            Tech Stack
          </h2>
          <ArrowRight
            className={`w-5 h-5 text-text-secondary transition-transform ${
              expandedSection === 'tech-stack' ? 'rotate-90' : ''
            }`}
          />
        </button>
        <div className={`mt-4 flex flex-wrap gap-2 ${
          expandedSection === 'tech-stack' || !expandedSection ? 'flex' : 'hidden'
        }`}>
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 text-accent-primary border border-accent-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
