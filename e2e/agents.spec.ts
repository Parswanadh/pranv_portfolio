import { test, expect } from '@playwright/test'

test.describe('Agents Page', () => {
  test('should display all agent demos', async ({ page }) => {
    await page.goto('/agents')
    await expect(page.locator('text=Research Agent')).toBeVisible()
    await expect(page.locator('text=Code Agent')).toBeVisible()
    await expect(page.locator('text=Data Agent')).toBeVisible()
  })

  test('should run agent demo', async ({ page }) => {
    await page.goto('/agents')

    // Find Research Agent input and run
    const agentSection = page.locator('text=Research Agent').locator('..').locator('..')
    await agentSection.locator('textarea').fill('Test prompt')
    await agentSection.locator('button:has-text("Run")').click()

    // Wait for response (simulated)
    await expect(agentSection.locator('text=This is a simulated response')).toBeVisible({ timeout: 10000 })
  })

  test('should reset agent demo', async ({ page }) => {
    await page.goto('/agents')

    const agentSection = page.locator('text=Research Agent').locator('..').locator('..')
    await agentSection.locator('textarea').fill('Test prompt')
    await agentSection.locator('button:has-text("Reset")').click()

    await expect(agentSection.locator('textarea')).toHaveValue('')
  })
})
