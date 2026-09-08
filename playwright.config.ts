import { defineConfig, devices } from '@playwright/test';

/**
 * Browser-only qualification: viewports, real focus rings, reduced motion,
 * offline/service-worker behaviour and axe accessibility scans.
 * Runs in CI; see docs/QA_BASELINE.md for what is covered where.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    // Sandbox-only accommodation: some CI-equivalent sandboxes have an
    // already-installed Chromium revision that doesn't match the exact
    // headless-shell build this Playwright version wants, and their egress
    // policy blocks re-downloading it from cdn.playwright.dev. Real CI
    // always runs `playwright install --with-deps chromium` first and never
    // sets this var, so this is a no-op there — the real browser download is
    // exercised, not bypassed.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    // Bind explicitly to IPv4. Vite's localhost binding can resolve to ::1 on
    // hosted Linux runners while Playwright probes 127.0.0.1, which makes the
    // server appear unavailable until the webServer timeout even though the
    // build itself is healthy.
    command: 'pnpm exec vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'small-mobile-320', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } } },
    { name: 'mobile-390', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // R2.2 priority 1: expanded browser qualification.
    { name: 'desktop-1920', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
    { name: 'mobile-landscape-844x390', use: { ...devices['Desktop Chrome'], viewport: { width: 844, height: 390 } } },
  ],
});
