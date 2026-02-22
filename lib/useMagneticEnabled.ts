'use client'

import { useEffect, useState } from 'react'

export function useMagneticEnabled() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only enable magnetic effect on desktop without reduced motion
    setIsEnabled(!isTouchDevice && !prefersReducedMotion)
  }, [])

  return isEnabled
}
