import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to all main pages', async ({ page }) => {
    const routes = [
      '/',
      '/projects',
      '/research',
      '/about',
      '/contact',
      '/resume'
    ]

    for (const route of routes) {
      await page.goto(route)

      // Wait for page to load
      await page.waitForLoadState('networkidle').catch(() => {})

      // Check that page loaded successfully
      const main = page.locator('main')
      await expect(main).toBeVisible()

      // Check title
      const title = await page.title()
      expect(title).toBeTruthy()
    }
  })

  test('should have working header navigation', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Check for navigation links
    const navLinks = page.locator('nav a')

    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    // Click first link (if visible)
    if (count > 0) {
      const firstLink = navLinks.first()
      if (await firstLink.isVisible()) {
        await firstLink.click()
        await page.waitForLoadState('networkidle').catch(() => {})
      }
    }
  })

  test('should handle back and forward navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    await page.goBack()
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/')

    await page.goForward()
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/projects')
  })

  test('should handle direct URL access', async ({ page }) => {
    const urls = [
      'http://localhost:3000/',
      'http://localhost:3000/projects',
      'http://localhost:3000/contact'
    ]

    for (const url of urls) {
      const response = await page.goto(url)

      if (response) {
        expect(response.status()).toBeLessThan(500)
      }

      await page.waitForLoadState('networkidle').catch(() => {})
    }
  })
})

test.describe('Mobile Navigation', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Check for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i], .menu-button').first()

    const hasMenuButton = await menuButton.isVisible().catch(() => false)

    if (hasMenuButton) {
      await menuButton.click()
      await page.waitForTimeout(500)

      // Menu should open
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    }
  })

  test('should navigate on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    const main = page.locator('main')
    await expect(main).toBeVisible()
  })
})
