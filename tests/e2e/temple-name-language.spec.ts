import { test, expect } from '@playwright/test';

/**
 * Regression: a handful of temple records keep a native-script name in the
 * `nameTa` field (Kannada, Malayalam, Telugu, Devanagari). The UI used to tag
 * every `nameTa` as lang="ta", mislabelling these for screen readers
 * (WCAG 3.1.2). The rendered lang attribute must follow the real script.
 */
const CASES = [
  { id: 'ctm-w3-tmka001', name: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ', lang: 'kn' },
  { id: 'ctm-w3-tmkl001', name: 'ത്രിശ്ശൂർ സുബ്രഹ്മണ്യ', lang: 'ml' },
  { id: 'ctm-w3-tmin003', name: 'స్కందగిరి సుబ్రహ్మణ్య స్వామి', lang: 'te' },
  { id: 'ctm-w3-tmin016', name: 'कार्तिक स्वामी मंदिर', lang: 'hi' },
  { id: 'ctm-tirupparankundram', name: 'திருப்பரங்குன்றம்', lang: 'ta' },
] as const;

for (const c of CASES) {
  test(`/temples/${c.id} heading is tagged lang="${c.lang}"`, async ({ page }) => {
    await page.goto(`/temples/${c.id}`);
    const h1 = page.getByRole('heading', { level: 1, name: c.name });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveAttribute('lang', c.lang);
  });
}

test('search results tag a native-script temple name with its own language', async ({ page }) => {
  await page.goto('/search?q=' + encodeURIComponent('ಕುಕ್ಕೆ'));
  const hit = page.locator('[lang="kn"]', { hasText: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ' }).first();
  await expect(hit).toBeVisible();
  // Scope to the name elements: `[lang="ta"]` alone would also match <html lang="ta">.
  await expect(page.locator('b[lang="ta"], small[lang="ta"]', { hasText: 'ಕುಕ್ಕೆ' })).toHaveCount(0);
});
