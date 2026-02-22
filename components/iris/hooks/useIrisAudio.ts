import { useRef, useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SpeakingState } from '../types'

export function useIrisAudio(pendingNavigation: string | null, onNavigationComplete?: () => void) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setSpeakingState('speaking')
    const handlePause = () => setSpeakingState('idle')
    const handleEnded = () => {
      setSpeakingState('idle')
      if (pendingNavigation) {
        router.push(pendingNavigation)
        onNavigationComplete?.()
      }
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [pendingNavigation, router, onNavigationComplete])

  const playAudio = useCallback(async (text: string) => {
    try {
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
      if (paragraphs.length === 0) return

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim()

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: paragraph,
            voice: 'aura-luna-en',
          })
        })

        if (!response.ok) throw new Error('TTS request failed')

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          await new Promise<void>((resolve, reject) => {
            const audio = audioRef.current!

            const handleEnded = () => {
              audio.removeEventListener('ended', handleEnded)
              audio.removeEventListener('error', handleError)
              URL.revokeObjectURL(audioUrl)
              resolve()
            }

            const handleError = () => {
              audio.removeEventListener('ended', handleEnded)
              audio.removeEventListener('error', handleError)
              URL.revokeObjectURL(audioUrl)
              reject(new Error('Audio playback failed'))
            }

            audio.addEventListener('ended', handleEnded)
            audio.addEventListener('error', handleError)

            audio.src = audioUrl
            audio.play().catch(e => {
              console.log('Audio play failed:', e)
              reject(e)
            })
          })

          if (i < paragraphs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1200))
          }
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
    }
  }, [])

  return {
    audioRef,
    speakingState,
    setSpeakingState,
    playAudio,
  }
}
