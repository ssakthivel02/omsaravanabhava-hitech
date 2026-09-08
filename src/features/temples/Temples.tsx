import { useMemo, useState, useId } from 'react';
import { Link } from 'wouter';
import { temples } from '@/content/temples';
import { useLocale } from '@/lib/locale';

const PAGE_SIZE = 200;

export default function Temples() {
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();
  const { locale, text } = useLocale();

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
        <h1 lang={locale}>{text('முருகன் கோயில்கள்', 'Murugan Temples')}</h1>
        <p lang={locale}>
          {text(
            `${temples.length} பதிவுகள். பெயர் அல்லது இடத்தால் வடிகட்டவும்.`,
            `${temples.length} records. Filter by name or place.`,
          )}
        </p>
      </header>

      <div className="filter">
        <label htmlFor={inputId} lang={locale}>
          {text('கோயில் தேடல்', 'Search temples')}
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

      <p className="result-count" aria-live="polite" lang={locale}>
        {results.length === 0
          ? text('0 பதிவுகள்', '0 records')
          : text(
              `காட்டப்படுவது ${visible.length} / மொத்தம் ${results.length} பதிவுகள்`,
              `Showing ${visible.length} of ${results.length} records`,
            )}
      </p>

      {results.length === 0 ? (
        <p className="empty" lang={locale}>
          {text(
            'இந்தத் தேடலுக்குப் பதிவு எதுவும் இல்லை. வேறு பெயரையோ இடத்தையோ முயற்சிக்கவும்.',
            'No records match this search. Try a different name or place.',
          )}
        </p>
      ) : (
        <ul className="temple-list">
          {visible.map((t) => {
            const showEnglishFirst = locale === 'en' && Boolean(t.nameEn);
            return (
              <li key={t.id}>
                <Link href={`/temples/${t.id}`} className="temple-row">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{t.nameEn}</b>
                      {t.nameTa && <small lang="ta">{t.nameTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={t.nameTa ? 'ta' : 'en'}>{t.nameTa ?? t.nameEn}</b>
                      <small>{t.nameEn}</small>
                    </>
                  )}
                  {t.isArupadaiVeedu && (
                    <em className="tag" lang={locale}>
                      {text('அறுபடை வீடு', 'Six Abodes')}
                    </em>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {shown < results.length && (
        <button type="button" className="btn btn-quiet" onClick={() => setShown((n) => n + PAGE_SIZE)}>
          <span lang={locale}>{text('மேலும் காட்டு', 'Show more')}</span>
        </button>
      )}
    </article>
  );
}
