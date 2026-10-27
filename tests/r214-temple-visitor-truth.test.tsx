import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import App from '@/app/App';

function openTemple(path: string) {
  const { hook } = memoryLocation({ path, static: false });
  return render(<Router hook={hook}><App /></Router>);
}

describe('R2.14 temple visitor experience', () => {
  it('shows visitor-friendly source context without raw audit badges or spreadsheet filenames', async () => {
    openTemple('/temples/ctm-ettukudi');
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(await screen.findByText(/கோயிலின் பெயர் மற்றும் கிடைக்கும் தகவல்கள்/)).toBeInTheDocument();
    const visible = document.body.textContent ?? '';
    expect(visible).not.toMatch(/Saravana_Bhava_World_Murugan_Temples_Expanded_Master\\.xlsx/);
    expect(visible).not.toMatch(/Completeness:\\s*0\\/3/);
    expect(visible).not.toMatch(/Source identity:\\s*MEDIUM/);
    expect(visible).not.toMatch(/Coordinates:\\s*Verification pending/);
    expect(visible).not.toMatch(/Image:\\s*Image pending/);
  });
});
