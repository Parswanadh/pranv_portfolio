import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('should match home page screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('should match projects page screenshot', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('projects.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('should match mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })
})
