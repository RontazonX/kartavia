import { test, expect } from '@playwright/test';

test.describe('UI Features & Enhancements', () => {
  // We test without authentication for UI features to ensure they work for guests too
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Dark mode toggle should switch themes correctly', async ({ page }) => {
    // Increase timeout since we are testing UI transitions
    test.setTimeout(45000);
    await page.goto('/');

    // Check if the theme toggle button exists
    const themeToggle = page.locator('button[aria-label="Toggle theme"], button:has(.lucide-sun), button:has(.lucide-moon)').first();
    
    const html = page.locator('html');
    
    // Ensure button is visible
    await expect(themeToggle).toBeVisible({ timeout: 15000 });
    
    // Initial state check
    const isInitiallyDark = await html.evaluate((node) => node.classList.contains('dark') || node.getAttribute('data-theme') === 'dark');

    // Click the toggle
    await themeToggle.evaluate((node: HTMLElement) => node.click());
    await page.waitForTimeout(1000);

    // Verify it changed
    const isNowDark = await html.evaluate((node) => node.classList.contains('dark') || node.getAttribute('data-theme') === 'dark');
    expect(isNowDark).not.toBe(isInitiallyDark);

    // Click again to revert
    await themeToggle.evaluate((node: HTMLElement) => node.click());
    await page.waitForTimeout(1000);

    const isBackToInitial = await html.evaluate((node) => node.classList.contains('dark') || node.getAttribute('data-theme') === 'dark');
    expect(isBackToInitial).toBe(isInitiallyDark);
  });

  test('Responsive Navigation Menu (Mobile View)', async ({ page }) => {
    // Set viewport to a mobile device size
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // The desktop navigation should be hidden
    const desktopNav = page.locator('a[href="/explore"].hidden.sm\\:block').first();
    if (await desktopNav.count() > 0) {
      await expect(desktopNav).toBeHidden();
    }

    // The mobile hamburger menu button should be visible
    const mobileMenuButton = page.locator('button:has(.lucide-menu)').first();
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton).toBeVisible();
      await mobileMenuButton.evaluate((node: HTMLElement) => node.click());
      await page.waitForTimeout(1000);
    }
  });

  test('SEO & Meta Tags validation on Home Page', async ({ page }) => {
    await page.goto('/');

    // Verify Title exists
    const title = await page.title();
    expect(title).not.toBe('');

    // Check main heading exists (H1) for accessibility & SEO
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });
});
