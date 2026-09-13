import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/arupadai-veedu', '/temples', '/temples/ctm-tirupparankundram', '/thiruppugazh', '/thiruppugazh/thiruppugazh-0006', '/works', '/prayers', '/practice', '/knowledge', '/library', '/search', '/sources', '/content-completeness', '/about', '/privacy', '/terms', '/disclaimer', '/accessibility', '/contact'];

test.describe('critical journeys', () => {
  for (const route of ROUTES) {
    test(`${route} renders with a heading and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(errors, `console errors on ${route}`).toEqual([]);
    });
    test(`${route} survives a deep-link refresh`, async ({ page }) => {
      await page.goto(route);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});

test.describe('accessibility', () => {
  for (const route of ['/', '/arupadai-veedu', '/temples', '/knowledge', '/library', '/search', '/practice', '/prayers', '/works', '/sources', '/content-completeness']) {
    test(`axe finds no violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('search discovery controls are keyboard- and state-accessible', async ({ page }) => {
    await page.goto('/search');
    const input = page.getByRole('searchbox', { name: /தேடல் சொல்|Search term/ });
    await expect(input).toBeVisible();
    await input.fill('Palani');
    await expect(page.getByText(/Showing \d+ of \d+ results|காட்டப்படுவது \d+ \/ மொத்தம் \d+ முடிவுகள்/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear search|தேடலை அழி/ })).toBeVisible();
    const templeFacet = page.getByRole('button', { name: /Temples \d+|கோயில்கள் \d+/ });
    await expect(templeFacet).toBeVisible();
    await templeFacet.click();
    await expect(templeFacet).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /Clear search|தேடலை அழி/ }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByRole('button', { name: /All \d+|அனைத்தும் \d+/ })).toHaveAttribute('aria-pressed', 'true');
  });

  test('local library saves and removes a temple record', async ({ page }) => {
    await page.goto('/temples/ctm-tirupparankundram');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const save = page.getByRole('button', { name: /சேமி|Save/ }).first();
    await expect(save).toBeVisible();
    await expect(save).toHaveAttribute('aria-pressed', 'false');
    await save.click();
    await expect(save).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/library');
    const savedSection = page.locator('section[aria-labelledby="saved-h"]');
    await expect(savedSection.locator('a[href="/temples/ctm-tirupparankundram"]')).toBeVisible();

    await savedSection.getByRole('button', { name: /^(நீக்கு|Remove)$/ }).click();
    await expect(savedSection.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை|No records have been saved yet/)).toBeVisible();
  });

  test('local library records and clears recent temple history', async ({ page }) => {
    await page.goto('/temples/ctm-tirupparankundram');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/library');
    const recentSection = page.locator('section[aria-labelledby="recent-h"]');
    await expect(recentSection.locator('a[href="/temples/ctm-tirupparankundram"]')).toBeVisible();

    await recentSection.getByRole('button', { name: /சமீபத்தை அழி|Clear recent/ }).click();
    await expect(recentSection.getByText(/சமீபப் பதிவுகள் இன்னும் இல்லை|No recent records yet/)).toBeVisible();
  });

  test('skip link is reachable and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /முதன்மை உள்ளடக்கத்திற்குச் செல்/ });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('touch targets meet size requirements — 44px for primary controls, WCAG floor/exception for secondary nav and inline links', async ({ page }) => {
    await page.goto('/');
    const targets = page.locator('a, button, .btn, .nav-link, .footer-link, input, select, textarea, audio, [role=button]');
    const count = await targets.count();
    expect(count).toBeGreaterThan(0);
    const tooSmall: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const el = targets.nth(i);
      if (!(await el.isVisible())) continue;
      const classification = await el.evaluate((node) => {
        if (node.tagName !== 'A') return 'primary';
        const parent = node.parentElement;
        const inSentence = !!parent && ['P', 'LI'].includes(parent.tagName) && Array.from(parent.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0);
        if (inSentence) return 'exempt';
        if (node.classList.contains('footer-link') || (node.classList.contains('nav-link') && node.closest('.mobile-nav') === null) || node.closest('.band-links, .trust-band') !== null) return 'secondary';
        return 'primary';
      });
      if (classification === 'exempt') continue;
      const box = await el.boundingBox();
      if (!box) continue;
      const min = classification === 'secondary' ? 24 : 44;
      if (box.height < min || box.width < min) tooSmall.push(`target ${i} (${await el.evaluate((n) => n.outerHTML.slice(0, 80))}) ${box.width}x${box.height} (min ${min})`);
    }
    expect(tooSmall, tooSmall.join('\n')).toEqual([]);
  });

  test('focus is visible on keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as HTMLElement).outlineStyle);
    expect(outline).not.toBe('none');
  });
});

test.describe('reduced motion', () => {
  test('home renders fully with animation suppressed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const duration = await page.evaluate(() => document.querySelector('.btn-primary') ? getComputedStyle(document.querySelector('.btn-primary') as HTMLElement).transitionDuration : '0s');
    expect(['0s', '0.01ms', '1e-05s']).toContain(duration);
  });
});

test.describe('responsive layout', () => {
  test('no horizontal overflow at any viewport', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
  test('Tamil script renders with real glyph width', async ({ page }) => {
    await page.goto('/arupadai-veedu');
    const width = await page.getByRole('heading', { level: 1 }).evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(40);
  });
});
