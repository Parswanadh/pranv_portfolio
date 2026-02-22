'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { MouseEvent, useRef, ReactNode } from 'react'
import { useMagneticEnabled } from '@/lib/useMagneticEnabled'

interface MagneticWrapperProps {
  children: ReactNode
  className?: string
  strength?: number
  disabled?: boolean
}

export function MagneticWrapper({
  children,
  className = '',
  strength = 0.2,
  disabled = false,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isEnabled = useMagneticEnabled()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled || !isEnabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set((e.clientX - centerX) * strength)
    mouseY.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const motionProps = isEnabled
    ? {
        ref,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: { x: springX, y: springY },
      }
    : { ref: undefined }

  return (
    <motion.div
      {...motionProps}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
