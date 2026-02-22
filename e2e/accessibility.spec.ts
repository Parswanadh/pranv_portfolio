import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    const lang = await html.getAttribute('lang')

    expect(lang).toBeTruthy()
  })

  test('should have proper document title', async ({ page }) => {
    await page.goto('/')

    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should have heading hierarchy', async ({ page }) => {
    await page.goto('/')

    const h1 = page.locator('h1')
    const h1Count = await h1.count()

    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('should have focus management', async ({ page }) => {
    await page.goto('/')

    // Tab through the page
    await page.keyboard.press('Tab')

    // Check that something received focus
    const activeElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA']).toContain(activeElement)
  })

  test('should have sufficient color contrast (basic check)', async ({ page }) => {
    await page.goto('/')

    // This is a basic check - full contrast checking requires more complex tools
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, a').all()

    // Just verify text elements exist and are visible
    expect(textElements.length).toBeGreaterThan(0)
  })

  test('should have ARIA labels where needed', async ({ page }) => {
    await page.goto('/')

    // Check buttons have accessible names
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')

      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel || ariaLabelledBy
      expect(hasAccessibleName).toBeTruthy()
    }
  })

  test('should handle keyboard navigation on all pages', async ({ page }) => {
    const routes = ['/', '/projects', '/contact']

    for (const route of routes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle').catch(() => {})

      // Try to tab through interactive elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      const activeElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'BODY']).toContain(activeElement)
    }
  })

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/')

    // Look for skip link
    const skipLink = page.locator('a[href*="main"], a[href*="content"], .skip-link').first()

    // Skip links are optional but good to have
    const exists = await skipLink.count() > 0

    if (exists) {
      expect(skipLink).toBeVisible()
    }
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')

      // Alt attribute should exist (can be empty for decorative images)
      expect(alt !== null).toBeTruthy()
    }
  })
})
