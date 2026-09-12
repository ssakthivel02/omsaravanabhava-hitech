import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'omsaravanabhava-hitech-ui-locale-v1';

async function switchLocale(page: import('@playwright/test').Page, locale: 'ta' | 'en' | 'te' | 'ml' | 'kn' | 'hi') {
  await page.getByRole('combobox', { name: 'Interface language / இடைமுக மொழி' }).selectOption(locale);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
}

async function switchToEnglish(page: import('@playwright/test').Page) {
  await switchLocale(page, 'en');
}

async function switchToTamil(page: import('@playwright/test').Page) {
  await switchLocale(page, 'ta');
}

test.describe('R2.13 local-first multilingual interface', () => {
  test('defaults to Tamil and switches the shared shell to English', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
    await expect(page.getByRole('link', { name: 'அறுபடை வீடு' }).first()).toBeVisible();

    await switchToEnglish(page);
    await expect(page.getByRole('link', { name: 'Six Abodes' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Through the Vel');
    await expect(page).toHaveTitle(/Murugan devotional knowledge/i);

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).toBe('en');
  });

  test('persists English across reload and can return to Tamil', async ({ page }) => {
    await page.goto('/knowledge');
    await switchToEnglish(page);
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Murugan Knowledge');
    await expect(page).toHaveTitle(/Murugan Knowledge/i);

    await switchToTamil(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('முருகன் அறிவுக் களம்');
    await expect(page).toHaveTitle(/முருகன் அறிவுக் களம்/);
  });

  test('switches the shared shell across the four added Indian languages', async ({ page }) => {
    await page.goto('/');

    const cases = [
      { locale: 'te' as const, home: 'ఓం శరవణభవ — హోమ్' },
      { locale: 'ml' as const, home: 'ഓം ശരവണഭവ — ഹോം' },
      { locale: 'kn' as const, home: 'ಓಂ ಶರವಣಭವ — ಮುಖಪುಟ' },
      { locale: 'hi' as const, home: 'ॐ सरवणभव — मुखपृष्ठ' },
    ];

    for (const item of cases) {
      await switchLocale(page, item.locale);
      await expect(page.getByRole('link', { name: item.home })).toBeVisible();
      const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(stored).toBe(item.locale);
    }
  });

  test('localizes route metadata when language changes', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveTitle(/தேடல்/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /தமிழ்/);

    await switchToEnglish(page);
    await expect(page).toHaveTitle(/Search — Om Saravana Bhava/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Search source-aware Murugan content/i);
  });

  test('keeps canonical Tamil content Tamil while English UI is active', async ({ page }) => {
    await page.goto('/temples/ctm-tirupparankundram');
    await switchToEnglish(page);

    await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'en');
    await expect(page.locator('.latin-name[lang="ta"]').first()).toBeVisible();

    await page.goto('/thiruppugazh/thiruppugazh-0006');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'ta');
    await expect(page.locator('.latin-name[lang="en"]')).toBeVisible();
  });

  test('mobile menu remains usable in both interface languages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByRole('button', { name: 'பட்டி' }).click();
    await expect(page.getByRole('navigation', { name: 'முதன்மை வழிசெலுத்தல்' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'கோயில்கள்' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'மூடு' }).click();
    await switchToEnglish(page);
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Temples' }).first()).toBeVisible();
  });
});
