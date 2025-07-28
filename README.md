# Preview Snapshot UI in Pull Request

Use Playwright library (testing web app) to test UI, End to End, API, etc

### File test:

- Config

```js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Input and path file test
  testDir: './src/tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
```

- Example file

```js
import { test } from '@playwright/test'

const baseLocal = 'http://localhost:5173'
// Page to run test with snapshot UI
const path = '/'

test('Screenshots', async ({ page }) => {
  await page.goto(baseLocal + path, { waitUntil: 'networkidle' })

  // Output snapshot file and path folder
  await page.screenshot({
    path: 'public/screenshots/screenshot.png',
    fullPage: true,
  })
})
```

### Package.json:

Config Playwright command in package.json when commit, you won't have to retype the command to update the snapshot

```js
"test": "playwright test",
"test:ui": "playwright test --ui"
```

### Workflow

- Setting Playwright CI
- Use Github Action Script new version to write workflow: https://github.com/actions/github-script
- Get link screenshot with https://raw.githubusercontent.com (stored files in repo) with path /screenshots/screenshot.png
- Example: https://raw.githubusercontent.com/tienlevi/playwright-test/main/public/screenshots/screenshot.png
- Return message with markdown in workflow to create comment in PR
- Link workflow: https://github.com/tienlevi/playwright-test/blob/main/.github/workflows/playwright.yml

### Demo

- Link demo: https://github.com/nrdlbs/fe-vite/pull/4
- Explaining the demo link:
  - After initing and configuring Github actions, it will automatically create a Comment in PR showing the demo link and Snapshot UI (Only show snapshots by link)
  - After recommit, it will update snapshot in comment
