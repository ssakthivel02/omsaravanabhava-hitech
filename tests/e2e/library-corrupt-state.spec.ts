import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'omsaravanabhava-hitech-library-v1';

test('library recovers safely from malformed and unsupported local state', async ({ page }) => {
  await page.goto('/');

  await page.evaluate((key) => localStorage.setItem(key, '{not-valid-json'), STORAGE_KEY);
  await page.goto('/library');
  await expect(page.getByRole('heading', { level: 1, name: /என் சேமிப்புகள்|My Library/ })).toBeVisible();
  await expect(page.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை|No records have been saved yet/)).toBeVisible();
  await expect(page.getByText(/சமீபப் பதிவுகள் இன்னும் இல்லை|No recent records yet/)).toBeVisible();

  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify({
      version: 999,
      saved: [{ type: 'temple', id: 'ctm-tirupparankundram', savedAt: new Date().toISOString() }],
      recent: [{ type: 'temple', id: 'ctm-tirupparankundram', visitedAt: new Date().toISOString() }],
    }));
  }, STORAGE_KEY);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: /என் சேமிப்புகள்|My Library/ })).toBeVisible();
  await expect(page.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை|No records have been saved yet/)).toBeVisible();
  await expect(page.getByText(/சமீபப் பதிவுகள் இன்னும் இல்லை|No recent records yet/)).toBeVisible();
});
