import { test, expect } from '@playwright/test'

test('Screenshots', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page).toHaveTitle(/.+/)
  await page.screenshot({
    path: 'public/screenshots/screenshot.png',
    fullPage: true,
  })
})
