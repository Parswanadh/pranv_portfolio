/**
 * Shared Rate Limiting Utility
 *
 * Provides a reusable rate limiting mechanism for all API routes
 * with automatic cleanup and IP-based tracking
 */

export interface RateLimitConfig {
  requests: number
  windowMs: number
  skipFailedRequests?: boolean
  skipSuccessfulRequests?: boolean
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

export interface RateLimiter {
  check: (identifier: string) => RateLimitResult
  reset: (identifier: string) => void
  cleanup: () => void
}

/**
 * Create a new rate limiter instance
 *
 * @param config - Rate limiting configuration
 * @returns Rate limiter object with check, reset, and cleanup methods
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  const store = new Map<string, { count: number; resetTime: number }>()

  // Auto-cleanup interval
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    Array.from(store.entries()).forEach(([identifier, limit]) => {
      if (now > limit.resetTime) {
        store.delete(identifier)
      }
    })
  }, config.windowMs)

  return {
    /**
     * Check if a request should be rate limited
     *
     * @param identifier - Unique identifier (usually IP address)
     * @returns Rate limit result with success status and metadata
     */
    check: (identifier: string): RateLimitResult => {
      const now = Date.now()
      const limit = store.get(identifier)

      // No previous limit or window expired
      if (!limit || now > limit.resetTime) {
        store.set(identifier, {
          count: 1,
          resetTime: now + config.windowMs,
        })

        return {
          success: true,
          limit: config.requests,
          remaining: config.requests - 1,
          resetTime: now + config.windowMs,
        }
      }

      // Check if limit exceeded
      if (limit.count >= config.requests) {
        return {
          success: false,
          limit: config.requests,
          remaining: 0,
          resetTime: limit.resetTime,
        }
      }

      // Increment counter
      limit.count++

      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - limit.count,
        resetTime: limit.resetTime,
      }
    },

    /**
     * Reset rate limit for a specific identifier
     *
     * @param identifier - Unique identifier to reset
     */
    reset: (identifier: string): void => {
      store.delete(identifier)
    },

    /**
     * Clean up resources (clear interval and store)
     */
    cleanup: (): void => {
      clearInterval(cleanupInterval)
      store.clear()
    },
  }
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  // Strict rate limiter for expensive operations (TTS, AI generation)
  strict: createRateLimiter({
    requests: 10,
    windowMs: 60000, // 1 minute
  }),

  // Moderate rate limiter for search and queries
  moderate: createRateLimiter({
    requests: 60,
    windowMs: 60000, // 1 minute
  }),

  // Lenient rate limiter for contact forms
  lenient: createRateLimiter({
    requests: 3,
    windowMs: 3600000, // 1 hour
  }),

  // Very strict rate limiter for authentication attempts
  auth: createRateLimiter({
    requests: 5,
    windowMs: 900000, // 15 minutes
  }),
}
