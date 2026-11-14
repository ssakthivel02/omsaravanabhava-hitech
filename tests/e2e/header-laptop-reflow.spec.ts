import { expect, test } from '@playwright/test';

// PR #19: exercise the actual React shell at the 90rem navigation breakpoint.
test('laptop menu remains usable and the 1440px transition does not overflow', async ({ page }) => {
  for (const width of [1280, 1439, 1440, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const menu = page.locator('.menu-toggle');
    const desktopNav = page.locator('.desktop-nav');
    const shouldUseMenu = width < 1440;
    await expect(menu).toBeVisible({ visible: shouldUseMenu });
    await expect(desktopNav).toBeVisible({ visible: !shouldUseMenu });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
    if (shouldUseMenu) {
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.locator('#mobile-nav a[href="/temples"]').first().click();
      await expect(page).toHaveURL(/\/temples(?:\/|$)/);
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
  }
});

// Narrow CSS viewport coverage is not a substitute for real browser zoom QA.
// Check both 320px mobile and 640px compact layouts; 200% browser zoom
// still requires separate visual/browser acceptance evidence.
test('320px and 640px reflow keep navigation usable without horizontal overflow', async ({ page }) => {
  for (const width of [320, 640]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const menu = page.locator('.menu-toggle');
    await expect(menu).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-nav')).toBeVisible();
  }
});
