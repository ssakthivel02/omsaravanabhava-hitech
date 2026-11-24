import { expect, test } from '@playwright/test';

test('Panchangam route shows Tamil pending notice and no invented time fields', async ({ page }) => {
  await page.goto('/daily-panchangam');
  await expect(page.getByRole('heading', { name: 'இன்றைய தமிழ் பஞ்சாங்கம்' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('தகவல் சரிபார்ப்பு நடைபெறுகிறது');
  await expect(page.getByRole('status')).toContainText('உறுதிப்படுத்தப்படாத சுபநேரங்களை');
  await expect(page.getByRole('region', { name: 'சரிபார்க்கப்பட்ட பஞ்சாங்கம்' })).toHaveCount(0);
});

test('Panchangam pending state remains accessible at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/daily-panchangam');
  await expect(page.getByRole('heading', { name: 'இன்றைய தமிழ் பஞ்சாங்கம்' })).toBeVisible();
  await expect(page.getByRole('status')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('Panchangam recovers from HTTP failure without publishing unverified values', async ({ page }) => {
  let requests = 0;
  await page.route('**/panchangam/today.json', async (route) => {
    requests += 1;
    if (requests === 1) {
      await route.fulfill({ status: 503, body: 'Unavailable' });
      return;
    }
    await route.fulfill({ json: { status: 'pending', noticeTa: 'சரிபார்ப்பு நிலுவையில் உள்ளது.' } });
  });
  await page.goto('/daily-panchangam');
  const status = page.getByRole('status');
  await expect(status).toContainText('தினசரி தகவலை இப்போது பெற முடியவில்லை.');
  const retry = page.getByRole('button', { name: 'மீண்டும் முயற்சிக்கவும்' });
  await retry.click();
  await expect(status).toContainText('சரிபார்ப்பு நிலுவையில் உள்ளது.');
  await expect(status).not.toContainText('தினசரி தகவலை இப்போது பெற முடியவில்லை.');
  await expect(retry).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'சரிபார்க்கப்பட்ட பஞ்சாங்கம்' })).toHaveCount(0);
  expect(requests).toBe(2);
});

test('Panchangam refreshes at Chennai midnight without publishing unapproved records', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-19T18:29:50Z') });
  let requests = 0;
  // Synthetic test data only; never use this fixture as a publication source.
  const fixture = {
    schemaVersion: '1.0', date: '2026-11-19', timezone: 'Asia/Kolkata',
    location: { name: 'Chennai' }, status: 'verified',
    source: { provider: 'Test fixture', citation: 'https://example.org/test', licence: 'test-only' },
    calculation: { method: 'Synthetic', verifiedAt: '2026-11-19T18:00:00Z' },
    fields: { tithi: 'a', nakshatra: 'b', yoga: 'c', karana: 'd', rahuKalam: 'e', yamagandam: 'f', nallaNeram: 'g' },
  };
  await page.route('**/panchangam/today.json', async (route) => {
    requests += 1;
    await route.fulfill({ json: fixture });
  });
  await page.goto('/daily-panchangam');
  const verified = page.getByRole('region', { name: 'சரிபார்க்கப்பட்ட பஞ்சாங்கம்' });
  await expect.poll(() => requests).toBe(1);
  await expect(verified).toHaveCount(0);
  await page.clock.runFor(11_000);
  await expect.poll(() => requests).toBe(2);
  await expect(verified).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('தகவல் சரிபார்ப்பு நடைபெறுகிறது');
});

test('Panchangam never renders unverified remote notice content', async ({ page }) => {
  const marker = 'UNVERIFIED_NOTICE_SENTINEL';
  let served = false;
  await page.route('**/panchangam/today.json', async (route) => {
    await route.fulfill({ json: {
      status: 'pending',
      noticeTa: marker,
      fields: { nallaNeram: marker },
    } });
    served = true;
  });
  await page.goto('/daily-panchangam');
  await expect.poll(() => served).toBe(true);
  await expect(page.getByRole('status')).toContainText('சரிபார்ப்பு நிலுவையில் உள்ளது.');
  await expect(page.getByText(marker, { exact: false })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'சரிபார்க்கப்பட்ட பஞ்சாங்கம்' })).toHaveCount(0);
});
