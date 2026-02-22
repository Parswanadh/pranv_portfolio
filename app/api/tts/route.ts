import { NextRequest, NextResponse } from 'next/server'
import { textToSpeech } from '@/lib/deepgram'
import { optimizeForVoice } from '@/lib/voice-optimizer'
import { rateLimiters } from '@/lib/rate-limiter'
import { getClientIP, getSecurityHeaders } from '@/lib/security-utils'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check with improved IP extraction
    const ip = getClientIP(request)
    const rateLimitResult = rateLimiters.strict.check(ip)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      )
    }

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const { text, voice } = body

    // Input validation
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Input length validation (DoS prevention)
    const MAX_TEXT_LENGTH = 5000
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.` },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Trim whitespace to prevent abuse with whitespace-only inputs
    const trimmedText = text.trim()
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty or whitespace only' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate voice parameter if provided
    if (voice !== undefined && typeof voice !== 'string') {
      return NextResponse.json(
        { error: 'Voice parameter must be a string' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Check for suspicious patterns (potential injection attacks)
    const suspiciousPatterns = /<script|javascript:|onerror|onload|onclick/i
    if (suspiciousPatterns.test(text)) {
      console.warn('Suspicious input detected in TTS:', { ip, text: text.substring(0, 100) })
      return NextResponse.json(
        { error: 'Invalid text content' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Optimize text before sending to Deepgram for natural speech
    const optimizedText = optimizeForVoice(trimmedText, {
      maxBreathUnitLength: 150,  // Shorter for slower, more deliberate speech
      addThinkingPauses: false,
      expandAcronyms: true,
      useConversationalStyle: true,
      enableParagraphPauses: true,
    })

    const audioBuffer = await textToSpeech({
      text: optimizedText,
      voice,
    })

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
        'X-RateLimit-Limit': String(rateLimitResult.limit),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        ...getSecurityHeaders(),
      },
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      {
        error: 'TTS request failed',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      {
        status: 500,
        headers: getSecurityHeaders(),
      }
    )
  }
}
