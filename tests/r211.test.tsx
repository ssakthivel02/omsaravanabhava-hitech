import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(<Router hook={hook}><App /></Router>);
}

beforeEach(cleanup);

describe('R2.11 Thiruppugazh corpus catalogue', () => {
  it('distinguishes the 1326-song reference corpus from the 275 source-linked records', () => {
    renderAt('/thiruppugazh');
    expect(screen.getByText('1326')).toBeInTheDocument();
    expect(screen.getByText('275')).toBeInTheDocument();
    expect(screen.getByText(/முழு 1,326 பாடல்களும் இத்தளத்தில் வெளியிடப்பட்டதாக/)).toBeInTheDocument();
  });

  it('shows all four governed Project Madurai source parts', () => {
    renderAt('/thiruppugazh');
    expect(screen.getAllByText('Project Madurai Part I').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Project Madurai Part II').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Project Madurai Part III').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Project Madurai Part IV').length).toBeGreaterThan(0);
    expect(screen.getByText('1001–1326')).toBeInTheDocument();
  });

  it('publishes the validated song 1 metadata without confusing duplicate source titles', () => {
    renderAt('/thiruppugazh');
    const songOneLink = screen.getAllByRole('link', { name: /விநாயகர் துதி/ })
      .find((link) => link.getAttribute('href') === '/thiruppugazh/thiruppugazh-0001');
    expect(songOneLink).toBeInTheDocument();
  });

  const samples = [
    [30, 'அனைவரும் மருண்டு'], [50, 'கொங்கைகள்'], [75, 'பஞ்ச பாதகம்'], [100, 'விந்ததில் ஊறி'],
    [125, 'ஓடி ஓடி'], [150, 'குன்றுங் குன்றும்'], [175, 'பாரியான கொடை'], [200, 'வேய் இசைந்து'],
    [225, 'நிறைமதி முகமெனும்'], [250, 'எனை அடைந்த'],
  ] as const;

  for (const [number, opening] of samples) {
    it(`publishes validated metadata through song ${number}`, async () => {
      const user = userEvent.setup();
      renderAt('/thiruppugazh');
      await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), opening);
      const song = screen.getByRole('link', { name: new RegExp(opening) });
      expect(song).toHaveAttribute('href', `/thiruppugazh/thiruppugazh-${String(number).padStart(4, '0')}`);
      expect(screen.getByText('காட்டப்படுவது 1 / 275')).toBeInTheDocument();
    });
  }

  it('publishes validated batch 012 metadata through song 275 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'தொக்கறாக் குடில்');
    const songTwoHundredSeventyFive = screen.getByRole('link', { name: /தொக்கறாக் குடில்/ });
    expect(songTwoHundredSeventyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0275');
    expect(screen.getByText('காட்டப்படுவது 1 / 275')).toBeInTheDocument();
  });

  it('searches only the verified catalogue and finds முத்தைத்தரு', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'முத்தைத்தரு');
    expect(screen.getByRole('link', { name: /முத்தைத்தரு/ })).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 1 / 275')).toBeInTheDocument();
  });

  it('does not fabricate records for an uncovered source part', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-2');
    expect(screen.getByText(/இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை/)).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 0 / 275')).toBeInTheDocument();
  });

  it('reports zero canonical texts and zero approved audio without hiding the gap', () => {
    renderAt('/thiruppugazh');
    const canonicalLabel = screen.getByText('முழு மூல உரை வெளியீடு');
    const audioLabel = screen.getByText('அங்கீகரிக்கப்பட்ட ஒலி');
    expect(canonicalLabel.parentElement).toHaveTextContent('0');
    expect(audioLabel.parentElement).toHaveTextContent('0');
  });
});
