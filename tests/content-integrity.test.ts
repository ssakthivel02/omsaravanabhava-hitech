/**
 * Content integrity: the governed corpus must never be silently invented.
 * These tests fail if a future import fabricates text the registries do not
 * actually contain, or drops a record that the archive does contain.
 */
import { describe, it, expect } from 'vitest';
import { temples } from '@/content/temples';
import {
  arupadaiVeedu,
  thiruppugazh,
  devotionalWorks,
  namavali,
  completeness,
  describeState,
} from '@/content';

describe('governed corpus', () => {
  it('carries the full recovered temple corpus', () => {
    expect(temples.length).toBe(376);
  });

  it('has exactly the six Arupadai Veedu in traditional order', () => {
    expect(arupadaiVeedu.map((t) => t.nameTa)).toEqual([
      'திருப்பரங்குன்றம்',
      'திருச்செந்தூர்',
      'பழனி',
      'சுவாமிமலை',
      'திருத்தணி',
      'பழமுதிர்சோலை',
    ]);
    expect(arupadaiVeedu.map((t) => t.pilgrimageOrder)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('does not invent Thiruppugazh verse text', () => {
    // R6 records are source-linked but the verse body was never re-imported.
    // If this starts failing, verify the text came from an authorised import.
    for (const s of thiruppugazh) {
      if (s.canonicalText !== null) {
        expect(s.canonicalTextStatus).not.toContain('NOT_REIMPORTED');
      }
    }
  });

  it('does not invent temple history or coordinates', () => {
    for (const t of temples) {
      if (t.latitude !== null) {
        expect(t.coordinateConfidence).not.toContain('PENDING_VERIFICATION');
      }
    }
  });

  it('publishes no Namavali collection while the registry forbids it', () => {
    if (namavali.datasetStatus.includes('ZERO_PUBLISHABLE')) {
      expect(namavali.records.length).toBe(0);
    }
  });

  it('keeps every devotional work metadata-only until rights are cleared', () => {
    for (const w of devotionalWorks) {
      if (w.rightsState.includes('UNCERTAIN')) {
        expect(w.canonicalTextState).toMatch(/NOT_REPUBLISHED|METADATA_ONLY/);
      }
    }
  });

  it('reports completeness truthfully against the actual records', () => {
    const templesDomain = completeness.domains.find((d) => d.key === 'temples');
    expect(templesDomain?.records).toBe(temples.length);
    expect(templesDomain?.withCoordinates).toBe(
      temples.filter((t) => t.latitude !== null).length,
    );
  });
});

describe('state labelling', () => {
  it('never labels a pending record as verified', () => {
    expect(describeState('COORDINATES_PENDING_VERIFICATION').tone).toBe('pending');
    expect(describeState('NO_APPROVED_AUDIO').tone).toBe('absent');
    expect(describeState('WITNESS_LEAD_RIGHTS_UNCERTAIN_NO_REPUBLICATION').tone).toBe(
      'absent',
    );
    expect(describeState('INHERITED_VERIFIED_SOURCE_LINKED').tone).toBe('verified');
  });
});
