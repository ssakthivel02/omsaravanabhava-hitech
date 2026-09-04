import { sourceLedger, works } from '@/content';

export default function Sources() {
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">மூலங்களும் முறையும்</h1>
        <p lang="ta">
          ஒவ்வொரு பதிவும் அறியப்பட்ட மூலத்திலிருந்து வருகிறது. மூலம் இல்லாத
          தகவலை இத்தளம் வெளியிடாது.
        </p>
      </header>

      <section aria-labelledby="method-h">
        <h2 id="method-h" lang="ta">
          முறை
        </h2>
        <ul className="prose-list" lang="ta">
          <li>மூலத் தமிழ் உரை மாற்றப்படுவதில்லை.</li>
          <li>
            மூல உரை, எளிய தமிழ், ஒலிபெயர்ப்பு, பொருள் — தனித்தனி அடுக்குகள்.
          </li>
          <li>சரிபார்க்கப்படாத நிலை மறைக்கப்படுவதில்லை.</li>
          <li>கோயில் நன்கொடைகளை இத்தளம் பெறுவதில்லை.</li>
        </ul>
      </section>

      <section aria-labelledby="works-h">
        <h2 id="works-h" lang="ta">
          நூல்கள்
        </h2>
        <ul className="prose-list">
          {works.map((w) => (
            <li key={w.id ?? w.titleEn}>
              <b lang="ta">{w.titleTa ?? w.titleEn}</b>
              {w.author && <span> · {w.author}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ledger-h">
        <h2 id="ledger-h" lang="ta">
          மூல ஏடு
        </h2>
        <ul className="prose-list">
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
