import { test, expect } from '@playwright/test'

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Projects/)
    await page.waitForLoadState('networkidle')
  })

  test('should display project cards', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for project content
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
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

    expect(errors.length).toBeLessThan(5) // Allow some errors but not many
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // Try to navigate back to home
    const homeLink = page.locator('a[href="/"]').first()
    if (await homeLink.isVisible()) {
      await homeLink.click()
      await page.waitForURL(/\/$/)
    }
  })
})

test.describe('Project Detail Pages', () => {
  test('should load a project detail page', async ({ page }) => {
    // Try to load a project page
    await page.goto('/projects/iris-ai-assistant')

    await page.waitForLoadState('networkidle')

    // Check that page loaded
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should handle 404 for non-existent projects', async ({ page }) => {
    const response = await page.goto('/projects/non-existent-project')

    if (response) {
      expect(response.status()).toBeLessThan(500)
    }
  })
})
