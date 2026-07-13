import { defineConfig, devices } from '@playwright/test';

/**
 * Production-mode media assertions on isolated port 3015.
 * Uses `next build` + `next start` because Next 16 blocks a second `next dev`
 * in the same apps/web directory while :3000 is already running.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /media-production\.smoke\.spec\.ts/,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:3015',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'pnpm --filter @jetbay/web exec next build && pnpm --filter @jetbay/web exec next start -p 3015',
    url: 'http://127.0.0.1:3015/en-us',
    reuseExistingServer: false,
    timeout: 600000,
    env: {
      ...process.env,
      APP_ENV: 'production',
      NEXT_PUBLIC_APP_ENV: 'production',
      NEXT_PUBLIC_PREFER_JETVINA_MEDIA: 'true',
      JETVINA_MEDIA_REMOTE_REVIEW_ENABLED: 'false',
      JETVINA_MEDIA_LOCAL_MIRROR_ENABLED: 'true',
      JETVINA_MEDIA_PRODUCTION_ENABLED: 'false',
      NEXT_PUBLIC_ALLOW_JETBAY_MEDIA: 'false',
    },
  },
});
