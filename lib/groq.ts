const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Check if GROQ API key is configured
 * Logs warning in development if missing
 */
function validateApiKey(): void {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    const errorMsg = 'GROQ_API_KEY is not configured. Please set it in .env.local'
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', errorMsg)
    }
    throw new Error(errorMsg + '\nGet your key at: https://console.groq.com/keys')
  }
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function sendMessage(messages: GroqMessage[]): Promise<string> {
  validateApiKey()

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GROQ API error: ${response.status} - ${error}`)
  }

  const data: GroqResponse = await response.json()
  return data.choices[0].message.content
}

/**
 * Stream messages from GROQ API
 * Returns an async generator that yields chunks as they arrive
 * Adds small delay for visible streaming effect
 */
export async function* streamMessages(messages: GroqMessage[]): AsyncGenerator<string, void, unknown> {
  validateApiKey()

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GROQ API error: ${response.status} - ${error}`)
  }

  // Create a reader for the stream
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      // Process all complete lines except the last one (may be incomplete)
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim()
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return
          }

          try {
            const parsed = JSON.parse(data)
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const chunk = parsed.choices[0].delta.content
              yield chunk
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      // Keep the last potentially incomplete line in buffer
      buffer = lines[lines.length - 1]
    }
  } finally {
    reader.releaseLock()
  }
}

// Rate limiting to prevent abuse
let lastRequest = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests

export async function sendMessageWithRateLimit(messages: GroqMessage[]): Promise<string> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequest

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }

  lastRequest = Date.now()
  return sendMessage(messages)
}
