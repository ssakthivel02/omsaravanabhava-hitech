import { test, expect } from '@playwright/test';

test('temple search persists in the URL and survives detail back-navigation', async ({ page }) => {
  await page.goto('/temples?q=Palani');

  const search = page.getByRole('searchbox', { name: /கோயில் தேடல்|Search temples/ });
  await expect(search).toHaveValue('Palani');
  await expect(page).toHaveURL(/\/temples\?q=Palani$/);

  const firstTemple = page.locator('a.temple-row').first();
  await expect(firstTemple).toBeVisible();
  const detailHref = await firstTemple.getAttribute('href');
  expect(detailHref).toMatch(/^\/temples\//);

  await firstTemple.click();
  await expect(page).toHaveURL(new RegExp(`${detailHref!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/temples\?q=Palani$/);
  await expect(search).toHaveValue('Palani');

  await search.fill('');
  await expect(page).toHaveURL(/\/temples$/);
});
