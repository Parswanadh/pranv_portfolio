import {
  validateEnvironment,
  getEnvVar,
  getOptionalEnvVar,
  initializeEnvironment,
} from '@/lib/env-validation'

// Mock process.env
const originalEnv = process.env

describe('env-validation', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('validateEnvironment', () => {
    it('should pass when all required variables are set', () => {
      process.env.GROQ_API_KEY = 'test-api-key'

      expect(() => validateEnvironment()).not.toThrow()
    })

    it('should throw error when required variables are missing', () => {
      // Remove GROQ_API_KEY
      delete process.env.GROQ_API_KEY

      expect(() => validateEnvironment()).toThrow('Missing required environment variables: GROQ_API_KEY')
    })

    it('should throw error when required variables are empty strings', () => {
      process.env.GROQ_API_KEY = ''

      expect(() => validateEnvironment()).toThrow('Missing required environment variables: GROQ_API_KEY')
    })

    it('should handle multiple missing variables', () => {
      const REQUIRED_ENV_VARS = ['GROQ_API_KEY', 'DATABASE_URL'] as const

      // Add more required vars for testing
      process.env.GROQ_API_KEY = ''
      ;(process.env as any).DATABASE_URL = undefined

      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: GROQ_API_KEY, DATABASE_URL'
      )
    })
  })

  describe('getEnvVar', () => {
    it('should return environment variable value', () => {
      process.env.GROQ_API_KEY = 'test-api-key'

      const result = getEnvVar('GROQ_API_KEY')
      expect(result).toBe('test-api-key')
    })

    it('should throw error when variable is not set', () => {
      delete process.env.GROQ_API_KEY

      expect(() => getEnvVar('GROQ_API_KEY')).toThrow(
        'Environment variable GROQ_API_KEY is required but not set'
      )
    })

    it('should throw error when variable is empty string', () => {
      process.env.GROQ_API_KEY = ''

      expect(() => getEnvVar('GROQ_API_KEY')).toThrow(
        'Environment variable GROQ_API_KEY is required but not set'
      )
    })
  })

  describe('getOptionalEnvVar', () => {
    it('should return default value when variable is not set', () => {
      delete process.env.NODE_ENV

      const result = getOptionalEnvVar('NODE_ENV')
      expect(result).toBe('development')
    })

    it('should return existing value when set', () => {
      process.env.NODE_ENV = 'production'

      const result = getOptionalEnvVar('NODE_ENV')
      expect(result).toBe('production')
    })

    it('should handle undefined environment variable', () => {
      ;(process.env as any).NEXT_PUBLIC_BASE_URL = undefined

      const result = getOptionalEnvVar('NEXT_PUBLIC_BASE_URL')
      expect(result).toBe('http://localhost:3000')
    })

    it('should handle empty string environment variable', () => {
      process.env.NODE_ENV = ''

      const result = getOptionalEnvVar('NODE_ENV')
      expect(result).toBe('development')
    })
  })

  describe('initializeEnvironment', () => {
    it('should log success when validation passes', () => {
      process.env.GROQ_API_KEY = 'test-api-key'

      const consoleLogSpy = vi.spyOn(console, 'log')
      const consoleErrorSpy = vi.spyOn(console, 'error')

      expect(() => initializeEnvironment()).not.toThrow()
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Environment validation passed')
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should log error and not exit in development when validation fails', () => {
      process.env.NODE_ENV = 'development'
      delete process.env.GROQ_API_KEY

      const consoleLogSpy = vi.spyOn(console, 'log')
      const consoleErrorSpy = vi.spyOn(console, 'error')
      const processExitSpy = vi.spyOn(process, 'exit')

      expect(() => initializeEnvironment()).not.toThrow()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Environment validation failed:',
        expect.any(Error)
      )
      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(processExitSpy).not.toHaveBeenCalled()
    })

    it('should call process.exit in production when validation fails', () => {
      process.env.NODE_ENV = 'production'
      delete process.env.GROQ_API_KEY

      const consoleLogSpy = vi.spyOn(console, 'log')
      const consoleErrorSpy = vi.spyOn(console, 'error')
      const processExitSpy = vi.spyOn(process, 'exit')

      expect(() => initializeEnvironment()).toThrow()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Environment validation failed:',
        expect.any(Error)
      )
      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(processExitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('type safety', () => {
    it('should enforce correct types for required variables', () => {
      // This test ensures TypeScript catches type mismatches
      process.env.GROQ_API_KEY = 'test-key'

      // These should compile without TypeScript errors
      const key = getEnvVar('GROQ_API_KEY') // Should be string
      expect(typeof key).toBe('string')
    })

    it('should enforce correct types for optional variables', () => {
      // Test that optional vars have correct return types
      const nodeEnv = getOptionalEnvVar('NODE_ENV')
      expect(typeof nodeEnv).toBe('string')

      const baseUrl = getOptionalEnvVar('NEXT_PUBLIC_BASE_URL')
      expect(typeof baseUrl).toBe('string')
    })
  })

  describe('edge cases', () => {
    it('should handle whitespace-only environment variables', () => {
      process.env.GROQ_API_KEY = '   '

      expect(() => validateEnvironment()).toThrow('Missing required environment variables')
    })

    it('should handle environment variables with only whitespace', () => {
      process.env.GROQ_API_KEY = '   \n\t   '

      expect(() => getEnvVar('GROQ_API_KEY')).toThrow(
        'Environment variable GROQ_API_KEY is required but not set'
      )
    })

    it('should handle environment variables with special characters', () => {
      process.env.GROQ_API_KEY = 'sk-123!@#$%^&*()'

      expect(() => validateEnvironment()).not.toThrow()
      expect(getEnvVar('GROQ_API_KEY')).toBe('sk-123!@#$%^&*()')
    })
  })
})