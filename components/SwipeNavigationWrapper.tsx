'use client'

import { useState, useEffect } from 'react'
import { useGestureNavigation } from '@/hooks/useGestureNavigation'
import { SwipeIndicatorsClient } from '@/components/SwipeIndicators'
import { useSwipeDetector } from '@/components/SwipeDetector'

export function SwipeNavigationWrapper({ children }: { children: React.ReactNode }) {
  const { goBack, goForward, canGoBack, canGoForward } = useGestureNavigation()
  const [isIrisOpen, setIsIrisOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(isTouchDevice && mediaQuery.matches)

    const handleResize = () => {
      setIsMobile(isTouchDevice && mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleResize)
    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  // Listen for Iris chat state to disable gestures when chat is open
  useEffect(() => {
    const checkIrisState = () => {
      const chatPanel = document.querySelector('[class*="fixed bottom-6 right-6"][class*="z-[9999]"]')
      const isOpen = chatPanel !== null && chatPanel.children.length > 1
      setIsIrisOpen(isOpen)
    }

    checkIrisState()

    const observer = new MutationObserver(checkIrisState)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  // Disable gestures if Iris chat is open or not on mobile
  const shouldDisable = !isMobile || isIrisOpen

  const handleSwipe = (action: () => void) => {
    action()

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handlers = useSwipeDetector({
    threshold: 80,
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
      <SwipeIndicatorsClient
        showLeft={canGoBack && isMobile && !isIrisOpen}
        showRight={canGoForward && isMobile && !isIrisOpen}
        onNavigateLeft={canGoBack ? () => handleSwipe(goBack) : undefined}
        onNavigateRight={canGoForward ? () => handleSwipe(goForward) : undefined}
      />
    </div>
  )
}
