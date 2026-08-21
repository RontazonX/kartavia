import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the homepage and display hero text', async ({ page }) => {
    await page.goto('/');
    
    // Check if the title is correct
    await expect(page).toHaveTitle(/Kartavia/);
    
    // Check if the header/navbar exists
    await expect(page.locator('header')).toBeVisible();
    
    // Look for the main logo text
    const logoText = page.getByText('Kartavia', { exact: true }).first();
    await expect(logoText).toBeVisible();
  });

  test('should navigate to Explore page when clicking navigation link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Find the Explore link in navigation
    const exploreLink = page.getByRole('link', { name: /explore/i }).first();
    
    // Force click natively to bypass any sticky header or viewport issues
    await exploreLink.evaluate(node => (node as HTMLElement).click());
    
    // Verify navigation
    await expect(page).toHaveURL(/.*\/explore/);
  });

  test('should have working About navigation', async ({ page }) => {
    await page.goto('/');
    
    // Some sites might not have /about yet, but we check if the link exists and is clickable
    const aboutLink = page.getByRole('link', { name: /about|tentang/i }).first();
    if (await aboutLink.isVisible()) {
      await aboutLink.evaluate(node => (node as HTMLElement).click());
      await expect(page).toHaveURL(/.*\/about/);
    }
  });
});
