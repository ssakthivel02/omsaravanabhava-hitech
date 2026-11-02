import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';

function openPath(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(<Router hook={hook}><App /></Router>);
}

describe('R2.14 internal Tamil library journeys', () => {
  it('opens a Murugan devotional book inside this website, without fabricating its text', async () => {
    openPath('/works/read/kandar-anubhuti');
    expect(await screen.findByRole('heading', { level: 1, name: 'கந்தர் அனுபூதி' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('கந்தர் அனுபூதி — ஓம் சரவணபவ'));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');
    expect(screen.getByRole('status')).toHaveTextContent(/வெளியிடப்படமாட்டாது/);
    expect(document.querySelector('.canonical')).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('offers internal reading navigation from the governed Works catalogue', async () => {
    openPath('/works');
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    const link = document.querySelector('a[href="/works/read/kandar-anubhuti"]');
    expect(link).not.toBeNull();
    expect(link).toHaveTextContent('நூல் விவரம்');
    expect(link).not.toHaveTextContent('தமிழில் படிக்க');
  });

  it('keeps reading controls and canonical text hidden for a rights-pending song', async () => {
    openPath('/thiruppugazh/thiruppugazh-0006');
    expect(await screen.findByRole('heading', { level: 1, name: 'முத்தைத்தரு' })).toBeInTheDocument();
    expect(document.querySelector('.canonical')).toBeNull();
    expect(screen.queryByRole('button', { name: 'எழுத்தைப் பெருக்க' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Decrease text size' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /திருப்புகழ் பாடல் வழிசெலுத்தல்/ })).toBeInTheDocument();
  });

  it('does not create a missing song when an unknown number is submitted', async () => {
    const user = userEvent.setup();
    openPath('/thiruppugazh');
    const jump = await screen.findByRole('textbox', { name: /பாடல் எண்ணுக்கு செல்லவும்|Jump to song number/ }, { timeout: 5000 });
    await user.type(jump, '9999');
    await user.click(screen.getByRole('button', { name: /செல்|Go/ }));
    expect(await screen.findByRole('status')).toHaveTextContent(/இந்த எண்ணுக்கான பதிவு கிடைக்கவில்லை|No catalogue entry exists/);
    expect(document.querySelector('a[href="/thiruppugazh/thiruppugazh-9999"]')).toBeNull();
  }, 10000);

  it('distinguishes full Tamil text availability from source-reference entries', async () => {
    const user = userEvent.setup();
    openPath('/thiruppugazh');
    const filter = await screen.findByRole('checkbox', { name: /முழு தமிழ் உரை உள்ள பாடல்கள் மட்டும்|Only songs with full Tamil text/ }, { timeout: 10000 });
    await user.click(filter);
    expect(filter).toBeChecked();
    expect(screen.getByText(/காட்டப்படுவது 0 \/|Showing 0 \/|0 \/ 1326/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/சரிபார்க்கப்பட்ட பதிவு இல்லை|No verified record/);
  }, 15000);

  it('does not send a Tiruppugazh reader to an external source website', async () => {
    openPath('/thiruppugazh');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('திருப்புகழ்');
    expect(document.querySelector('a[href*="projectmadurai.org"]')).toBeNull();
    expect(document.querySelector('a[target="_blank"]')).toBeNull();
  });
});
