import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const reqs = [];
  page.on('request', (r) => reqs.push(`${r.method()} ${r.url()}`));
  await page.goto('http://127.0.0.1:3001/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type="email"]');
  const emails = await page.locator('input[type="email"]').count();
  const pwds = await page.locator('input[type="password"]').count();
  console.log({ emails, pwds });
  await page.locator('input[type="email"]').first().click();
  await page.locator('input[type="email"]').first().fill('admin@jetbay.local');
  await page.locator('input[type="password"]').first().fill('Admin123!');
  console.log(
    'values',
    await page.locator('input[type="email"]').inputValue(),
    await page.locator('input[type="password"]').inputValue(),
  );
  await page.getByRole('button', { name: /sign in/i }).click({ force: true });
  await page.waitForTimeout(5000);
  console.log('url', page.url());
  console.log(
    'reqs',
    reqs.filter((u) => /auth|4000|login/.test(u)).slice(0, 20),
  );
  console.log('error', await page.locator('.jb-login__error').textContent().catch(() => null));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
