import { Link } from 'wouter';
import { thiruppugazh } from '@/content';
import StateBadge from '@/components/StateBadge';
import { useLocale } from '@/lib/locale';

export default function Thiruppugazh() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('திருப்புகழ்', 'Thiruppugazh')}</h1>
        <p lang={locale}>
          {text(
            `அருணகிரிநாதர் அருளிய திருப்புகழ். தற்போது ${thiruppugazh.length} பதிவுகள் மூலத்துடன் இணைக்கப்பட்டுள்ளன.`,
            `Thiruppugazh, composed by Arunagirinathar. ${thiruppugazh.length} records are currently linked to their source.`,
          )}
        </p>
      </header>

      <ul className="song-list">
        {thiruppugazh.map((s) => (
          <li key={s.id}>
            <Link href={`/thiruppugazh/${s.id}`} className="song-row">
              {/* Canonical song title: always Tamil, regardless of UI language. */}
              <b lang="ta">{s.titleTa ?? s.openingWords}</b>
              <small>
                {s.sourceNumbering?.system}
                {s.sourceNumbering?.number ? ` · ${s.sourceNumbering.number}` : ''}
              </small>
              <StateBadge state={s.canonicalTextStatus} />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
