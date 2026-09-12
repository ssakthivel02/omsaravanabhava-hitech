import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
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

describe('R2.12 geographic provenance UI integration', () => {
  it('renders all six Arupadai Veedu records fail-closed until authoritative coordinates are verified', () => {
    const { container } = renderAt('/arupadai-veedu');

    expect(
      container.querySelectorAll(
        '[data-coordinate-publication-state="COORDINATES_PENDING_VERIFICATION"]',
      ),
    ).toHaveLength(6);

    expect(
      container.querySelectorAll(
        '[data-coordinate-publication-state="COORDINATES_VERIFIED_FOR_PUBLICATION"]',
      ),
    ).toHaveLength(0);
  });
});
