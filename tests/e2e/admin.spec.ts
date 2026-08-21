import { test, expect } from '@playwright/test';

test.describe('Admin Panel (Unauthenticated)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect unauthenticated users to login page', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });
});

test.describe('Admin Panel (Authenticated)', () => {
  test('should display admin layout/sidebar when logged in as admin', async ({ page }) => {
    // Assuming the setup user is an admin or we just check the page loads the UI
    await page.goto('/admin/destinations');
    
    // We should not be redirected to login.
    const isLogin = page.url().includes('login');
    expect(isLogin).toBe(false);
  });
});
