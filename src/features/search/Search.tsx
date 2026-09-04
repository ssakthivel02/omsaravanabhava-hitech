import { useMemo, useState, useId } from 'react';
import { Link } from 'wouter';
import { thiruppugazh, works } from '@/content';
import { temples } from '@/content/temples';
import StateBadge from '@/components/StateBadge';

interface Hit {
  href: string;
  titleTa: string | null;
  titleEn: string | null;
  kindTa: string;
  state: string;
}

const PAGE_SIZE = 20;

const INDEX: Hit[] = [
  ...temples.map((t) => ({
    href: `/temples/${t.id}`,
    titleTa: t.nameTa,
    titleEn: t.nameEn,
    kindTa: 'கோயில்',
    state: t.coordinateConfidence,
  })),
  ...thiruppugazh.map((s) => ({
    href: `/thiruppugazh/${s.id}`,
    titleTa: s.titleTa ?? s.openingWords,
    titleEn: null,
    kindTa: 'திருப்புகழ்',
    state: s.canonicalTextStatus,
  })),
  ...works.map((w) => ({
    href: '/sources',
    titleTa: w.titleTa,
    titleEn: w.titleEn,
    kindTa: 'நூல்',
    state: w.verificationState,
  })),
];

export default function Search() {
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();

  const allHits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return INDEX.filter((h) =>
      [h.titleTa, h.titleEn]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle)),
    );
  }, [q]);

  const hits = allHits.slice(0, shown);

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">தேடல்</h1>
        <p lang="ta">
          தமிழ் மற்றும் ஆங்கிலத்தில் தேடலாம். இது ஆளுகை/மூலம்-குறிக்கப்பட்ட
          பதிவுகளைத் தேடுகிறது; ஒவ்வொரு முடிவின் நிலையும் அதனுடன்
          காட்டப்படும்.
        </p>
      </header>

      <div className="filter">
        <label htmlFor={inputId} lang="ta">
          தேடல் சொல்
        </label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShown(PAGE_SIZE);
          }}
          placeholder="பழனி / Thiruchendur / முத்தைத்தரு"
          autoComplete="off"
        />
      </div>

      <p className="result-count" aria-live="polite" lang="ta">
        {q.trim().length < 2
          ? 'குறைந்தது இரண்டு எழுத்துகள்'
          : allHits.length === 0
            ? '0 முடிவுகள்'
            : `காட்டப்படுவது ${hits.length} / மொத்தம் ${allHits.length} முடிவுகள்`}
      </p>

      {/* Zero-result state never invents content. */}
      {q.trim().length >= 2 && allHits.length === 0 && (
        <p className="empty" lang="ta">
          இந்தச் சொல்லுக்கு இத்தளத்தின் ஆளுகைப் பதிவுகளில் முடிவு இல்லை.
          இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது.
        </p>
      )}

      <ul className="temple-list">
        {hits.map((h) => (
          <li key={h.href + (h.titleTa ?? '')}>
            <Link href={h.href} className="temple-row">
              <b lang="ta">{h.titleTa ?? h.titleEn}</b>
              <small>{h.titleEn}</small>
              <em className="tag" lang="ta">
                {h.kindTa}
              </em>
              <StateBadge state={h.state} />
            </Link>
          </li>
        ))}
      </ul>

      {shown < allHits.length && (
        <button type="button" className="btn btn-quiet" onClick={() => setShown((n) => n + PAGE_SIZE)}>
          <span lang="ta">மேலும் காட்டு</span>
        </button>
      )}
    </article>
  );
}
