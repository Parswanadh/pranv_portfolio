'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { usePathname, useRouter } from 'next/navigation'
import { MessageCircle, X, Send, Volume2, VolumeX, Sparkles, ArrowRight, RotateCcw } from 'lucide-react'
import { optimizeForVoice } from '@/lib/voice-optimizer'
import { getContextualSystemPrompt } from '@/lib/page-context'
import { detectNavigationIntent, shouldNavigate } from '@/lib/navigation-intent'
import {
  getSession,
  addMessageToSession,
  getPreferences,
  savePreferences,
  getConversationHistory,
  addToNavigationHistory,
  clearMessages,
  resetSession,
  getSessionInfo,
  getConversationSummary,
} from '@/lib/iris-session'
import {
  getDynamicGreeting,
  getContextualSuggestions,
  getTopicBasedSuggestions,
  getPageName,
} from '@/lib/proactive-suggestions'
import type { Suggestion } from '@/lib/proactive-suggestions'
import { FolderOpen, FileText, Mail, Sparkles as SparklesIcon } from 'lucide-react'
import { TypingIndicator } from '@/components/skeletons/LoadingSkeleton'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
  suggestion?: {
    text: string
    prompt: string
    action: 'navigate'
    target?: string
  }
}

type SpeakingState = 'idle' | 'listening' | 'processing' | 'reasoning' | 'speaking'

// Example questions for onboarding
const EXAMPLE_QUESTIONS: Suggestion[] = [
  { text: 'What are Pranav\'s top skills?', action: 'chat', prompt: 'What are Pranav\'s top skills?' },
  { text: 'Tell me about PRO_CODE', action: 'chat', prompt: 'Tell me about PRO_CODE' },
  { text: 'What is AUTO-GIT?', action: 'chat', prompt: 'What is AUTO-GIT?' },
  { text: 'Show me Pranav\'s AI projects', action: 'chat', prompt: 'Show me Pranav\'s AI projects' },
  { text: 'How can I contact Pranav?', action: 'chat', prompt: 'How can I contact Pranav?' },
]

// Quick action buttons for navigation
const QUICK_ACTIONS = [
  { label: 'View Projects', path: '/projects', icon: FolderOpen },
  { label: 'Download Resume', path: '/resume', icon: FileText },
  { label: 'Get in Touch', path: '/contact', icon: Mail },
]

const BASE_IRIS_SYSTEM_PROMPT = `You are Iris, Pranav's friendly A.I. voice assistant.

CRITICAL - PRONOUN INTERPRETATION:
When users ask "What are your..." or use "you/your", ALWAYS answer about PRANAV, NOT about yourself as an AI.
Examples:
- "What are your top skills?" → Answer with Pranav's skills (Generative AI, Embedded Systems, etc.)
- "What projects have you built?" → Answer about Pranav's projects
- "Tell me about your background" → Answer about Pranav's education and experience
You are Pranav's VOICE - you speak FOR him, not about yourself.

SPEAK NATURALLY - Be brief and conversational:
- 2-3 sentences MAX per response
- Use casual words: oh, hmm, right, gotcha, plus, so
- Add commas for natural breathing pauses
- End with "Want me to explain more?" if topic is complex

About Pranav:
B.Tech at Amrita Vishwa Vidyapeetham, Bangalore. Builds AI tools like PRO_CODE (local coding assistant), AUTO-GIT (star project), GPT-OSS Vision (multimodal research), and Parshu-STT (voice transcription).

PRANAV'S TOP SKILLS (answer these when asked about "your skills"):
• Generative AI & LLMs - Local models, RAG, prompt engineering
• Embedded Systems - Microcontrollers, IoT, firmware development
• Computer Vision - Image processing, multimodal AI, satellite imagery
• Robotics & Automation - Autonomous systems, multi-agent orchestration

PROJECTS - Key Details:
• PRO_CODE: Local AI coding assistant using Ollama models and ChromaDB for privacy-focused development. Leverages Gemini CLI tools for code generation.
• AUTO-GIT (STAR PROJECT): Multi-agent system using multiple local LLMs running in parallel (no API). Give it a research task, it autonomously researches, implements, and auto-pushes to GitHub. Features orchestrator agent for planning and self-correction to ensure error-free execution.
• GPT-OSS Vision: Research project integrating Q-Former with GPT-OSS for satellite imagery. MAJOR FAILURES: training instability, Q-Former wouldn't converge after 100+ epochs, adapter layer failures, domain overfitting on satellite data, single-GPU memory leaks, frozen LLM bottleneck preventing end-to-end optimization. NOT production-ready - valuable research failure.
• Parshu-STT: Windows voice transcription tool with global hotkey. Listens to voice and auto-pastes at cursor. Custom commands: "nextline" and "and" convert during transcription.
• CLI-Tour: Terminal-based AI assistant for project management

ACCURACY: Only mention projects above. Education is Amrita (NOT Stevens, NOT JNTU).

Be brief. Speak slowly. One topic at a time.`

// Memoized message item component with navigation suggestion support
const MessageItem = memo(({ msg, onSuggestionClick }: { msg: Message; onSuggestionClick?: (suggestion: Message['suggestion']) => void }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className="flex flex-col max-w-[85%]">
      <div
        className={`p-3 rounded-lg ${
          msg.role === 'user'
            ? 'bg-accent-primary text-bg-primary'
            : 'bg-background-elevated text-text-primary'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
      {msg.suggestion && msg.role === 'assistant' && onSuggestionClick && (
        <button
          onClick={() => onSuggestionClick(msg.suggestion)}
          className="mt-2 ml-3 px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs rounded hover:bg-accent-primary/20 transition-colors flex items-center gap-2 self-start"
        >
          {msg.suggestion.text}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
))
MessageItem.displayName = 'MessageItem'



export default function IrisAssistant() {
  const pathname = usePathname()
  const router = useRouter()

  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [sessionInfo, setSessionInfo] = useState(getSessionInfo)

  // User Preferences
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const assistantMessageIndexRef = useRef<number>(-1)

  // Handle client-side mounting to prevent hydration errors
  // Split into two effects: mounting (runs once) and pathname-dependent (runs on navigation)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const prefs = getPreferences()
    setSoundEnabled(prefs.soundEnabled)

    // Track navigation
    if (pathname) {
      addToNavigationHistory(pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted])

  // Load conversation history (only on initial mount) - separate effect to avoid dependency issues
  useEffect(() => {
    if (!mounted) return

    // Load conversation history only on initial mount
    if (messages.length === 0) {
      const history = getConversationHistory(10)
      if (history.length > 0) {
        setMessages(history)
      } else {
        // First visit - dynamic greeting
        setMessages([{
          role: 'assistant',
          content: getDynamicGreeting(),
          timestamp: Date.now(),
        }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // Update suggestions when page changes or messages change
  useEffect(() => {
    // Show example questions on first visit, otherwise show contextual suggestions
    if (messages.length <= 1) {
      setSuggestions(EXAMPLE_QUESTIONS)
    } else {
      setSuggestions(getContextualSuggestions(pathname || '/'))
    }
  }, [pathname, messages.length])

  // Update session info every 30 seconds
  useEffect(() => {
    if (!mounted) return

    const updateInfo = () => setSessionInfo(getSessionInfo())

    // Update immediately
    updateInfo()

    // Then update every 30 seconds
    const interval = setInterval(updateInfo, 30000)

    return () => clearInterval(interval)
  }, [mounted, messages.length])

  // Custom event listener
  useEffect(() => {
    const handleOpenIris = () => setIsOpen(true)
    window.addEventListener('open-iris', handleOpenIris)
    return () => window.removeEventListener('open-iris', handleOpenIris)
  }, [])

  // Handle iris-question event from command palette
  useEffect(() => {
    const handleIrisQuestion = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsOpen(true)
      setInput(customEvent.detail || '')
    }
    window.addEventListener('iris-question', handleIrisQuestion)
    return () => window.removeEventListener('iris-question', handleIrisQuestion)
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Speaking state from audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setSpeakingState('speaking')
    const handlePause = () => setSpeakingState('idle')
    const handleEnded = () => {
      setSpeakingState('idle')
      // Execute pending navigation after audio completes
      if (pendingNavigation) {
        router.push(pendingNavigation)
        setPendingNavigation(null)
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
  }, [pendingNavigation, router])

  // Save preference change
  const updateSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled)
    savePreferences({ soundEnabled: enabled })
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => {
      const updated: Message[] = [
        ...prev,
        { role: 'user', content: userMessage, timestamp: Date.now() },
        { role: 'assistant', content: '', timestamp: Date.now() }
      ]
      // Store the index where assistant message will be added (last index)
      assistantMessageIndexRef.current = updated.length - 1
      return updated
    })
    setIsLoading(true)
    setSpeakingState('processing')

    // Detect navigation intent EARLY
    const navIntent = detectNavigationIntent(userMessage)

    try {
      // Get contextual system prompt
      const systemPrompt = getContextualSystemPrompt(BASE_IRIS_SYSTEM_PROMPT, pathname || '/')
      const session = getSession()

      // Call streaming API with full context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...getConversationHistory(10),
            { role: 'user', content: userMessage }
          ],
          context: {
            topicsDiscussed: session.topicsDiscussed,
            currentPage: pathname,
            navigationHistory: session.navigationHistory,
            sessionDuration: Date.now() - session.startTime,
          }
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      // Read the streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response is not readable')
      }

      const decoder = new TextDecoder()
      let fullMessage = ''
      let buffer = ''
      let isDone = false

      // STEP 1: Collect complete message from stream
      while (!isDone) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Process all complete lines except the last one (may be incomplete)
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              isDone = true
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullMessage += parsed.content
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }

        // Keep the last potentially incomplete line in buffer
        buffer = lines[lines.length - 1]
      }

      // STEP 2: Generate TTS for complete message
      const optimizedMessage = optimizeForVoice(fullMessage, {
        maxBreathUnitLength: 150,  // Shorter = slower, more deliberate speech
        addThinkingPauses: false,
        expandAcronyms: true,
        useConversationalStyle: true,
        enableParagraphPauses: true,
      })

      // Save to session
      addMessageToSession('user', userMessage, pathname || "/")
      addMessageToSession('assistant', fullMessage, pathname || "/")

      setIsLoading(false)

      // STEP 3: Start BOTH audio and text display at the same time
      if (soundEnabled && optimizedMessage) {
        setSpeakingState('speaking')
        // Don't await - let audio play in background
        playAudio(optimizedMessage)
      }

      // Stream text display with BATCHED updates (optimized)
      const chars = fullMessage.split('')
      const BATCH_SIZE = 5 // Update every 5 characters instead of 1
      
      for (let i = 0; i < chars.length; i += BATCH_SIZE) {
        const nextIndex = Math.min(i + BATCH_SIZE, chars.length)
        const displayedText = chars.slice(0, nextIndex).join('')
        
        setMessages(prev => {
          const updated = [...prev]
          updated[assistantMessageIndexRef.current] = {
            role: 'assistant',
            content: displayedText,
            timestamp: Date.now()
          }
          return updated
        })

        // Smooth typing effect (delay per batch)
        if (i < chars.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 15))
        }
      }

      setSpeakingState('idle')

      // Handle navigation - CONSENSUAL approach
      const navDecision = shouldNavigate(navIntent, pathname || "/")
      if (navIntent.target && navIntent.confidence >= 50 && !navDecision.shouldNavigate) {
        // Add navigation suggestion to the message (consensual - user clicks to navigate)
        setMessages(prev => {
          const updated = [...prev]
          updated[assistantMessageIndexRef.current] = {
            ...updated[assistantMessageIndexRef.current],
            suggestion: navIntent.suggestion
          }
          return updated
        })
      } else if (navDecision.shouldNavigate && navIntent.target) {
        // EXPLICIT command - auto-navigate after audio
        if (soundEnabled) {
          setPendingNavigation(navIntent.target)
        } else {
          setTimeout(() => {
            router.push(navIntent.target!)
          }, 500)
        }
      }

    } catch (error) {
      console.error('Error:', error)

      // Simple fallback responses based on keywords
      const lowerMessage = userMessage.toLowerCase()
      let fallbackResponse = "I'm having trouble connecting to my AI backend right now. Please try again later."

      if (lowerMessage.includes('skill') || lowerMessage.includes('what are you')) {
        fallbackResponse = "Pranav's top skills include:\n\n• Generative AI & LLMs\n• Embedded Systems\n• Computer Vision\n• Robotics & Automation\n• IoT & Hardware Design"
      } else if (lowerMessage.includes('project')) {
        fallbackResponse = "Pranav has worked on several exciting projects including PRO_CODE (local AI coding assistant), AUTO-GIT (autonomous multi-agent system), GPT-OSS Vision (multimodal AI research), and Parshu-STT (voice transcription tool). Check out the Projects page for details!"
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
        fallbackResponse = "You can reach Pranav at prnvamara@gmail.com or use the Contact form on this website."
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        fallbackResponse = "Hello! I'm Iris, Pranav's AI assistant. How can I help you today?"
      } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
        fallbackResponse = "You can download Pranav's resume from the Resume page in the navigation menu."
      }

      setMessages(prev => {
        const updated = [...prev]
        // Remove the placeholder message
        if (updated[assistantMessageIndexRef.current]?.content === '') {
          updated.splice(assistantMessageIndexRef.current, 1)
        }
        // Add fallback response
        updated.push({
          role: 'assistant',
          content: fallbackResponse,
          timestamp: Date.now()
        })
        return updated
      })
      setIsLoading(false)
      setSpeakingState('idle')
    }
  }

  const playAudio = async (text: string) => {
    try {
      // Split by paragraph breaks (double newline) for chunked playback
      // This creates actual pauses between topics
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim())

      if (paragraphs.length === 0) return

      // Play each paragraph sequentially with delay between
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

        if (!response.ok) {
          throw new Error('TTS request failed')
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        // Play this paragraph
        if (audioRef.current) {
          await new Promise<void>((resolve, reject) => {
            const audio = audioRef.current!

            // Set up ended listener for this chunk
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

          // Add natural pause between paragraphs (1200ms = 1.2s)
          // Only add pause if there are more paragraphs to play
          if (i < paragraphs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1200))
          }
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion | Message['suggestion']) => {
    // Handle navigation suggestions from messages
    if (suggestion && 'action' in suggestion && suggestion.action === 'navigate') {
      if ('target' in suggestion && suggestion.target) {
        router.push(suggestion.target)
      } else if ('prompt' in suggestion && suggestion.prompt) {
        // Extract target from the prompt or navigate based on text
        const promptLower = suggestion.prompt.toLowerCase()
        if (promptLower.includes('project')) router.push('/projects')
        else if (promptLower.includes('agent')) router.push('/agents')
        else if (promptLower.includes('about') || promptLower.includes('pranav')) router.push('/about')
        else if (promptLower.includes('contact') || promptLower.includes('touch')) router.push('/contact')
        else if (promptLower.includes('research') || promptLower.includes('paper')) router.push('/research')
        else if (promptLower.includes('leadership') || promptLower.includes('vyom')) router.push('/leadership')
        else if (promptLower.includes('tool')) router.push('/tools')
        else if (promptLower.includes('resume') || promptLower.includes('cv')) router.push('/resume')
        else if (promptLower.includes('home')) router.push('/')
        else {
          // Default: populate input with the prompt
          setInput(suggestion.prompt)
        }
      }
      return
    }

    // Handle regular suggestions
    if (!suggestion) return
    if (suggestion.action === 'navigate' && suggestion.target) {
      router.push(suggestion.target)
    } else {
      setInput(suggestion.prompt || suggestion.text)
    }
  }

  const getSpeakingStateText = () => {
    switch (speakingState) {
      case 'idle': return 'Ready to help'
      case 'listening': return 'Listening...'
      case 'processing': return 'Thinking...'
      case 'reasoning': return 'Formulating response...'
      case 'speaking': return 'Speaking...'
      default: return 'Ready'
    }
  }

  const handleClearConversation = () => {
    if (sessionInfo.hasHistory) {
      setShowClearConfirm(true)
    } else {
      clearMessages()
      setMessages([{
        role: 'assistant',
        content: getDynamicGreeting(),
        timestamp: Date.now(),
      }])
      setSessionInfo(getSessionInfo())
    }
  }

  const confirmClearConversation = () => {
    clearMessages()
    setMessages([{
      role: 'assistant',
      content: getDynamicGreeting(),
      timestamp: Date.now(),
    }])
    setShowClearConfirm(false)
    setSessionInfo(getSessionInfo())
  }

  const handleNewSession = () => {
    const newSession = resetSession()
    setMessages([{
      role: 'assistant',
      content: getDynamicGreeting(),
      timestamp: Date.now(),
    }])
    setSessionInfo(getSessionInfo())
    setShowClearConfirm(false)
  }

  const handleDismissConfirm = () => {
    setShowClearConfirm(false)
  }

  // Update suggestions based on topics when messages change
  useEffect(() => {
    if (messages.length > 2 && sessionInfo.topics.length > 0) {
      const topicSuggestions = getTopicBasedSuggestions(sessionInfo.topics)
      setSuggestions(topicSuggestions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, sessionInfo.topics.length, sessionInfo.topics])

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('[IrisAssistant] Error caught:', error)
        console.error('Component stack:', errorInfo.componentStack)
      }}
    >
      <>
        {/* Floating Toggle Button */}
        {!isOpen && mounted && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-[99999] flex items-center justify-center bg-accent-primary text-bg-primary rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer focus:ring-2 focus:ring-accent-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-bg-primary active:scale-95 touch-manipulation"
            aria-label="Chat with Iris"
            style={{
              width: '56px',
              height: '56px',
            }}
          >
            <MessageCircle className="w-6 h-6" strokeWidth={2} />
          </button>
        )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 z-[99999] w-auto md:w-96 max-h-[60vh] md:max-h-[600px] max-w-full bg-bg-primary border border-border-default rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                  <span className="text-white font-bold">I</span>
                </div>
                {speakingState !== 'idle' && (
                  <div className="absolute -bottom-0.5 -right-0.5 flex items-end gap-0.5 h-3">
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-accent-primary rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.05}s`, height: `${6 + Math.random() * 6}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-text-primary flex items-center gap-2 text-sm">
                    Iris
                    {speakingState === 'speaking' && (
                      <Sparkles className="w-3 h-3 text-accent-primary animate-pulse" />
                    )}
                  </h3>
                  <button
                    onClick={handleClearConversation}
                    className="min-h-[32px] flex items-center gap-1 px-2 py-1 text-xs text-accent-primary hover:text-accent-secondary transition-colors flex-shrink-0 rounded hover:bg-background-elevated touch-manipulation"
                    title="Start new chat"
                  >
                    <RotateCcw className="w-3 h-3" />
                    New Chat
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary mt-0.5">
                  <span>{getSpeakingStateText()}</span>
                  {sessionInfo.hasHistory && (
                    <>
                      <span className="text-border-default">•</span>
                      <span className="truncate" title={`Session started: ${sessionInfo.durationText}`}>
                        {sessionInfo.durationText}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateSoundEnabled(!soundEnabled)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-background-elevated rounded transition-colors touch-manipulation"
                aria-label={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-background-elevated rounded transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Session Info Bar */}
          {sessionInfo.hasHistory && (
            <div className="px-4 py-2 bg-background-tertiary border-b border-border-default">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">On:</span>
                  <span className="font-mono text-accent-primary">{getPageName(pathname || '/')}</span>
                </div>
                {sessionInfo.topics.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Discussing:</span>
                    <span className="text-text-tertiary">{getConversationSummary()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showClearConfirm && (
            <div className="px-4 py-3 bg-background-tertiary border-b border-border-default">
              <p className="text-sm text-text-primary mb-3">
                Clear conversation and start fresh?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={confirmClearConversation}
                  className="px-3 py-1.5 bg-accent-primary text-bg-primary text-xs rounded hover:opacity-90 transition-opacity"
                >
                  Clear conversation
                </button>
                <button
                  onClick={handleNewSession}
                  className="px-3 py-1.5 bg-background-elevated text-text-primary text-xs rounded hover:bg-background-primary transition-colors border border-border-default"
                >
                  Start new session
                </button>
                <button
                  onClick={handleDismissConfirm}
                  className="px-3 py-1.5 text-text-tertiary text-xs rounded hover:text-text-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* Onboarding Section - Show on first visit */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-4">
                {/* Capabilities Section */}
                <div className="bg-background-elevated rounded-lg p-4 border border-border-default">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-accent-primary" />
                    <h4 className="text-sm font-semibold text-text-primary">What can I do?</h4>
                  </div>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="flex items-start gap-2">
                      <span className="text-accent-primary mt-0.5">•</span>
                      <span>Explore projects like <span className="text-accent-primary font-mono">PRO_CODE</span> and <span className="text-accent-primary font-mono">AUTO-GIT</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent-primary mt-0.5">•</span>
                      <span>Answer questions about skills and experience</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent-primary mt-0.5">•</span>
                      <span>Guide you to different sections of the portfolio</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent-primary mt-0.5">•</span>
                      <span>Tell you about research and leadership work</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-background-elevated rounded-lg p-4 border border-border-default">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={action.path}
                          onClick={() => router.push(action.path)}
                          className="flex flex-col items-center gap-1.5 p-3 bg-background-tertiary rounded-lg hover:bg-background-primary hover:border-accent-primary border border-transparent transition-all group"
                        >
                          <Icon className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" />
                          <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors text-center">
                            {action.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Example Questions */}
                <div>
                  <p className="text-xs text-text-tertiary font-mono mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_QUESTIONS.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(suggestion.prompt || suggestion.text)}
                        className="px-3 py-1.5 bg-background-elevated text-text-secondary text-xs font-mono rounded-full hover:bg-background-tertiary hover:text-accent-primary transition-colors border border-border-default hover:border-accent-primary/50"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageItem key={i} msg={msg} onSuggestionClick={handleSuggestionClick} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background-elevated p-3 rounded-lg flex items-center gap-2">
                  <TypingIndicator />
                  <p className="text-sm text-text-tertiary">Iris is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && messages.length > 1 && (
            <div className="px-4 py-2 border-t border-border-default">
              <p className="text-xs text-text-tertiary font-mono mb-2">Suggested:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-2 py-1 bg-background-tertiary text-text-secondary rounded hover:bg-background-elevated transition-colors flex items-center gap-1"
                  >
                    {(suggestion.prompt || suggestion.text).length > 25
                      ? (suggestion.prompt || suggestion.text).substring(0, 25) + '...'
                      : (suggestion.prompt || suggestion.text)}
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border-default bg-bg-secondary">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="Ask Iris anything..."
                className="flex-1 px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 text-base text-text-primary placeholder:text-text-tertiary leading-normal"
                disabled={isLoading}
                style={{
                  direction: 'ltr',
                  writingMode: 'horizontal-tb',
                  textOrientation: 'mixed',
                  letterSpacing: 'normal',
                  wordSpacing: 'normal',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-accent-primary text-bg-primary rounded-lg hover:opacity-90 disabled:opacity-50 focus:ring-2 focus:ring-accent-primary focus:outline-none transition-opacity"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} />
        </div>
      )}
      </>
    </ErrorBoundary>
  )
}
