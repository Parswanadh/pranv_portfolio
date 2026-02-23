'use client'

import { useEffect, useRef } from 'react'

interface Node {
  id: string
  x: number
  y: number
  radius: number
  label: string
  category: 'skill' | 'project' | 'concept' | 'agent'
}

interface Edge {
  from: string
  to: string
}

interface QuantumGraphProps {
  mode?: 'background' | 'interactive' | 'explanatory'
}

export default function QuantumGraph({ mode = 'interactive' }: QuantumGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const hoveredNodeRef = useRef<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize nodes
    const nodes: Node[] = [
      { id: 'ai', x: 0.5, y: 0.5, radius: 30, label: 'AI/ML', category: 'skill' },
      { id: 'react', x: 0.3, y: 0.4, radius: 25, label: 'React', category: 'skill' },
      { id: 'python', x: 0.7, y: 0.4, radius: 25, label: 'Python', category: 'skill' },
      { id: 'systems', x: 0.5, y: 0.3, radius: 25, label: 'Systems', category: 'skill' },
      { id: 'research', x: 0.4, y: 0.6, radius: 25, label: 'Research', category: 'skill' },
      { id: 'agent1', x: 0.6, y: 0.6, radius: 20, label: 'Agent A', category: 'agent' },
      { id: 'agent2', x: 0.7, y: 0.7, radius: 20, label: 'Agent B', category: 'agent' },
      { id: 'proj1', x: 0.3, y: 0.7, radius: 22, label: 'Project X', category: 'project' },
      { id: 'llm', x: 0.2, y: 0.5, radius: 20, label: 'LLMs', category: 'concept' },
      { id: 'vision', x: 0.8, y: 0.5, radius: 20, label: 'Vision', category: 'concept' },
    ]

    // Initialize edges
    const edges: Edge[] = [
      { from: 'ai', to: 'react' },
      { from: 'ai', to: 'python' },
      { from: 'ai', to: 'systems' },
      { from: 'ai', to: 'research' },
      { from: 'ai', to: 'agent1' },
      { from: 'ai', to: 'agent2' },
      { from: 'research', to: 'proj1' },
      { from: 'agent1', to: 'agent2' },
      { from: 'llm', to: 'ai' },
      { from: 'vision', to: 'ai' },
    ]

    nodesRef.current = nodes
    edgesRef.current = edges

    // Convert normalized coordinates to canvas coordinates
    const getNodeCanvasPos = (node: Node) => ({
      x: node.x * canvas.width,
      y: node.y * canvas.height,
    })

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from)
        const toNode = nodes.find(n => n.id === edge.to)
        if (!fromNode || !toNode) return

        const from = getNodeCanvasPos(fromNode)
        const to = getNodeCanvasPos(toNode)

        const isConnectedToHovered =
          hoveredNodeRef.current === edge.from || hoveredNodeRef.current === edge.to

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)

        if (isConnectedToHovered) {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)'
          ctx.lineWidth = 2
        } else {
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'
          ctx.lineWidth = 1
        }
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach(node => {
        const pos = getNodeCanvasPos(node)
        const isHovered = hoveredNodeRef.current === node.id

        // Subtle floating animation
        const offsetY = Math.sin(time + node.x * 10) * 5

        // Glow effect
        if (isHovered) {
          const gradient = ctx.createRadialGradient(
            pos.x, pos.y + offsetY, 0,
            pos.x, pos.y + offsetY, node.radius * 2
          )
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)')
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
          ctx.fillStyle = gradient
          ctx.fillRect(pos.x - node.radius * 2, pos.y + offsetY - node.radius * 2, node.radius * 4, node.radius * 4)
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y + offsetY, isHovered ? node.radius * 1.1 : node.radius, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? '#818cf8' : '#6366f1'
        ctx.fill()

        // Label
        ctx.fillStyle = isHovered ? '#ffffff' : '#888888'
        ctx.font = `${isHovered ? 'bold ' : ''}12px "JetBrains Mono", monospace`
        ctx.textAlign = 'center'
        ctx.fillText(node.label, pos.x, pos.y + offsetY + node.radius + 15)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Mouse handling
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      if (mode === 'background') return

      // Check hover
      let hovered: string | null = null
      nodes.forEach(node => {
        const pos = getNodeCanvasPos(node)
        const dist = Math.sqrt(
          Math.pow(e.clientX - pos.x, 2) + Math.pow(e.clientY - pos.y, 2)
        )
        if (dist < node.radius) {
          hovered = node.id
        }
      })

      hoveredNodeRef.current = hovered
    }

    const handleClick = (e: MouseEvent) => {
      if (mode !== 'interactive') return

      nodes.forEach(node => {
        const pos = getNodeCanvasPos(node)
        const dist = Math.sqrt(
          Math.pow(e.clientX - pos.x, 2) + Math.pow(e.clientY - pos.y, 2)
        )
        if (dist < node.radius) {
          // Handle node click - could navigate to related page
          console.log('Clicked node:', node.label)
        }
      })
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mode])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: mode === 'background' ? 'none' : 'auto' }}
    />
  )
}
