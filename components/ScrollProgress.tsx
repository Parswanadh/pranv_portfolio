'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

/**
 * Main scroll progress indicator
 * Shows a gradient bar at the top of the page that fills as you scroll
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary origin-left z-[9999]"
      style={{
        scaleX: scrollYProgress,
      }}
    />
  )
}

/**
 * Scroll to top button
 * Appears when user scrolls down past 500px
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-[9999] w-12 h-12 bg-accent-primary text-bg-primary rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center focus:ring-2 focus:ring-accent-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-bg-primary"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/**
 * Reading progress indicator
 * Shows reading time and scroll percentage
 */
export function ReadingProgress({
  contentRef,
  readingTime,
}: {
  contentRef: React.RefObject<HTMLElement>
  readingTime: string
}) {
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start start', 'end end'],
  })

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 px-3 py-2 bg-bg-secondary/80 backdrop-blur-sm border border-border-default rounded-full text-xs font-mono">
      <span className="text-text-tertiary">{readingTime}</span>
      <span className="text-border-default">•</span>
      <span className="text-text-primary">{Math.round(progress.get())}%</span>
    </div>
  )
}

/**
 * Section-based progress indicator
 * Highlights current section in navigation
 */
export function SectionIndicator({ sections }: { sections: string[] }) {
  const [currentSection, setCurrentSection] = useState(sections[0])

  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  return (
    <div className="fixed top-20 right-4 z-[9999]">
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <div
            key={section}
            className={`w-1 h-8 rounded transition-all ${
              currentSection === section ? 'bg-accent-primary' : 'bg-bg-tertiary'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
