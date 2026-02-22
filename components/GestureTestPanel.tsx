'use client'

import { useState, useEffect } from 'react'
import { useGestureNavigation } from '@/hooks/useGestureNavigation'

/**
 * Gesture Navigation Test Panel
 * Add this component to any page to test gesture navigation functionality
 *
 * Usage:
 * import { GestureTestPanel } from '@/components/GestureTestPanel'
 *
 * export default function TestPage() {
 *   return (
 *     <div>
 *       <GestureTestPanel />
 *       {...rest of page content}
 *     </div>
 *   )
 * }
 */
export function GestureTestPanel() {
  const { goBack, goForward, canGoBack, canGoForward, currentPage, pages } = useGestureNavigation()
  const [touchInfo, setTouchInfo] = useState({
    hasTouch: false,
    maxTouchPoints: 0,
    viewport: { width: 0, height: 0 },
    isMobile: false,
  })
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0 })
  const [lastSwipe, setLastSwipe] = useState<string>('')

  useEffect(() => {
    const updateTouchInfo = () => {
      setTouchInfo({
        hasTouch: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        isMobile: window.innerWidth < 768,
      })
    }

    updateTouchInfo()
    window.addEventListener('resize', updateTouchInfo)
    return () => window.removeEventListener('resize', updateTouchInfo)
  }, [])

  const handleSwipe = (direction: 'left' | 'right', action: () => void) => {
    setSwipeCount(prev => ({ ...prev, [direction]: prev[direction] + 1 }))
    setLastSwipe(`${direction} at ${new Date().toLocaleTimeString()}`)
    action()

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Only show in development
  }

  const currentIndex = currentPage ? pages.indexOf(currentPage as string) : -1

  return (
    <div className="fixed bottom-4 left-4 z-[10000] bg-bg-secondary/95 backdrop-blur border border-accent-primary rounded-lg p-4 max-w-sm font-mono text-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-accent-primary">Gesture Nav Test</h3>
        <button
          onClick={() => setSwipeCount({ left: 0, right: 0 })}
          className="px-2 py-1 bg-bg-elevated rounded hover:bg-bg-tertiary"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        {/* Touch Info */}
        <div className="bg-bg-tertiary rounded p-2">
          <div className="font-bold text-text-secondary mb-1">Device Info</div>
          <div className="grid grid-cols-2 gap-1 text-text-tertiary">
            <span>Touch:</span>
            <span className={touchInfo.hasTouch ? 'text-green-500' : 'text-red-500'}>
              {touchInfo.hasTouch ? 'Yes' : 'No'}
            </span>
            <span>Points:</span>
            <span>{touchInfo.maxTouchPoints}</span>
            <span>Width:</span>
            <span>{touchInfo.viewport.width}px</span>
            <span>Mobile:</span>
            <span className={touchInfo.isMobile ? 'text-green-500' : 'text-red-500'}>
              {touchInfo.isMobile ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Navigation State */}
        <div className="bg-bg-tertiary rounded p-2">
          <div className="font-bold text-text-secondary mb-1">Navigation State</div>
          <div className="grid grid-cols-2 gap-1 text-text-tertiary">
            <span>Current:</span>
            <span className="text-accent-primary truncate">{currentPage}</span>
            <span>Index:</span>
            <span>{currentIndex + 1} / {pages.length}</span>
            <span>Can Back:</span>
            <span className={canGoBack ? 'text-green-500' : 'text-red-500'}>
              {canGoBack ? 'Yes' : 'No'}
            </span>
            <span>Can Fwd:</span>
            <span className={canGoForward ? 'text-green-500' : 'text-red-500'}>
              {canGoForward ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Swipe Actions */}
        <div className="bg-bg-tertiary rounded p-2">
          <div className="font-bold text-text-secondary mb-1">Test Actions</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSwipe('right', goBack)}
              disabled={!canGoBack}
              className="flex-1 px-3 py-2 bg-accent-primary text-bg-primary rounded disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              ← Back ({swipeCount.right})
            </button>
            <button
              onClick={() => handleSwipe('left', goForward)}
              disabled={!canGoForward}
              className="flex-1 px-3 py-2 bg-accent-primary text-bg-primary rounded disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Next ({swipeCount.left})
            </button>
          </div>
        </div>

        {/* Last Swipe */}
        {lastSwipe && (
          <div className="bg-bg-tertiary rounded p-2">
            <div className="font-bold text-text-secondary mb-1">Last Swipe</div>
            <div className="text-text-tertiary">{lastSwipe}</div>
          </div>
        )}

        {/* Page Navigation */}
        <div className="bg-bg-tertiary rounded p-2">
          <div className="font-bold text-text-secondary mb-1">All Pages</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {pages.map((page, index) => (
              <div
                key={page}
                className={`flex items-center gap-2 text-text-tertiary ${
                  index === currentIndex ? 'text-accent-primary' : ''
                }`}
              >
                <span className="w-4">{index + 1}.</span>
                <span className="flex-1 truncate">{page || '/home'}</span>
                {index === currentIndex && <span>←</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
