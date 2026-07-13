import { test, expect } from '@playwright/test';

/**
 * Production-mode media: no requests to jetvina.com, no /assets/jetbay,
 * unverified JetVina must not appear — placeholders only unless approved fixture.
 *
 * Run with: pnpm test:e2e:media-production
 * (dedicated config on port 3015)
 */

const ROUTES = [
  '/en-us',
  '/en-us/empty-leg',
  '/en-us/private-jet-charter',
  '/en-us/news',
  '/en-us/login',
  '/en-us/register',
];

test.describe('media production no-hotlink', () => {
  for (const route of ROUTES) {
    test(`production ${route} blocks JetVina remote + JetBay`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const remoteJetvina: string[] = [];
      const jetbay: string[] = [];
      const assetFails: string[] = [];

      page.on('request', (req) => {
        const u = req.url();
        if (/https?:\/\/(www\.)?jetvina\.com\//i.test(u)) remoteJetvina.push(u);
        if (/\/assets\/jetbay\//i.test(u)) jetbay.push(u);
      });
      page.on('response', (res) => {
        const url = res.url();
        if (res.status() >= 400 && /\.(png|jpe?g|svg|webp|avif)(\?|$)/i.test(url) && !/favicon/i.test(url)) {
          assetFails.push(`${res.status()} ${url}`);
        }
      });

      const res = await page.goto(route, { waitUntil: 'networkidle' });
      expect(res?.status()).toBeLessThan(400);

      expect(remoteJetvina, remoteJetvina[0] ?? 'unexpected jetvina.com request').toEqual([]);
      expect(jetbay, jetbay[0] ?? 'unexpected /assets/jetbay request').toEqual([]);

      const html = await page.content();
      expect(html).not.toMatch(/https?:\/\/(www\.)?jetvina\.com\//i);
      expect(html).not.toMatch(/\/assets\/jetbay\//i);

      // Unverified mirrors must not render when production publish disabled
      const unverifiedLocal = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .map((img) => img.getAttribute('src') || '')
          .filter((s) => s.includes('/assets/jetvina/mirror/')),
      );
      expect(unverifiedLocal, unverifiedLocal[0] ?? '').toEqual([]);

      expect(assetFails.slice(0, 8), assetFails[0] ?? '').toEqual([]);
    });
  }
});
