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
export type ContentLocale = 'ta' | 'en';
export type LocaleAlternates = Partial<Record<Exclude<UiLocale, ContentLocale>, string>>;

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

function resolveContentLocale(locale: UiLocale): ContentLocale {
  return locale === 'ta' ? 'ta' : 'en';
}

type LocaleContextValue = {
  /** Selected interface language, including the four new R2.13 locales. */
  uiLocale: UiLocale;
  /**
   * Locale safe for governed content that currently has only Tamil/English
   * labels. New interface languages intentionally fall back to reviewed
   * English until that content layer receives a reviewed translation.
   */
  locale: ContentLocale;
  setLocale: (locale: UiLocale) => void;
  text: (ta: string, en: string, alternates?: LocaleAlternates) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  uiLocale: 'ta',
  locale: 'ta',
  setLocale: () => undefined,
  text: (ta) => ta,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [uiLocale, setLocaleState] = useState<UiLocale>(readStoredLocale);

  const setLocale = useCallback((next: UiLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // UI language remains usable for this tab even if browser storage is blocked.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = uiLocale;
    document.documentElement.dir = 'ltr';
    document.documentElement.dataset.uiLocale = uiLocale;
  }, [uiLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      uiLocale,
      locale: resolveContentLocale(uiLocale),
      setLocale,
      text: (ta, en, alternates) => resolveText(uiLocale, ta, en, alternates),
    }),
    [uiLocale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
