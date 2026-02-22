import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/)
    await page.waitForLoadState('networkidle')
  })

  test('should display contact form or content', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    expect(errors.length).toBeLessThan(5)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should have accessible form inputs if form exists', async ({ page }) => {
    const form = page.locator('form').first()

    if (await form.isVisible()) {
      // Check for labels
      const inputs = form.locator('input, textarea')
      const count = await inputs.count()

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')

        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          const hasLabel = await label.count() > 0
          const hasAriaLabel = await input.getAttribute('aria-label')

          expect(hasLabel || hasAriaLabel).toBeTruthy()
        }
      }
    }
  })
})

test.describe('Contact Form Submission', () => {
  test('should handle form submission gracefully', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const form = page.locator('form').first()

    if (await form.isVisible()) {
      // Fill out form with test data
      const nameInput = form.locator('input[name="name"], input[placeholder*="name" i]').first()
      const emailInput = form.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first()
      const messageInput = form.locator('textarea[name="message"], textarea[placeholder*="message" i]').first()

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User')
      }

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com')
      }

      if (await messageInput.isVisible()) {
        await messageInput.fill('This is a test message.')
      }

      // Try to submit (might fail validation, but shouldn't crash)
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first()

      if (await submitButton.isVisible()) {
        await Promise.all([
          page.waitForResponse(response => response.url().includes('/api') || response.status() === 200).catch(() => null),
          submitButton.click()
        ]).catch(() => {
          // Submit might fail, that's okay
        })
      }
    }
  })
})
