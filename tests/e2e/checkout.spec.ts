import { test, expect } from '@playwright/test';

test.describe('Checkout & Booking Flow (Authenticated)', () => {
  test('should be able to navigate to checkout from destination detail', async ({ page }) => {
    // Navigate to a known destination if available, otherwise just use /explore to click the first one
    await page.goto('/explore');
    
    // Wait for the first destination link and click it
    const firstDestinationLink = page.locator('a[href^="/destinations/"], a[href^="/detail/"]').first();
    
    if (await firstDestinationLink.isVisible()) {
      await firstDestinationLink.evaluate((node) => (node as HTMLElement).click());
      
      // We are on detail page. Let's find the "Book" button.
      const bookBtn = page.getByRole('button', { name: /book|pesan/i }).first();
      await expect(bookBtn).toBeVisible();
      
      // Try to click it (some might require date selection first, so we just check it exists)
      // If we can click it, we should be taken to checkout
      await bookBtn.click();
      
      // See if it redirects to checkout or opens a modal
      // We'll give it a generous timeout just in case it's a slow transition
      await page.waitForTimeout(2000);
      
      const isCheckout = page.url().includes('checkout');
      const hasModal = await page.locator('dialog, [role="dialog"]').isVisible();
      
      expect(isCheckout || hasModal).toBe(true);
    }
  });
});
