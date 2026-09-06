import { useId, useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  arupadaiVeedu,
  devotionalWorks,
  muruganNames,
  thiruppugazh,
  works,
  describeSourceConfidence,
} from '@/content';
import { temples } from '@/content/temples';
import StateBadge from '@/components/StateBadge';

type Facet = 'all' | 'temple' | 'arupadai' | 'thiruppugazh' | 'work' | 'name';

interface Hit {
  href: string;
  titleTa: string | null;
  titleEn: string | null;
  kind: Exclude<Facet, 'all'>;
  kindTa: string;
  aliases: string[];
  metadata: string[];
  state?: string | null | undefined;
  sourceConfidence?: string | null | undefined;
}

const PAGE_SIZE = 20;
const ARUPADAI_IDS = new Set(arupadaiVeedu.map((item) => item.id));
const devotionalIds = new Set(devotionalWorks.map((item) => item.id));
const workCatalogue = [
  ...devotionalWorks,
  ...works.filter((item) => !item.id || !devotionalIds.has(item.id)),
];

const normalizeSearch = (value: string) =>
  value.normalize('NFKC').toLocaleLowerCase('ta-IN').replace(/\s+/g, ' ').trim();

const INDEX: Hit[] = [
  ...temples.map((temple) => {
    const arupadai = ARUPADAI_IDS.has(temple.id);
    return {
      href: `/temples/${temple.id}`,
      titleTa: temple.nameTa,
      titleEn: temple.nameEn,
      kind: arupadai ? ('arupadai' as const) : ('temple' as const),
      kindTa: arupadai ? 'அறுபடை வீடு' : 'கோயில்',
      aliases: [...temple.alternateNames, temple.transliteration].filter((value): value is string => Boolean(value)),
      metadata: [
        temple.deity,
        temple.muruganForm,
        temple.district,
        temple.state,
        ...temple.classification,
      ].filter((value): value is string => Boolean(value)),
      state: temple.coordinateConfidence,
      sourceConfidence: temple.sources[0]?.confidence,
    };
  }),
  ...thiruppugazh.map((song) => ({
    href: `/thiruppugazh/${song.id}`,
    titleTa: song.titleTa ?? song.openingWords,
    titleEn: null,
    kind: 'thiruppugazh' as const,
    kindTa: 'திருப்புகழ்',
    aliases: [song.openingWords].filter((value): value is string => Boolean(value)),
    metadata: [song.attribution, song.edition].filter((value): value is string => Boolean(value)),
    state: song.canonicalTextStatus,
  })),
  ...workCatalogue.map((work) => ({
    href: work.id ? `/works#work-${work.id}` : '/works',
    titleTa: work.titleTa,
    titleEn: work.titleEn,
    kind: 'work' as const,
    kindTa: 'நூல்',
    aliases: [],
    metadata: 'author' in work ? [work.author, work.period].filter((value): value is string => Boolean(value)) : [],
    state: 'rightsState' in work ? work.rightsState : work.verificationState,
  })),
  ...muruganNames.map((name, index) => ({
    href: `/knowledge#name-${name.id ?? `name-${index + 1}`}`,
    titleTa: name.nameTa,
    titleEn: name.nameEn,
    kind: 'name' as const,
    kindTa: 'முருகன் பெயர்',
    aliases: [],
    metadata: [name.meaning].filter((value): value is string => Boolean(value)),
    sourceConfidence: name.sources[0]?.confidence,
  })),
];

function scoreHit(hit: Hit, rawNeedle: string): number {
  const needle = normalizeSearch(rawNeedle);
  if (!needle) return 0;
  const titleTa = normalizeSearch(hit.titleTa ?? '');
  const titleEn = normalizeSearch(hit.titleEn ?? '');
  const aliases = hit.aliases.map(normalizeSearch);
  const metadata = hit.metadata.map(normalizeSearch);

  if (titleTa === needle) return 1000;
  if (aliases.some((value) => value === needle)) return 950;
  if (titleEn === needle) return 925;
  if (titleTa.startsWith(needle)) return 850;
  if (titleEn.startsWith(needle)) return 825;
  if (aliases.some((value) => value.startsWith(needle))) return 800;
  if (titleTa.includes(needle)) return 700;
  if (titleEn.includes(needle)) return 675;
  if (aliases.some((value) => value.includes(needle))) return 650;
  if (metadata.some((value) => value.includes(needle))) return 300;
  return 0;
}

const FACETS: Array<{ value: Facet; label: string }> = [
  { value: 'all', label: 'அனைத்தும்' },
  { value: 'temple', label: 'கோயில்கள்' },
  { value: 'arupadai', label: 'அறுபடை வீடு' },
  { value: 'thiruppugazh', label: 'திருப்புகழ்' },
  { value: 'work', label: 'நூல்கள்' },
  { value: 'name', label: 'முருகன் பெயர்கள்' },
];

export default function Search() {
  const [q, setQ] = useState('');
  const [facet, setFacet] = useState<Facet>('all');
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();

  const allHits = useMemo(() => {
    const needle = q.trim();
    if (normalizeSearch(needle).length < 2) return [];
    return INDEX
      .map((hit) => ({ hit, score: scoreHit(hit, needle) }))
      .filter(({ hit, score }) => score > 0 && (facet === 'all' || hit.kind === facet))
      .sort((a, b) => b.score - a.score || (a.hit.titleTa ?? a.hit.titleEn ?? '').localeCompare(b.hit.titleTa ?? b.hit.titleEn ?? '', 'ta'))
      .map(({ hit }) => hit);
  }, [q, facet]);

  const hits = allHits.slice(0, shown);
  const normalizedLength = normalizeSearch(q).length;

  return (
    <article className="page search-page">
      <header className="page-head">
        <p className="hero-eyebrow" lang="ta">உள்ளூர் · தீர்மானிக்கத்தக்க தேடல்</p>
        <h1 lang="ta">தேடல்</h1>
        <p lang="ta">
          தமிழ், ஆங்கிலம் மற்றும் பதிவிலுள்ள மாற்றுப்பெயர்களில் தேடலாம். முடிவுகள்
          ஆளுகைப் பதிவுகளிலிருந்து மட்டுமே வருகின்றன; இத்தளம் தேடல் பதிலை உருவாக்காது.
        </p>
      </header>

      <div className="filter search-filter">
        <label htmlFor={inputId} lang="ta">தேடல் சொல்</label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setShown(PAGE_SIZE);
          }}
          placeholder="பழனி / Palani / முத்தைத்தரு"
          autoComplete="off"
        />
      </div>

      <div className="search-facets" role="group" aria-label="உள்ளடக்க வகை">
        {FACETS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`search-facet${facet === item.value ? ' is-active' : ''}`}
            aria-pressed={facet === item.value}
            onClick={() => {
              setFacet(item.value);
              setShown(PAGE_SIZE);
            }}
          >
            <span lang="ta">{item.label}</span>
          </button>
        ))}
      </div>

      <p className="result-count" aria-live="polite" lang="ta">
        {normalizedLength < 2
          ? 'குறைந்தது இரண்டு எழுத்துகள்'
          : allHits.length === 0
            ? '0 முடிவுகள்'
            : `காட்டப்படுவது ${hits.length} / மொத்தம் ${allHits.length} முடிவுகள்`}
      </p>

      {normalizedLength >= 2 && allHits.length === 0 && (
        <div className="empty search-zero" lang="ta">
          <p>இந்தச் சொல்லுக்கு தற்போதைய ஆளுகைப் பதிவுகளில் முடிவு இல்லை. இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது.</p>
          <div className="band-links">
            <Link href="/knowledge">அறிவுக் களம்</Link>
            <Link href="/temples">கோயில் அடைவு</Link>
            <Link href="/sources">மூலங்கள்</Link>
          </div>
        </div>
      )}

      {q.trim().length === 0 && (
        <nav className="search-starters" aria-label="தேடலைத் தொடங்க">
          <Link href="/knowledge" className="search-starter">
            <b lang="ta">முருகன் அறிவுக் களம்</b>
            <small lang="ta">பெயர்கள், படைவீடுகள், நூல்கள்</small>
          </Link>
          <Link href="/arupadai-veedu" className="search-starter">
            <b lang="ta">அறுபடை வீடு</b>
            <small lang="ta">ஆறு படைவீடுகளும் ஒரே இடத்தில்</small>
          </Link>
          <Link href="/temples" className="search-starter">
            <b lang="ta">கோயில் அடைவு</b>
            <small lang="ta">376 ஆளுகைப் பதிவுகள்</small>
          </Link>
          <Link href="/content-completeness" className="search-starter">
            <b lang="ta">உள்ளடக்க நிலை</b>
            <small lang="ta">எது தயார், எது நிலுவையில்</small>
          </Link>
        </nav>
      )}

      <ul className="temple-list search-results">
        {hits.map((hit) => {
          const sourceState = hit.sourceConfidence ? describeSourceConfidence(hit.sourceConfidence) : null;
          return (
            <li key={`${hit.kind}:${hit.href}:${hit.titleTa ?? hit.titleEn ?? ''}`}>
              <Link href={hit.href} className="temple-row search-result-row">
                <b lang="ta">{hit.titleTa ?? hit.titleEn}</b>
                {hit.titleEn && <small>{hit.titleEn}</small>}
                <em className="tag" lang="ta">{hit.kindTa}</em>
                <span className="search-result-states">
                  {sourceState && (
                    <span className={`state state-${sourceState.tone}`}>
                      <span className="state-dot" aria-hidden="true" />
                      <span lang="ta">{sourceState.label}</span>
                    </span>
                  )}
                  {hit.state && <StateBadge state={hit.state} />}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {shown < allHits.length && (
        <button type="button" className="btn btn-quiet" onClick={() => setShown((value) => value + PAGE_SIZE)}>
          <span lang="ta">மேலும் காட்டு</span>
        </button>
      )}
    </article>
  );
}
