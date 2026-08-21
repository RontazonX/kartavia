import { test, expect } from '@playwright/test';

test.describe('Dashboard (Unauthenticated)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect unauthenticated user from /profile to /login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*\/login/);
  });
});

test.describe('Dashboard (Authenticated)', () => {
  test('should load dashboard for authenticated user', async ({ page }) => {
    await page.goto('/dashboard');
    // Shouldn't redirect to login
    const isLogin = page.url().includes('login');
    expect(isLogin).toBe(false);
    
    // Check if dashboard heading is visible
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });
});
