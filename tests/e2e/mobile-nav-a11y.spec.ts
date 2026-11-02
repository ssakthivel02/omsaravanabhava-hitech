import { test, expect } from '@playwright/test';

test('mobile navigation preserves current-route semantics and restores trigger focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');

  const menu = page.getByRole('button', { name: /பட்டி|Menu/ });
  await menu.click();

  const mobileNav = page.locator('#mobile-nav');
  await expect(mobileNav).toBeVisible();

  const contact = mobileNav.getByRole('link', { name: /தொடர்பு|Contact/ });
  await expect(contact).toHaveAttribute('aria-current', 'page');

  const about = mobileNav.getByRole('link', { name: /இத்தளம் பற்றி|About/ });
  await about.click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(mobileNav).toHaveCount(0);
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');

  await menu.click();
  const reopenedNav = page.locator('#mobile-nav');
  await expect(reopenedNav).toBeVisible();
  await expect(reopenedNav.getByRole('link', { name: /இத்தளம் பற்றி|About/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
});
