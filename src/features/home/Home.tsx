import { Link } from 'wouter';
import { arupadaiVeedu, completeness, thiruppugazh } from '@/content';

/**
 * The hero is a single orchestrated moment: the Vel drawn as a vertical
 * luminous axis with the six Arupadai Veedu set along its shaft. The six
 * abodes are a genuine traditional pilgrimage sequence, so numbering them
 * encodes real information rather than decorating the layout.
 */
function VelAxis() {
  return (
    <div className="vel-axis" aria-hidden="true">
      <svg viewBox="0 0 120 620" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--vel-bright)" stopOpacity="0.95" />
            <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="60" cy="86" r="72" fill="url(#glow)" />
        <path
          d="M60 12 C82 44 88 66 88 80 C88 100 76 112 60 118 C44 112 32 100 32 80 C32 66 38 44 60 12 Z"
          fill="none"
          stroke="var(--vel-bright)"
          strokeWidth="2"
        />
        <line x1="60" y1="24" x2="60" y2="600" stroke="url(#shaft)" strokeWidth="2.5" />
        <line x1="44" y1="124" x2="76" y2="124" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round" />

        {arupadaiVeedu.map((_, i) => (
          <circle
            key={i}
            cx="60"
            cy={168 + i * 74}
            r="5"
            fill="var(--sanctum)"
            stroke="var(--gold)"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}

export default function Home() {
  // Counts come from the precomputed completeness summary so the home route
  // never pulls the full 376-record temple chunk just to render a number.
  // R2-CODE-003: a raw record count must never stand in for completeness, so
  // the Thiruppugazh count is always paired with its canonical-text state.
  const templeCount =
    completeness.domains.find((d) => d.key === 'temples')?.records ?? 0;
  const thiruppugazhDomain = completeness.domains.find((d) => d.key === 'thiruppugazh');
  const songCount = thiruppugazh.length;
  const songsWithCanonicalText = thiruppugazhDomain?.withCanonicalText ?? 0;

  return (
    <>
      <section className="hero">
        <VelAxis />
        <div className="hero-copy">
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
      </section>

      <section className="band" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang="ta">
            அறுபடை வீடு
          </h2>
          <p lang="ta">
            முருகனின் ஆறு படைவீடுகள், பாரம்பரிய யாத்திரை வரிசையில்.
          </p>
        </div>
        <ol className="abode-list">
          {arupadaiVeedu.map((t) => (
            <li key={t.id}>
              <Link href={`/temples/${t.id}`} className="abode">
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

      <section className="band band-split" aria-labelledby="library-h">
        <div>
          <h2 id="library-h" lang="ta">
            நூலகம்
          </h2>
          <p lang="ta">
            திருப்புகழ் {songCount} மூலம்-இணைக்கப்பட்ட பதிவுகள் — இதில் மூல
            தமிழ் உரை இறக்குமதி செய்யப்பட்டவை {songsWithCanonicalText}/
            {songCount}. கோயில்கள் {templeCount} ஆளுகைப் பதிவுகள். பதிவு
            எண்ணிக்கை இருப்பையே காட்டும்; முழுமையைக் காட்டாது — ஒவ்வொரு
            பதிவின் உண்மையான நிலையும் அதனுள் குறிக்கப்படுகிறது.
          </p>
          <p className="band-links">
            <Link href="/thiruppugazh" lang="ta">
              திருப்புகழ்
            </Link>
            <Link href="/temples" lang="ta">
              கோயில்கள்
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

      <section className="band trust-band">
        <p lang="ta">
          இத்தளம் எந்தக் கோயில் நன்கொடையையும் பெறவோ, கையாளவோ இல்லை. உத்தியோகபூர்வ
          தொடர்புகள் மட்டுமே காட்டப்படுகின்றன.
        </p>
        <Link href="/content-completeness" lang="ta">
          உள்ளடக்க நிலை
        </Link>
      </section>
    </>
  );
}
