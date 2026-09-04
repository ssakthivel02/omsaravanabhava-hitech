import { useCallback, useState } from 'react';
import { arupadaiVeedu } from '@/content';
import { localDayIndex } from '@/lib/localDay';

const KEY = 'omsaravanabhava-hitech.practice.count';

// Read once, synchronously, as the lazy useState initialiser below — never
// from an effect. Setting state from inside an effect body on mount causes
// an avoidable second render (react-hooks/set-state-in-effect); this app has
// no server-rendered HTML to hydrate, so reading localStorage during the
// first client render cannot cause a hydration mismatch.
const readStoredCount = (): number => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
};

/**
 * Daily devotion: a private repetition counter kept in this browser only.
 * No account, no streak pressure, no server. The count can always be reset.
 */
export default function Practice() {
  const [count, setCount] = useState<number>(readStoredCount);

  const persist = useCallback((n: number) => {
    setCount(n);
    try {
      window.localStorage.setItem(KEY, String(n));
    } catch {
      /* ignore */
    }
  }, []);

  // The six abodes rotate as a daily focus, derived from the visitor's local
  // calendar date (see src/lib/localDay.ts — R2-CODE-007) so it is stable for
  // their whole day and requires no stored state.
  const dayIndex = localDayIndex(arupadaiVeedu.length);
  const focus = arupadaiVeedu[dayIndex];

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">தினசரி வழிபாடு</h1>
        <p lang="ta">
          எண்ணிக்கை இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது. கணக்கு தேவையில்லை.
        </p>
      </header>

      {focus && (
        <section aria-labelledby="focus-h">
          <h2 id="focus-h" lang="ta">
            இன்றைய நினைவு
          </h2>
          <p className="canonical" lang="ta">
            {focus.nameTa}
          </p>
        </section>
      )}

      <section aria-labelledby="count-h">
        <h2 id="count-h" lang="ta">
          ஜப எண்ணிக்கை
        </h2>
        <p className="counter" aria-live="polite">
          <span className="counter-value">{count}</span>
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => persist(count + 1)}
          >
            <span lang="ta">ஒன்று சேர்</span>
          </button>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => persist(0)}
          >
            <span lang="ta">மீட்டமை</span>
          </button>
        </div>
        <p className="note" lang="ta">
          இத்தளம் எந்த வாக்குறுதியையும் அளிக்கவில்லை. இது ஒரு தனிப்பட்ட
          எண்ணிக்கைக் கருவி மட்டுமே.
        </p>
      </section>
    </article>
  );
}
