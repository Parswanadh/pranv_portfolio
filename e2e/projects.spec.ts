import { test, expect } from '@playwright/test'

test.describe('Projects Page', () => {
  test('should display all projects', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('text=/projects')).toBeVisible()
    await expect(page.locator('text=Neural Agent Framework')).toBeVisible()
    await expect(page.locator('text=Quantum Graph Visualization')).toBeVisible()
    await expect(page.locator('text=Terminal Operating System')).toBeVisible()
  })

  test('should navigate to project detail page', async ({ page }) => {
    await page.goto('/projects')
    await page.click('text=Neural Agent Framework')
    await expect(page).toHaveURL(/\/projects\/neural-agent-framework/)
  })

  test('should display project details', async ({ page }) => {
    await page.goto('/projects/neural-agent-framework')
    await expect(page.locator('text=Neural Agent Framework')).toBeVisible()
    await expect(page.locator('text=Multi-agent system')).toBeVisible()
    await expect(page.locator('text=Tech Stack')).toBeVisible()
  })

  test('should have back navigation', async ({ page }) => {
    await page.goto('/projects/neural-agent-framework')
    await page.click('text=/projects')
    await expect(page).toHaveURL('/projects')
  })
})
