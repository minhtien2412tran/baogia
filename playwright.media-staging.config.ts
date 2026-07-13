import { defineConfig, devices } from '@playwright/test';

/** Staging media review — reuses :3000 when already running. */
export default defineConfig({
  testDir: './tests',
  testMatch: /media-staging\.smoke\.spec\.ts/,
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm --filter @jetbay/web exec next dev -p 3000',
    url: 'http://127.0.0.1:3000/en-us',
    reuseExistingServer: true,
    timeout: 180000,
    env: {
      ...process.env,
      APP_ENV: 'staging',
      NEXT_PUBLIC_APP_ENV: 'staging',
      NEXT_PUBLIC_PREFER_JETVINA_MEDIA: 'true',
      JETVINA_MEDIA_REMOTE_REVIEW_ENABLED: 'true',
      JETVINA_MEDIA_LOCAL_MIRROR_ENABLED: 'true',
      JETVINA_MEDIA_PRODUCTION_ENABLED: 'false',
      NEXT_PUBLIC_ALLOW_JETBAY_MEDIA: 'false',
    },
  },
});
