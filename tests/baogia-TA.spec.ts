import { test, expect } from '@playwright/test';

test.describe('baogia-TA Platform E2E Checks', () => {
  test.beforeAll(async ({ request }) => {
    // Wait up to 15 seconds for port 4000 to be ready (NestJS server startup)
    for (let i = 0; i < 15; i++) {
      try {
        const res = await request.get('http://localhost:4000/');
        if (res.ok()) return;
      } catch (e) {
        // ignore and retry
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });

  test('should load Public Web homepage on port 3000', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/Create Next App/);
  });

  test('should load Admin Dashboard homepage on port 3001', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await expect(page).toHaveTitle(/Create Next App/);
  });

  test('should access NestJS API root and return Hello World on port 4000', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    const content = await page.textContent('body');
    expect(content?.trim()).toBe('Hello World!');
  });

  test('should load NestJS Swagger UI on port 4000/swagger', async ({ page }) => {
    await page.goto('http://localhost:4000/swagger');
    const title = await page.title();
    expect(title).toBe('Swagger UI');
  });

  test('should load NestJS OpenAPI JSON spec on port 4000/openapi.json', async ({ request }) => {
    const response = await request.get('http://localhost:4000/openapi.json');
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.info.title).toBe('J - TA API');
  });
});
