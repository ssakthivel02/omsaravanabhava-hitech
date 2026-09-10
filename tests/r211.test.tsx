import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';
import { thiruppugazh } from '@/content';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(<Router hook={hook}><App /></Router>);
}

beforeEach(cleanup);

describe('R2.11 Thiruppugazh corpus catalogue', () => {
  it('locks the governed runtime at exactly 500 source-linked records with no canonical bodies', () => {
    expect(thiruppugazh).toHaveLength(500);
    expect(thiruppugazh.every((song) => song.canonicalText === null)).toBe(true);
    expect(thiruppugazh.every((song) => song.audioState === 'NO_APPROVED_AUDIO')).toBe(true);
    expect(thiruppugazh.at(-1)?.id).toBe('thiruppugazh-0500');
    expect(thiruppugazh.at(-1)?.openingWords).toBe('சகுட முந்தும்');
  });

  it('distinguishes the 1326-song reference corpus from the 500 source-linked records', () => {
    renderAt('/thiruppugazh');
    expect(screen.getByText('1326')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
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
    [225, 'நிறைமதி முகமெனும்'], [250, 'எனை அடைந்த'], [275, 'தொக்கறாக் குடில்'], [300, 'வார் உற்று எழும்'],
    [325, 'இறைச்சிப் பற்று'], [330, 'முட்டுப் பட்டு'], [350, 'வம்பறாச்சில'], [375, 'கமரி மலர்குழல்'],
    [400, 'இருவர் மயலோ'], [425, 'செயசெய அருணா'], [450, 'கைத்தருண சோதி'], [475, 'கூந்தலாழ விரிந்து'], [500, 'சகுட முந்தும்'],
  ] as const;

  for (const [number, opening] of samples) {
    it(`publishes validated metadata through song ${number}`, async () => {
      const user = userEvent.setup();
      renderAt('/thiruppugazh');
      await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), opening);
      const song = screen.getByRole('link', { name: new RegExp(opening) });
      expect(song).toHaveAttribute('href', `/thiruppugazh/thiruppugazh-${String(number).padStart(4, '0')}`);
      expect(screen.getByText('காட்டப்படுவது 1 / 500')).toBeInTheDocument();
    });
  }

  it('publishes validated Part II metadata through song 500 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'சகுட முந்தும்');
    const songFiveHundred = screen.getByRole('link', { name: /சகுட முந்தும்/ });
    expect(songFiveHundred).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0500');
    expect(screen.getByText('காட்டப்படுவது 1 / 500')).toBeInTheDocument();
  });

  it('exposes exactly the 170 governed Part II records currently promoted', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-2');
    expect(screen.getByText('காட்டப்படுவது 170 / 500')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /அற்றைக் கற்றை/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0331');
    expect(screen.getByRole('link', { name: /சகுட முந்தும்/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0500');
  });

  it('does not fabricate records for the still-uncovered Part III lane', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-3');
    expect(screen.getByText(/இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை/)).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 0 / 500')).toBeInTheDocument();
  });

  it('searches only the verified catalogue and finds முத்தைத்தரு', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'முத்தைத்தரு');
    expect(screen.getByRole('link', { name: /முத்தைத்தரு/ })).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 1 / 500')).toBeInTheDocument();
  });

  it('reports zero canonical texts and zero approved audio without hiding the gap', () => {
    renderAt('/thiruppugazh');
    const canonicalLabel = screen.getByText('முழு மூல உரை வெளியீடு');
    const audioLabel = screen.getByText('அங்கீகரிக்கப்பட்ட ஒலி');
    expect(canonicalLabel.parentElement).toHaveTextContent('0');
    expect(audioLabel.parentElement).toHaveTextContent('0');
  });
});
