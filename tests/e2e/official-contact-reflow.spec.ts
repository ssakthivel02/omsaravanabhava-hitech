import { test, expect } from '@playwright/test';

/**
 * Regression: the "current official information" contact rows on the six
 * Arupadai Veedu temple pages contain long unbreakable strings (e.g. the
 * Swamimalai e-mail address). `.field` is a grid, and a grid item's
 * min-content width is the longest unbreakable run, which the site-wide
 * `overflow-wrap: break-word` does not reduce. Without `minmax(0, 1fr)` and
 * `overflow-wrap: anywhere` that forced ~83px of horizontal scrolling at 320px.
 */
const ARUPADAI_TEMPLES = [
  'ctm-tirupparankundram',
  'ctm-tiruchendur',
  'ctm-palani',
  'ctm-swamimalai',
  'ctm-tiruthani',
  'ctm-pazhamudircholai',
] as const;

for (const width of [320, 390]) {
  for (const id of ARUPADAI_TEMPLES) {
    test(`/temples/${id} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/temples/${id}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.official-current')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on /temples/${id} at ${width}px`).toBeLessThanOrEqual(1);
    });
  }
}
