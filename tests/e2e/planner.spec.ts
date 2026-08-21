import { test, expect } from '@playwright/test';

test.describe('AI Planner (Protected)', () => {
  test('should load the AI planner page correctly', async ({ page }) => {
    await page.goto('/planner');
    
    // Check for the main heading of the planner
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    
    // It should have an input/textarea for the prompt
    const promptInput = page.locator('textarea, input[type="text"]').first();
    await expect(promptInput).toBeVisible();
    
    // Simulate typing a prompt
    await promptInput.fill('Saya ingin liburan ke Candi Prambanan');
    
    // It should have a generate/submit button
    const generateBtn = page.getByRole('button', { name: /generate|buat|plan/i }).first();
    await expect(generateBtn).toBeVisible();
  });
});
