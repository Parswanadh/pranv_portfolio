/**
 * Environment variable validation utilities
 * Validate critical environment variables at startup
 */

// Required environment variables
const REQUIRED_ENV_VARS = [
  'GROQ_API_KEY',
  // Add other required variables here
] as const

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
} as const

type RequiredEnvKey = typeof REQUIRED_ENV_VARS[number]

/**
 * Validate required environment variables
 * Throws error if any required variables are missing
 */
export function validateEnvironment(): void {
  const missingVars: RequiredEnvKey[] = []

  REQUIRED_ENV_VARS.forEach(key => {
    if (!process.env[key] || process.env[key] === '') {
      missingVars.push(key)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      `Please set these variables in your .env.local file`
    )
  }
}

/**
 * Get environment variable with validation
 */
export function getEnvVar(key: RequiredEnvKey): string {
  const value = process.env[key]
  if (!value || value === '') {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value
}

/**
 * Get optional environment variable with default
 */
export function getOptionalEnvVar<T extends keyof typeof OPTIONAL_ENV_VARS>(
  key: T
): typeof OPTIONAL_ENV_VARS[T] {
  return OPTIONAL_ENV_VARS[key]
}

/**
 * Initialize environment validation
 * Call this at application startup
 */
export function initializeEnvironment(): void {
  try {
    validateEnvironment()
    console.log('✅ Environment validation passed')
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}
