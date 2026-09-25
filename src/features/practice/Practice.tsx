import { useCallback, useState } from 'react';
import { arupadaiVeedu } from '@/content';
import { localDayIndex } from '@/lib/localDay';
import { useLocale } from '@/lib/locale';
import './practice-r213.css';

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
  const { locale, text } = useLocale();

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
    <article className="page practice-page">
      <header className="page-head practice-hero">
        <div className="practice-hero-copy">
          <h1 lang={locale}>
            {text('தினசரி வழிபாடு', 'Daily Practice', {
              te: 'రోజువారీ ఆరాధన',
              ml: 'ദൈനംദിന ആരാധന',
              kn: 'ದೈನಂದಿನ ಆರಾಧನೆ',
              hi: 'दैनिक साधना',
            })}
          </h1>
          <p lang={locale}>
            {text(
              'எண்ணிக்கை இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது. கணக்கு தேவையில்லை.',
              'The count is saved only in this browser. No account needed.',
              {
                te: 'ఈ లెక్క ఈ బ్రౌజర్‌లో మాత్రమే నిల్వ చేయబడుతుంది. ఖాతా అవసరం లేదు.',
                ml: 'ഈ എണ്ണം ഈ ബ്രൗസറിൽ മാത്രം സൂക്ഷിക്കുന്നു. അക്കൗണ്ട് ആവശ്യമില്ല.',
                kn: 'ಈ ಎಣಿಕೆ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಸಲಾಗುತ್ತದೆ. ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ.',
                hi: 'यह गिनती केवल इस ब्राउज़र में सहेजी जाती है। खाते की आवश्यकता नहीं है।',
              },
            )}
          </p>
        </div>
      </header>

      <div className="practice-grid">
        {focus && (
          <section className="practice-card practice-focus" aria-labelledby="focus-h">
            <h2 id="focus-h" lang={locale}>
              {text('இன்றைய நினைவு', "Today's Focus", {
                te: 'ఈరోజు ధ్యానం',
                ml: 'ഇന്നത്തെ ശ്രദ്ധ',
                kn: 'ಇಂದಿನ ಧ್ಯಾನ',
                hi: 'आज का ध्यान',
              })}
            </h2>
            {/* Canonical Tamil name on the devotional reading surface: always Tamil. */}
            <p className="canonical practice-focus-name" lang="ta">
              {focus.nameTa}
            </p>
          </section>
        )}

        <section className="practice-card practice-counter-card" aria-labelledby="count-h">
          <h2 id="count-h" lang={locale}>
            {text('ஜப எண்ணிக்கை', 'Japa Count', {
              te: 'జప సంఖ్య',
              ml: 'ജപ എണ്ണം',
              kn: 'ಜಪ ಎಣಿಕೆ',
              hi: 'जप गणना',
            })}
          </h2>
          <div className="practice-counter-shell">
            <p className="counter" aria-live="polite">
              <span className="counter-value">{count}</span>
            </p>
          </div>
          <div className="hero-actions practice-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => persist(count + 1)}
            >
              <span lang={locale}>
                {text('ஒன்று சேர்', 'Add one', {
                  te: 'ఒకటి జోడించు',
                  ml: 'ഒന്ന് ചേർക്കുക',
                  kn: 'ಒಂದನ್ನು ಸೇರಿಸಿ',
                  hi: 'एक जोड़ें',
                })}
              </span>
            </button>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => persist(0)}
            >
              <span lang={locale}>
                {text('மீட்டமை', 'Reset', {
                  te: 'రీసెట్ చేయి',
                  ml: 'പുനഃസജ്ജമാക്കുക',
                  kn: 'ಮರುಹೊಂದಿಸಿ',
                  hi: 'रीसेट करें',
                })}
              </span>
            </button>
          </div>
          <p className="note practice-note" lang={locale}>
            {text(
              'இத்தளம் எந்த வாக்குறுதியையும் அளிக்கவில்லை. இது ஒரு தனிப்பட்ட எண்ணிக்கைக் கருவி மட்டுமே.',
              'This site makes no promises. This is only a private counting tool.',
              {
                te: 'ఈ సైట్ ఎలాంటి హామీలు ఇవ్వదు. ఇది కేవలం వ్యక్తిగత లెక్కింపు సాధనం మాత్రమే.',
                ml: 'ഈ സൈറ്റ് യാതൊരു വാഗ്ദാനവും നൽകുന്നില്ല. ഇത് വ്യക്തിഗത എണ്ണൽ ഉപകരണം മാത്രമാണ്.',
                kn: 'ಈ ತಾಣ ಯಾವುದೇ ಭರವಸೆ ನೀಡುವುದಿಲ್ಲ. ಇದು ಕೇವಲ ವೈಯಕ್ತಿಕ ಎಣಿಕೆ ಸಾಧನವಾಗಿದೆ.',
                hi: 'यह साइट कोई वादा नहीं करती। यह केवल एक निजी गिनती उपकरण है।',
              },
            )}
          </p>
        </section>
      </div>
    </article>
  );
}
