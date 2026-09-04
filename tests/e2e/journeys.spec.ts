import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  '/', '/arupadai-veedu', '/temples', '/temples/ctm-tirupparankundram',
  '/thiruppugazh', '/thiruppugazh/thiruppugazh-0006', '/works', '/prayers',
  '/practice', '/search', '/sources', '/content-completeness', '/about',
  '/privacy', '/terms', '/disclaimer', '/accessibility', '/contact',
];

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
  for (const route of ['/', '/arupadai-veedu', '/temples', '/search', '/practice']) {
    test(`axe finds no violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      // R2-CODE-021: the installed axe-core release also ships WCAG 2.2
      // rules; scanning only 2.0/2.1 tags left them unexercised even though
      // the tooling supported them. axe alone still does not prove full
      // WCAG conformance — see docs/ACCESSIBILITY_MANUAL_QA_RUNBOOK_V1.md
      // for the manual checks this cannot automate.
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('skip link is reachable and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /முதன்மை உள்ளடக்கத்திற்குச் செல்/ });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('touch targets meet size requirements — 44px for primary controls, WCAG floor/exception for secondary nav and inline links', async ({ page }) => {
    // R2-CODE-022: the previous scope covered buttons only. This covers
    // every meaningful interactive control, but applies WCAG 2.2 SC 2.5.8
    // correctly rather than a single flat number:
    //   - ~44x44 (the project's stated preference, stricter than WCAG) for
    //     PRIMARY controls a visitor acts on with intent: buttons, form
    //     inputs, the mobile nav (the actual touch navigation on small
    //     screens), audio and filter controls.
    //   - WCAG's real 24x24 floor for dense SECONDARY navigation clusters
    //     (desktop top nav, the footer trust nav, standalone "see more"
    //     links) that are not literally embedded in a sentence.
    //   - WCAG's "Inline" exception (fully exempt) for a link that sits
    //     inside a running sentence — SC 2.5.8 does not set a minimum size
    //     for those at all, by design, because shrinking a sentence's
    //     wording to hit a pixel target would be worse for readability.
    await page.goto('/');
    const targets = page.locator(
      'a, button, .btn, .nav-link, .footer-link, input, select, textarea, audio, [role=button]',
    );
    const count = await targets.count();
    expect(count).toBeGreaterThan(0);
    const tooSmall: string[] = [];
    for (let i = 0; i < count; i += 1) {
      const el = targets.nth(i);
      if (!(await el.isVisible())) continue;

      const classification = await el.evaluate((node) => {
        if (node.tagName !== 'A') return 'primary';
        // A link inside running prose (surrounded by sibling text nodes in
        // a <p>/<li>) qualifies for WCAG's "Inline" exception outright.
        const parent = node.parentElement;
        const inSentence =
          !!parent &&
          ['P', 'LI'].includes(parent.tagName) &&
          Array.from(parent.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0,
          );
        if (inSentence) return 'exempt';
        if (
          node.classList.contains('footer-link') ||
          (node.classList.contains('nav-link') && node.closest('.mobile-nav') === null) ||
          node.closest('.band-links, .trust-band') !== null
        ) {
          return 'secondary';
        }
        return 'primary';
      });
      if (classification === 'exempt') continue;

      const box = await el.boundingBox();
      if (!box) continue;
      const min = classification === 'secondary' ? 24 : 44;
      if (box.height < min || box.width < min) {
        tooSmall.push(`target ${i} (${await el.evaluate((n) => n.outerHTML.slice(0, 80))}) ${box.width}x${box.height} (min ${min})`);
      }
    }
    expect(tooSmall, tooSmall.join('\n')).toEqual([]);
  });

  test('focus is visible on keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return getComputedStyle(el).outlineStyle;
    });
    expect(outline).not.toBe('none');
  });
});

test.describe('reduced motion', () => {
  test('home renders fully with animation suppressed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const duration = await page.evaluate(() => {
      const el = document.querySelector('.btn-primary');
      return el ? getComputedStyle(el).transitionDuration : '0s';
    });
    expect(['0s', '0.01ms', '1e-05s']).toContain(duration);
  });
});

test.describe('responsive layout', () => {
  test('no horizontal overflow at any viewport', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('Tamil script renders with real glyph width', async ({ page }) => {
    await page.goto('/arupadai-veedu');
    const width = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(40);
  });
});
