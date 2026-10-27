import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('does not send a Tiruppugazh reader to an external source website', async () => {
    openPath('/thiruppugazh');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('திருப்புகழ்');
    expect(document.querySelector('a[href*="projectmadurai.org"]')).toBeNull();
    expect(document.querySelector('a[target="_blank"]')).toBeNull();
  });
});
