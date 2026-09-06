import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { arupadaiVeedu, completeness, thiruppugazh } from '@/content';
import { localDayIndex } from '@/lib/localDay';

/**
 * The hero is a single orchestrated moment: the Vel drawn as a vertical
 * luminous axis with the six Arupadai Veedu set along its shaft. The six
 * abodes are a genuine traditional pilgrimage sequence, so numbering them
 * encodes real information rather than decorating the layout — the ordinal
 * beside each dot is the same 01..06 the Arupadai band below uses, making
 * the Vel a small map of the journey rather than a bare decorative icon
 * (flagship visual review: "is the Vel a meaningful focal motif?"). Each
 * ordinal's dot uses the same six-colour warm-to-cool sequence as the
 * Arupadai band below and the abode list in this same page, so the
 * relationship between hero, list and full pilgrimage route reads as one
 * continuous idea rather than three separately-designed things.
 */
const STOP_COLORS = [
  'var(--gold)',
  'var(--gold-soft)',
  'var(--saffron)',
  'var(--copper)',
  'var(--vel)',
  'var(--vel-bright)',
];

function VelAxis() {
  return (
    <div className="vel-axis" aria-hidden="true">
      <svg viewBox="0 0 200 640" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--vel-bright)" stopOpacity="0.95" />
            <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity="0.65" />
            <stop offset="55%" stopColor="var(--gold)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-ambient">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-ambient-cool">
            <stop offset="0%" stopColor="var(--vel)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--vel)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Deep sanctum-depth wash: a wide warm field up top fading into a
            cool Vel-toned field lower down, so the axis reads as travelling
            through a lit space rather than floating on flat ground. */}
        <circle cx="100" cy="150" r="260" fill="url(#glow-ambient)" />
        <circle cx="100" cy="520" r="240" fill="url(#glow-ambient-cool)" />

        <circle cx="100" cy="86" r="104" fill="url(#glow)" />
        <path
          d="M100 12 C122 44 128 66 128 80 C128 100 116 112 100 118 C84 112 72 100 72 80 C72 66 78 44 100 12 Z"
          fill="none"
          stroke="var(--vel-bright)"
          strokeWidth="2"
        />
        <line x1="100" y1="24" x2="100" y2="616" stroke="url(#shaft)" strokeWidth="2.5" />
        <line x1="84" y1="124" x2="116" y2="124" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round" />

        {arupadaiVeedu.map((t, i) => (
          <g key={t.id}>
            <circle cx="100" cy={168 + i * 84} r="9" fill={STOP_COLORS[i]} opacity="0.14" />
            <circle
              cx="100"
              cy={168 + i * 84}
              r="5"
              fill="var(--sanctum)"
              stroke={STOP_COLORS[i]}
              strokeWidth="2"
            />
            <text
              x="118"
              y={168 + i * 84 + 4}
              fontSize="13"
              fill="var(--gold-soft)"
              opacity="0.85"
            >
              {String(t.pilgrimageOrder).padStart(2, '0')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * A lightweight, non-representational suggestion of temple architecture —
 * stepped gopuram tiers as flat geometric bands — sitting behind the hero
 * copy on wide screens only. It is abstract line/shape geometry (no raster
 * art, no invented temple likeness), present purely to give ultra-wide
 * viewports a second compositional anchor instead of empty ground between
 * the text column and the Vel (flagship review: "1920px must look designed
 * specifically for 1920px", "remove dead dark voids").
 */
function SanctumAbstraction() {
  return (
    <svg
      className="hero-architecture"
      aria-hidden="true"
      viewBox="0 0 960 520"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="tier-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--copper)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Five receding stepped tiers, each narrower and higher than the
          last — a gopuram's silhouette reduced to pure proportion. */}
      <polygon points="480,40 560,120 400,120" fill="none" stroke="url(#tier-fade)" strokeWidth="1.5" />
      <polygon points="480,90 610,190 350,190" fill="none" stroke="url(#tier-fade)" strokeWidth="1.5" />
      <polygon points="480,150 660,270 300,270" fill="none" stroke="url(#tier-fade)" strokeWidth="1.5" />
      <polygon points="480,220 710,360 250,360" fill="none" stroke="url(#tier-fade)" strokeWidth="1.5" />
      <polygon points="480,300 760,460 200,460" fill="none" stroke="url(#tier-fade)" strokeWidth="1.5" />
      <line x1="150" y1="460" x2="810" y2="460" stroke="var(--copper)" strokeWidth="1.5" opacity="0.55" />
    </svg>
  );
}

export default function Home() {
  // Counts come from the precomputed completeness summary so the home route
  // never pulls the full 376-record temple chunk (or any other full corpus)
  // just to render a number. R2-CODE-003: a raw record count must never
  // stand in for completeness, so every count below is paired with its real
  // state rather than presented as if it were finished coverage.
  const templeDomain = completeness.domains.find((d) => d.key === 'temples');
  const templeCount = templeDomain?.records ?? 0;
  const thiruppugazhDomain = completeness.domains.find((d) => d.key === 'thiruppugazh');
  const songCount = thiruppugazh.length;
  const songsWithCanonicalText = thiruppugazhDomain?.withCanonicalText ?? 0;
  const worksDomain = completeness.domains.find((d) => d.key === 'works');
  const namesDomain = completeness.domains.find((d) => d.key === 'names');
  const prayersDomain = completeness.domains.find((d) => d.key === 'prayers');

  // Today's focus mirrors Practice's own derivation (src/lib/localDay.ts):
  // stable for the visitor's whole local calendar day, no stored state.
  const todayIndex = localDayIndex(arupadaiVeedu.length);
  const todayFocus = arupadaiVeedu[todayIndex];

  return (
    <>
      <section className="hero">
        <span className="hero-edge" aria-hidden="true" />
        <SanctumAbstraction />
        <div className="hero-copy">
          <p className="hero-eyebrow" lang="ta">
            வேல் · அறுபடை வீடு · திருப்புகழ்
          </p>
          <h1 lang="ta">
            வேலின் வழியே
            <br />
            முருகன் அறிவுலகம்
          </h1>
          <p className="hero-lead" lang="ta">
            அறுபடை வீடு, திருப்புகழ், முருகன் கோயில்கள் — ஒவ்வொரு பதிவும் அதன்
            மூலத்துடனும், சரிபார்ப்பு நிலையுடனும்.
          </p>
          <p className="hero-sub">
            Every record carries its source and its verification state. Nothing
            here is filled in by guesswork.
          </p>
          <div className="hero-actions">
            <Link href="/arupadai-veedu" className="btn btn-primary">
              <span lang="ta">அறுபடை வீடு காண்க</span>
            </Link>
            <Link href="/search" className="btn btn-quiet">
              <span lang="ta">தேடல்</span>
            </Link>
          </div>
        </div>
        <div className="hero-stage">
          <VelAxis />
        </div>
      </section>

      <section className="band band-thread" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang="ta">
            அறுபடை வீடு
          </h2>
          <p lang="ta">
            முருகனின் ஆறு படைவீடுகள், பாரம்பரிய யாத்திரை வரிசையில்.
          </p>
        </div>
        <ol className="abode-list">
          {arupadaiVeedu.map((t, i) => (
            <li key={t.id}>
              <Link
                href={`/temples/${t.id}`}
                className="abode"
                style={{ '--abode-accent': STOP_COLORS[i % STOP_COLORS.length] } as CSSProperties}
              >
                <span className="abode-num">{String(t.pilgrimageOrder).padStart(2, '0')}</span>
                <span className="abode-body">
                  <b lang="ta">{t.nameTa}</b>
                  <small>{t.nameEn}</small>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="band" aria-labelledby="works-constellation-h">
        <div className="band-head">
          <h2 id="works-constellation-h" lang="ta">
            பக்தி நூல் தொகுப்பு
          </h2>
          <p lang="ta">
            திருப்புகழ், மந்திரம்-துதி, பிற பக்தி நூல்கள், திருநாமங்கள் —
            ஒவ்வொன்றும் அதன் மூல நிலையுடன்.
          </p>
        </div>
        <div className="constellation">
          <Link href="/thiruppugazh" className="portal portal-lead">
            <b lang="ta">திருப்புகழ்</b>
            <p lang="ta">
              {songCount} மூலம்-இணைக்கப்பட்ட பாடல்கள் · மூல தமிழ் உரை
              இறக்குமதி {songsWithCanonicalText}/{songCount}
            </p>
          </Link>
          <Link href="/prayers" className="portal">
            <b lang="ta">மந்திரம் · துதி · நாமாவளி</b>
            <p lang="ta">{prayersDomain?.records ?? 0} பதிவு · விவரங்கள் மட்டும்</p>
          </Link>
          <Link href="/works" className="portal">
            <b lang="ta">பாடல்களும் நூல்களும்</b>
            <p lang="ta">{worksDomain?.records ?? 0} நூல் பதிவுகள்</p>
          </Link>
          <Link href="/content-completeness" className="portal portal-minor">
            <b lang="ta">திருநாமங்கள்</b>
            <p lang="ta">{namesDomain?.records ?? 0} பதிவு · நிலை காண்க</p>
          </Link>
        </div>
      </section>

      <section className="band band-split" aria-labelledby="temple-intel-h">
        <div>
          <h2 id="temple-intel-h" lang="ta">
            கோயில் அறிவுத்திறன்
          </h2>
          <p lang="ta">
            {templeCount} ஆளுகைப் பதிவுகள் — இதில் {arupadaiVeedu.length}{' '}
            அறுபடை வீடு. ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் கொண்ட பதிவுகள்:{' '}
            {templeDomain?.withCoordinates ?? 0}/{templeCount}. பதிவு
            எண்ணிக்கை இருப்பையே காட்டும், முழுமையை அல்ல.
          </p>
          <p className="band-links">
            <Link href="/temples" lang="ta">
              கோயில் அடைவு
            </Link>
            <Link href="/arupadai-veedu" lang="ta">
              அறுபடை வீடு
            </Link>
          </p>
        </div>
        <dl className="counts">
          {completeness.domains.slice(0, 4).map((d) => (
            <div key={d.key} className="count">
              <dt lang="ta">{d.labelTa}</dt>
              <dd>{d.records}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="band-note" lang="ta">
        மேலேயுள்ள எண்கள் பதிவு இருப்பைக் காட்டுகின்றன, முழுமையை அல்ல. விரிவான
        நிலைக்கு{' '}
        <Link href="/content-completeness" lang="ta">
          உள்ளடக்க நிலை
        </Link>{' '}
        பக்கத்தைப் பார்க்கவும்.
      </p>

      {todayFocus && (
        <section className="band devotion-band" aria-labelledby="devotion-h">
          <div className="band-head">
            <h2 id="devotion-h" lang="ta">
              இன்றைய வழிபாடு
            </h2>
            <p lang="ta">
              இன்றைய நினைவு: <b lang="ta">{todayFocus.nameTa}</b>. எண்ணிக்கை
              இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது — கணக்கு தேவையில்லை,
              தொடர் இழப்பு அழுத்தமும் இல்லை.
            </p>
            <p className="band-links">
              <Link href="/practice" lang="ta">
                தினசரி வழிபாட்டைத் திற
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="band trust-band">
        <p lang="ta">
          இத்தளம் எந்தக் கோயில் நன்கொடையையும் பெறவோ, கையாளவோ இல்லை. உத்தியோகபூர்வ
          தொடர்புகள் மட்டுமே காட்டப்படுகின்றன. மூலங்கள் எவ்வாறு சரிபார்க்கப்படுகின்றன
          என்பதையும், &ldquo;நிலுவையில்&rdquo; என்றால் என்ன என்பதையும் கீழே காணலாம்.
        </p>
        <p className="band-links">
          <Link href="/sources" lang="ta">
            மூலங்கள்
          </Link>
          <Link href="/content-completeness" lang="ta">
            உள்ளடக்க நிலை
          </Link>
        </p>
      </section>
    </>
  );
}
