import { test, expect } from '@playwright/test';

const API = 'http://127.0.0.1:4000';
const WEB = 'http://localhost:3000';
const ADMIN = 'http://localhost:3001';

test.describe('JetBay Platform E2E', () => {
  test('web home loads with JetBay branding', async ({ page }) => {
    await page.goto(`${WEB}/en-us`);
    await expect(page.getByRole('heading', { name: /Global Private Jet Charter/i }).first()).toBeVisible();
    await expect(page.getByText('Fixed-Price Charter Routes')).toBeVisible();
  });

  test('vietnamese locale shows translated login', async ({ page }) => {
    await page.goto(`${WEB}/vi/login`);
    await expect(page.getByRole('link', { name: /Đăng nhập|Sign in/i })).toBeVisible({ timeout: 10000 });
  });

  test('account login page has OAuth section', async ({ page }) => {
    await page.goto(`${WEB}/en-us/login`);
    await expect(page.getByText(/Continue with Google|Continue with Apple/i).first()).toBeVisible();
  });

  test('admin dashboard loads after login', async ({ page, request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@jetbay.local', password: 'Admin123!' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const token = body.tokens?.accessToken as string;
    expect(token).toBeTruthy();

    await page.goto(`${ADMIN}/login`);
    await page.evaluate((t) => localStorage.setItem('jetbay_admin_token', t), token);
    await page.goto(`${ADMIN}/dashboard`);
    await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 15000 });
  });

  test('API health and swagger', async ({ request }) => {
    const root = await request.get(`${API}/`);
    expect(root.ok()).toBeTruthy();
    const spec = await request.get(`${API}/openapi.json`);
    expect(spec.ok()).toBeTruthy();
    const json = await spec.json();
    expect(json.info.title).toBe('JETBAY API');
  });

  test('API auth OTP dev flow', async ({ request }) => {
    const send = await request.post(`${API}/auth/otp/send`, {
      data: { phone: '+84909999999', purpose: 'LOGIN' },
    });
    expect(send.ok()).toBeTruthy();
    const body = await send.json();
    expect(body.sent).toBeTruthy();
    if (body.devCode) {
      const verify = await request.post(`${API}/auth/otp/verify-login`, {
        data: { phone: '+84909999999', code: body.devCode },
      });
      expect(verify.ok()).toBeTruthy();
      const login = await verify.json();
      expect(login.tokens?.accessToken).toBeTruthy();
    }
  });

  test('fixed price page shows routes from API', async ({ page }) => {
    await page.goto(`${WEB}/en-us/fixed-price-charter`);
    await expect(page.getByText('London').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('All fixed-price routes')).toBeVisible();
  });

  test('ski and golf destination pages', async ({ page }) => {
    await page.goto(`${WEB}/en-us/ski-destinations`);
    await expect(page.getByRole('heading', { name: /Ski/i })).toBeVisible({ timeout: 10000 });
    await page.goto(`${WEB}/en-us/golf-destinations`);
    await expect(page.getByRole('heading', { name: /Golf/i })).toBeVisible({ timeout: 10000 });
  });

  test('quote form submits successfully', async ({ page }) => {
    await page.goto(`${WEB}/en-us`);
    await page.locator('#email').fill('e2e@test.local');
    await page.getByRole('button', { name: /Search Available Aircraft/i }).click();
    await expect(
      page.getByText(/Quote request received|Available Aircraft|contact you within/i).first(),
    ).toBeVisible({ timeout: 20000 });
  });
});
