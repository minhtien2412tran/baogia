import { test, expect } from '@playwright/test';

const LOCALES = ['en-us'];
const VIEWPORTS = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

const ROUTES = [
  '/en-us',
  '/en-us/empty-leg',
  '/en-us/login',
  '/en-us/register',
  '/en-us/private-jet-charter',
];

test.describe('public branding smoke', () => {
  for (const vp of VIEWPORTS) {
    test(`homepage ${vp.name} no JetBay / no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (res) => {
        if (res.status() === 404 && /\.(png|jpe?g|svg|ico|webp)$/i.test(res.url())) {
          errors.push(`asset 404: ${res.url()}`);
        }
      });

      await page.goto('/en-us', { waitUntil: 'domcontentloaded' });
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/JetBay/i);
      expect(bodyText).not.toMatch(/demo@jetbay\.local/i);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 2;
      });
      expect(overflow).toBeFalsy();

      const logo = page.locator('.brand-logo, .jb-logo-img').first();
      if (await logo.count()) {
        const box = await logo.boundingBox();
        expect(box?.width ?? 0).toBeGreaterThan(40);
        expect(box?.height ?? 0).toBeGreaterThan(12);
      }

      expect(
        errors
          .filter((e) => !e.includes('favicon'))
          .filter((e) => !/hydration|Hydration/i.test(e))
          .slice(0, 5),
      ).toEqual([]);
      // Hydration must also be clean — assert separately with full message
      const hydration = errors.filter((e) => /hydration|Hydration/i.test(e));
      expect(hydration, hydration[0] ?? '').toEqual([]);
    });
  }

  test('booking widget swap + multi-city controls', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en-us', { waitUntil: 'domcontentloaded' });
    const swap = page.locator('button[aria-label*="swap" i], .jb-swap-btn').first();
    if (await swap.count()) {
      await swap.click();
    }
    const multi = page.getByRole('button', { name: /multi/i }).first();
    if (await multi.count()) {
      await multi.click();
      const add = page.getByRole('button', { name: /add/i }).first();
      if (await add.count()) await add.click();
    }
  });

  test('mobile menu open/close', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en-us', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /accept/i }).click({ timeout: 2000 }).catch(() => undefined);
    const open = page.getByRole('button', { name: /open menu/i });
    await open.click();
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
    await page.getByRole('button', { name: /close menu/i }).click();
  });

  test('login page has BrandLogo and no JetBay credentials leak', async ({ page }) => {
    await page.goto('/en-us/login', { waitUntil: 'domcontentloaded' });
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/JetBay/i);
    expect(text).not.toMatch(/demo@jetbay/i);
    await expect(page.locator('img[alt*="JetVina" i], .brand-logo, .jb-logo-img').first()).toBeVisible();
  });

  test('empty leg page loads', async ({ page }) => {
    await page.goto('/en-us/empty-leg', { waitUntil: 'domcontentloaded' });
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/\bJetBay\b/);
  });

  for (const route of ROUTES) {
    test(`route ${route} no JetBay DOM text`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/\bJetBay\b/);
    });
  }
});

test.describe('locale smoke', () => {
  for (const locale of LOCALES) {
    test(`${locale} header footer present`, async ({ page }) => {
      await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('header.jb-header')).toBeVisible();
      await expect(page.locator('footer.jb-footer')).toBeVisible();
    });
  }
});
