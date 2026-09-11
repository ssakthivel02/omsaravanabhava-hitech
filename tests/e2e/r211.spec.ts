import { expect, test } from '@playwright/test';

test.describe('R2.11 Thiruppugazh catalogue browser qualification', () => {
  test('publishes truthful corpus coverage and source lanes', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await expect(page.getByRole('heading', { level: 1, name: 'திருப்புகழ்' })).toBeVisible();
    await expect(page.getByText('1326', { exact: true })).toBeVisible();
    await expect(page.getByText('1275', { exact: true })).toBeVisible();
    await expect(page.getByText('Project Madurai Part I', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Project Madurai Part II', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Project Madurai Part III', { exact: true }).first()).toBeVisible();
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
    [325, 'இறைச்சிப் பற்று'], [330, 'முட்டுப் பட்டு'], [350, 'வம்பறாச்சில'], [375, 'கமரி மலர்குழல்'],
    [400, 'இருவர் மயலோ'], [425, 'செயசெய அருணா'], [450, 'கைத்தருண சோதி'], [475, 'கூந்தலாழ விரிந்து'],
    [500, 'சகுட முந்தும்'], [525, 'சரவண பவநிதி'], [575, 'ஐந்து பூதமும்'], [600, 'அத் துகிரின் நல்'],
    [625, 'கடினதட கும்ப'], [650, 'விலைக்கு மேனியில்'], [675, 'புவிபுனல் காலும்'], [700, 'தலங்களில் வரும்'],
    [725, 'சீதள வாரிஜ'], [750, 'குடத் தாமரையாம்'], [775, 'பூமாது உரமேயணி'], [800, 'சூழ்ந்து ஏன்ற துக்க'],
    [825, 'உரை ஒழிந்து'], [850, 'இதசந்தன புழுகு'], [875, 'கடகரிம ருப்பிற்க'], [900, 'அரி மருகோனே'],
    [925, 'தசையாகிய'], [950, 'மைச் சரோருகம்'], [975, 'ஏடுக்கொத் தாரலர்'],
  ] as const;

  for (const [number, opening] of samples) {
    test(`publishes validated song ${number} metadata and keeps its canonical body withheld`, async ({ page }) => {
      await page.goto('/thiruppugazh');
      await page.getByLabel('திருப்புகழ் தேடல்').fill(opening);
      const song = page.getByRole('link', { name: new RegExp(`${opening}.*${number}`) });
      await expect(song).toBeVisible();
      await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
      await song.click();
      await expect(page).toHaveURL(new RegExp(`thiruppugazh-${String(number).padStart(4, '0')}`));
      await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
    });
  }

  test('publishes validated song 1000 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('வேடர் செழுந்தினை');
    const songOneThousand = page.getByRole('link', { name: /வேடர் செழுந்தினை.*1000/ });
    await expect(songOneThousand).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousand.click();
    await expect(page).toHaveURL(/thiruppugazh-1000/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1025 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('சீதமலம் வெப்பு');
    const songOneThousandTwentyFive = page.getByRole('link', { name: /சீதமலம் வெப்பு.*1025/ });
    await expect(songOneThousandTwentyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandTwentyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1025/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1050 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('தொட அடாது');
    const songOneThousandFifty = page.getByRole('link', { name: /தொட அடாது.*1050/ });
    await expect(songOneThousandFifty).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandFifty.click();
    await expect(page).toHaveURL(/thiruppugazh-1050/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1075 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('திரிபுரம் அதனை');
    const songOneThousandSeventyFive = page.getByRole('link', { name: /திரிபுரம் அதனை.*1075/ });
    await expect(songOneThousandSeventyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandSeventyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1075/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1100 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('அங்கதன் கண்டகன்');
    const songOneThousandOneHundred = page.getByRole('link', { name: /அங்கதன் கண்டகன்.*1100/ });
    await expect(songOneThousandOneHundred).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandOneHundred.click();
    await expect(page).toHaveURL(/thiruppugazh-1100/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1125 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('அரிய வஞ்சகர்');
    const songOneThousandOneHundredTwentyFive = page.getByRole('link', { name: /அரிய வஞ்சகர்.*1125/ });
    await expect(songOneThousandOneHundredTwentyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandOneHundredTwentyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1125/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1150 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('கலவியி நலமுரை');
    const songOneThousandOneHundredFifty = page.getByRole('link', { name: /கலவியி நலமுரை.*1150/ });
    await expect(songOneThousandOneHundredFifty).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandOneHundredFifty.click();
    await expect(page).toHaveURL(/thiruppugazh-1150/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1175 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('பாணிக்கு உட்படாது');
    const songOneThousandOneHundredSeventyFive = page.getByRole('link', { name: /பாணிக்கு உட்படாது.*1175/ });
    await expect(songOneThousandOneHundredSeventyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandOneHundredSeventyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1175/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1200 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('வாடையில் மதனை');
    const songOneThousandTwoHundred = page.getByRole('link', { name: /வாடையில் மதனை.*1200/ });
    await expect(songOneThousandTwoHundred).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandTwoHundred.click();
    await expect(page).toHaveURL(/thiruppugazh-1200/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1225 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('கச்சுப் பூட்டு');
    const songOneThousandTwoHundredTwentyFive = page.getByRole('link', { name: /கச்சுப் பூட்டு.*1225/ });
    await expect(songOneThousandTwoHundredTwentyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandTwoHundredTwentyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1225/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1250 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('தீ ஊதை தாத்ரி');
    const songOneThousandTwoHundredFifty = page.getByRole('link', { name: /தீ ஊதை தாத்ரி.*1250/ });
    await expect(songOneThousandTwoHundredFifty).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandTwoHundredFifty.click();
    await expect(page).toHaveURL(/thiruppugazh-1250/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('publishes validated song 1275 metadata and keeps its canonical body withheld', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('மூலா நிலமதின்');
    const songOneThousandTwoHundredSeventyFive = page.getByRole('link', { name: /மூலா நிலமதின்.*1275/ });
    await expect(songOneThousandTwoHundredSeventyFive).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
    await songOneThousandTwoHundredSeventyFive.click();
    await expect(page).toHaveURL(/thiruppugazh-1275/);
    await expect(page.getByText(/உரை.*ஏற்றப்படவில்லை|text.*not.*imported/i).first()).toBeVisible();
  });

  test('filters to exactly the 340 governed Part II records', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('மூல பகுதி').selectOption('part-2');
    await expect(page.getByText('காட்டப்படுவது 340 / 1275')).toBeVisible();
    await expect(page.getByRole('link', { name: /அற்றைக் கற்றை.*331/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /நிகரில் பஞ்ச.*670/ })).toBeVisible();
  });

  test('filters to exactly the 330 governed Part III records', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('மூல பகுதி').selectOption('part-3');
    await expect(page.getByText('காட்டப்படுவது 330 / 1275')).toBeVisible();
    await expect(page.getByRole('link', { name: /பரவி உனது.*671/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /வேடர் செழுந்தினை.*1000/ })).toBeVisible();
  });

  test('filters to exactly the 275 governed Part IV records', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('மூல பகுதி').selectOption('part-4');
    await expect(page.getByText('காட்டப்படுவது 275 / 1275')).toBeVisible();
    await expect(page.getByRole('link', { name: /இலகி யிருகுழை.*1001/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /மூலா நிலமதின்.*1275/ })).toBeVisible();
  });

  test('searches verified entries without inventing missing songs', async ({ page }) => {
    await page.goto('/thiruppugazh');
    await page.getByLabel('திருப்புகழ் தேடல்').fill('முத்தைத்தரு');
    await expect(page.getByRole('link', { name: /முத்தைத்தரு/ })).toBeVisible();
    await expect(page.getByText('காட்டப்படுவது 1 / 1275')).toBeVisible();
  });

  test('keeps corpus-reference links external and source-labelled', async ({ page }) => {
    await page.goto('/thiruppugazh');
    const firstSource = page.getByRole('link', { name: 'மூலத்தை காண்க' }).first();
    await expect(firstSource).toHaveAttribute('target', '_blank');
    await expect(firstSource).toHaveAttribute('href', /projectmadurai\.org/);
  });
});