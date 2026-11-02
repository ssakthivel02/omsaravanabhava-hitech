import { useLocale, type UiLocale } from '@/lib/locale';

const OPTIONS: Array<{ value: UiLocale; short: string; label: string }> = [
  { value: 'ta', short: 'தமிழ்', label: 'தமிழ் இடைமுகம்' },
  { value: 'en', short: 'English', label: 'English interface' },
  { value: 'te', short: 'తెలుగు', label: 'తెలుగు ఇంటర్‌ఫేస్' },
  { value: 'ml', short: 'മലയാളം', label: 'മലയാളം ഇന്റർഫേസ്' },
  { value: 'kn', short: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ ಇಂಟರ್ಫೇಸ್' },
  { value: 'hi', short: 'हिन्दी', label: 'हिन्दी इंटरफ़ेस' },
];

export default function LanguageSwitch() {
  const { uiLocale, setLocale } = useLocale();

  return (
    <label className="language-switch">
      <span className="sr-only">Interface language / இடைமுக மொழி</span>
      <select
        className="language-switch-select"
        value={uiLocale}
        aria-label="Interface language / இடைமுக மொழி"
        lang={uiLocale}
        onChange={(event) => setLocale(event.currentTarget.value as UiLocale)}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value} lang={option.value}>
            {option.short}
          </option>
        ))}
      </select>
    </label>
  );
}
