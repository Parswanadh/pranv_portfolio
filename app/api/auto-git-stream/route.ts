import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters } from '@/lib/rate-limiter'
import { getClientIP, getSecurityHeaders } from '@/lib/security-utils'

export const runtime = 'edge'

/**
 * AUTO-GIT Real-time Streaming API
 *
 * This endpoint provides real-time streaming of AUTO-GIT agent activities.
 * For demonstration purposes, this returns simulated data.
 *
 * In production, this would connect to the actual AUTO-GIT backend
 * and stream real-time logs from the multi-agent system.
 */

interface AgentLog {
  agent: string
  message: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface StreamEvent {
  type: 'log' | 'progress' | 'complete' | 'error'
  data: AgentLog | { progress: number } | { repoUrl: string } | { error: string }
}

// Simulated agent workflow
const SIMULATED_WORKFLOW = [
  { agent: 'Orchestrator', message: 'Initializing AUTO-GIT system...', type: 'info' as const },
  { agent: 'PaperScout', message: 'Searching arXiv for papers...', type: 'info' as const },
  { agent: 'PaperScout', message: 'Found 127 relevant papers', type: 'info' as const },
  { agent: 'PaperScout', message: 'Selected: "Attention Is All You Need"', type: 'success' as const },
  { agent: 'Researcher', message: 'Extracting methodology from PDF...', type: 'info' as const },
  { agent: 'Researcher', message: 'Found: Self-Attention mechanism', type: 'info' as const },
  { agent: 'Researcher', message: 'Found: Multi-Head Attention', type: 'info' as const },
  { agent: 'Researcher', message: 'Found: Position Encoding', type: 'success' as const },
  { agent: 'Planner', message: 'Planning software architecture...', type: 'info' as const },
  { agent: 'Planner', message: 'Tech stack: PyTorch + Transformers', type: 'info' as const },
  { agent: 'Planner', message: 'Architecture plan complete', type: 'success' as const },
  { agent: 'Coder', message: 'Generating model code...', type: 'info' as const },
  { agent: 'Coder', message: 'Writing attention modules...', type: 'info' as const },
  { agent: 'Coder', message: 'Creating training script...', type: 'info' as const },
  { agent: 'Coder', message: 'Code generation complete: 15 files', type: 'success' as const },
  { agent: 'Validator', message: 'Running syntax checks...', type: 'info' as const },
  { agent: 'Validator', message: 'Running unit tests...', type: 'info' as const },
  { agent: 'Validator', message: 'Test coverage: 87%', type: 'info' as const },
  { agent: 'Validator', message: 'All tests passed!', type: 'success' as const },
  { agent: 'Orchestrator', message: 'Creating GitHub repository...', type: 'info' as const },
  { agent: 'Orchestrator', message: 'Repository created: auto-git-repo-123', type: 'success' as const },
]

export async function GET(request: NextRequest) {
  // Rate limiting check with improved IP extraction
  const ip = getClientIP(request)
  const rateLimitResult = rateLimiters.strict.check(ip)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many connections. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          ...getSecurityHeaders(),
          'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
        },
      }
    )
  }

  // Configure CORS with stricter allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3002',
    // Add your production domains here
    // 'https://yourdomain.com',
  ]

  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/event-stream')
  responseHeaders.set('Cache-Control', 'no-cache')
  responseHeaders.set('Connection', 'keep-alive')

  // Set CORS header only for allowed origins (strict CORS policy)
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    responseHeaders.set('Access-Control-Allow-Origin', origin)
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
    responseHeaders.set('Access-Control-Max-Age', '86400') // 24 hours
  } else if (origin) {
    // Origin is present but not in allowed list - reject the request
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403, headers: getSecurityHeaders() }
    )
  }

  // Add security headers
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    responseHeaders.set(key, value as string)
  })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let currentIndex = 0

      const sendEvent = (event: StreamEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(encoder.encode(data))
      }

      // Send initial connection message
      sendEvent({
        type: 'log',
        data: {
          agent: 'System',
          message: 'Connected to AUTO-GIT stream',
          timestamp: new Date().toISOString(),
          type: 'info',
        },
      })

      // Stream logs with delays to simulate real-time processing
      const streamInterval = setInterval(() => {
        if (currentIndex >= SIMULATED_WORKFLOW.length) {
          // Send completion event
          sendEvent({
            type: 'complete',
            data: {
              repoUrl: 'https://github.com/balcha/auto-git-repo-123',
            },
          })
          clearInterval(streamInterval)
          controller.close()
          return
        }

        const log = SIMULATED_WORKFLOW[currentIndex]
        sendEvent({
          type: 'log',
          data: {
            ...log,
            timestamp: new Date().toISOString(),
          },
        })

        // Send progress update
        const progress = ((currentIndex + 1) / SIMULATED_WORKFLOW.length) * 100
        sendEvent({
          type: 'progress',
          data: { progress },
        })

        currentIndex++
      }, 1000) // Send a new log every second

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(streamInterval)
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      ...Object.fromEntries(responseHeaders.entries()),
      'X-RateLimit-Limit': String(rateLimitResult.limit),
      'X-RateLimit-Remaining': String(rateLimitResult.remaining),
    },
  })
}

/**
 * Integration Example:
 *
 * ```tsx
 * 'use client'
 *
 * import { useEffect, useState } from 'react'
 *
 * function AutoGitStream() {
 *   const [logs, setLogs] = useState([])
 *
 *   useEffect(() => {
 *     const eventSource = new EventSource('/api/auto-git-stream')
 *
 *     eventSource.onmessage = (event) => {
 *       const data = JSON.parse(event.data)
 *       if (data.type === 'log') {
 *         setLogs(prev => [...prev, data.data])
 *       }
 *     }
 *
 *     return () => eventSource.close()
 *   }, [])
 *
 *   return (
 *     <div>
 *       {logs.map((log, i) => (
 *         <div key={i}>[{log.agent}] {log.message}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
