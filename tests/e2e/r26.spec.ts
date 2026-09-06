import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('R2.6 product surfaces', () => {
  for (const route of ['/knowledge', '/library']) {
    test(`${route} renders, refreshes, and has no axe violations`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
      page.on('pageerror', (error) => errors.push(error.message));

      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
      expect(errors).toEqual([]);

      await page.reload();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }

  test('saving a temple is local-only and survives a reload', async ({ page }) => {
    await page.goto('/temples/ctm-tirupparankundram');
    await expect(page.getByRole('heading', { level: 1, name: 'திருப்பரங்குன்றம்' })).toBeVisible();
    await page.getByRole('button', { name: 'சேமி' }).click();
    await expect(page.getByRole('button', { name: 'சேமிக்கப்பட்டது' })).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/library');
    await expect(page.getByRole('heading', { level: 1, name: 'என் சேமிப்புகள்' })).toBeVisible();
    await expect(page.getByRole('link', { name: /திருப்பரங்குன்றம்/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('link', { name: /திருப்பரங்குன்றம்/ })).toBeVisible();
  });

  test('opening governed detail pages creates bounded local Recent entries', async ({ page }) => {
    await page.goto('/temples/ctm-tirupparankundram');
    await expect(page.getByRole('heading', { level: 1, name: 'திருப்பரங்குன்றம்' })).toBeVisible();
    await page.waitForFunction(() => localStorage.getItem('omsaravanabhava-hitech-library-v1')?.includes('ctm-tirupparankundram'));

    await page.goto('/thiruppugazh/thiruppugazh-0006');
    await expect(page.getByRole('heading', { level: 1, name: 'முத்தைத்தரு' })).toBeVisible();
    await page.waitForFunction(() => localStorage.getItem('omsaravanabhava-hitech-library-v1')?.includes('thiruppugazh-0006'));

    await page.goto('/library');
    const recent = page.getByRole('heading', { level: 2, name: 'சமீபத்தில் பார்த்தவை' }).locator('..').locator('..');
    await expect(recent).toContainText('திருப்பரங்குன்றம்');
    await expect(recent).toContainText('முத்தைத்தரு');
  });

  test('identifier-only Murugan-name records are not exposed as invented names', async ({ page }) => {
    await page.goto('/knowledge');
    await expect(page.getByText(/வெளியிடத்தக்க திருப்பெயர் உரைகள் இன்னும் இல்லை/)).toBeVisible();
    await expect(page.getByText(/அடையாளக் குறியீட்டிலிருந்து ஊகிக்காது/)).toBeVisible();

    await page.goto('/search');
    await page.getByLabel('தேடல் சொல்').fill('முருக');
    await page.getByRole('button', { name: 'முருகன் பெயர்கள்' }).click();
    await expect(page.getByText(/இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது/)).toBeVisible();
  });
});
