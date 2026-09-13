import { sourceLedger, works } from '@/content';
import { useLocale } from '@/lib/locale';
import './trust-r213.css';

export default function Sources() {
  const { locale, text } = useLocale();
  const linkedSources = sourceLedger.filter((source) => Boolean(source.url)).length;

  return (
    <article className="page trust-page sources-page">
      <header className="page-head trust-hero">
        <div className="trust-hero-copy">
          <p className="trust-eyebrow" lang={locale}>
            {text('ஆதார வெளிப்படைத்தன்மை', 'Source transparency')}
          </p>
          <h1 lang={locale}>{text('மூலங்களும் முறையும்', 'Sources and Method')}</h1>
          <p lang={locale}>
            {text(
              'ஒவ்வொரு பதிவும் அறியப்பட்ட மூலத்திலிருந்து வருகிறது. மூலம் இல்லாத தகவலை இத்தளம் வெளியிடாது.',
              'Every record traces to a known source. This site does not publish information that has no source.',
            )}
          </p>
        </div>

        <dl className="trust-summary" aria-label={text('மூலச் சுருக்கம்', 'Source summary')}>
          <div>
            <dt lang={locale}>{text('நூல்கள்', 'Works')}</dt>
            <dd>{works.length}</dd>
          </div>
          <div>
            <dt lang={locale}>{text('மூலப் பதிவுகள்', 'Source records')}</dt>
            <dd>{sourceLedger.length}</dd>
          </div>
          <div>
            <dt lang={locale}>{text('இணைக்கப்பட்ட மூலங்கள்', 'Linked sources')}</dt>
            <dd>{linkedSources}</dd>
          </div>
        </dl>
      </header>

      <section className="trust-section" aria-labelledby="method-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={locale}>
            {text('வெளியீட்டு ஒழுங்கு', 'Publication discipline')}
          </p>
          <h2 id="method-h" lang={locale}>
            {text('முறை', 'Method')}
          </h2>
        </div>
        <ul className="trust-principles" lang={locale}>
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

      <section className="trust-section" aria-labelledby="works-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={locale}>
            {text('ஆதார அடுக்கு', 'Reference layer')}
          </p>
          <h2 id="works-h" lang={locale}>
            {text('நூல்கள்', 'Works')}
          </h2>
        </div>
        <ul className="trust-work-grid">
          {works.map((work) => (
            <li key={work.id ?? work.titleEn}>
              {/* Work title and author are canonical/source facts: always Tamil when available. */}
              <strong lang={work.titleTa ? 'ta' : 'en'}>{work.titleTa ?? work.titleEn}</strong>
              {work.author && <span>{work.author}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="trust-section trust-ledger" aria-labelledby="ledger-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={locale}>
            {text('திறந்த ஆதாரம்', 'Traceable references')}
          </p>
          <h2 id="ledger-h" lang={locale}>
            {text('மூல ஏடு', 'Source Ledger')}
          </h2>
          <p lang={locale}>
            {text(
              'இங்கு காட்டப்படுவது ஏற்கனவே பராமரிக்கப்படும் மூல ஏட்டிலுள்ள குறிப்புகள் மட்டுமே.',
              'This view presents only the references already maintained in the governed source ledger.',
            )}
          </p>
        </div>
        <ol className="trust-ledger-list">
          {sourceLedger.map((source, index) => (
            <li key={`${source.reference ?? source.url ?? 'source'}-${index}`}>
              <span className="trust-ledger-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                {source.url ? (
                  <a href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.reference ?? source.url}
                    <span className="sr-only"> {text('(புதிய தாவலில் திறக்கும்)', '(opens in a new tab)')}</span>
                  </a>
                ) : (
                  <span>{source.reference ?? '—'}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
