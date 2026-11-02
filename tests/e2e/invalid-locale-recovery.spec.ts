import { test, expect } from '@playwright/test';

const localeStorageKey = 'omsaravanabhava-hitech-ui-locale-v1';

test('invalid persisted locale falls back safely to Tamil', async ({ page }) => {
  await page.addInitScript(({ key }) => {
    window.localStorage.setItem(key, 'xx-invalid-locale');
  }, { key: localeStorageKey });

  await page.goto('/');

  const language = page.getByRole('combobox', { name: 'Interface language / இடைமுக மொழி' });
  await expect(language).toHaveValue('ta');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('html')).toHaveAttribute('data-ui-locale', 'ta');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
