import { describe, expect, it } from 'vitest';
import final1326Raw from '@/content/intake/thiruppugazh-final-1326.json';
import sources from '@/content/sources.json';

const final1326 = final1326Raw;

describe('R2.11 Thiruppugazh final 1326 — Project Madurai Part IV', () => {
  it('contains exactly the governed final 1326 record', () => {
    expect(final1326).toHaveLength(1);
    expect(final1326.at(0)?.id).toBe('thiruppugazh-1326');
    expect(final1326.at(0)?.sourceNumbering.number).toBe(1326);
    expect(final1326.at(0)?.openingWords).toBe('ஓருரு வாகிய');
    expect(final1326.at(0)?.titleTa).toBe('ஓருரு வாகி');
  });

  it('remains on the governed Project Madurai Part IV source lane', () => {
    const song = final1326.at(0);
    expect(song?.sourceId).toBe('MHS14');
    expect(song?.edition).toBe('Project Madurai Part IV, verses 1001–1326');
    expect(song?.sourceNumbering.system).toBe('Project Madurai Part IV');
    const source = sources.find((entry) => entry.id === 'MHS14');
    expect(source).toMatchObject({
      reference: 'Project Madurai Thiruppugazh Part IV, verses 1001–1326',
      type: 'PUBLIC_UNICODE_EDITION',
      confidence: 'HIGH',
      url: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html',
      rights: 'HEADER_PRESERVATION_CONDITION_STATED',
    });
  });

  it('keeps the final record fail-closed and metadata-only', () => {
    const song = final1326.at(0);
    expect(song?.canonicalText).toBeNull();
    expect(song?.canonicalTextStatus).toBe('SOURCE_LINKED_TEXT_NOT_IMPORTED');
    expect(song?.attribution).toBe('SOURCE_VERIFIED_METADATA_ONLY');
    expect(song?.verificationState).toBe('SOURCE_VERIFIED_METADATA_ONLY');
    expect(song?.meaningState).toBe('NOT_PUBLISHED');
    expect(song?.transliterationState).toBe('NOT_PUBLISHED');
    expect(song?.audioState).toBe('NO_APPROVED_AUDIO');
    expect(song?.publicationState).toBe('INTAKE_VALIDATED_NOT_YET_PUBLIC');
    expect(song?.rightsStatus).toBe('HEADER_PRESERVATION_CONDITION_STATED');
    expect('venue' in song!).toBe(false);
    expect('audioUrl' in song!).toBe(false);
    expect('mediaUrl' in song!).toBe(false);
  });

  it('locks the independently corroborated final endpoint', () => {
    const song = final1326.at(0);
    expect(song?.sourceNumbering.number).toBe(1326);
    expect(song?.openingWords).toBe('ஓருரு வாகிய');
    expect(song?.titleTa).toBe('ஓருரு வாகி');
  });

  it('is exactly the single terminal record after qualified 1325', () => {
    expect(final1326.at(0)?.sourceNumbering.number).toBe(1326);
  });
});