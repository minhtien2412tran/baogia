import { chromium } from '@playwright/test';
import fs from 'node:fs';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', (m) => logs.push(`console:${m.type()}:${m.text()}`));
  page.on('response', async (r) => {
    if (r.url().includes('/auth/login')) {
      logs.push(`login-res:${r.status()}`);
      try {
        logs.push(`login-body:${(await r.text()).slice(0, 300)}`);
      } catch {
        /* ignore */
      }
    }
  });
  await page.goto('http://127.0.0.1:3001/login');
  await page.locator('input[type="email"]').fill('admin@jetbay.local');
  await page.locator('input[type="password"]').fill('Admin123!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForTimeout(4000);
  logs.push(`url:${page.url()}`);
  const err = await page.locator('.jb-login__error').textContent().catch(() => null);
  logs.push(`error:${err}`);
  logs.push(`bodyText:${(await page.locator('body').innerText()).slice(0, 800)}`);
  fs.writeFileSync('tmp/admin-login-debug.txt', logs.join('\n'));
  console.log(logs.join('\n'));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
