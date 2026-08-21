import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Opt out of authenticated state for auth tests
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Register page should have required fields and submit button', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: /sign up|register/i })).toBeVisible();
    await expect(page.locator('input[name="fname"]')).toBeVisible();
    await expect(page.locator('input[name="lname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up', exact: true })).toBeVisible();
  });

  test('Password visibility toggle changes input type', async ({ page }) => {
    await page.goto('/register');
    const passwordInput = page.locator('input[name="password"]');
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click the eye icon (it's the only lucide icon inside the relative div containing the password input)
    await page.locator('.lucide-eye-off').click();
    
    // Should change to text type
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('Registration with invalid email format shows validation error', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="fname"]', 'Test');
    await page.fill('input[name="lname"]', 'User');
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="password"]', 'Password123!');
    
    // The browser usually blocks submission of invalid emails natively via type="email"
    // We can evaluate if the form is valid
    const isEmailValid = await page.$eval('input[name="email"]', (el: HTMLInputElement) => el.checkValidity());
    expect(isEmailValid).toBe(false);
  });

  test('Login page shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword123');
    
    // Submit
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Normally we would wait for an error message to appear
    // The exact selector depends on your error alert component
    const errorMessage = page.locator('.text-error-500, [role="alert"]').first();
    // Since Supabase might take a moment, we wait for the error message
    // If the error message doesn't appear, this test will fail, indicating a bug in error handling!
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});
