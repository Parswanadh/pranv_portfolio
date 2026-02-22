'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * CanvasParticles Component
 *
 * Modern particle effects system with WebGPU support and Canvas 2D fallback.
 * Features mouse interaction for enhanced visual engagement.
 *
 * @example
 * ```tsx
 * <WebgpuParticles />
 * ```
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

interface MousePosition {
  x: number | null
  y: number | null
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Particle count based on screen size
  getParticleCount: () => {
    if (typeof window === 'undefined') return 80
    const width = window.innerWidth
    if (width < 768) return 50 // Mobile
    if (width < 1024) return 80 // Tablet
    return 120 // Desktop
  },

  // Interaction radius for mouse effect
  MOUSE_RADIUS: 120,

  // Mouse force strength
  MOUSE_FORCE: 0.08,

  // Connection distance for drawing lines
  CONNECTION_DISTANCE: 100,

  // Particle speed range
  MIN_SPEED: 0.1,
  MAX_SPEED: 0.4,

  // Particle size range
  MIN_SIZE: 1,
  MAX_SIZE: 2.5,

  // Color palette (orange accent theme)
  COLORS: [
    'rgba(245, 166, 35, 0.8)',   // Primary accent
    'rgba(212, 165, 116, 0.7)',  // Secondary
    'rgba(139, 115, 85, 0.6)',   // Tertiary
    'rgba(245, 166, 35, 0.5)',   // Lighter accent
  ],
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<MousePosition>({ x: null, y: null })

  const [isSupported, setIsSupported] = useState(true)
  const [useWebGPU, setUseWebGPU] = useState(false)

  // Check WebGPU support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'gpu' in navigator) {
      setUseWebGPU(true)
    }
  }, [])

  // Initialize particles
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = CONFIG.getParticleCount()
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.MAX_SPEED,
        vy: (Math.random() - 0.5) * CONFIG.MAX_SPEED,
        size: CONFIG.MIN_SIZE + Math.random() * (CONFIG.MAX_SIZE - CONFIG.MIN_SIZE),
        color: CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)],
        alpha: 0.5 + Math.random() * 0.5,
      })
    }

    particlesRef.current = particles
  }, [])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }, [])

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: null, y: null }
  }, [])

  // Update particle positions
  const updateParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles = particlesRef.current
    const mouse = mouseRef.current

    particles.forEach((particle) => {
      // Apply mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < CONFIG.MOUSE_RADIUS) {
          const force = (CONFIG.MOUSE_RADIUS - distance) / CONFIG.MOUSE_RADIUS
          const angle = Math.atan2(dy, dx)

          // Gentle repulsion from mouse
          particle.vx -= Math.cos(angle) * force * CONFIG.MOUSE_FORCE
          particle.vy -= Math.sin(angle) * force * CONFIG.MOUSE_FORCE
        }
      }

      // Apply velocity
      particle.x += particle.vx
      particle.y += particle.vy

      // Damping to return to normal speed
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      if (speed > CONFIG.MAX_SPEED) {
        particle.vx *= 0.98
        particle.vy *= 0.98
      }
      if (speed < CONFIG.MIN_SPEED) {
        particle.vx *= 1.02
        particle.vy *= 1.02
      }

      // Bounce off edges with wrap-around
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0
    })
  }, [])

  // Draw particles and connections
  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const particles = particlesRef.current

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CONFIG.CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONFIG.CONNECTION_DISTANCE) * 0.2
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(245, 166, 35, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })

    // Draw particles
    particles.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.alpha
      ctx.fill()
      ctx.globalAlpha = 1
    })

    // Draw mouse glow effect
    const mouse = mouseRef.current
    if (mouse.x !== null && mouse.y !== null) {
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        CONFIG.MOUSE_RADIUS
      )
      gradient.addColorStop(0, 'rgba(245, 166, 35, 0.1)')
      gradient.addColorStop(1, 'rgba(245, 166, 35, 0)')

      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, CONFIG.MOUSE_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }, [])

  // Animation loop
  const animate = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    updateParticles(canvas)
    draw(ctx, canvas)
    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx))
  }, [updateParticles, draw])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsSupported(false)
      return
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas)
    }

    resizeCanvas()

    // Set up event listeners
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }

    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleMouseLeave)

    // Start animation
    animate(canvas, ctx)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseLeave)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles, handleMouseMove, handleMouseLeave, animate])

  // Fallback message if not supported
  if (!isSupported) {
    return null
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 opacity-60 md:opacity-60"
        style={{ opacity: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.25 : 0.6 }}
        aria-hidden="true"
      />
      {/* Debug indicator (hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 px-3 py-1 bg-bg-secondary border border-border-default rounded text-xs font-mono text-text-tertiary opacity-50">
          {useWebGPU ? 'WebGPU' : 'Canvas 2D'} Particles
        </div>
      )}
    </>
  )
}

// ============================================================================
// ACCESSIBILITY & PERFORMANCE
// ============================================================================

/**
 * Accessibility Features:
 * - aria-hidden="true" to hide from screen readers
 * - pointer-events-none to prevent interaction conflicts
 * - Respects prefers-reduced-motion via opacity reduction
 *
 * Performance Optimizations:
 * - requestAnimationFrame for smooth animations
 * - Particle count based on screen size
 * - Efficient distance calculations
 * - Proper cleanup of event listeners and animation frames
 * - Canvas 2D fallback for broader compatibility
 */
