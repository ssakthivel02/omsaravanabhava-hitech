import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';
import ReadAloud from '@/components/ReadAloud';
import {
  clearAllLibraryData,
  isSaved,
  readLibrary,
  recordRecent,
  saveItem,
  unsaveItem,
} from '@/lib/localLibrary';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(
    <Router hook={hook}>
      <App />
    </Router>,
  );
}

beforeEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('R2.6 local-only library', () => {
  it('saves and removes a stable reference without any backend', () => {
    const item = { type: 'temple' as const, id: 'ctm-tirupparankundram', titleTa: 'திருப்பரங்குன்றம்' };
    expect(saveItem(item)).toBe(true);
    expect(isSaved(item)).toBe(true);
    expect(readLibrary().saved).toHaveLength(1);
    expect(unsaveItem(item)).toBe(true);
    expect(isSaved(item)).toBe(false);
  });

  it('deduplicates Recent and moves the latest visit to the front', () => {
    const first = { type: 'temple' as const, id: 'ctm-tirupparankundram', titleTa: 'திருப்பரங்குன்றம்' };
    const second = { type: 'temple' as const, id: 'ctm-palani', titleTa: 'பழனி' };
    recordRecent(first);
    recordRecent(second);
    recordRecent(first);
    const recent = readLibrary().recent;
    expect(recent).toHaveLength(2);
    expect(recent[0]?.id).toBe(first.id);
  });

  it('fails closed to an empty library when local storage is corrupted', () => {
    window.localStorage.setItem('omsaravanabhava-hitech-library-v1', '{not-json');
    expect(readLibrary()).toEqual({ version: 1, saved: [], recent: [] });
  });

  it('clears all local library state under user control', () => {
    saveItem({ type: 'temple', id: 'ctm-tirupparankundram' });
    recordRecent({ type: 'temple', id: 'ctm-tirupparankundram' });
    expect(clearAllLibraryData()).toBe(true);
    expect(readLibrary()).toEqual({ version: 1, saved: [], recent: [] });
  });
});

describe('R2.6 governed product routes', () => {
  it('renders the Murugan Knowledge hub with an explicit governed-release boundary', async () => {
    renderAt('/knowledge');
    expect(await screen.findByRole('heading', { level: 1, name: 'முருகன் அறிவுக் களம்' })).toBeInTheDocument();
    expect(screen.getByText(/ஆளுகை\/மூலம்-குறிக்கப்பட்ட பதிவுகளை மட்டுமே/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'திருப்பெயர்கள்' })).toBeInTheDocument();
  });

  it('renders My Library as explicitly local-only', async () => {
    renderAt('/library');
    expect(await screen.findByRole('heading', { level: 1, name: 'என் சேமிப்புகள்' })).toBeInTheDocument();
    expect(screen.getByText(/கணக்கு, மேக ஒத்திசைவு அல்லது பகுப்பாய்வு இல்லை/)).toBeInTheDocument();
    expect(screen.getByText(/இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை/)).toBeInTheDocument();
  });

  it('finds a governed Murugan name and can narrow to the names facet', async () => {
    const user = userEvent.setup();
    renderAt('/search');
    const input = await screen.findByLabelText('தேடல் சொல்');
    await user.type(input, 'முருக');
    await user.click(screen.getByRole('button', { name: 'முருகன் பெயர்கள்' }));
    expect(screen.queryByText(/இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது/)).not.toBeInTheDocument();
    expect(screen.getAllByText('முருகன் பெயர்').length).toBeGreaterThan(0);
  });
});

describe('R2.6 browser read aloud', () => {
  it('does not autoplay speech on render', () => {
    const speak = vi.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak,
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: () => [],
      },
    });
    render(<ReadAloud text="முருகன்" />);
    expect(speak).not.toHaveBeenCalled();
  });

  it('refuses to substitute a non-Tamil voice for Tamil text', async () => {
    const speak = vi.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak,
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: () => [{ lang: 'en-GB', name: 'English', default: true, localService: true, voiceURI: 'en', nameURI: '' }],
      },
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        lang = '';
        voice: SpeechSynthesisVoice | null = null;
        rate = 1;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(public text: string) {}
      },
    });
    const user = userEvent.setup();
    render(<ReadAloud text="முருகன்" />);
    await user.click(screen.getByRole('button', { name: 'வாசித்துக் கேட்க' }));
    expect(speak).not.toHaveBeenCalled();
    expect(screen.getByText(/தமிழ் வாசிப்பு குரல் கிடைக்கவில்லை/)).toBeInTheDocument();
  });
});
