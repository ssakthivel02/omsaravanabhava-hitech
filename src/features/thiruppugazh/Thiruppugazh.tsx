import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { thiruppugazh } from '@/content';
import {
  THIRUPPUGAZH_CORPUS_PARTS,
  THIRUPPUGAZH_REFERENCE_CORPUS_SIZE,
  corpusPartForSongNumber,
} from '@/content/thiruppugazh-corpus';
import StateBadge from '@/components/StateBadge';
import { useLocale } from '@/lib/locale';

export default function Thiruppugazh() {
  const { locale, text } = useLocale();
  const [query, setQuery] = useState('');
  const [partFilter, setPartFilter] = useState('all');

  const publishedCanonicalTextCount = thiruppugazh.filter(
    (song) => Boolean(song.canonicalText),
  ).length;
  const approvedAudioCount = thiruppugazh.filter(
    (song) => song.audioState && song.audioState !== 'NO_APPROVED_AUDIO',
  ).length;

  const rows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ta');
    return thiruppugazh.filter((song) => {
      const number = song.sourceNumbering?.number;
      const part = typeof number === 'number' ? corpusPartForSongNumber(number) : undefined;
      const matchesPart = partFilter === 'all' || part?.id === partFilter;
      if (!matchesPart) return false;
      if (!normalized) return true;
      const haystack = [
        song.titleTa,
        song.openingWords,
        number?.toString(),
        song.sourceNumbering?.system,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('ta');
      return haystack.includes(normalized);
    });
  }, [partFilter, query]);

  return (
    <article className="page thiruppugazh-page">
      <header className="page-head">
        <h1 lang={locale}>{text('திருப்புகழ்', 'Thiruppugazh')}</h1>
        <p lang={locale}>
          {text(
            `அருணகிரிநாதர் அருளிய திருப்புகழின் 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} பாடல்கள் கொண்ட மூல-குறிப்பு வரம்பில், தற்போது ${thiruppugazh.length} பதிவுகள் மட்டுமே தனிப்பட்ட மூல இணைப்புடன் சரிபார்க்கப்பட்டுள்ளன.`,
            `Within the 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} source-reference corpus for Arunagirinathar's Thiruppugazh, only ${thiruppugazh.length} records are currently individually source-linked in this application.`,
          )}
        </p>
      </header>

      <section className="corpus-summary" aria-labelledby="corpus-summary-title">
        <div>
          <p className="eyebrow" id="corpus-summary-title">
            {text('வெளியீட்டு உண்மை நிலை', 'Publication truth')}
          </p>
          <p>
            {text(
              'முழு 1,326 பாடல்களும் இத்தளத்தில் வெளியிடப்பட்டதாக இந்த எண் பொருளல்ல. உரிமை மற்றும் பதிப்பு சரிபார்ப்பு முடிந்த பதிவுகள் மட்டுமே திறக்கப்படும்.',
              'The 1,326 reference count does not mean all song texts are published here. Only records that pass source and publication checks are opened as catalogue entries.',
            )}
          </p>
        </div>
        <dl className="corpus-counts">
          <div><dt>{text('மூல இணைப்புள்ள பதிவுகள்', 'Source-linked records')}</dt><dd>{thiruppugazh.length}</dd></div>
          <div><dt>{text('குறிப்பு பாடல் வரம்பு', 'Reference corpus')}</dt><dd>{THIRUPPUGAZH_REFERENCE_CORPUS_SIZE}</dd></div>
          <div><dt>{text('முழு மூல உரை வெளியீடு', 'Canonical texts published')}</dt><dd>{publishedCanonicalTextCount}</dd></div>
          <div><dt>{text('அங்கீகரிக்கப்பட்ட ஒலி', 'Approved audio')}</dt><dd>{approvedAudioCount}</dd></div>
        </dl>
      </section>

      <section className="corpus-parts" aria-labelledby="corpus-parts-title">
        <div className="section-heading">
          <h2 id="corpus-parts-title">{text('மூலப் பகுதி வரைபடம்', 'Source-part map')}</h2>
          <p>{text('நான்கு Project Madurai பகுதிகளும் தற்போது குறிப்பு மற்றும் ஒப்பீட்டு பயன்பாட்டிற்கே.', 'All four Project Madurai parts are currently reference-only for source comparison and coverage.')}</p>
        </div>
        <div className="corpus-part-grid">
          {THIRUPPUGAZH_CORPUS_PARTS.map((part) => {
            const linked = thiruppugazh.filter((song) => {
              const number = song.sourceNumbering?.number;
              return typeof number === 'number' && number >= part.start && number <= part.end;
            }).length;
            return (
              <article className="corpus-part" key={part.id}>
                <b>{part.label}</b>
                <span>{part.start}–{part.end}</span>
                <small>{text(`${linked} பதிவுகள் இணைக்கப்பட்டுள்ளன`, `${linked} records linked`)}</small>
                <a href={part.sourceUrl} target="_blank" rel="noreferrer">
                  {text('மூலத்தை காண்க', 'View source')}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="catalog-controls" aria-labelledby="catalog-title">
        <div className="section-heading">
          <h2 id="catalog-title">{text('சரிபார்க்கப்பட்ட பட்டியல்', 'Verified catalogue')}</h2>
          <p>{text('தமிழ் தொடக்கச் சொல் அல்லது பாடல் எண்ணால் தேடலாம்.', 'Search by Tamil opening words or source song number.')}</p>
        </div>
        <div className="catalog-filter-row">
          <label>
            <span>{text('திருப்புகழ் தேடல்', 'Search Thiruppugazh')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text('உதா: முத்தைத்தரு அல்லது 6', 'e.g. முத்தைத்தரு or 6')}
            />
          </label>
          <label>
            <span>{text('மூல பகுதி', 'Source part')}</span>
            <select value={partFilter} onChange={(event) => setPartFilter(event.target.value)}>
              <option value="all">{text('அனைத்து பகுதிகள்', 'All parts')}</option>
              {THIRUPPUGAZH_CORPUS_PARTS.map((part) => (
                <option key={part.id} value={part.id}>{part.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="catalog-result-count" aria-live="polite">
          {text(`காட்டப்படுவது ${rows.length} / ${thiruppugazh.length}`, `Showing ${rows.length} / ${thiruppugazh.length}`)}
        </p>
      </section>

      {rows.length > 0 ? (
        <ul className="song-list">
          {rows.map((song) => (
            <li key={song.id}>
              <Link href={`/thiruppugazh/${song.id}`} className="song-row">
                <b lang="ta">{song.titleTa ?? song.openingWords}</b>
                <small>
                  {song.sourceNumbering?.system}
                  {song.sourceNumbering?.number ? ` · ${song.sourceNumbering.number}` : ''}
                </small>
                <StateBadge state={song.canonicalTextStatus} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="catalog-empty" role="status">
          {text('இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை. இத்தளம் காணாமல் உள்ள பாடலை உருவாக்காது.', 'No verified record matches this filter. The site will not invent a missing song entry.')}
        </p>
      )}
    </article>
  );
}
