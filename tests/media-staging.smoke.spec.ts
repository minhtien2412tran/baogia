import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

const ROUTES = [
  '/en-us',
  '/en-us/empty-leg',
  '/en-us/private-jet-charter',
  '/en-us/news',
  '/en-us/login',
  '/en-us/register',
  '/en-us/this-route-does-not-exist-404',
];

test.describe('media staging review', () => {
  for (const vp of VIEWPORTS) {
    test(`staging ${vp.name} homepage media`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors: string[] = [];
      const assetFails: string[] = [];
      page.on('pageerror', (e) => consoleErrors.push(e.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('response', (res) => {
        const url = res.url();
        if (res.status() >= 400 && /\.(png|jpe?g|svg|webp|avif|gif|css|js)(\?|$)/i.test(url)) {
          if (!/favicon/i.test(url)) assetFails.push(`${res.status()} ${url}`);
        }
      });

      await page.goto('/en-us', { waitUntil: 'domcontentloaded' });
      const html = await page.content();
      expect(html).not.toMatch(/\/assets\/jetbay\//i);
      expect(await page.locator('body').innerText()).not.toMatch(/\bJetBay\b/);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      );
      expect(overflow).toBeFalsy();

      const hydration = consoleErrors.filter((e) => /hydration|Hydration/i.test(e));
      expect(hydration, hydration[0] ?? '').toEqual([]);
      expect(assetFails.slice(0, 8), assetFails[0] ?? '').toEqual([]);
    });
  }

  for (const route of ROUTES) {
    test(`staging route ${route} no jetbay assets`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      const jetbayHits: string[] = [];
      page.on('request', (req) => {
        if (/\/assets\/jetbay\//i.test(req.url())) jetbayHits.push(req.url());
      });
      const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
      if (route.includes('404')) {
        expect(res?.status()).toBeGreaterThanOrEqual(400);
      } else {
        expect(res?.status()).toBeLessThan(400);
      }
      expect(jetbayHits, jetbayHits[0] ?? '').toEqual([]);
      const html = await page.content();
      expect(html).not.toMatch(/\/assets\/jetbay\//i);
    });
  }
});
