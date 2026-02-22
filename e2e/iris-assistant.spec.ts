import { test, expect } from '@playwright/test'

test.describe('Iris AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')

    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
  })

  test('should open Iris chat widget from homepage button', async ({ page }) => {
    // Click the "Chat with Iris" button
    await page.click('text=Chat with Iris')

    // Wait for the chat panel to appear
    await expect(page.locator('text=Iris')).toBeVisible()
    await expect(page.locator('text=Balcha\'s AI Assistant')).toBeVisible()

    // Check that initial greeting is displayed
    await expect(page.locator("text=I'm Iris, Balcha's AI assistant")).toBeVisible()
  })

  test('should send message and receive response', async ({ page }) => {
    // Open Iris
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Type a message
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Tell me about Balcha')

    // Send the message
    await page.click('button[aria-label="Send"]')

    // Wait for response (loading state should disappear)
    await expect(page.locator('text=Iris is thinking...')).toBeVisible()
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    // Check that a response was received (should have at least 2 messages now)
    const messages = await page.locator('.max-w-\\[80\\%\\]').count()
    expect(messages).toBeGreaterThanOrEqual(2)
  })

  test('should NOT speak markdown syntax (star star issue)', async ({ page }) => {
    // Open Iris
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Enable sound to test TTS
    const soundButton = page.locator('button[aria-label="Mute"]')
    const isMuted = await soundButton.isVisible()
    if (isMuted) {
      await soundButton.click()
    }

    // Type a message that might trigger markdown response
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Tell me about Balcha')

    // Send the message
    await page.click('button[aria-label="Send"]')

    // Wait for response
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    // Get the assistant's response text
    const responseElement = await page.locator('.max-w-\\[80\\%\\]').last()
    const responseText = await responseElement.textContent()

    console.log('Response text:', responseText)

    // Verify the response does NOT contain literal "star star" or asterisk readings
    expect(responseText?.toLowerCase()).not.toContain('star star')
    expect(responseText?.toLowerCase()).not.toContain('asterisk')

    // The response should still be meaningful and contain expected content
    expect(responseText?.length).toBeGreaterThan(50)
  })

  test('should use conversational language (verify system prompt)', async ({ page }) => {
    // Open Iris
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Send a question
    await page.fill('input[placeholder="Ask Iris anything..."]', 'What are Balcha\'s main projects?')
    await page.click('button[aria-label="Send"]')

    // Wait for response
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    // Get the response
    const responseElement = await page.locator('.max-w-\\[80\\%\\]').last()
    const responseText = await responseElement.textContent()

    console.log('Projects response:', responseText)

    // Verify response mentions projects naturally
    expect(responseText?.toLowerCase()).toMatch(/pro.code|gpt.oss|auto.git|parshu.stt|projects/i)

    // Verify NO markdown syntax in spoken response
    expect(responseText).not.toMatch(/\*\*/)
    expect(responseText).not.toMatch(/\*[^*]+\*/)
    expect(responseText).not.toMatch(/__[^_]+__/)
  })

  test('should navigate to projects page', async ({ page }) => {
    // Open Iris
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Send navigation request
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Show me the projects')
    await page.click('button[aria-label="Send"]')

    // Wait for response
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    // Check for navigation intent in response
    const responseElement = await page.locator('.max-w-\\[80\\%\\]').last()
    const responseText = await responseElement.textContent()

    console.log('Navigation response:', responseText)

    // Response should mention navigating or showing projects
    expect(responseText?.toLowerCase()).toMatch(/projects|take you|show you|navigate/i)

    // Wait for potential navigation (1.5 second delay as per code)
    await page.waitForTimeout(2000)

    // Check if navigation occurred
    const currentUrl = page.url()
    console.log('Current URL after navigation:', currentUrl)

    // Navigation should occur if response contains navigation triggers
    if (responseText?.toLowerCase().includes('take you to') ||
        responseText?.toLowerCase().includes('let\'s go to') ||
        responseText?.toLowerCase().includes('show you')) {
      await expect(page).toHaveURL(/\/projects/, { timeout: 3000 })
    }
  })

  test('should handle markdown stripping for TTS correctly', async ({ page }) => {
    // This test verifies the stripMarkdownForSpeech function works correctly
    // by checking various markdown patterns

    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Ask a question that might trigger formatted responses
    await page.fill('input[placeholder="Ask Iris anything..."]', 'What makes Balcha unique?')
    await page.click('button[aria-label="Send"]')

    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    const responseElement = await page.locator('.max-w-\\[80\\%\\]').last()
    const responseText = await responseElement.textContent()

    console.log('Unique response:', responseText)

    // Verify no markdown syntax artifacts
    expect(responseText).not.toContain('**')
    expect(responseText).not.toContain('*')
    expect(responseText).not.toContain('```')
    expect(responseText).not.toContain('`')

    // Verify no literal readings of markdown
    expect(responseText?.toLowerCase()).not.toContain('star')
    expect(responseText?.toLowerCase()).not.toContain('asterisk')
    expect(responseText?.toLowerCase()).not.toContain('backtick')
    expect(responseText?.toLowerCase()).not.toContain('hashtag')
  })

  test('should toggle sound on/off', async ({ page }) => {
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Find the sound toggle button
    const soundButton = page.locator('button[aria-label="Mute"], button[aria-label="Unmute"]')

    // Initial state should be unmuted (Volume2 icon visible)
    await expect(soundButton).toBeVisible()

    // Click to mute
    await soundButton.click()
    await expect(page.locator('button[aria-label="Unmute"]')).toBeVisible()

    // Click to unmute
    await page.locator('button[aria-label="Unmute"]').click()
    await expect(page.locator('button[aria-label="Mute"]')).toBeVisible()
  })

  test('should close chat panel', async ({ page }) => {
    // Open Iris
    await page.click('text=Chat with Iris')
    await expect(page.locator('text=Iris')).toBeVisible()

    // Close the panel
    await page.click('button[aria-label="Close"]')

    // Panel should be hidden
    await expect(page.locator('text=Iris')).toBeHidden()

    // Floating button should be visible again
    await expect(page.locator('button[aria-label="Chat with Iris"]')).toBeVisible()
  })
})

test.describe('Iris TTS Integration', () => {
  test('should make TTS API call with cleaned text', async ({ page }) => {
    // Listen for network requests
    let ttsRequestUrl: string | null = null

    page.on('request', request => {
      if (request.url().includes('/api/tts')) {
        ttsRequestUrl = request.url()
        console.log('TTS Request URL:', ttsRequestUrl)
      }
    })

    await page.goto('/')
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // Ensure sound is enabled
    const muteButton = page.locator('button[aria-label="Mute"]')
    if (await muteButton.isVisible()) {
      await muteButton.click()
    }

    // Send a message
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Tell me about Balcha')
    await page.click('button[aria-label="Send"]')

    // Wait for response
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })

    // Give TTS time to trigger
    await page.waitForTimeout(2000)

    // Verify TTS was called
    expect(ttsRequestUrl).toBeTruthy()

    // Check that the URL contains text parameter (and not markdown)
    if (ttsRequestUrl) {
      // URL-encoded text should not contain asterisks
      expect(ttsRequestUrl).not.toMatch(/%2A%2A/)  // ** encoded
      expect(ttsRequestUrl).not.toMatch(/__/)      // underscores for bold
    }
  })

  test('should handle errors gracefully', async ({ page }) => {
    // This test verifies error handling in the chat
    await page.goto('/')
    await page.click('text=Chat with Iris')
    await page.waitForTimeout(500)

    // We can't easily test API failures without mocking,
    // but we can verify the UI handles loading states correctly

    // Check that input is disabled during loading
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Test message')
    await page.click('button[aria-label="Send"]')

    // Input should be disabled during loading
    const input = page.locator('input[placeholder="Ask Iris anything..."]')
    await expect(input).toBeDisabled()

    // After response, input should be enabled again
    await expect(page.locator('text=Iris is thinking...')).toBeHidden({ timeout: 15000 })
    await expect(input).toBeEnabled()
  })
})
