'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { MagneticButton } from '@/components/MagneticButton'

const quotes = [
  '"The best way to predict the future is to build it."',
  '"Where systems thinking meets shipyard velocity."',
  '"Quality is not an act, it is a habit."',
  '"Code is the instrument of thought."',
  '"Simplicity is the ultimate sophistication."',
]

export default function Footer() {
  const [quote, setQuote] = useState(quotes[0])
  const [uptime, setUptime] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(80)

  useEffect(() => {
    setMounted(true)
    setWindowWidth(typeof window !== 'undefined' ? Math.min(80, window.innerWidth / 8) : 80)
    const now = new Date()
    // Set initial build time only on client
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setQuote((prev) => {
        const currentIndex = quotes.indexOf(prev)
        const nextIndex = (currentIndex + 1) % quotes.length
        return quotes[nextIndex]
      })
    }, 30000)

    // Update uptime every second
    const startTime = Date.now()
    const uptimeInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setUptime(elapsed)
    }, 1000)

    return () => {
      clearInterval(quoteInterval)
      clearInterval(uptimeInterval)
    }
  }, [mounted])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  // Format build time only on client side to avoid hydration mismatch
  const buildTime = mounted
    ? new Date().toISOString().replace('T', ' ').substring(0, 19)
    : '2025-01-19 00:00:00'

  return (
    <footer className="bg-bg-primary border-t border-border-default">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Retro terminal style footer */}
        <div className="font-mono text-xs text-text-secondary space-y-2">
          <div className="overflow-hidden">
            {'─'.repeat(Math.floor(windowWidth))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>PORTFOLIO v2.0</span>
            <span>|</span>
            <span>BUILT WITH Next.js + React + Framer Motion</span>
            <span>|</span>
            <span>© 2025</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>LAST COMPILE: {buildTime}</span>
            <span>|</span>
            <span>UPTIME: {formatUptime(uptime)}</span>
          </div>
          <div className="text-text-accent terminal-glow">
            &gt; {quote}
          </div>
          <div className="overflow-hidden">
            {'─'.repeat(Math.floor(windowWidth))}
          </div>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <MagneticButton
            href="https://github.com/PranavAmara05"
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-text-secondary hover:text-accent-primary hover:bg-bg-elevated rounded-lg transition-colors duration-150 touch-manipulation"
            aria-label="GitHub"
            strength={0.2}
          >
            <Github className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton
            href="https://www.linkedin.com/in/amara-pranav"
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-text-secondary hover:text-accent-primary hover:bg-bg-elevated rounded-lg transition-colors duration-150 touch-manipulation"
            aria-label="LinkedIn"
            strength={0.2}
          >
            <Linkedin className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton
            href="mailto:prnvamara@gmail.com"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-text-secondary hover:text-accent-primary hover:bg-bg-elevated rounded-lg transition-colors duration-150 touch-manipulation"
            aria-label="Email"
            strength={0.2}
          >
            <Mail className="w-5 h-5" />
          </MagneticButton>
        </div>
      </div>
    </footer>
  )
}
