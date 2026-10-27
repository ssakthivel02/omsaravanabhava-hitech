import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    const jump = await screen.findByRole('textbox', { name: 'பாடல் எண்ணுக்கு செல்லவும்' });
    await user.type(jump, '9999');
    await user.click(screen.getByRole('button', { name: 'செல்' }));
    expect(await screen.findByRole('status')).toHaveTextContent('இந்த எண்ணுக்கான பதிவு கிடைக்கவில்லை');
    expect(document.querySelector('a[href="/thiruppugazh/thiruppugazh-9999"]')).toBeNull();
  });

  it('does not send a Tiruppugazh reader to an external source website', async () => {
    openPath('/thiruppugazh');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('திருப்புகழ்');
    expect(document.querySelector('a[href*="projectmadurai.org"]')).toBeNull();
    expect(document.querySelector('a[target="_blank"]')).toBeNull();
  });
});
