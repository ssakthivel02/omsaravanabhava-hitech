import { Link } from 'wouter';
import { thiruppugazh } from '@/content';
import StateBadge from '@/components/StateBadge';

export default function Thiruppugazh() {
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">திருப்புகழ்</h1>
        <p lang="ta">
          அருணகிரிநாதர் அருளிய திருப்புகழ். தற்போது {thiruppugazh.length} பதிவுகள்
          மூலத்துடன் இணைக்கப்பட்டுள்ளன.
        </p>
      </header>

      <ul className="song-list">
        {thiruppugazh.map((s) => (
          <li key={s.id}>
            <Link href={`/thiruppugazh/${s.id}`} className="song-row">
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
