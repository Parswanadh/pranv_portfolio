'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ReactNode, MouseEvent, useRef } from 'react'
import { useMagneticEnabled } from '@/lib/useMagneticEnabled'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  href?: string
  target?: string
  rel?: string
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  disabled = false,
  href,
  target,
  rel,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isEnabled = useMagneticEnabled()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled || !isEnabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Reset position before click
    x.set(0)
    y.set(0)
    onClick?.(e)
  }

  const motionProps = isEnabled
    ? {
        style: { x: springX, y: springY },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      }
    : {}

  const content = (
    <motion.div
      ref={ref}
      {...motionProps}
      className={`inline-flex items-center justify-center transition-transform ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } touch-manipulation`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
    >
      {children}
    </motion.div>
  )

  if (href && !disabled) {
    return (
      <a href={href} target={target} rel={rel} className={className} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button disabled={disabled} className={className} {...props}>
      {content}
    </button>
  )
}
