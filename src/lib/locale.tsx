import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const UI_LOCALES = ['ta', 'en', 'te', 'ml', 'kn', 'hi'] as const;
export type UiLocale = (typeof UI_LOCALES)[number];
export type LocaleAlternates = Partial<Record<Exclude<UiLocale, 'ta' | 'en'>, string>>;

const STORAGE_KEY = 'omsaravanabhava-hitech-ui-locale-v1';

export function isUiLocale(value: unknown): value is UiLocale {
  return typeof value === 'string' && (UI_LOCALES as readonly string[]).includes(value);
}

function readStoredLocale(): UiLocale {
  if (typeof window === 'undefined') return 'ta';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isUiLocale(stored) ? stored : 'ta';
  } catch {
    return 'ta';
  }
}

function resolveText(
  locale: UiLocale,
  ta: string,
  en: string,
  alternates?: LocaleAlternates,
): string {
  if (locale === 'ta') return ta;
  if (locale === 'en') return en;
  return alternates?.[locale] ?? en;
}

type LocaleContextValue = {
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
  text: (ta: string, en: string, alternates?: LocaleAlternates) => string;
};

// Tamil remains the deterministic first-run default. Routes that have not yet
// completed reviewed translations fall back to English rather than presenting
// machine-generated or unreviewed devotional claims as authoritative copy.
const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ta',
  setLocale: () => undefined,
  text: (ta) => ta,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<UiLocale>(readStoredLocale);

  const setLocale = useCallback((next: UiLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // UI language remains usable for this tab even if browser storage is blocked.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr';
    document.documentElement.dataset.uiLocale = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      text: (ta, en, alternates) => resolveText(locale, ta, en, alternates),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
