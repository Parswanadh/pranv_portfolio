'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MouseEvent, useRef, ReactNode } from 'react'
import { useMagneticEnabled } from '@/lib/useMagneticEnabled'

interface MagneticTiltCardProps {
  children: ReactNode
  className?: string
  tiltStrength?: number
  disabled?: boolean
}

export function MagneticTiltCard({
  children,
  className = '',
  tiltStrength = 5,
  disabled = false,
}: MagneticTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isEnabled = useMagneticEnabled()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Transform mouse position to rotation
  const rotateX = useTransform(springY, [-100, 100], [tiltStrength, -tiltStrength])
  const rotateY = useTransform(springX, [-100, 100], [-tiltStrength, tiltStrength])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled || !isEnabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) * 0.1)
    y.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const motionProps = isEnabled
    ? {
        ref,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d' as const,
        },
      }
    : {}

  return (
    <motion.div
      {...motionProps}
      className={className}
    >
      {children}
    </motion.div>
  )
}
