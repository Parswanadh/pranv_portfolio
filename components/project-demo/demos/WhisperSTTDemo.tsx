'use client'

import { useEffect, useState, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import type { TranscriptionResult } from '../types'

interface WhisperSTTDemoProps {
  isPlaying: boolean
  onToggle: () => void
}

export function WhisperSTTDemo({ isPlaying, onToggle }: WhisperSTTDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const samplePhrases = [
      { text: "Hello, how are you today?", delay: 500 },
      { text: "I'm doing great, thanks!", delay: 2000 },
      { text: "The weather is beautiful.", delay: 3500 },
    ]

    let animationId: number
    let startTime = Date.now()

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() - startTime
      const centerY = canvas.height / 2

      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x += 2) {
        const frequency = isPlaying ? 0.02 : 0.01
        const amplitude = isPlaying ? 50 + Math.sin(time * 0.005) * 30 : 20
        const y = centerY + Math.sin(x * frequency + time * 0.01) * amplitude * Math.sin(x * 0.01)

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      if (isPlaying) {
        const barCount = 32
        const barWidth = canvas.width / barCount

        for (let i = 0; i < barCount; i++) {
          const barHeight = Math.abs(Math.sin(time * 0.01 + i * 0.3)) * 100 * Math.random()
          const hue = (i / barCount) * 60 + 30

          ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.3)`
          ctx.fillRect(
            i * barWidth,
            centerY - barHeight / 2,
            barWidth - 2,
            barHeight
          )
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    if (isPlaying) {
      samplePhrases.forEach((phrase, i) => {
        setTimeout(() => {
          setTranscriptions(prev => [...prev, {
            text: phrase.text,
            timestamp: Date.now(),
            confidence: 0.85 + Math.random() * 0.14
          }])
        }, phrase.delay)
      })
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isPlaying])

  return (
    <div className="space-y-4">
      <div className="relative h-32 rounded-lg overflow-hidden border border-border-default">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className="min-h-[44px] flex items-center gap-2 px-4 py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded transition-colors active:scale-95 touch-manipulation"
          aria-label={isPlaying ? 'Pause demo' : 'Start demo'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-sm">{isPlaying ? 'Listening...' : 'Start Listening'}</span>
        </button>

        {transcriptions.length > 0 && (
          <button
            onClick={() => setTranscriptions([])}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-bg-elevated rounded transition-colors touch-manipulation"
            aria-label="Clear transcriptions"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {transcriptions.map((t, i) => (
          <div
            key={i}
            className="p-3 bg-bg-secondary rounded border border-border-default animate-fadeIn"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-sm text-text-primary mb-1">{t.text}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-bg-elevated rounded overflow-hidden">
                <div
                  className="h-full bg-accent-primary"
                  style={{ width: `${t.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-tertiary">{Math.round(t.confidence * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
