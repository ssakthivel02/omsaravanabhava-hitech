import { useMemo, useState, useId } from 'react';
import { Link } from 'wouter';
import { temples } from '@/content/temples';

const PAGE_SIZE = 200;

export default function Temples() {
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return temples;
    return temples.filter((t) =>
      [t.nameTa, t.nameEn, t.transliteration, t.district, t.state]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle)),
    );
  }, [q]);

  const visible = results.slice(0, shown);

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">முருகன் கோயில்கள்</h1>
        <p lang="ta">{temples.length} பதிவுகள். பெயர் அல்லது இடத்தால் வடிகட்டவும்.</p>
      </header>

      <div className="filter">
        <label htmlFor={inputId} lang="ta">
          கோயில் தேடல்
        </label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShown(PAGE_SIZE);
          }}
          placeholder="திருச்செந்தூர் / Palani"
        />
      </div>

      <p className="result-count" aria-live="polite" lang="ta">
        {results.length === 0
          ? '0 பதிவுகள்'
          : `காட்டப்படுவது ${visible.length} / மொத்தம் ${results.length} பதிவுகள்`}
      </p>

      {results.length === 0 ? (
        <p className="empty" lang="ta">
          இந்தத் தேடலுக்குப் பதிவு எதுவும் இல்லை. வேறு பெயரையோ இடத்தையோ
          முயற்சிக்கவும்.
        </p>
      ) : (
        <ul className="temple-list">
          {visible.map((t) => (
            <li key={t.id}>
              <Link href={`/temples/${t.id}`} className="temple-row">
                <b lang="ta">{t.nameTa ?? t.nameEn}</b>
                <small>{t.nameEn}</small>
                {t.isArupadaiVeedu && (
                  <em className="tag" lang="ta">
                    அறுபடை வீடு
                  </em>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {shown < results.length && (
        <button type="button" className="btn btn-quiet" onClick={() => setShown((n) => n + PAGE_SIZE)}>
          <span lang="ta">மேலும் காட்டு</span>
        </button>
      )}
    </article>
  );
}
