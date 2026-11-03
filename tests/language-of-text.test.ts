import { describe, it, expect } from 'vitest';
import { languageOfText } from '@/lib/languageOfText';
import { temples } from '@/content/temples';

describe('languageOfText', () => {
  it('tags each Indic script with its language', () => {
    expect(languageOfText('திருப்பரங்குன்றம்')).toBe('ta');
    expect(languageOfText('ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ')).toBe('kn');
    expect(languageOfText('ത്രിശ്ശൂർ സുബ്രഹ്മണ്യ')).toBe('ml');
    expect(languageOfText('స్కందగిరి సుబ్రహ్మణ్య స్వామి')).toBe('te');
    expect(languageOfText('कार्तिक स्वामी मंदिर')).toBe('hi');
  });

  it('keeps Tamil for Tamil text that contains a Latin place name', () => {
    expect(languageOfText('Ariyalur முருகன் கோவில்')).toBe('ta');
  });

  it('uses en for Latin-only text and the fallback when there are no letters', () => {
    expect(languageOfText('Kukke Subramanya Temple')).toBe('en');
    expect(languageOfText('')).toBe('ta');
    expect(languageOfText(null, 'en')).toBe('en');
    expect(languageOfText('1234 —', 'ta')).toBe('ta');
  });

  it('does not alter or normalise the text (pure classifier)', () => {
    const input = 'ಕುಕ್ಕೆ';
    languageOfText(input);
    expect(input).toBe('ಕುಕ್ಕೆ');
  });

  it('classifies every governed temple name; no record falls to an unexpected language', () => {
    const counts: Record<string, number> = {};
    for (const t of temples) {
      if (!t.nameTa) continue;
      const lang = languageOfText(t.nameTa);
      counts[lang] = (counts[lang] ?? 0) + 1;
      // Never silently relabel a name as English: a record's Indic name must stay Indic.
      if (/[ऀ-ൿ]/u.test(t.nameTa)) expect(lang).not.toBe('en');
    }
    // Known current data: native-script names stored in `nameTa`.
    expect(counts.kn).toBe(5);
    expect(counts.ml).toBe(7);
    expect(counts.te).toBe(4);
    expect(counts.hi).toBe(2);
    // Latin-only strings stored in `nameTa` (overseas temples) are English, not Tamil.
    expect(counts.en).toBe(154);
    expect(counts.ta).toBe(204);
  });
});
