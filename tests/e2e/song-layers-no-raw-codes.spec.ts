import { test, expect } from '@playwright/test';

/**
 * Regression: the song "Layers" panel showed the raw internal code
 * SOURCE_LINKED_TEXT_NOT_IMPORTED for almost every Thiruppugazh record.
 */
for (const id of ['thiruppugazh-0150', 'thiruppugazh-0001', 'thiruppugazh-1326']) {
  test(`/thiruppugazh/${id} Layers panel shows no raw state codes`, async ({ page }) => {
    await page.goto(`/thiruppugazh/${id}`);
    const layers = page.locator('section.layers');
    await expect(layers).toBeVisible();
    await expect(layers).not.toContainText(/[A-Z]{3,}_[A-Z]{3,}/);
  });
}
