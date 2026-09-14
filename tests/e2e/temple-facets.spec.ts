import { test, expect } from '@playwright/test';

test('temple discovery facets persist in URL and restore through navigation', async ({ page }) => {
  await page.goto('/temples?arupadai=1');

  const search = page.getByRole('searchbox', { name: /கோயில் தேடல்|Search temples/ });
  const district = page.getByRole('combobox', { name: /மாவட்டம்|District/ });
  const state = page.getByRole('combobox', { name: /மாநிலம்|State/ });
  const arupadai = page.getByRole('checkbox', { name: /அறுபடை வீடு மட்டும்|Six Abodes only/ });

  await expect(arupadai).toBeChecked();
  await expect(page).toHaveURL(/\/temples\?arupadai=1$/);

  const firstArupadai = page.locator('.temple-list a').first();
  await expect(firstArupadai).toBeVisible();
  await expect(firstArupadai.getByText(/அறுபடை வீடு|Six Abodes/)).toBeVisible();

  // Exercise district persistence independently so the test never assumes
  // that an arbitrary district intersects the Six Abodes subset.
  await arupadai.uncheck();
  await district.selectOption({ index: 1 });
  const selectedDistrict = await district.inputValue();
  expect(selectedDistrict).not.toBe('');
  await expect(page).toHaveURL(new RegExp(`district=${encodeURIComponent(selectedDistrict)}`));
  await expect(page).not.toHaveURL(/arupadai=1/);
  await expect(page.locator('.temple-list a').first()).toBeVisible();

  // Exercise state persistence independently for the same reason.
  await district.selectOption('');
  await state.selectOption({ index: 1 });
  const selectedState = await state.inputValue();
  expect(selectedState).not.toBe('');
  await expect(page).toHaveURL(new RegExp(`state=${encodeURIComponent(selectedState)}`));
  await expect(page.locator('.temple-list a').first()).toBeVisible();

  const firstFiltered = page.locator('.temple-list a').first();
  await firstFiltered.click();
  await expect(page).toHaveURL(/\/temples\//);

  await page.goBack();
  await expect(state).toHaveValue(selectedState);
  await expect(arupadai).not.toBeChecked();
  await expect(page).toHaveURL(new RegExp(`state=${encodeURIComponent(selectedState)}`));

  await search.fill('Palani');
  await expect(page).toHaveURL(/q=Palani/);

  await page.getByRole('button', { name: /வடிகட்டிகளை அழி|Clear filters/ }).click();
  await expect(page).toHaveURL(/\/temples$/);
  await expect(search).toHaveValue('');
  await expect(district).toHaveValue('');
  await expect(state).toHaveValue('');
  await expect(arupadai).not.toBeChecked();
});
