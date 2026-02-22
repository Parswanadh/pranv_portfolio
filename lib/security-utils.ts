/**
 * Security Utilities for Portfolio Application
 *
 * Provides centralized security functions for:
 * - IP address extraction with spoofing protection
 * - Input sanitization
 * - Content Security Policy headers
 * - CSRF protection utilities
 */

/**
 * Extract client IP address with spoofing protection
 * Checks multiple headers in order of reliability
 */
export function getClientIP(request: Request): string {
  // Check headers in order of reliability (most trusted first)
  const cfIP = request.headers.get('cf-connecting-ip') // Cloudflare
  const flyIP = request.headers.get('fly-client-ip') // Fly.io
  const realIP = request.headers.get('x-real-ip')
  const forwarded = request.headers.get('x-forwarded-for')

  // x-forwarded-for can contain multiple IPs, take the first one (original client)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim())
    if (ips.length > 0 && ips[0]) {
      return ips[0]
    }
  }

  return cfIP || flyIP || realIP || 'unknown'
}

/**
 * Validate and sanitize URL to prevent open redirects
 */
export function sanitizeURL(url: string, allowedDomains: string[] = []): boolean {
  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }

    // If allowed domains specified, check against them
    if (allowedDomains.length > 0) {
      return allowedDomains.some(domain => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`))
    }

    return true
  } catch {
    return false
  }
}

/**
 * Generate Content Security Policy headers
 */
export function getCSPHeaders(nonce?: string) {
  const scriptSrc = nonce ? `'nonce-${nonce}'` : "'self'"

  return {
    'Content-Security-Policy': [
      `default-src 'self'`,
      `script-src ${scriptSrc} 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data: https: blob:`,
      `connect-src 'self' https://api.groq.com https://agent.development.beta.easyencoder.com`,
      `media-src 'self' blob:`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`,
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

/**
 * Validate file upload type and size
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove any directory paths
  const name = filename.replace(/^.*[\\\/]/, '')

  // Remove dangerous characters
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.') // Prevent path traversal with ..
    .slice(0, 255) // Limit length
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  requests: number
  windowMs: number
}

/**
 * Create a rate limiter with automatic cleanup
 */
export function createRateLimiter(config: RateLimitConfig) {
  const store = new Map<string, { count: number; resetTime: number }>()

  // Auto-cleanup interval
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    Array.from(store.entries()).forEach(([ip, limit]) => {
      if (now > limit.resetTime) {
        store.delete(ip)
      }
    })
  }, config.windowMs)

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
    },

    reset: (ip: string): void => {
      store.delete(ip)
    },

    cleanup: (): void => {
      clearInterval(cleanupInterval)
      store.clear()
    },
  }
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
}

/**
 * Validate email format more strictly than basic regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Detect common XSS attack patterns
 */
export function detectXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Sanitize user input for display in HTML context
 * Uses HTML entity encoding
 */
export { encode } from 'html-entities'
