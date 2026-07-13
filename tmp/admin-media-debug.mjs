import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3011/login');
  await page.locator('input[type="email"]').fill('admin@jetbay.local');
  await page.locator('input[type="password"]').fill('Admin123!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  console.log('after login', page.url());
  console.log('token', await page.evaluate(() => localStorage.getItem('jetbay_admin_token')?.slice(0, 12)));
  await page.goto('http://127.0.0.1:3011/dashboard/media-review');
  await page.waitForTimeout(2000);
  console.log('media url', page.url());
  console.log('body', (await page.locator('body').innerText()).slice(0, 800));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
