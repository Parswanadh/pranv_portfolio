import { NextRequest } from 'next/server'
import { streamMessages } from '@/lib/groq'
import { rateLimiters } from '@/lib/rate-limiter'
import { getClientIP, getSecurityHeaders, detectXSSPatterns } from '@/lib/security-utils'

export async function OPTIONS(request: NextRequest) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3002',
  ]

  const origin = request.headers.get('origin')

  return new Response(null, {
    status: 200,
    headers: {
      ...(origin && allowedOrigins.includes(origin)
        ? { 'Access-Control-Allow-Origin': origin }
        : {}),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...getSecurityHeaders(),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check with improved IP extraction
    const ip = getClientIP(request)
    const rateLimitResult = rateLimiters.strict.check(ip)

    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            ...getSecurityHeaders(),
          },
        }
      )
    }

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages, context } = body

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate messages array length (DoS prevention)
    const MAX_MESSAGES = 100
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum ${MAX_MESSAGES} messages allowed.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate each message
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      if (!msg || typeof msg !== 'object') {
        return new Response(
          JSON.stringify({ error: `Message at index ${i} is invalid` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...getSecurityHeaders() } }
        )
      }
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: `Message at index ${i} missing required fields: role, content` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...getSecurityHeaders() } }
        )
      }
      if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: `Message content at index ${i} cannot be empty` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...getSecurityHeaders() } }
        )
      }
      // Message content length validation
      const MAX_CONTENT_LENGTH = 4000
      if (msg.content.length > MAX_CONTENT_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Message content at index ${i} is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...getSecurityHeaders() } }
        )
      }

      // Check for XSS/injection patterns in message content
      if (detectXSSPatterns(msg.content)) {
        console.warn('XSS attempt detected in chat message:', {
          ip,
          messageIndex: i,
          content: msg.content.substring(0, 100),
        })
        return new Response(
          JSON.stringify({ error: `Invalid content detected in message at index ${i}` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...getSecurityHeaders() } }
        )
      }
    }

    let enhancedMessages = [...messages]

    // Inject context into system message if provided
    if (context) {
      try {
        const systemMsgIdx = enhancedMessages.findIndex(m => m.role === 'system')

        if (systemMsgIdx >= 0) {
          const contextString = `

CONVERSATION CONTEXT:
Topics discussed: ${context.topicsDiscussed && context.topicsDiscussed.length > 0 ? context.topicsDiscussed.join(', ') : 'None yet'}
Current page: ${context.currentPage || 'Home'}
Navigation history: ${context.navigationHistory && context.navigationHistory.length > 0 ? context.navigationHistory.join(' → ') : 'Home'}
Session duration: ${context.sessionDuration ? Math.floor(context.sessionDuration / 60000) + ' minutes' : '0 minutes'}`

          enhancedMessages[systemMsgIdx] = {
            ...enhancedMessages[systemMsgIdx],
            content: enhancedMessages[systemMsgIdx].content + contextString
          }
        }
      } catch (contextError) {
        console.error('Context injection error:', contextError)
        // Continue without context if injection fails
      }
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamMessages(enhancedMessages)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (streamError) {
          console.error('Streaming error:', streamError)
          // Send error message to client
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Limit': String(rateLimitResult.limit),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        ...getSecurityHeaders(),
      },
    })
  } catch (error) {
    console.error('GROQ API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getSecurityHeaders(),
        },
      }
    )
  }
}
