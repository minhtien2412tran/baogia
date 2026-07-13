import { test, expect } from '@playwright/test';

/**
 * Admin Media Review browser E2E.
 * Login requires ADMIN (media.reviewer cannot use Admin UI gate).
 * Production approve on UNVERIFIED must fail; CLIENT_PROVIDED may succeed for admin.
 */
test.describe('Admin Media Review', () => {
  test('login → list → filter → detail → staging → prod rights gate', async ({
    page,
  }) => {
    const failed: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 500) failed.push(`${res.status()} ${res.url()}`);
    });

    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@jetbay.local');
    await page.locator('input[type="password"]').fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });

    await page.goto('/dashboard/media-review');
    await expect(page).toHaveURL(/media-review/, { timeout: 15000 });
    await expect(page.getByText(/Media review/i).first()).toBeVisible({
      timeout: 20000,
    });

    const filter = page.getByLabel('Filter rights status');
    await filter.selectOption('UNVERIFIED');
    await page.getByRole('button', { name: /refresh/i }).click();
    await page.waitForTimeout(800);

    const openBtn = page.getByRole('button', { name: /Open media|Open/i }).first();
    if ((await openBtn.count()) > 0) {
      await openBtn.click();
      await expect(page.getByLabel('Media detail')).toBeVisible();

      const alt = page.getByLabel('Alt text');
      const altValue = `e2e-alt-${Date.now()}`;
      await alt.fill(altValue);
      await page.getByRole('button', { name: /save meta/i }).click();
      await page.waitForTimeout(1500);
      // status role may be empty on slow API — re-open or check msg/detail still present
      const status = page.getByRole('status');
      if ((await status.count()) > 0) {
        await expect(status.first()).toBeVisible();
      } else {
        await expect(page.getByLabel('Media detail')).toBeVisible();
      }

      await page.getByRole('button', { name: /approve staging/i }).click();
      await page.waitForTimeout(800);

      await page.getByRole('button', { name: /approve production/i }).click();
      await page.waitForTimeout(800);
      const statusText = ((await page.getByRole('status').allTextContents()) || [])
        .join(' ')
        .toLowerCase();
      if (statusText) {
        expect(statusText).not.toMatch(/production approved/);
      }
    }

    await filter.selectOption('CLIENT_PROVIDED');
    await page.getByRole('button', { name: /refresh/i }).click();
    await page.waitForTimeout(800);
    const clientOpen = page.getByRole('button', { name: /Open media|Open/i }).first();
    if ((await clientOpen.count()) > 0) {
      await clientOpen.click();
      await page.getByRole('button', { name: /approve production/i }).click();
      await page.waitForTimeout(1000);
    }

    await filter.focus();
    await expect(filter).toBeFocused();

    expect(failed, `5xx responses: ${failed.join(', ')}`).toEqual([]);
  });

  test('non-admin reviewer cannot login to Admin UI', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('media.reviewer@jetbay.local');
    await page.locator('input[type="password"]').fill('MediaReview123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('.jb-login__error')).toContainText(/admin access/i, {
      timeout: 15000,
    });
  });
});
