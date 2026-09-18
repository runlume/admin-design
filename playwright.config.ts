import { defineConfig, devices } from '@playwright/test'
import { authFile } from './src/test/e2e/global-setup'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3200'

export default defineConfig({
  testDir: './src/test/e2e',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  outputDir: 'test-results',
  globalSetup: './src/test/e2e/global-setup.ts',
  use: {
    baseURL,
    // 控制台需要登录，这里带上 setup 里登录好的管理员会话。
    storageState: authFile,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'pnpm dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 30000,
  },
})
