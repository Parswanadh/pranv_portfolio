const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/speak'
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || ''

export interface TTSOptions {
  text: string
  voice?: string // Default: 'aura-asteria-en' (female)
}

/**
 * Convert text to speech using Deepgram Aura
 * Uses optimized parameters for natural, conversational speech
 */
export async function textToSpeech(options: TTSOptions): Promise<ArrayBuffer> {
  if (!DEEPGRAM_API_KEY) {
    throw new Error('DEEPGRAM_API_KEY is not set')
  }

  const { text, voice = 'aura-asteria-en' } = options

  // Build URL with optimization parameters for natural speech
  const params = new URLSearchParams({
    model: voice,
    // Performance and quality settings
    encoding: 'mp3',
  })

  const response = await fetch(`${DEEPGRAM_API_URL}?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Deepgram TTS error: ${response.status} - ${error}`)
  }

  return await response.arrayBuffer()
}
