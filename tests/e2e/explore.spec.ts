import { test, expect } from '@playwright/test';

test.describe('Explore Page', () => {
  test('should load explore page and show results', async ({ page }) => {
    await page.goto('/explore');
    
    // Check if the main heading is visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    // Check if the filter sidebar is rendered (it should have a clear filters or search button/inputs)
    const sidebar = page.locator('aside, .w-full.md\\:w-64').first();
    await expect(sidebar).toBeVisible();

    // Verify some text exists indicating it loaded (either destinations or "no results")
    const bodyText = page.locator('body');
    await expect(bodyText).toContainText(/found|No results found/i);
  });

  test('should update results when searching', async ({ page }) => {
    await page.goto('/explore');
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Candi');
      await searchInput.press('Enter');
      await expect(page).toHaveURL(/.*q=Candi/i);
    }
  });

  test('should show no results message for invalid search', async ({ page }) => {
    await page.goto('/explore?q=XYZINVALIDSEARCHQQQ123');
    const bodyText = page.locator('body');
    // Ensure we don't crash, but display a graceful empty state
    await expect(bodyText).toContainText(/No results|tidak ditemukan|tidak ada/i, { ignoreCase: true });
  });
});
