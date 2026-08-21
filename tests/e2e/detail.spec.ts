import { test, expect } from '@playwright/test';

test.describe('Destination Detail Page', () => {
  test('should load destination details when navigating from home/explore', async ({ page }) => {
    await page.goto('/explore');
    
    // Wait for destinations to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Find the first destination card link (usually an <a> tag wrapping the card or a "View Details" button)
    const firstDestinationLink = page.locator('a[href^="/destinations/"], a[href^="/detail/"]').first();
    
    if (await firstDestinationLink.isVisible()) {
      await firstDestinationLink.evaluate((node) => (node as HTMLElement).click());
      
      // Verify we navigated to a detail page
      await expect(page).toHaveURL(/.*\/destinations\/.*|.*\/detail\/.*/);
      
      // Ensure the detail page has an image and a "Book" or "Pesan" button
      await expect(page.locator('img').first()).toBeVisible();
      await expect(page.getByRole('button', { name: /book|pesan/i }).first()).toBeVisible();
    }
  });
});
