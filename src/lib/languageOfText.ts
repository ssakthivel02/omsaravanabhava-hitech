/**
 * Language tag for a piece of display text, derived from its actual script.
 *
 * Several governed records keep their native-script name in a field called
 * `nameTa` even when the temple is Kannada, Malayalam, Telugu or Hindi (for
 * example "ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ"). Hardcoding `lang="ta"` on those mislabels them
 * for screen readers (WCAG 3.1.2 Language of Parts) and biases font selection.
 * This returns the dominant Indic script's language, `en` for Latin-only text,
 * and `fallback` when the string has no letters. It never alters the text.
 */
export type TextLang = 'ta' | 'te' | 'kn' | 'ml' | 'hi' | 'en';

const INDIC: ReadonlyArray<readonly [Exclude<TextLang, 'en'>, number, number]> = [
  ['ta', 0x0b80, 0x0bff],
  ['te', 0x0c00, 0x0c7f],
  ['kn', 0x0c80, 0x0cff],
  ['ml', 0x0d00, 0x0d7f],
  ['hi', 0x0900, 0x097f], // Devanagari (Hindi/Marathi/Sanskrit names)
];

export function languageOfText(text: string | null | undefined, fallback: TextLang = 'ta'): TextLang {
  if (!text) return fallback;
  const counts = new Map<TextLang, number>();
  let latin = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    const hit = INDIC.find(([, lo, hi]) => cp >= lo && cp <= hi);
    if (hit) counts.set(hit[0], (counts.get(hit[0]) ?? 0) + 1);
    else if ((cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a)) latin += 1;
  }
  let best: TextLang | null = null;
  let bestCount = 0;
  for (const [lang, n] of counts) {
    if (n > bestCount) {
      best = lang;
      bestCount = n;
    }
  }
  if (best) return best;
  return latin > 0 ? 'en' : fallback;
}
