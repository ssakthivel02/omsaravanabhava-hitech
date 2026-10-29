import { test, expect } from '@playwright/test';

test('main search query and facet persist in URL and restore through navigation', async ({ page }) => {
  await page.goto('/search?q=Palani&type=temple');

  const input = page.getByRole('searchbox', { name: /தேடல் சொல்|Search term/ });
  await expect(input).toHaveValue('Palani');

  const templeFacet = page.getByRole('button', { name: /Temples \d+|கோயில்கள் \d+/ });
  await expect(templeFacet).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/search\?q=Palani&type=temple$/);

  const firstResult = page.locator('.search-results a').first();
  await expect(firstResult).toBeVisible();
  await firstResult.click();
  await expect(page).not.toHaveURL(/\/search/);

  await page.goBack();
  await expect(page).toHaveURL(/\/search\?q=Palani&type=temple$/);
  await expect(input).toHaveValue('Palani');
  await expect(templeFacet).toHaveAttribute('aria-pressed', 'true');

  await input.fill('Murugan');
  await expect(page).toHaveURL(/\/search\?q=Murugan&type=temple$/);

  const allFacet = page.getByRole('button', { name: /All \d+|அனைத்தும் \d+/ });
  await allFacet.click();
  await expect(page).toHaveURL(/\/search\?q=Murugan$/);

  await page.getByRole('button', { name: /Clear search|தேடலை அழி/ }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(input).toHaveValue('');
  await expect(allFacet).toHaveAttribute('aria-pressed', 'true');
});
