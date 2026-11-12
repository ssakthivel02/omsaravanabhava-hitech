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
