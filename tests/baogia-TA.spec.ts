import { test, expect } from '@playwright/test';

test.describe('J-TA Platform E2E', () => {
  test('web home loads with J-TA branding', async ({ page }) => {
    await page.goto('http://localhost:3000/en');
    await expect(page.getByText('Global Private Jet Charter')).toBeVisible();
    await expect(page.getByText('Fixed-Price Charter Routes')).toBeVisible();
  });

  test('admin dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 15000 });
  });

  test('API health and swagger', async ({ request }) => {
    const root = await request.get('http://127.0.0.1:4000/');
    expect(root.ok()).toBeTruthy();
    const spec = await request.get('http://127.0.0.1:4000/openapi.json');
    expect(spec.ok()).toBeTruthy();
    const json = await spec.json();
    expect(json.info.title).toBe('J - TA API');
  });

  test('fixed price page shows routes from API', async ({ page }) => {
    await page.goto('http://localhost:3000/en/fixed-price-charter');
    await expect(page.getByRole('heading', { name: /London → Paris/i })).toBeVisible({ timeout: 10000 });
  });

  test('quote form validation', async ({ page }) => {
    await page.goto('http://localhost:3000/en');
    await page.getByRole('button', { name: /Search Available Aircraft/i }).click();
    await expect(page.getByText(/Quote request received|contact you within/i)).toBeVisible({ timeout: 15000 });
  });
});
