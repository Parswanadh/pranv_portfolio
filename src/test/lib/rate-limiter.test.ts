import { createRateLimiter, rateLimiters, type RateLimitConfig } from '@/lib/rate-limiter'
import { vi } from 'vitest'

// Mock setInterval and clearInterval
const setIntervalMock = vi.spyOn(global, 'setInterval')
const clearIntervalMock = vi.spyOn(global, 'clearInterval')

describe('rate-limiter', () => {
  let rateLimiter: ReturnType<typeof createRateLimiter>

  beforeEach(() => {
    vi.useFakeTimers()
    setIntervalMock.mockClear()
    clearIntervalMock.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    rateLimiter?.cleanup()
  })

  describe('createRateLimiter', () => {
    it('should create a rate limiter with default config', () => {
      const config: RateLimitConfig = {
        requests: 5,
        windowMs: 60000,
      }
      rateLimiter = createRateLimiter(config)

      expect(rateLimiter).toHaveProperty('check')
      expect(rateLimiter).toHaveProperty('reset')
      expect(rateLimiter).toHaveProperty('cleanup')
      expect(setIntervalMock).toHaveBeenCalled()
    })

    it('should create a rate limiter with custom config', () => {
      const config: RateLimitConfig = {
        requests: 10,
        windowMs: 300000,
        skipFailedRequests: true,
        skipSuccessfulRequests: false,
      }
      rateLimiter = createRateLimiter(config)

      expect(setIntervalMock).toHaveBeenCalledWith(expect.any(Function), 300000)
    })

    it('should create interval with correct window time', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      expect(setIntervalMock).toHaveBeenCalledWith(expect.any(Function), 60000)
    })
  })

  describe('check method', () => {
    it('should allow first request for identifier', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      const result = rateLimiter.check('192.168.1.1')

      expect(result.success).toBe(true)
      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(4)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })

    it('should increment count for subsequent requests', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      // First request
      let result = rateLimiter.check('192.168.1.1')
      expect(result.remaining).toBe(4)

      // Second request
      result = rateLimiter.check('192.168.1.1')
      expect(result.remaining).toBe(3)
    })

    it('should block requests when limit exceeded', () => {
      rateLimiter = createRateLimiter({
        requests: 2,
        windowMs: 60000,
      })

      // Two allowed requests
      rateLimiter.check('192.168.1.1')
      rateLimiter.check('192.168.1.1')

      // Third request should be blocked
      const result = rateLimiter.check('192.168.1.1')

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset count after window expires', () => {
      rateLimiter = createRateLimiter({
        requests: 2,
        windowMs: 1000, // 1 second
      })

      // Use two requests
      rateLimiter.check('192.168.1.1')
      rateLimiter.check('192.168.1.1')

      // Should be blocked
      let result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(false)

      // Fast forward past window
      vi.advanceTimersByTime(1000)

      // Should allow new request
      result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should handle different identifiers independently', () => {
      rateLimiter = createRateLimiter({
        requests: 2,
        windowMs: 60000,
      })

      // Block first identifier
      rateLimiter.check('ip1')
      rateLimiter.check('ip1')
      const result1 = rateLimiter.check('ip1')
      expect(result1.success).toBe(false)

      // Second identifier should still be allowed
      const result2 = rateLimiter.check('ip2')
      expect(result2.success).toBe(true)
    })

    it('should return correct reset time', () => {
      const windowMs = 60000
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs,
      })

      const result = rateLimiter.check('192.168.1.1')
      const expectedResetTime = Date.now() + windowMs

      expect(result.resetTime).toBeGreaterThanOrEqual(expectedResetTime)
      expect(result.resetTime).toBeLessThan(expectedResetTime + 100) // Allow small margin
    })
  })

  describe('reset method', () => {
    it('should reset rate limit for specific identifier', () => {
      rateLimiter = createRateLimiter({
        requests: 2,
        windowMs: 60000,
      })

      // Block identifier
      rateLimiter.check('192.168.1.1')
      rateLimiter.check('192.168.1.1')
      let result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(false)

      // Reset identifier
      rateLimiter.reset('192.168.1.1')

      // Should allow new requests
      result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(true)
    })

    it('should not affect other identifiers when resetting', () => {
      rateLimiter = createRateLimiter({
        requests: 2,
        windowMs: 60000,
      })

      // Block first identifier
      rateLimiter.check('ip1')
      rateLimiter.check('ip1')

      // Block second identifier
      rateLimiter.check('ip2')
      rateLimiter.check('ip2')

      // Reset first identifier
      rateLimiter.reset('ip1')

      // First should be unblocked, second should remain blocked
      expect(rateLimiter.check('ip1').success).toBe(true)
      expect(rateLimiter.check('ip2').success).toBe(false)
    })

    it('should handle reset for non-existent identifier gracefully', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      // Should not throw when resetting non-existent identifier
      expect(() => rateLimiter.reset('nonexistent')).not.toThrow()
    })
  })

  describe('cleanup method', () => {
    it('should clear interval and store', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      // Make some requests
      rateLimiter.check('ip1')
      rateLimiter.check('ip2')

      // Cleanup
      rateLimiter.cleanup()

      // Should clear interval
      expect(clearIntervalMock).toHaveBeenCalled()

      // Should not allow more requests (though technically the limiter is still functional)
      // This is more of an integration test
    })
  })

  describe('pre-configured rate limiters', () => {
    it('should have strict limiter with 10 requests per minute', () => {
      const result = rateLimiters.strict.check('192.168.1.1')

      expect(result.limit).toBe(10)
      expect(result.remaining).toBe(9)
    })

    it('should have moderate limiter with 60 requests per minute', () => {
      const result = rateLimiters.moderate.check('192.168.1.1')

      expect(result.limit).toBe(60)
      expect(result.remaining).toBe(59)
    })

    it('should have lenient limiter with 3 requests per hour', () => {
      const result = rateLimiters.lenient.check('192.168.1.1')

      expect(result.limit).toBe(3)
      expect(result.remaining).toBe(2)
    })

    it('should have auth limiter with 5 requests per 15 minutes', () => {
      const result = rateLimiters.auth.check('192.168.1.1')

      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(4)
    })

    it('should have separate cleanup methods', () => {
      expect(rateLimiters.strict.cleanup).toBeDefined()
      expect(rateLimiters.moderate.cleanup).toBeDefined()
      expect(rateLimiters.lenient.cleanup).toBeDefined()
      expect(rateLimiters.auth.cleanup).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty string identifier', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 60000,
      })

      const result = rateLimiter.check('')

      expect(result.success).toBe(true)
      expect(result.limit).toBe(5)
    })

    it('should handle very high request counts', () => {
      rateLimiter = createRateLimiter({
        requests: 1000,
        windowMs: 60000,
      })

      // Make many requests
      for (let i = 0; i < 999; i++) {
        rateLimiter.check('192.168.1.1')
      }

      // Should still allow one more
      let result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(0)

      // Next should be blocked
      result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(false)
    })

    it('should handle very short windows', () => {
      rateLimiter = createRateLimiter({
        requests: 1,
        windowMs: 10, // 10ms
      })

      // Allow first request
      rateLimiter.check('192.168.1.1')

      // Should block immediately
      let result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(false)

      // After window, should allow again
      vi.advanceTimersByTime(10)
      result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(true)
    })

    it('should handle very long windows', () => {
      rateLimiter = createRateLimiter({
        requests: 5,
        windowMs: 86400000, // 24 hours
      })

      // Should work normally
      rateLimiter.check('192.168.1.1')
      rateLimiter.check('192.168.1.1')
      rateLimiter.check('192.168.1.1')

      const result = rateLimiter.check('192.168.1.1')
      expect(result.success).toBe(true)
    })
  })
})