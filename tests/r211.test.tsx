import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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

describe('R2.11 Thiruppugazh corpus catalogue', () => {
  it('distinguishes the 1326-song reference corpus from the 175 source-linked records', () => {
    renderAt('/thiruppugazh');
    expect(screen.getByText('1326')).toBeInTheDocument();
    expect(screen.getByText('175')).toBeInTheDocument();
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
    const songOneLink = screen
      .getAllByRole('link', { name: /விநாயகர் துதி/ })
      .find((link) => link.getAttribute('href') === '/thiruppugazh/thiruppugazh-0001');
    expect(songOneLink).toBeInTheDocument();
  });

  it('publishes validated batch 002 metadata through song 30 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'அனைவரும் மருண்டு');
    const songThirty = screen.getByRole('link', { name: /அனைவரும் மருண்டு/ });
    expect(songThirty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0030');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 003 metadata through song 50 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'கொங்கைகள்');
    const songFifty = screen.getByRole('link', { name: /கொங்கைகள்/ });
    expect(songFifty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0050');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 004 metadata through song 75 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'பஞ்ச பாதகம்');
    const songSeventyFive = screen.getByRole('link', { name: /பஞ்ச பாதகம்/ });
    expect(songSeventyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0075');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 005 metadata through song 100 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'விந்ததில் ஊறி');
    const songOneHundred = screen.getByRole('link', { name: /விந்ததில் ஊறி/ });
    expect(songOneHundred).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0100');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 006 metadata through song 125 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'ஓடி ஓடி');
    const songOneHundredTwentyFive = screen.getByRole('link', { name: /ஓடி ஓடி/ });
    expect(songOneHundredTwentyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0125');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 007 metadata through song 150 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'குன்றுங் குன்றும்');
    const songOneHundredFifty = screen.getByRole('link', { name: /குன்றுங் குன்றும்/ });
    expect(songOneHundredFifty).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0150');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('publishes validated batch 008 metadata through song 175 without publishing its body', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'பாரியான கொடை');
    const songOneHundredSeventyFive = screen.getByRole('link', { name: /பாரியான கொடை/ });
    expect(songOneHundredSeventyFive).toHaveAttribute('href', '/thiruppugazh/thiruppugazh-0175');
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('searches only the verified catalogue and finds முத்தைத்தரு', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.type(screen.getByLabelText('திருப்புகழ் தேடல்'), 'முத்தைத்தரு');
    expect(screen.getByRole('link', { name: /முத்தைத்தரு/ })).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 1 / 175')).toBeInTheDocument();
  });

  it('does not fabricate records for an uncovered source part', async () => {
    const user = userEvent.setup();
    renderAt('/thiruppugazh');
    await user.selectOptions(screen.getByLabelText('மூல பகுதி'), 'part-2');
    expect(screen.getByText(/இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை/)).toBeInTheDocument();
    expect(screen.getByText('காட்டப்படுவது 0 / 175')).toBeInTheDocument();
  });

  it('reports zero canonical texts and zero approved audio without hiding the gap', () => {
    renderAt('/thiruppugazh');
    const canonicalLabel = screen.getByText('முழு மூல உரை வெளியீடு');
    const audioLabel = screen.getByText('அங்கீகரிக்கப்பட்ட ஒலி');
    expect(canonicalLabel.parentElement).toHaveTextContent('0');
    expect(audioLabel.parentElement).toHaveTextContent('0');
  });
});
