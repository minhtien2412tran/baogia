import { chromium } from '@playwright/test';
import fs from 'node:fs';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('request', (r) => {
    if (r.url().includes('auth') || r.url().includes('4000') || r.url().includes('minhtien')) {
      logs.push(`req:${r.method()} ${r.url()}`);
    }
  });
  page.on('response', async (r) => {
    if (r.url().includes('auth') || r.url().includes('4000')) {
      logs.push(`res:${r.status()} ${r.url()}`);
    }
  });
  await page.goto('http://127.0.0.1:3001/login', { waitUntil: 'networkidle' });
  const apiHint = await page.locator('.jb-login__api').innerText();
  logs.push(`apiHint:${apiHint}`);
  await page.locator('input[type="email"]').fill('admin@jetbay.local');
  await page.locator('input[type="password"]').fill('Admin123!');
  await page.locator('form').evaluate((f) => (f).requestSubmit());
  await page.waitForTimeout(5000);
  logs.push(`url:${page.url()}`);
  logs.push(`error:${await page.locator('.jb-login__error').textContent().catch(() => 'none')}`);
  logs.push(`body:${(await page.locator('body').innerText()).slice(0, 600)}`);
  fs.writeFileSync('tmp/admin-login-debug2.txt', logs.join('\n'));
  console.log(logs.join('\n'));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
