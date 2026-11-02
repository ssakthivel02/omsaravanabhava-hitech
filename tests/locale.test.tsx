import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitch from '@/components/LanguageSwitch';
import { LocaleProvider, useLocale } from '@/lib/locale';

function Probe() {
  const { uiLocale, text } = useLocale();
  return (
    <p data-testid="locale-probe">
      {uiLocale}:{text('தமிழ்', 'English', { te: 'తెలుగు', ml: 'മലയാളം', kn: 'ಕನ್ನಡ', hi: 'हिन्दी' })}
    </p>
  );
}

function FallbackProbe() {
  const { uiLocale, locale, text } = useLocale();
  return (
    <p data-testid="fallback-probe">
      {uiLocale}:{locale}:{text('தமிழ் மட்டும்', 'Reviewed English fallback')}
    </p>
  );
}

describe('local-first multilingual UI', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'ta';
    document.documentElement.dir = 'ltr';
    delete document.documentElement.dataset.uiLocale;
  });

  it('defaults to Tamil and exposes six supported interface languages', () => {
    render(
      <LocaleProvider>
        <LanguageSwitch />
        <Probe />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale-probe')).toHaveTextContent('ta:தமிழ்');
    const selector = screen.getByRole('combobox', { name: 'Interface language / இடைமுக மொழி' });
    expect(selector).toHaveValue('ta');
    expect(screen.getAllByRole('option')).toHaveLength(6);
    expect(screen.getByRole('option', { name: 'తెలుగు' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'മലയാളം' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ಕನ್ನಡ' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'हिन्दी' })).toBeInTheDocument();
  });

  it('persists and renders a reviewed Hindi translation', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <LanguageSwitch />
        <Probe />
      </LocaleProvider>,
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Interface language / இடைமுக மொழி' }),
      'hi',
    );

    expect(screen.getByTestId('locale-probe')).toHaveTextContent('hi:हिन्दी');
    expect(localStorage.getItem('omsaravanabhava-hitech-ui-locale-v1')).toBe('hi');
    expect(document.documentElement.lang).toBe('hi');
    expect(document.documentElement.dataset.uiLocale).toBe('hi');
  });

  it('restores a stored Telugu preference on the next render', () => {
    localStorage.setItem('omsaravanabhava-hitech-ui-locale-v1', 'te');
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale-probe')).toHaveTextContent('te:తెలుగు');
  });

  it('separates the selected UI locale from the governed content fallback locale', () => {
    localStorage.setItem('omsaravanabhava-hitech-ui-locale-v1', 'ml');
    render(
      <LocaleProvider>
        <FallbackProbe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('fallback-probe')).toHaveTextContent(
      'ml:en:Reviewed English fallback',
    );
  });
});
