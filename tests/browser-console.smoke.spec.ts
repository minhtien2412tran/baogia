import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const ALLOWED_CONSOLE = [
  // Next.js / React DevTools / remote image decode noise (not app bugs)
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  /\[HMR\]/i,
  // JetVina CDN may be unreachable from some CI runners
  /Failed to load resource:.*jetvina\.com/i,
  /net::ERR_.*jetvina\.com/i,
];

async function collectPageIssues(page: Page) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const failed: string[] = [];

  page.on('console', (msg: ConsoleMessage) => {
    const text = msg.text();
    if (ALLOWED_CONSOLE.some((r) => r.test(text))) return;
    // Intentional missing route — browser logs 404 for document or chunk
    if (msg.type() === 'error' && /status of 404/i.test(text) && /Not Found/i.test(text)) return;
    if (msg.type() === 'error') errors.push(text);
    if (msg.type() === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Allow third-party analytics / font failures; fail on local assets
    if (url.includes('localhost') || url.includes('minhtien') || url.includes('/placeholders/') || url.includes('/brand/')) {
      failed.push(`${req.failure()?.errorText ?? 'failed'} ${url}`);
    }
  });

  return { errors, warnings, failed };
}

test.describe('browser console clean', () => {
  for (const route of ['/en-us', '/en-us/empty-leg', '/en-us/login', '/en-us/register']) {
    test(`${route} has no console errors`, async ({ page }) => {
      const bag = await collectPageIssues(page);
      const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(res?.ok() || res?.status() === 304).toBeTruthy();
      await page.waitForTimeout(800);
      expect(bag.errors, bag.errors.join('\n')).toEqual([]);
      expect(
        bag.failed.filter((f) => !/favicon|apple-touch/i.test(f)),
        bag.failed.join('\n'),
      ).toEqual([]);
    });
  }

  test('404 page has no console errors', async ({ page }) => {
    const bag = await collectPageIssues(page);
    await page.goto('/en-us/this-route-does-not-exist-xyz', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    expect(bag.errors, bag.errors.join('\n')).toEqual([]);
  });
});

test.describe('AirportInput a11y', () => {
  test('combobox keyboard + unique ids', async ({ page }) => {
    await page.goto('/en-us', { waitUntil: 'domcontentloaded' });
    const from = page.locator('input[role="combobox"]').first();
    const to = page.locator('input[role="combobox"]').nth(1);
    await expect(from).toBeVisible({ timeout: 15000 });
    const fromId = await from.getAttribute('id');
    const toId = await to.getAttribute('id');
    expect(fromId).toBeTruthy();
    expect(toId).toBeTruthy();
    expect(fromId).not.toEqual(toId);

    await from.fill('HAN');
    await page.waitForTimeout(400);
    const listId = await from.getAttribute('aria-controls');
    expect(listId).toBeTruthy();
    const list = page.locator(`#${listId}`);
    // May be open after debounce
    await from.press('ArrowDown');
    await from.press('Escape');
    await expect(from).toHaveAttribute('aria-expanded', 'false');
  });
});
