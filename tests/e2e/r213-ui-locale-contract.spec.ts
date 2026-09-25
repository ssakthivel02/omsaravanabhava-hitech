import { test, expect } from '@playwright/test';

const cases = [
  { locale: 'te', title: 'పాటలు మరియు పవిత్ర గ్రంథాలు' },
  { locale: 'ml', title: 'ഗാനങ്ങളും പവിത്ര കൃതികളും' },
  { locale: 'kn', title: 'ಹಾಡುಗಳು ಮತ್ತು ಪವಿತ್ರ ಕೃತಿಗಳು' },
  { locale: 'hi', title: 'गीत और पवित्र कृतियाँ' },
] as const;

test.describe('R2.13 works UI/content locale contract', () => {
  for (const item of cases) {
    test(`renders ${item.locale} generic UI while preserving governed content fallback`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/works');

      await page
        .getByRole('combobox', { name: 'Interface language / இடைமுக மொழி' })
        .selectOption(item.locale);

      await expect(page.locator('html')).toHaveAttribute('lang', item.locale);

      const heading = page.getByRole('heading', { level: 1, name: item.title });
      await expect(heading).toBeVisible();
      await expect(heading).toHaveAttribute('lang', item.locale);

      // The governed work catalogue remains Tamil/English content. For the four
      // added UI locales, the reviewed content fallback is English rather than
      // an invented translation of sacred/work titles.
      await expect(page.locator('.works-entry-copy b[lang="en"]').first()).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
