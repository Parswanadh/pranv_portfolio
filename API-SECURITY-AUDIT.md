# API Security Audit & Quick Fixes

**Date:** 2026-01-27
**Auditor:** Backend Developer Agent
**Scope:** All API endpoints in portfolio application

---

## Critical Security Issues

### 1. TTS Endpoint Missing Rate Limiting (CRITICAL)
**File:** `app/api/tts/route.ts`
**Risk:** API abuse, cost overrun, service degradation

**Current State:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json()
    // No rate limiting!
    const audioBuffer = await textToSpeech({ text, voice })
    // ...
  }
}
```

**Fix Required:**
```typescript
// Add at top of file
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_REQUESTS = 10
const RATE_LIMIT_WINDOW_MS = 60000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (limit.count >= RATE_LIMIT_REQUESTS) {
    return false
  }
  limit.count++
  return true
}

// Add in POST handler
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  // ... rest of code
}
```

---

### 2. XSS Protection Incomplete (HIGH)
**File:** `app/api/contact/route.ts`
**Risk:** Cross-site scripting if contact data is displayed unsafely

**Current State:**
```typescript
const sanitizedName = name.trim().slice(0, 100)
const sanitizedEmail = email.trim().slice(0, 255)
// Only trim/slice - no HTML encoding!
```

**Fix Required:**
```typescript
// Install: npm install html-entities
import { encode } from 'html-entities'

const sanitizedName = encode(name.trim().slice(0, 100))
const sanitizedEmail = encode(email.trim().slice(0, 255))
const sanitizedSubject = encode(subject.trim().slice(0, 200))
const sanitizedMessage = encode(message.trim().slice(0, 500))
```

---

### 3. IP Spoofing Vulnerability (MEDIUM)
**Files:** All API routes
**Risk:** Rate limiting can be bypassed

**Current State:**
```typescript
const ip = request.headers.get('x-forwarded-for') || 'unknown'
// Can be easily spoofed!
```

**Fix Required:**
```typescript
function getClientIP(request: NextRequest): string {
  // Check multiple headers, in order of reliability
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')

  if (forwarded) {
    // Take first IP from forwarded chain
    return forwarded.split(',')[0].trim()
  }

  return realIP || cfIP || 'unknown'
}
```

---

### 4. CORS Too Permissive (MEDIUM)
**File:** `app/api/auto-git-stream/route.ts`
**Risk:** Any origin can access the endpoint

**Current State:**
```typescript
return new NextResponse(stream, {
  headers: {
    'Access-Control-Allow-Origin': '*', // Too open!
  }
})
```

**Fix Required:**
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://yourdomain.com', // Add your production domain
]

const origin = request.headers.get('origin')
const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

return new NextResponse(stream, {
  headers: {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
  }
})
```

---

## Performance Issues

### 5. Search Results Not Cached (MEDIUM)
**File:** `app/api/search/route.ts`
**Impact:** Unnecessary re-computation

**Fix Required:**
```typescript
const searchCache = new Map<string, { results: any[], timestamp: number }>()
const CACHE_TTL = 300000 // 5 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // Check cache
  const cached = searchCache.get(query)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({
      results: cached.results,
      count: cached.results.length,
      query,
      cached: true
    })
  }

  // Perform search
  const results = await searchContent(query, 10)

  // Cache results
  searchCache.set(query, { results, timestamp: Date.now() })

  return NextResponse.json({
    results,
    count: results.length,
    query,
    cached: false
  })
}
```

---

## Code Quality Issues

### 6. Duplicated Rate Limiting Code (LOW)
**Files:** `app/api/chat/route.ts`, `app/api/contact/route.ts`
**Issue:** Same code repeated in multiple files

**Fix Required:**
Create shared utility:
```typescript
// lib/rate-limit.ts
export function createRateLimiter(config: {
  requests: number
  windowMs: number
}) {
  const store = new Map<string, { count: number; resetTime: number }>()

  return {
    check: (ip: string): boolean => {
      const now = Date.now()
      const limit = store.get(ip)

      if (!limit || now > limit.resetTime) {
        store.set(ip, { count: 1, resetTime: now + config.windowMs })
        return true
      }

      if (limit.count >= config.requests) {
        return false
      }

      limit.count++
      return true
    }
  }
}

// Cleanup
setInterval(() => {
  const now = Date.now()
  Array.from(store.entries()).forEach(([ip, limit]) => {
    if (now > limit.resetTime) {
      store.delete(ip)
    }
  })
}, config.windowMs)
```

Usage:
```typescript
import { createRateLimiter } from '@/lib/rate-limit'

const chatRateLimit = createRateLimiter({
  requests: 10,
  windowMs: 60000
})

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  if (!chatRateLimit.check(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ...
}
```

---

## Missing Features

### 7. No CSRF Protection (MEDIUM)
**Files:** All POST endpoints
**Risk:** Cross-site request forgery

**Fix Required:**
```typescript
// lib/csrf.ts
import { SignJWT, jwtVerify } from 'jose'

const CSRF_SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'fallback-secret-change-in-production'
)

export async function generateCSRFToken(sessionId: string): Promise<string> {
  return await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(CSRF_SECRET)
}

export async function verifyCSRFToken(token: string, sessionId: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, CSRF_SECRET)
    return payload.sessionId === sessionId
  } catch {
    return false
  }
}

// Usage in API routes
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { csrfToken, ...data } = body

  const sessionId = getSessionId(request) // Get from cookie
  if (!await verifyCSRFToken(csrfToken, sessionId)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }
  // Process data...
}
```

---

### 8. No Request Validation Schema (LOW)
**Files:** All API routes
**Issue:** Manual validation is error-prone

**Fix Required:**
```typescript
// Install: npm install zod
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(500),
  honeypot: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = ContactSchema.parse(body)
    // Now we know data is valid
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      )
    }
  }
}
```

---

## Recommended Priority Order

1. **CRITICAL - Fix TTS rate limiting** (15 minutes)
2. **HIGH - Add HTML encoding** (30 minutes)
3. **MEDIUM - Implement shared rate limiter** (1 hour)
4. **MEDIUM - Add CSRF protection** (2 hours)
5. **MEDIUM - Implement search caching** (30 minutes)
6. **LOW - Fix CORS configuration** (15 minutes)
7. **LOW - Add request validation schemas** (2 hours)

---

## Testing Checklist

After implementing fixes, verify:

- [ ] TTS endpoint rate limits correctly
- [ ] XSS attempts are encoded in contact form
- [ ] Rate limiting works with real IPs (not spoofable)
- [ ] CORS only allows specific origins
- [ ] Search results are cached appropriately
- [ ] CSRF tokens prevent cross-site requests
- [ ] Validation schemas reject bad data
- [ ] All endpoints still pass functional tests

---

## Monitoring Recommendations

Add these metrics to track:

1. Rate limit hits per endpoint
2. Average response times
3. Error rates by endpoint
4. Suspicious activity (XSS attempts, SQL injection attempts)
5. API quota usage for TTS

```typescript
// Example monitoring hook
function recordMetric(endpoint: string, status: number, duration: number) {
  console.log(JSON.stringify({
    type: 'api_metric',
    endpoint,
    status,
    duration,
    timestamp: new Date().toISOString()
  }))
}
```
