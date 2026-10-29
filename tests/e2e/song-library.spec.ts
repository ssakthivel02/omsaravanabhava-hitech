import { test, expect } from '@playwright/test';

test('Thiruppugazh save and recent history remain independently recoverable', async ({ page }) => {
  const songHref = '/thiruppugazh/thiruppugazh-0006';

  await page.goto(songHref);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const save = page.getByRole('button', { name: /சேமி|Save/ }).first();
  await expect(save).toBeVisible();
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/library');
  const savedSection = page.locator('section[aria-labelledby="saved-h"]');
  const recentSection = page.locator('section[aria-labelledby="recent-h"]');
  const songLink = `a[href="${songHref}"]`;

  await expect(savedSection.locator(songLink)).toBeVisible();
  await expect(recentSection.locator(songLink)).toBeVisible();

  await savedSection.getByRole('button', { name: /^(நீக்கு|Remove)$/ }).click();
  await expect(savedSection.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை|No records have been saved yet/)).toBeVisible();

  await expect(recentSection.locator(songLink)).toBeVisible();
});
