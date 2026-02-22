import { NextRequest, NextResponse } from 'next/server'
import { searchContent } from '@/lib/embeddings'
import { rateLimiters } from '@/lib/rate-limiter'
import { getClientIP, getSecurityHeaders, detectXSSPatterns } from '@/lib/security-utils'

export async function GET(request: NextRequest) {
  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  const rateLimit = rateLimiters.moderate.check(ip)
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many searches. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // Input validation
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] }, { status: 400 })
  }

  // Query length validation (DoS prevention)
  const MAX_QUERY_LENGTH = 200
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Query is too long. Maximum ${MAX_QUERY_LENGTH} characters allowed.` },
      { status: 400 }
    )
  }

  try {
    const results = await searchContent(query, 10)

    return NextResponse.json({
      results,
      count: results.length,
      query,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  const rateLimit = rateLimiters.moderate.check(ip)
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many searches. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const body = await request.json()
    const { query, limit = 10 } = body

    // Input validation
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] }, { status: 400 })
    }

    // Query length validation (DoS prevention)
    const MAX_QUERY_LENGTH = 200
    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Query is too long. Maximum ${MAX_QUERY_LENGTH} characters allowed.` },
        { status: 400 }
      )
    }

    // Limit validation
    if (limit && (typeof limit !== 'number' || limit < 1 || limit > 50)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      )
    }

    const results = await searchContent(query, limit)

    return NextResponse.json({
      results,
      count: results.length,
      query,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
