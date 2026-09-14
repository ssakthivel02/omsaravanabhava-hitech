import { test, expect } from '@playwright/test';

/**
 * R2-CODE-020 / manual-accessibility companion.
 *
 * A 320 CSS-pixel layout viewed at 200% browser zoom has roughly the same
 * horizontal content budget as a 160 CSS-pixel viewport. Playwright does not
 * expose a cross-browser "browser zoom" API, so this deliberately uses the
 * stricter equivalent-width reflow probe. Passing this does not replace
 * manual zoom/screen-reader acceptance evidence; it prevents obvious
 * horizontal-scroll regressions in the shell/footer before owner review.
 */
test('shell and footer reflow without horizontal scrolling at the 200% equivalent width', async ({ page }) => {
  await page.setViewportSize({ width: 160, height: 640 });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.site-footer')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const footerOverflow = await page.locator('.site-footer').evaluate(
    (footer) => footer.scrollWidth - footer.clientWidth,
  );
  expect(footerOverflow).toBeLessThanOrEqual(1);

  const trustNav = page.locator('.site-footer nav');
  await expect(trustNav).toBeVisible();
  await expect(trustNav.locator('a').first()).toBeVisible();
});
