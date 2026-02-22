'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SwipeIndicatorsProps {
  showLeft: boolean
  showRight: boolean
  onNavigateLeft?: () => void
  onNavigateRight?: () => void
}

// Client-side only wrapper component - this is the main export
export function SwipeIndicatorsClient({
  showLeft,
  showRight,
  onNavigateLeft,
  onNavigateRight,
}: SwipeIndicatorsProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(isTouchDevice && mediaQuery.matches)

    const handleResize = () => {
      setIsMobile(isTouchDevice && mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleResize)
    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  // Prevent SSR rendering
  if (!mounted || !isMobile) {
    return null
  }

  return (
    <AnimatePresence>
      {showLeft && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[9999] md:hidden"
          onClick={onNavigateLeft}
          role="button"
          tabIndex={0}
          aria-label="Navigate to previous page"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onNavigateLeft?.()
            }
          }}
        >
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
            className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 text-bg-primary" />
          </motion.div>
        </motion.div>
      )}

      {showRight && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] md:hidden"
          onClick={onNavigateRight}
          role="button"
          tabIndex={0}
          aria-label="Navigate to next page"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onNavigateRight?.()
            }
          }}
        >
          <motion.div
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
            className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 text-bg-primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
