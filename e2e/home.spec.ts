import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('/')

    // Check terminal boot is skipped on subsequent visits
    await expect(page.locator('text=SYSTEM READY')).not.toBeVisible()

    // Check hero content
    await expect(page.locator('text=./parsh')).toBeVisible()
    await expect(page.locator('text=Architecting intelligence at the edge of chaos')).toBeVisible()
  })

  test('should display featured projects section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=FEATURED PROJECTS')).toBeVisible()
    await expect(page.locator('text=Neural Agent Framework')).toBeVisible()
  })

  test('should display active agents section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=ACTIVE AGENTS')).toBeVisible()
  })

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=View Projects')
    await expect(page).toHaveURL(/\/projects/)
  })

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=About Me')
    await expect(page).toHaveURL(/\/about/)
  })

  test('should open command palette with Cmd+K', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await expect(page.locator('text=Type a command or search')).toBeVisible()
  })

  test('should have working mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Open menu
    await page.click('button[aria-label="Toggle menu"]')
    await expect(page.locator('text=/home')).toBeVisible()
    await expect(page.locator('text=/projects')).toBeVisible()

    // Navigate
    await page.click('text=/projects')
    await expect(page).toHaveURL(/\/projects/)
  })
})
