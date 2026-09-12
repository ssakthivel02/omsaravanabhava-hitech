import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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

describe('R2.12 temple-detail geographic publication state', () => {
  it('keeps an Arupadai Veedu temple coordinate state fail-closed on the detail route', async () => {
    renderAt('/temples/ctm-tirupparankundram');

    expect(await screen.findByRole('heading', { name: /திருப்பரங்குன்றம்|Tirupparankundram/ })).toBeInTheDocument();

    const provenance = screen.getByRole('heading', { name: /மூலமும் நிலையும்|Source and State/ }).closest('section');
    expect(provenance).not.toBeNull();
    expect(provenance).toHaveAttribute(
      'data-coordinate-publication-state',
      'COORDINATES_PENDING_VERIFICATION',
    );
    expect(provenance).toHaveTextContent(/ஆயத்தொலைவு|Coordinates/);
  });
});
