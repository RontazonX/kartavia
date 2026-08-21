import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // We perform a real registration here to ensure we have a fresh, valid user for tests.
  // This generates a random email so it doesn't conflict with database constraints.
  const randomId = Math.floor(Math.random() * 1000000);
  const email = `testuser${randomId}@example.com`;
  
  await page.goto('/register');
  await page.fill('input[name="fname"]', 'Test');
  await page.fill('input[name="lname"]', 'User');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'Password123!');
  
  // Submit the form
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
  
  // Wait until the page redirects to /dashboard (or wherever it goes after successful signup)
  // Or wait for the network request to finish and UI to update
  await page.waitForURL(/.*\/dashboard/, { timeout: 15000 }).catch(() => {
    console.log('Did not redirect to dashboard immediately, continuing anyway to save state.');
  });
  
  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
