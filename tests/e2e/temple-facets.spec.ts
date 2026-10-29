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

  await firstArupadai.click();
  await expect(page).toHaveURL(/\/temples\//);

  await page.goBack();
  await expect(page).toHaveURL(/\/temples\?arupadai=1$/);
  await expect(arupadai).toBeChecked();

  // District/state controls are intentionally rendered only when the current
  // governed corpus actually contains values. Exercise them when available;
  // never manufacture an option merely to make the browser test pass.
  if ((await district.count()) > 0) {
    const options = district.locator('option');
    expect(await options.count()).toBeGreaterThan(1);
    await arupadai.uncheck();
    await district.selectOption({ index: 1 });
    const selectedDistrict = await district.inputValue();
    expect(selectedDistrict).not.toBe('');
    await expect.poll(() => new URL(page.url()).searchParams.get('district')).toBe(selectedDistrict);
    await expect(page.locator('.temple-list a').first()).toBeVisible();
    await district.selectOption('');
  }

  if ((await state.count()) > 0) {
    const options = state.locator('option');
    expect(await options.count()).toBeGreaterThan(1);
    await arupadai.uncheck();
    await state.selectOption({ index: 1 });
    const selectedState = await state.inputValue();
    expect(selectedState).not.toBe('');
    await expect.poll(() => new URL(page.url()).searchParams.get('state')).toBe(selectedState);
    await expect(page.locator('.temple-list a').first()).toBeVisible();
    await state.selectOption('');
  }

  if (await arupadai.isChecked()) {
    await arupadai.uncheck();
  }
  await search.fill('Palani');
  await expect(page).toHaveURL(/q=Palani/);
  await expect(page.locator('.temple-list a').first()).toBeVisible();

  await page.getByRole('button', { name: /வடிகட்டிகளை அழி|Clear filters/ }).click();
  await expect(page).toHaveURL(/\/temples$/);
  await expect(search).toHaveValue('');
  await expect(arupadai).not.toBeChecked();
  if ((await district.count()) > 0) await expect(district).toHaveValue('');
  if ((await state.count()) > 0) await expect(state).toHaveValue('');
});
