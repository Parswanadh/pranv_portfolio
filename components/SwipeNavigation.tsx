'use client'

import { useEffect, useState } from 'react'
import { useGestureNavigation } from '@/hooks/useGestureNavigation'
import { useSwipeDetector } from '@/components/SwipeDetector'

interface SwipeNavigationProps {
  children: React.ReactNode
  disabled?: boolean
  threshold?: number
  enableHapticFeedback?: boolean
}

export function SwipeNavigation({
  children,
  disabled = false,
  threshold = 80,
  enableHapticFeedback = true,
}: SwipeNavigationProps) {
  const { goBack, goForward, canGoBack, canGoForward } = useGestureNavigation()
  const [isIrisOpen, setIsIrisOpen] = useState(false)

  // Listen for Iris chat state to disable gestures when chat is open
  useEffect(() => {
    // Check if Iris chat is open by looking for the chat panel in DOM
    const checkIrisState = () => {
      const chatPanel = document.querySelector('[class*="fixed bottom-6 right-6"][class*="z-[9999]"]')
      const isOpen = chatPanel !== null && chatPanel.children.length > 1
      setIsIrisOpen(isOpen)
    }

    // Initial check
    checkIrisState()

    // Watch for DOM changes
    const observer = new MutationObserver(checkIrisState)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  // Disable gestures if Iris chat is open or globally disabled
  const shouldDisable = disabled || isIrisOpen

  const handleSwipe = (action: () => void) => {
    // Perform navigation
    action()

    // Haptic feedback
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10) // Short vibration (10ms)
    }
  }

  const handlers = useSwipeDetector({
    threshold,
    disabled: shouldDisable,
    onSwipeLeft: canGoForward ? () => handleSwipe(goForward) : undefined,
    onSwipeRight: canGoBack ? () => handleSwipe(goBack) : undefined,
  })

  return (
    <div
      onTouchStart={handlers.onTouchStart}
      onTouchEnd={handlers.onTouchEnd}
      onTouchMove={handlers.onTouchMove}
      style={{ touchAction: 'pan-y pinch-zoom' }}
      data-swipe-enabled={!shouldDisable}
    >
      {children}
    </div>
  )
}
