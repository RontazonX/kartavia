# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> authenticate
- Location: tests\e2e\auth.setup.ts:6:6

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="fname"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - complementary [ref=e3]:
    - heading "Privasi dan analitik" [level=2] [ref=e4]
    - paragraph [ref=e5]:
      - text: Izinkan data penggunaan anonim untuk membantu MyIPM meningkatkan layanan. Informasi selengkapnya tersedia di
      - link "Kebijakan Privasi" [ref=e6] [cursor=pointer]:
        - /url: https://ipm.my.id/privacy
      - text: .
    - generic [ref=e7]:
      - button "Tolak" [ref=e8]
      - button "Izinkan analitik" [ref=e9]
  - generic [ref=e10]:
    - generic:
      - img "Mascot"
    - generic [ref=e11]:
      - banner [ref=e12]:
        - img "Logo" [ref=e13]
        - generic [ref=e14]: Command Center Access Request
        - heading "DAFTAR ORGANISASI." [level=1] [ref=e15]
      - generic [ref=e16]: Pernah punya akun organisasi atau level PW? Silakan masuk memakai username dan password lama. Pendaftaran mandiri saat ini hanya untuk PD, PC, dan PR.
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]: Level Pimpinan
            - combobox "Level Pimpinan" [ref=e21]:
              - option "Pilih level pimpinan" [disabled] [selected]
              - option "Daerah (PD)"
              - option "Cabang (PC)"
              - option "Ranting (PR)"
          - generic [ref=e22]:
            - generic [ref=e23]: Nama Pimpinan / Struktur
            - textbox "Nama Pimpinan / Struktur" [disabled] [ref=e24]:
              - /placeholder: Pilih level pimpinan dulu
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]: Email untuk Login
            - textbox "Email untuk Login" [ref=e28]:
              - /placeholder: nama@gmail.com
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Password Sesi
              - textbox "Password Sesi" [ref=e32]:
                - /placeholder: ••••••••
            - generic [ref=e33]:
              - generic [ref=e34]: Konfirmasi Password
              - textbox "Konfirmasi Password" [ref=e35]:
                - /placeholder: ••••••••
        - button "Daftar & Lanjutkan" [ref=e39]
      - contentinfo [ref=e40]:
        - paragraph [ref=e41]:
          - text: Sudah memiliki akses?
          - link "Masuk Sekarang" [ref=e42] [cursor=pointer]:
            - /url: /login/
```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
  5  | 
  6  | setup('authenticate', async ({ page }) => {
  7  |   // We perform a real registration here to ensure we have a fresh, valid user for tests.
  8  |   // This generates a random email so it doesn't conflict with database constraints.
  9  |   const randomId = Math.floor(Math.random() * 1000000);
  10 |   const email = `testuser${randomId}@example.com`;
  11 |   
  12 |   await page.goto('/register');
> 13 |   await page.fill('input[name="fname"]', 'Test');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  14 |   await page.fill('input[name="lname"]', 'User');
  15 |   await page.fill('input[name="email"]', email);
  16 |   await page.fill('input[name="password"]', 'Password123!');
  17 |   
  18 |   // Submit the form
  19 |   await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
  20 |   
  21 |   // Wait until the page redirects to /dashboard (or wherever it goes after successful signup)
  22 |   // Or wait for the network request to finish and UI to update
  23 |   await page.waitForURL(/.*\/dashboard/, { timeout: 15000 }).catch(() => {
  24 |     console.log('Did not redirect to dashboard immediately, continuing anyway to save state.');
  25 |   });
  26 |   
  27 |   // End of authentication steps.
  28 |   await page.context().storageState({ path: authFile });
  29 | });
  30 | 
```