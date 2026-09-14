import { describe, expect, it } from 'vitest';
import vinayakaShodasha from '@/content/vinayaka-shodasha-nama.json';

describe('Vinayaka Shodasha Namavali', () => {
  it('publishes exactly sixteen sourced invocations in stable order', () => {
    expect(vinayakaShodasha.invocationCount).toBe(16);
    expect(vinayakaShodasha.invocations).toHaveLength(16);
    expect(vinayakaShodasha.invocations.map((item) => item.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );
  });

  it('matches the verified sixteen-name sequence without merged extras', () => {
    expect(vinayakaShodasha.invocations.map((item) => item.name)).toEqual([
      'Sumukha',
      'Ekadanta',
      'Kapila',
      'Gajakarnaka',
      'Lambodara',
      'Vikata',
      'Vighnaraja',
      'Vinayaka',
      'Dhumaketu',
      'Ganadhyaksha',
      'Phalachandra',
      'Gajanana',
      'Vakratunda',
      'Shurpakarna',
      'Heramba',
      'Skandapurvaja',
    ]);
  });

  it('keeps publication provenance explicit', () => {
    expect(vinayakaShodasha.verificationState).toBe('VERIFIED_AGAINST_IDENTIFIED_SOURCE');
    expect(vinayakaShodasha.publicationState).toBe('PUBLISHED_VERIFIED_SOURCE');
    expect(vinayakaShodasha.source.url).toContain('sanskritdocuments.org');
    expect(vinayakaShodasha.invocations.every((item) => item.tamil.startsWith('ஓம் '))).toBe(true);
  });
});
