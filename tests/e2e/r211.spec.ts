import { expect, test } from '@playwright/test';

test.describe('R2.11 Thiruppugazh catalogue browser qualification', () => {
  test('publishes truthful corpus coverage and source lanes', async ({ page }) => {
    await page.goto('/thiruppugazh');

    await expect(page.getByRole('heading', { level: 1, name: 'திருப்புகழ்' })).toBeVisible();
    // The corpus number also legitimately appears in explanatory prose and
    // the Part IV range. Target the exact stat value rather than relying on
    // a substring text locator, so this remains stable as truthful context
    // is added around the number.
    await expect(page.getByText('1326', { exact: true })).toBeVisible();
    await expect(page.getByText('12', { exact: true })).toBeVisible();
    // Source-part names also appear in the filter options by design. Verify
    // at least one visible rendered source label rather than requiring the
    // string to occur only once in the DOM.
    await expect(page.getByText('Project Madurai Part I', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Project Madurai Part IV', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('1001–1326', { exact: true })).toBeVisible();

    const bodyWidth = await page.locator('body').evaluate((body) => body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('searches verified entries without inventing missing songs', async ({ page }) => {
    await page.goto('/thiruppugazh');

    await page.getByLabel('திருப்புகழ் தேடல்').fill('முத்தைத்தரு');
    await expect(page.getByRole('link', { name: /முத்தைத்தரு/ })).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 12')).toBeVisible();

    await page.getByLabel('மூல பகுதி').selectOption('part-2');
    await expect(page.getByText(/இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை/)).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 0 / 12')).toBeVisible();
  });

  test('keeps corpus-reference links external and source-labelled', async ({ page }) => {
    await page.goto('/thiruppugazh');
    const firstSource = page.getByRole('link', { name: 'மூலத்தை காண்க' }).first();
    await expect(firstSource).toHaveAttribute('target', '_blank');
    await expect(firstSource).toHaveAttribute('href', /projectmadurai\.org/);
  });
});
