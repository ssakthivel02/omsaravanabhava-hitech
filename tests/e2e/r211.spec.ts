import { expect, test } from '@playwright/test';

test.describe('R2.11 Thiruppugazh catalogue browser qualification', () => {
  test('publishes truthful corpus coverage and source lanes', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await expect(page.getByRole('heading', { level: 1, name: 'திருப்புகழ்' })).toBeVisible();
    await expect(page.getByText('1326', { exact: true })).toBeVisible();
    await expect(page.getByText('325', { exact: true })).toBeVisible();
    await expect(page.getByText('Project Madurai Part I', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Project Madurai Part IV', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('1001–1326', { exact: true })).toBeVisible();
    const bodyWidth = await page.locator('body').evaluate((body) => body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('publishes validated song 1 metadata and keeps the song body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    const songOne = page.getByRole('link', { name: /விநாயகர் துதி.*1/ }).first();
    await expect(songOne).toBeVisible();
    await songOne.click();
    await expect(page).toHaveURL(/thiruppugazh-0001/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  const samples = [
    [30, 'அனைவரும் மருண்டு'], [50, 'கொங்கைகள்'], [75, 'பஞ்ச பாதகம்'], [100, 'விந்ததில் ஊறி'],
    [125, 'ஓடி ஓடி'], [150, 'குன்றுங் குன்றும்'], [175, 'பாரியான கொடை'], [200, 'வேய் இசைந்து'],
    [225, 'நிறைமதி முகமெனும்'], [250, 'எனை அடைந்த'], [275, 'தொக்கறாக் குடில்'], [300, 'வார் உற்று எழும்'],
  ] as const;

  for (const [number, opening] of samples) {
    test(`publishes validated song ${number} metadata and keeps its canonical body withheld`, async ({ page }) => {
      await page.goto('/thiruppugazh');
      await page.getByLabel('திருப்புகழ் தேடல்').fill(opening);
      const song = page.getByRole('link', { name: new RegExp(`${opening}.*${number}`) });
      await expect(song).toBeVisible();
      await expect(page.getByText('காட்டப்படுவது 1 / 325')).toBeVisible();
      await song.click();
      await expect(page).toHaveURL(new RegExp(`thiruppugazh-${String(number).padStart(4, '0')}`));
      await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
    });
  }

  test('publishes validated song 325 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('இறைச்சிப் பற்று');
    const songThreeHundredTwentyFive = page.getByRole('link', { name: /இறைச்சிப் பற்று.*325/ });
    await expect(songThreeHundredTwentyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 325')).toBeVisible();
    await songThreeHundredTwentyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-0325/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('searches verified entries without inventing missing songs', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('முத்தைத்தரு');
    await expect(page.getByRole('link', { name: /முத்தைத்தரு/ })).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 325')).toBeVisible();
    await page.getByLabel('மூல பகுதி').selectOption('part-2');
    await expect(page.getByText(/இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை/)).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 0 / 325')).toBeVisible();
  });

  test('keeps corpus-reference links external and source-labelled', async ({ page }) => {
    await page.goto('/thiruppugazh');
    const firstSource = page.getByRole('link', { name: 'மூலத்தை காண்க' }).first();
    await expect(firstSource).toHaveAttribute('target', '_blank');
    await expect(firstSource).toHaveAttribute('href', /projectmadurai\.org/);
  });
});
