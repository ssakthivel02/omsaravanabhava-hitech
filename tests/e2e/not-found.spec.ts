import { test, expect } from '@playwright/test';

test('unknown top-level route fails gracefully and recovers home', async ({ page }) => {
  await page.goto('/not-a-real-page');

  await expect(
    page.getByRole('heading', { level: 1, name: /பக்கம் காணப்படவில்லை|Page not found/ }),
  ).toBeVisible();

  const home = page.getByRole('link', { name: /^(முகப்பு|Home)$/ });
  await expect(home).toBeVisible();
  await home.click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
