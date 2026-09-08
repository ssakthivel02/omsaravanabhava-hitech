import { sourceLedger, works } from '@/content';
import { useLocale } from '@/lib/locale';

export default function Sources() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('மூலங்களும் முறையும்', 'Sources and Method')}</h1>
        <p lang={locale}>
          {text(
            'ஒவ்வொரு பதிவும் அறியப்பட்ட மூலத்திலிருந்து வருகிறது. மூலம் இல்லாத தகவலை இத்தளம் வெளியிடாது.',
            'Every record traces to a known source. This site does not publish information that has no source.',
          )}
        </p>
      </header>

      <section aria-labelledby="method-h">
        <h2 id="method-h" lang={locale}>
          {text('முறை', 'Method')}
        </h2>
        <ul className="prose-list" lang={locale}>
          <li>{text('மூலத் தமிழ் உரை மாற்றப்படுவதில்லை.', 'The canonical Tamil text is never altered.')}</li>
          <li>
            {text(
              'மூல உரை, எளிய தமிழ், ஒலிபெயர்ப்பு, பொருள் — தனித்தனி அடுக்குகள்.',
              'Source text, easy-reading Tamil, transliteration, meaning — kept as separate layers.',
            )}
          </li>
          <li>{text('சரிபார்க்கப்படாத நிலை மறைக்கப்படுவதில்லை.', 'An unverified state is never hidden.')}</li>
          <li>{text('கோயில் நன்கொடைகளை இத்தளம் பெறுவதில்லை.', 'This site does not receive temple donations.')}</li>
        </ul>
      </section>

      <section aria-labelledby="works-h">
        <h2 id="works-h" lang={locale}>
          {text('நூல்கள்', 'Works')}
        </h2>
        <ul className="prose-list">
          {works.map((w) => (
            <li key={w.id ?? w.titleEn}>
              {/* Work title and author are canonical/source facts: always Tamil. */}
              <b lang={w.titleTa ? 'ta' : 'en'}>{w.titleTa ?? w.titleEn}</b>
              {w.author && <span> · {w.author}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="layers" aria-labelledby="ledger-h">
        <h2 id="ledger-h" lang={locale}>
          {text('மூல ஏடு', 'Source Ledger')}
        </h2>
        <ul className="ledger-list">
          {sourceLedger.map((s, i) => (
            <li key={i}>
              {s.url ? (
                <a href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.reference ?? s.url}
                </a>
              ) : (
                (s.reference ?? '—')
              )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
