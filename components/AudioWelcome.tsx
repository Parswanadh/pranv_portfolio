'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play } from 'lucide-react'

export function AudioWelcome() {
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const playWelcomeAudio = useCallback(() => {
    if (hasPlayed || !audioRef.current) return

    // Check sound preference
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false'
    if (!soundEnabled) {
      return
    }

    // Check if audio file exists (by checking if it can load)
    audioRef.current.volume = 0.8
    audioRef.current.play().then(() => {
      setIsPlaying(true)
      setShowIndicator(true)

      // Mark as played
      localStorage.setItem('audioWelcomePlayed', 'true')
      setHasPlayed(true)

      // Hide indicator after audio completes
      if (audioRef.current) {
        audioRef.current.onended = () => {
          setIsPlaying(false)
          setTimeout(() => setShowIndicator(false), 2000)
        }
      }

      // Set a timeout to hide indicator even if audio is very short or fails
      setTimeout(() => {
        setIsPlaying(false)
        setShowIndicator(false)
      }, 3000)
    }).catch((err) => {
      console.log('Audio autoplay prevented or file not available:', err)
      // Mark as played to avoid repeated attempts
      localStorage.setItem('audioWelcomePlayed', 'true')
      setHasPlayed(true)
    })
  }, [hasPlayed])

  useEffect(() => {
    if (!mounted) return

    // Check if already played this session
    const played = localStorage.getItem('audioWelcomePlayed')
    if (played) {
      setHasPlayed(true)
      return
    }

    // Listen for terminal boot complete event
    const handleBootComplete = () => {
      // Wait a moment for user to orient
      setTimeout(() => {
        playWelcomeAudio()
      }, 1500) // 1.5 seconds delay
    }

    window.addEventListener('terminal-boot-complete', handleBootComplete)

    return () => {
      window.removeEventListener('terminal-boot-complete', handleBootComplete)
    }
  }, [mounted, playWelcomeAudio])

  if (!mounted) {
    return null
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/welcome-message.mp3"
        preload="none"
        onError={(e) => {
          console.log('Audio file not available or failed to load')
          // Mark as played to avoid repeated attempts
          localStorage.setItem('audioWelcomePlayed', 'true')
          setHasPlayed(true)
        }}
      />

      {/* Visual indicator when playing */}
      {isPlaying && (
        <div className="fixed top-24 right-4 z-[9998] flex items-center gap-2 px-4 py-2 bg-accent-primary/20 backdrop-blur-sm border border-accent-primary rounded-full animate-pulse">
          <Play className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-mono text-accent-primary">Welcome message playing...</span>
        </div>
      )}
    </>
  )
}
