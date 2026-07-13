import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const i = line.indexOf('=');
    out[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
  }
  return out;
}

const root = process.cwd();
const apiEnv = readEnvFile(path.join(root, 'apps/api/.env'));
const apiKey = apiEnv.API_KEY || '';

/**
 * Admin Media Review E2E — production-mode Next on :3011
 * (Next 16 blocks a second `next dev` in the same app dir).
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /admin-media-review\.e2e\.spec\.ts/,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:3011',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/start-admin-e2e.mjs',
    url: 'http://127.0.0.1:3011/login',
    reuseExistingServer: true,
    timeout: 300000,
  },
});
