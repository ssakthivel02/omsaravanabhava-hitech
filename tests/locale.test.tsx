import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitch from '@/components/LanguageSwitch';
import { LocaleProvider, useLocale } from '@/lib/locale';

function Probe() {
  const { locale, text } = useLocale();
  return <p data-testid="locale-probe">{locale}:{text('தமிழ்', 'English')}</p>;
}

describe('local-first UI language', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'ta';
    delete document.documentElement.dataset.uiLocale;
  });

  it('defaults to Tamil and persists an explicit English selection', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <LanguageSwitch />
        <Probe />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale-probe')).toHaveTextContent('ta:தமிழ்');
    expect(screen.getByRole('button', { name: 'தமிழ் இடைமுகம்' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'English interface' }));

    expect(screen.getByTestId('locale-probe')).toHaveTextContent('en:English');
    expect(screen.getByRole('button', { name: 'English interface' })).toHaveAttribute('aria-pressed', 'true');
    expect(localStorage.getItem('omsaravanabhava-hitech-ui-locale-v1')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dataset.uiLocale).toBe('en');
  });

  it('restores a stored English preference on the next render', () => {
    localStorage.setItem('omsaravanabhava-hitech-ui-locale-v1', 'en');
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale-probe')).toHaveTextContent('en:English');
  });
});
