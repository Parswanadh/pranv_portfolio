'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TerminalBoot from '@/components/TerminalBoot'
import { MagneticButton } from '@/components/MagneticButton'
import { MagneticWrapper } from '@/components/MagneticWrapper'
import { BentoGrid, BentoItem } from '@/components/BentoGrid'
import { BentoCtaCard } from '@/components/BentoCard'
import { IrisCtaButton } from '@/components/IrisCtaButton'
import { ArrowRight, Cpu, Download, MapPin, Calendar, Zap, Award, Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { optimizedImages } from '@/lib/utils/image-optimizer'

interface FeaturedProjectMetrics {
  codeGenerated?: string
  accuracy?: string
  latency?: string
  transcriptionHours?: string
}

interface FeaturedProject {
  slug: string
  title: string
  category: string
  status: string
  metrics?: FeaturedProjectMetrics
}

const featuredProjects: FeaturedProject[] = [
  {
    slug: 'pro-code',
    title: 'PRO_CODE – Local AI Coding Assistant',
    category: 'AI Tools',
    status: 'Production-Ready',
    metrics: {
      codeGenerated: '50,000+ lines',
      accuracy: '99.9% uptime',
    }
  },
  {
    slug: 'gpt-oss-vision',
    title: 'GPT-OSS Vision – Multimodal AI Pipeline',
    category: 'Multimodal AI',
    status: 'Production-Ready',
    metrics: {
      accuracy: '100+ epochs',
    }
  },
  {
    slug: 'parshu-stt',
    title: 'Parshu-STT – Real-Time Voice Transcription',
    category: 'Productivity Tools',
    status: 'Production-Ready',
    metrics: {
      transcriptionHours: '100+ hours',
      accuracy: '95% accuracy',
      latency: '<2s latency',
    }
  },
]

const activeAgents = [
  { name: 'Iris', status: 'online' },
  { name: 'PRO_CODE', status: 'online' },
  { name: 'GPT-OSS Vision', status: 'online' },
]

// Force dynamic rendering to avoid static generation issues with event handlers
export const dynamic = 'force-dynamic'

export default function Home() {
  const [showBoot, setShowBoot] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const hasSeenBoot = localStorage.getItem('hasSeenBoot')
    if (!hasSeenBoot) {
      setShowBoot(true)
    } else {
      setBootComplete(true)
    }
  }, [mounted])

  if (showBoot && !bootComplete) {
    return <TerminalBoot onComplete={() => setBootComplete(true)} />
  }

  return (
    <div className="min-h-screen relative">
      <Header />

      {/* Hero with Bento Grid Layout */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden select-none py-12 md:py-20">
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <BentoGrid
            items={[
              // Profile Image - Large card (left side)
              {
                id: 'profile',
                size: 'large',
                content: (
                  <div className="relative h-full flex items-center justify-center p-6 bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl overflow-hidden">
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div className="w-48 h-64 md:w-56 md:h-72 rounded-3xl bg-gradient-to-br from-accent-primary to-accent-secondary p-1">
                          <div className="w-full h-full rounded-3xl bg-bg-secondary overflow-hidden">
                            <Image
                              src={optimizedImages.profile.src}
                              alt="Amara Pranav - AI and Data Science Engineer"
                              width={optimizedImages.profile.width}
                              height={optimizedImages.profile.height}
                              sizes={optimizedImages.profile.sizes}
                              className="w-full h-full object-cover object-top"
                              priority
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ),
              },
              // Name & Title - Wide card (top right)
              {
                id: 'name-title',
                size: 'wide',
                content: (
                  <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-6 flex flex-col justify-center">
                    <h1 className="font-mono text-lg md:text-xl font-bold text-text-primary mb-3">
                      <span className="text-accent-primary terminal-glow">&gt; hello</span>
                      <span className="text-text-secondary">, I'm</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
                      Amara<br />Pranav
                    </h2>
                    <p className="text-base md:text-lg text-text-secondary mt-3 font-serif italic">
                      "Building intelligent systems through ML, DL, and Computer Vision"
                    </p>
                  </div>
                ),
              },
              // Status - Small card (top right of right section)
              {
                id: 'status',
                size: 'small',
                content: (
                  <div className="h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/30 rounded-xl p-5 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-accent-primary" />
                    </div>
                    <p className="text-sm font-mono text-text-secondary mb-1">Currently</p>
                    <p className="text-base font-bold text-accent-primary">Open to Work</p>
                  </div>
                ),
              },
              // Quick Stats - Wide card (middle right)
              {
                id: 'quick-stats',
                size: 'wide',
                content: (
                  <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-6 flex flex-col justify-center">
                    <p className="font-mono text-sm text-text-tertiary mb-4">AI & Data Science × Machine Learning × Computer Vision</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      I build AI-powered tools, prototype intelligent systems, and explore the future of human-AI collaboration. I maximize every resource's potential and create innovative solutions.
                    </p>
                  </div>
                ),
              },
              // Iris CTA - Medium card
              {
                id: 'iris-cta',
                size: 'medium',
                content: <IrisCtaButton key="iris-cta-button"></IrisCtaButton>,
              },
              // Latest Project - Medium card
              {
                id: 'latest-project',
                size: 'medium',
                content: (
                  <MagneticWrapper strength={0.06}>
                    <Link href="/projects" className="group block h-full">
                      <motion.div
                        className="relative h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/30 hover:border-accent-primary rounded-xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center mb-4">
                            <Code2 className="w-6 h-6 text-accent-primary" />
                          </div>
                          <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono mb-2">
                            View Projects
                          </h3>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            Explore my portfolio of AI tools, embedded systems, and robotics projects.
                          </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-2 mt-4 text-accent-primary group-hover:gap-3 transition-all">
                          <span className="text-sm font-mono font-semibold">Explore</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    </Link>
                  </MagneticWrapper>
                ),
              },
              // Skills/Info - Tall card (bottom left)
              {
                id: 'skills-info',
                size: 'tall',
                content: (
                  <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-accent-primary" />
                        <h3 className="font-mono text-base font-bold text-text-primary">Expertise</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                          <span className="text-sm text-text-secondary">Generative AI & LLMs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                          <span className="text-sm text-text-secondary">Embedded Systems</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                          <span className="text-sm text-text-secondary">Computer Vision</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                          <span className="text-sm text-text-secondary">Robotics & Automation</span>
                        </div>
                      </div>
                    </div>
                    <MagneticButton
                      href="/resume"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded-lg text-text-primary font-mono text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </MagneticButton>
                  </div>
                ),
              },
              // Location - Small card
              {
                id: 'location',
                size: 'small',
                content: (
                  <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-accent-primary" />
                      <span className="text-xs text-text-tertiary font-mono">Location</span>
                    </div>
                    <p className="text-sm font-bold text-text-primary">Bangalore, India</p>
                  </div>
                ),
              },
              // Experience/Year - Small card
              {
                id: 'experience',
                size: 'small',
                content: (
                  <div className="h-full bg-gradient-to-br from-bg-secondary to-bg-elevated border-2 border-border-default rounded-xl p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-accent-primary" />
                      <span className="text-xs text-text-tertiary font-mono">Experience</span>
                    </div>
                    <p className="text-sm font-bold text-text-primary">3+ Years</p>
                  </div>
                ),
              },
            ]}
            className="max-w-5xl mx-auto"
          />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative z-10 bg-bg-primary border-t border-border-default py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-2xl font-bold text-text-primary">
              FEATURED PROJECTS
            </h2>
            <a
              href="/projects"
              className="font-mono text-sm text-accent-primary hover:underline flex items-center gap-1"
            >
              [→ ALL]
            </a>
          </div>

          <BentoGrid
            items={featuredProjects.map((project) => ({
              id: project.slug,
              size: 'medium',
              content: (
                <MagneticWrapper key={project.slug} strength={0.1}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block h-full"
                  >
                    <div className="bg-bg-secondary border border-border-default hover:border-accent-primary rounded-xl p-6 transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-mono text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight">
                          {project.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono whitespace-nowrap shrink-0">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-tertiary font-mono mb-4">{project.category}</p>
                      {project.metrics && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.metrics.codeGenerated && (
                            <span className="text-xs px-2 py-1 bg-bg-elevated rounded text-text-secondary font-mono">
                              {project.metrics.codeGenerated}
                            </span>
                          )}
                          {project.metrics.accuracy && (
                            <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded font-mono">
                              {project.metrics.accuracy}
                            </span>
                          )}
                          {project.metrics.latency && (
                            <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded font-mono">
                              {project.metrics.latency}
                            </span>
                          )}
                          {project.metrics.transcriptionHours && (
                            <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded font-mono">
                              {project.metrics.transcriptionHours}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </MagneticWrapper>
              ),
            }))}
          />
        </div>
      </section>

      {/* Active Agents */}
      <section className="relative z-10 bg-bg-secondary border-t border-border-default py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-mono text-2xl font-bold text-text-primary flex items-center gap-3">
              <Cpu className="w-6 h-6 text-accent-primary" />
              ACTIVE AGENTS
            </h2>
            <a
              href="/agents"
              className="font-mono text-sm text-accent-primary hover:underline flex items-center gap-1"
            >
              [→ ALL]
            </a>
          </div>

          <div className="flex flex-wrap gap-4">
            {activeAgents.map((agent, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 bg-bg-primary border border-border-default rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-log-success animate-pulse' : 'bg-log-error'}`} />
                <span className="font-mono text-sm text-text-primary">{agent.name}</span>
                <span className="font-mono text-xs text-text-tertiary">● {agent.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
