import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'omsaravanabhava-hitech-library-v1';

test('stale saved library references remain recoverable and removable', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(
    ({ key }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          saved: [
            {
              type: 'thiruppugazh',
              id: 'removed-song-id',
              titleTa: 'பழைய திருப்புகழ் பதிவு',
              savedAt: '2026-01-01T00:00:00.000Z',
            },
          ],
          recent: [],
        }),
      );
    },
    { key: STORAGE_KEY },
  );

  await page.goto('/library');

  const savedSection = page.locator('section[aria-labelledby="saved-h"]');
  const staleItem = savedSection.locator('li.is-missing');

  await expect(staleItem).toBeVisible();
  await expect(staleItem.getByText('பழைய திருப்புகழ் பதிவு')).toBeVisible();
  await expect(staleItem.getByText(/இந்த வெளியீட்டில் பதிவு இல்லை|Not in this release/)).toBeVisible();

  const recoveryLink = staleItem.locator('a[href="/thiruppugazh"]');
  await expect(recoveryLink).toBeVisible();

  await staleItem.getByRole('button', { name: /^(நீக்கு|Remove)$/ }).click();
  await expect(savedSection.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை|No records have been saved yet/)).toBeVisible();
});
