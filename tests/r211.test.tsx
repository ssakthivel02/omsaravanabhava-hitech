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
  it('locks the governed runtime at exactly 1250 source-linked records with no canonical bodies', () => {
    expect(thiruppugazh).toHaveLength(1250);
    expect(thiruppugazh.every((song) => song.canonicalText === null)).toBe(true);
    expect(thiruppugazh.every((song) => song.audioState === 'NO_APPROVED_AUDIO')).toBe(true);
    expect(thiruppugazh.at(-1)?.id).toBe('thiruppugazh-1250');
    expect(thiruppugazh.at(-1)?.openingWords).toBe('தீ ஊதை தாத்ரி');
  });

  it('distinguishes the 1326-song reference corpus from the 1250 source-linked records', () => {
    renderAt('/thiruppugazh');
    expect(screen.getByText('1326')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
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
    [400, 'இருவர் மயலோ'], [425, 'செயசெய அருணா'], [450, 'கைத்தருண சோதி'], [475, 'கூந்தலாழ விரிந்து'],
    [500, 'சகுட முந்தும்'], [525, 'சரவண பவநிதி'], [575, 'ஐந்து பூதமும்'], [600, 'அத் துகிரின் நல்'],
    [625, 'கடினதட கும்ப'], [650, 'விலைக்கு மேனியில்'], [675, 'புவிபுனல் காலும்'], [700, 'தலங்களில் வரும்'],
    [725, 'சீதள வாரிஜ'], [750, 'குடத் தாமரையாம்'], [775, 'பூமாது உரமேயணி'], [800, 'சூழ்ந்து ஏன்ற துக்க'],
    [825, 'உரை ஒழிந்து'], [850, 'இதசந்தன புழுகு'], [875, 'கடகரிம ருப்பிற்க'], [900, 'அரி மருகோனே'],
    [925, 'தசையாகிய'], [950, 'மைச் சரோருகம்'], [975, 'ஏடுக்கொத் தாரலர்'], [1000, 'வேடர் செழுந்தினை'],
  ] as const;

  for (const [number, opening] of samples) {
    it(`publishes validated metadata through song ${number}`, async () => {
      const user = userEvent.setup();
      renderAt('/thiruppugazh');
      await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), opening);
      const song = screen.getByRole('link', { name: new RegExp(opening) });
      expect(song).toHaveAttribute('href', `/thiruppugazh/thiruppugazh-${String(number).padStart(4, '0')}`);
      expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
    });
  }

  it('publishes validated Part III metadata through song 1000 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'வேடர் செழுந்தினை');
    const songOneThousand = screen.getByRole('link', { name: /வேடர் செழுந்தினை/ });
    expect(songOneThousand).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1000');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1025 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'சீதமலம் வெப்பு');
    const songOneThousandTwentyFive = screen.getByRole('link', { name: /சீதமலம் வெப்பு/ });
    expect(songOneThousandTwentyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1025');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1050 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'தொட அடாது');
    const songOneThousandFifty = screen.getByRole('link', { name: /தொட அடாது/ });
    expect(songOneThousandFifty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1050');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1075 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'திரிபுரம் அதனை');
    const songOneThousandSeventyFive = screen.getByRole('link', { name: /திரிபுரம் அதனை/ });
    expect(songOneThousandSeventyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1075');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1100 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'அங்கதன் கண்டகன்');
    const songOneThousandOneHundred = screen.getByRole('link', { name: /அங்கதன் கண்டகன்/ });
    expect(songOneThousandOneHundred).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1100');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1125 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'அரிய வஞ்சகர்');
    const songOneThousandOneHundredTwentyFive = screen.getByRole('link', { name: /அரிய வஞ்சகர்/ });
    expect(songOneThousandOneHundredTwentyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1125');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1150 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'கலவியி நலமுரை');
    const songOneThousandOneHundredFifty = screen.getByRole('link', { name: /கலவியி நலமுரை/ });
    expect(songOneThousandOneHundredFifty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1150');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1175 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'பாணிக்கு உட்படாது');
    const songOneThousandOneHundredSeventyFive = screen.getByRole('link', { name: /பாணிக்கு உட்படாது/ });
    expect(songOneThousandOneHundredSeventyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1175');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1200 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'வாடையில் மதனை');
    const songOneThousandTwoHundred = screen.getByRole('link', { name: /வாடையில் மதனை/ });
    expect(songOneThousandTwoHundred).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1200');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1225 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'கச்சுப் பூட்டு');
    const songOneThousandTwoHundredTwentyFive = screen.getByRole('link', { name: /கச்சுப் பூட்டு/ });
    expect(songOneThousandTwoHundredTwentyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1225');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('publishes validated Part IV metadata through song 1250 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'தீ ஊதை தாத்ரி');
    const songOneThousandTwoHundredFifty = screen.getByRole('link', { name: /தீ ஊதை தாத்ரி/ });
    expect(songOneThousandTwoHundredFifty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1250');
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('exposes exactly the 340 governed Part II records currently promoted', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-2');
    expect(screen.getByText('காட்டப்படுவது 340 / 1250')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /அற்றைக் கற்றை/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0331');
    expect(screen.getByRole('link', { name: /நிகரில் பஞ்ச/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0670');
  });

  it('exposes exactly the 330 governed Part III records currently promoted', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-3');
    expect(screen.getByText('காட்டப்படுவது 330 / 1250')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /பரவி உனது/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0671');
    expect(screen.getByRole('link', { name: /வேடர் செழுந்தினை/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1000');
  });

  it('exposes exactly the 250 governed Part IV records currently promoted', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-4');
    expect(screen.getByText('காட்டப்படுவது 250 / 1250')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /இலகி யிருகுழை/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1001');
    expect(screen.getByRole('link', { name: /தீ ஊதை தாத்ரி/ })).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-1250');
  });

  it('searches only the verified catalogue and finds முத்தைத்தரு', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'முத்தைத்தரு');
    expect(screen.getByRole('link', { name: /முத்தைத்தரு/ })).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 1 / 1250')).toBeInTheDocument();
  });

  it('reports zero canonical texts and zero approved audio without hiding the gap', () => {
    renderAt('/thiruppugazh');
    const canonicalLabel = screen.getByText('முழு மூல உரை வெளியீடு');
    const audioLabel = screen.getByText('அங்கீகரிக்கப்பட்ட ஒலி');
    expect(canonicalLabel.parentElement).toHaveTextContent('0');
    expect(audioLabel.parentElement).toHaveTextContent('0');
  });
});