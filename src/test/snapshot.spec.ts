import { test } from '@playwright/test'

const baseLocal = 'http://localhost:5173'
const path = '/'

test('Screenshots', async ({ page }) => {
  await page.goto(baseLocal + path, { waitUntil: 'networkidle' })

  await page.screenshot({
    path: 'public/screenshots/screenshot.png',
    fullPage: true,
  })
})
