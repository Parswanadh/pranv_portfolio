'use client'

import { useRef, useCallback } from 'react'

interface SwipeDetectorProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number  // Minimum distance in pixels
  disabled?: boolean  // Disable swipe detection
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
}

export function useSwipeDetector({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  disabled = false,
}: SwipeDetectorProps): SwipeHandlers {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
    touchEnd.current = null
  }, [disabled])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }, [disabled])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart.current || !touchEnd.current) return

    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y

    // Check if threshold met
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    // Reset
    touchStart.current = null
    touchEnd.current = null
  }, [disabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  }
}

export function SwipeDetector({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  disabled = false,
  children,
}: SwipeDetectorProps & { children?: React.ReactNode }) {
  const handlers = useSwipeDetector({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold,
    disabled,
  })

  if (!children) {
    return null
  }

  return (
    <div
      onTouchStart={handlers.onTouchStart}
      onTouchEnd={handlers.onTouchEnd}
      onTouchMove={handlers.onTouchMove}
      style={{ touchAction: 'pan-y pinch-zoom' }} // Allow vertical scrolling and pinch zoom
    >
      {children}
    </div>
  )
}
