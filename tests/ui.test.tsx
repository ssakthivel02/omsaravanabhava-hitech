/**
 * Executed UI behaviour tests (jsdom).
 *
 * These cover the journeys that do not need a real browser: routing and
 * deep-link handling, unknown routes, keyboard reachability, Tamil rendering
 * and language tagging, honest empty states, and the rule that a record is
 * never displayed as verified when the registry says otherwise.
 *
 * Viewport, reduced-motion, focus-ring visibility and colour contrast are
 * covered by tests/e2e/*.spec.ts under Playwright, which needs a real browser.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(
    <Router hook={hook}>
      <App />
    </Router>,
  );
}

beforeEach(cleanup);

describe('routing and deep links', () => {
  it('renders the flagship home at /', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /வேலின் வழியே/ }),
    ).toBeInTheDocument();
  });

  it('deep-links straight into a temple detail route', async () => {
    renderAt('/temples/ctm-tirupparankundram');
    // Temple routes are code-split, so wait for the chunk to resolve.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'திருப்பரங்குன்றம்' }),
    ).toBeInTheDocument();
  });

  it('deep-links into a Thiruppugazh record', () => {
    renderAt('/thiruppugazh/thiruppugazh-0006');
    expect(
      screen.getByRole('heading', { level: 1, name: 'முத்தைத்தரு' }),
    ).toBeInTheDocument();
  });

  it('shows a useful page for an unknown route rather than a blank screen', () => {
    renderAt('/no-such-page');
    expect(
      screen.getByRole('heading', { level: 1, name: /காணப்படவில்லை/ }),
    ).toBeInTheDocument();
    // An empty screen is an invitation to act: offer real ways onward.
    expect(screen.getByRole('link', { name: 'முகப்பு' })).toBeInTheDocument();
  });

  it('shows a recoverable message for an unknown temple id', async () => {
    renderAt('/temples/ctm-does-not-exist');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /காணப்படவில்லை/,
    );
    expect(
      screen.getByRole('link', { name: /கோயில் பட்டியலுக்கு/ }),
    ).toBeInTheDocument();
  });
});

describe('landmarks and keyboard access', () => {
  it('exposes banner, main and contentinfo landmarks', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('puts a skip link first in the tab order', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.tab();
    expect(document.activeElement).toHaveTextContent('முதன்மை உள்ளடக்கத்திற்குச் செல்');
  });

  it('marks the current page in the primary navigation', () => {
    renderAt('/temples');
    const nav = screen.getByRole('navigation', { name: 'முதன்மை வழிசெலுத்தல்' });
    expect(
      within(nav).getByRole('link', { current: 'page' }),
    ).toHaveTextContent('கோயில்கள்');
  });

  it('mobile menu toggle reports its expanded state', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const toggle = screen.getByRole('button', { name: 'பட்டி' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'மூடு' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('marks the current page in the mobile navigation too, not only desktop (R2-CODE-017)', async () => {
    const user = userEvent.setup();
    renderAt('/temples');
    await user.click(screen.getByRole('button', { name: 'பட்டி' }));
    const mobileNav = document.getElementById('mobile-nav');
    expect(mobileNav).not.toBeNull();
    const current = within(mobileNav!).getAllByRole('link', { current: 'page' });
    expect(current.length).toBeGreaterThan(0);
    expect(current[0]).toHaveTextContent('கோயில்கள்');
  });
});

describe('Tamil rendering', () => {
  it('sets Tamil script content with an explicit lang attribute', () => {
    renderAt('/arupadai-veedu');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('lang', 'ta');
    expect(heading.textContent).toBe('அறுபடை வீடு');
  });

  it('lists the six abodes in traditional pilgrimage order', () => {
    renderAt('/arupadai-veedu');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
    expect(items[0]).toHaveTextContent('திருப்பரங்குன்றம்');
    expect(items[5]).toHaveTextContent('பழமுதிர்சோலை');
  });
});

describe('truthful content states', () => {
  it('does not print verse text when the registry has none', () => {
    renderAt('/thiruppugazh/thiruppugazh-0006');
    expect(screen.getByText(/மூலத் தமிழ்\s*உரை இன்னும் ஏற்றப்படவில்லை/)).toBeInTheDocument();
    expect(document.querySelector('.canonical')).toBeNull();
  });

  it('states plainly when a temple has no history or visitor info from source yet', async () => {
    renderAt('/temples/ctm-tirupparankundram');
    expect(
      await screen.findByText(/இன்னும்\s*மூலத்திலிருந்து\s*கிடைக்கவில்லை/),
    ).toBeInTheDocument();
  });

  it('does not let a missing history/visitor-info state imply the temple identity itself is unverified', async () => {
    renderAt('/temples/ctm-tirupparankundram');
    expect(
      await screen.findByText(/கோயிலின் அடையாளம் குறித்த ஐயத்தைக் குறிக்காது/),
    ).toBeInTheDocument();
    // The identity/source-confidence dimension is rendered independently of
    // coordinate and image state (R2-CODE-005).
    expect(screen.getAllByText(/மூல அடையாளம்/).length).toBeGreaterThan(0);
  });

  it('never publishes a Namavali collection while rights are unresolved', () => {
    renderAt('/prayers');
    expect(
      screen.getByText(/வெளியிடத்தக்க நாமாவளித் தொகுப்பு எதுவும் இல்லை/),
    ).toBeInTheDocument();
  });

  it('states that the platform does not take temple donations', () => {
    renderAt('/');
    expect(
      screen.getByText(/கோயில் நன்கொடைகளைப் பெறுவதில்லை/),
    ).toBeInTheDocument();
  });
});

describe('search', () => {
  it('finds a temple by Tamil name', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'பழனி');
    expect(await screen.findByText('பழனி')).toBeInTheDocument();
  });

  it('finds a temple by English name', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'Palani');
    expect(await screen.findByRole('link', { name: /Palani/ })).toBeInTheDocument();
  });

  it('never invents content for a zero-result search', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'zzzznotathing');
    expect(
      await screen.findByText(/இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது/),
    ).toBeInTheDocument();
  });

  it('announces the result count politely', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'பழனி');
    const status = document.querySelector('[aria-live="polite"]');
    expect(status).toBeTruthy();
  });

  it('does not promise that only verified records are shown, and shows each result state', async () => {
    // R2-CODE-001: search previously promised "verified records only" and
    // never rendered the collected per-hit state.
    const user = userEvent.setup();
    renderAt('/search');
    expect(screen.queryByText(/சரிபார்க்கப்பட்ட பதிவுகள் மட்டுமே/)).not.toBeInTheDocument();
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'பழனி');
    const row = (await screen.findByText('பழனி')).closest('a');
    expect(row).not.toBeNull();
    expect(row!.querySelector('.state')).not.toBeNull();
  });

  it('discloses how many results are shown out of the total', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    await user.type(await screen.findByLabelText('தேடல் சொல்'), 'திரு');
    expect(await screen.findByText(/காட்டப்படுவது \d+ \/ மொத்தம் \d+/)).toBeInTheDocument();
  });
});

describe('daily practice', () => {
  it('counts repetitions locally and can be reset', async () => {
    const user = userEvent.setup();
    renderAt('/practice');
    const add = screen.getByRole('button', { name: 'ஒன்று சேர்' });
    await user.click(add);
    await user.click(add);
    expect(screen.getByText('2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'மீட்டமை' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('makes no claim of guaranteed benefit', () => {
    renderAt('/practice');
    expect(screen.getByText(/எந்த வாக்குறுதியையும் அளிக்கவில்லை/)).toBeInTheDocument();
  });
});
