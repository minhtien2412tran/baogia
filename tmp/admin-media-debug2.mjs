import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3011/login');
  await page.locator('input[type="email"]').fill('admin@jetbay.local');
  await page.locator('input[type="password"]').fill('Admin123!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  const token1 = await page.evaluate(() => localStorage.getItem('jetbay_admin_token'));
  console.log('token1 len', token1?.length);
  await page.goto('http://127.0.0.1:3011/dashboard/media-review', {
    waitUntil: 'domcontentloaded',
  });
  const token2 = await page.evaluate(() => localStorage.getItem('jetbay_admin_token'));
  console.log('token2 len', token2?.length);
  console.log('url', page.url());
  await page.waitForTimeout(1500);
  console.log('url2', page.url());
  console.log('token3 len', (await page.evaluate(() => localStorage.getItem('jetbay_admin_token')))?.length);
  // client-side nav
  await page.goto('http://127.0.0.1:3011/login');
  await page.locator('input[type="email"]').fill('admin@jetbay.local');
  await page.locator('input[type="password"]').fill('Admin123!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  await page.evaluate(() => {
    window.location.href = '/dashboard/media-review';
  });
  await page.waitForTimeout(2000);
  console.log('spa-like url', page.url());
  console.log('body', (await page.locator('body').innerText()).slice(0, 500));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
