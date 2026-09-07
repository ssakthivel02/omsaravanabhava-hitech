import { useLocale, type UiLocale } from '@/lib/locale';

const OPTIONS: Array<{ value: UiLocale; short: string; label: string }> = [
  { value: 'ta', short: 'தமிழ்', label: 'தமிழ் இடைமுகம்' },
  { value: 'en', short: 'EN', label: 'English interface' },
];

export default function LanguageSwitch() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-switch" role="group" aria-label="Interface language / இடைமுக மொழி">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="language-switch-option"
          aria-pressed={locale === option.value}
          aria-label={option.label}
          onClick={() => setLocale(option.value)}
        >
          {option.short}
        </button>
      ))}
    </div>
  );
}
