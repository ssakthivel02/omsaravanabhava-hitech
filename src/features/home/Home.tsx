import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { arupadaiVeedu, completeness, thiruppugazh } from '@/content';
import { localDayIndex } from '@/lib/localDay';
import { useLocale } from '@/lib/locale';

const STOP_COLORS = [
  'var(--gold)',
  'var(--gold-soft)',
  'var(--saffron)',
  'var(--copper)',
  'var(--vel)',
  'var(--vel-bright)',
];

/**
 * Flagship sacred visual. Desktop and mobile use two responsive crops of the
 * same approved artwork so Murugan, Valli, Deivanai, the Vel and peacock stay
 * legible without stretching or squeezing faces on narrow screens.
 */
function HomeSacredVisual({ locale }: { locale: 'ta' | 'en' }) {
  const alt =
    locale === 'ta'
      ? 'முருகன், வள்ளி, தெய்வானை, வேல் மற்றும் மயில் கொண்ட பக்தி காட்சி'
      : 'Devotional scene of Murugan with Valli, Deivanai, the Vel and peacock';

  return (
    <figure className="home-sacred-visual">
      <picture>
        <source
          media="(max-width: 47.99rem)"
          srcSet="/images/home-murugan-valli-deivanai-mobile.webp"
          type="image/webp"
        />
        <img
          src="/images/home-murugan-valli-deivanai-1920.webp"
          alt={alt}
          width="1920"
          height="1080"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <span className="home-sacred-visual-shade" aria-hidden="true" />
    </figure>
  );
}

export default function Home() {
  const { locale, text } = useLocale();
  const templeDomain = completeness.domains.find((d) => d.key === 'temples');
  const templeCount = templeDomain?.records ?? 0;
  const thiruppugazhDomain = completeness.domains.find((d) => d.key === 'thiruppugazh');
  const songCount = thiruppugazh.length;
  const songsWithCanonicalText = thiruppugazhDomain?.withCanonicalText ?? 0;
  const worksDomain = completeness.domains.find((d) => d.key === 'works');
  const namesDomain = completeness.domains.find((d) => d.key === 'names');
  const prayersDomain = completeness.domains.find((d) => d.key === 'prayers');

  const todayIndex = localDayIndex(arupadaiVeedu.length);
  const todayFocus = arupadaiVeedu[todayIndex];

  return (
    <>
      <section className="hero hero-sacred-family">
        <span className="hero-edge" aria-hidden="true" />
        <HomeSacredVisual locale={locale} />
        <div className="hero-copy">
          <p className="hero-eyebrow" lang={locale}>
            {text('வேல் · அறுபடை வீடு · திருப்புகழ்', 'Vel · Six Abodes · Thiruppugazh')}
          </p>
          <h1 lang={locale}>
            {locale === 'ta' ? (
              <>
                வேலின் வழியே
                <br />
                முருகன் அறிவுலகம்
              </>
            ) : (
              <>
                Through the Vel
                <br />
                into Murugan&apos;s World of Knowledge
              </>
            )}
          </h1>
          <p className="hero-lead" lang={locale}>
            {text(
              'அறுபடை வீடு, திருப்புகழ், முருகன் கோயில்கள் — ஒவ்வொரு பதிவும் அதன் மூலத்துடனும், சரிபார்ப்பு நிலையுடனும்.',
              'Six Abodes, Thiruppugazh, Murugan temples — every record with its source and its verification state.',
            )}
          </p>
          <p className="hero-sub" lang="en">
            Every record carries its source and its verification state. Nothing
            here is filled in by guesswork.
          </p>
          <div className="hero-actions">
            <Link href="/arupadai-veedu" className="btn btn-primary">
              <span lang={locale}>{text('அறுபடை வீடு காண்க', 'See the Six Abodes')}</span>
            </Link>
            <Link href="/search" className="btn btn-quiet">
              <span lang={locale}>{text('தேடல்', 'Search')}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="band band-thread" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang={locale}>
            {text('அறுபடை வீடு', 'Six Abodes')}
          </h2>
          <p lang={locale}>
            {text('முருகனின் ஆறு படைவீடுகள், பாரம்பரிய யாத்திரை வரிசையில்.', "Murugan's six abodes, in the traditional pilgrimage order.")}
          </p>
        </div>
        <ol className="abode-list">
          {arupadaiVeedu.map((t, i) => {
            const showEnglishFirst = locale === 'en' && Boolean(t.nameEn);
            return (
              <li key={t.id}>
                <Link
                  href={`/temples/${t.id}`}
                  className="abode"
                  style={{ '--abode-accent': STOP_COLORS[i % STOP_COLORS.length] } as CSSProperties}
                >
                  <span className="abode-num">{String(t.pilgrimageOrder).padStart(2, '0')}</span>
                  <span className="abode-body">
                    {showEnglishFirst ? (
                      <>
                        <b lang="en">{t.nameEn}</b>
                        <small lang="ta">{t.nameTa}</small>
                      </>
                    ) : (
                      <>
                        <b lang="ta">{t.nameTa}</b>
                        <small>{t.nameEn}</small>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="band" aria-labelledby="works-constellation-h">
        <div className="band-head">
          <h2 id="works-constellation-h" lang={locale}>
            {text('பக்தி நூல் தொகுப்பு', 'Devotional Works Collection')}
          </h2>
          <p lang={locale}>
            {text(
              'திருப்புகழ், மந்திரம்-துதி, பிற பக்தி நூல்கள், திருநாமங்கள் — ஒவ்வொன்றும் அதன் மூல நிலையுடன்.',
              'Thiruppugazh, mantras and prayers, other devotional works, sacred names — each with its own source state.',
            )}
          </p>
        </div>
        <div className="constellation">
          <Link href="/thiruppugazh" className="portal portal-lead">
            <b lang={locale}>{text('திருப்புகழ்', 'Thiruppugazh')}</b>
            <p lang={locale}>
              {text(
                `${songCount} மூலம்-இணைக்கப்பட்ட பாடல்கள் · மூல தமிழ் உரை இறக்குமதி ${songsWithCanonicalText}/${songCount}`,
                `${songCount} source-linked songs · canonical Tamil text imported ${songsWithCanonicalText}/${songCount}`,
              )}
            </p>
          </Link>
          <Link href="/prayers" className="portal">
            <b lang={locale}>{text('மந்திரம் · துதி · நாமாவளி', 'Mantras · Prayers · Namavali')}</b>
            <p lang={locale}>{text(`${prayersDomain?.records ?? 0} பதிவு · விவரங்கள் மட்டும்`, `${prayersDomain?.records ?? 0} records · details only`)}</p>
          </Link>
          <Link href="/works" className="portal">
            <b lang={locale}>{text('பாடல்களும் நூல்களும்', 'Songs and Sacred Works')}</b>
            <p lang={locale}>{text(`${worksDomain?.records ?? 0} நூல் பதிவுகள்`, `${worksDomain?.records ?? 0} work records`)}</p>
          </Link>
          <Link href="/content-completeness" className="portal portal-minor">
            <b lang={locale}>{text('திருநாமங்கள்', 'Sacred Names')}</b>
            <p lang={locale}>{text(`${namesDomain?.records ?? 0} பதிவு · நிலை காண்க`, `${namesDomain?.records ?? 0} records · see status`)}</p>
          </Link>
        </div>
      </section>

      <section className="band band-split" aria-labelledby="temple-intel-h">
        <div>
          <h2 id="temple-intel-h" lang={locale}>
            {text('கோயில் அறிவுத்திறன்', 'Temple Intelligence')}
          </h2>
          <p lang={locale}>
            {text(
              `${templeCount} ஆளுகைப் பதிவுகள் — இதில் ${arupadaiVeedu.length} அறுபடை வீடு. ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் கொண்ட பதிவுகள்: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. பதிவு எண்ணிக்கை இருப்பையே காட்டும், முழுமையை அல்ல.`,
              `${templeCount} governed records — including ${arupadaiVeedu.length} Six Abodes. Records with coordinates, history, or visitor information: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. The record count shows presence only, not completeness.`,
            )}
          </p>
          <p className="band-links">
            <Link href="/temples" lang={locale}>
              {text('கோயில் அடைவு', 'Temple directory')}
            </Link>
            <Link href="/arupadai-veedu" lang={locale}>
              {text('அறுபடை வீடு', 'Six Abodes')}
            </Link>
          </p>
        </div>
        <dl className="counts">
          {completeness.domains.slice(0, 4).map((d) => (
            <div key={d.key} className="count">
              <dt lang={locale}>{text(d.labelTa, d.labelEn)}</dt>
              <dd>{d.records}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="band-note" lang={locale}>
        {text('மேலேயுள்ள எண்கள் பதிவு இருப்பைக் காட்டுகின்றன, முழுமையை அல்ல. விரிவான நிலைக்கு', 'The numbers above show record presence, not completeness. For the detailed state, see the')}{' '}
        <Link href="/content-completeness" lang={locale}>
          {text('உள்ளடக்க நிலை', 'Content status')}
        </Link>{' '}
        {text('பக்கத்தைப் பார்க்கவும்.', 'page.')}
      </p>

      {todayFocus && (
        <section className="band devotion-band" aria-labelledby="devotion-h">
          <div className="band-head">
            <h2 id="devotion-h" lang={locale}>
              {text('இன்றைய வழிபாடு', "Today's Practice")}
            </h2>
            <p lang={locale}>
              {text("இன்றைய நினைவு: ", "Today's focus: ")}
              <b lang="ta">{todayFocus.nameTa}</b>
              {text(
                '. எண்ணிக்கை இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது — கணக்கு தேவையில்லை, தொடர் இழப்பு அழுத்தமும் இல்லை.',
                '. The count is saved only in this browser — no account needed, no streak pressure.',
              )}
            </p>
            <p className="band-links">
              <Link href="/practice" lang={locale}>
                {text('தினசரி வழிபாட்டைத் திற', 'Open Daily Practice')}
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="band trust-band">
        <p lang={locale}>
          {text(
            'இத்தளம் எந்தக் கோயில் நன்கொடையையும் பெறவோ, கையாளவோ இல்லை. உத்தியோகபூர்வ தொடர்புகள் மட்டுமே காட்டப்படுகின்றன. மூலங்கள் எவ்வாறு சரிபார்க்கப்படுகின்றன என்பதையும், "நிலுவையில்" என்றால் என்ன என்பதையும் கீழே காணலாம்.',
            'This site does not receive or handle any temple donations. Only official contacts are shown. Below you can see how sources are verified and what "pending" means.',
          )}
        </p>
        <p className="band-links">
          <Link href="/sources" lang={locale}>
            {text('மூலங்கள்', 'Sources')}
          </Link>
          <Link href="/content-completeness" lang={locale}>
            {text('உள்ளடக்க நிலை', 'Content status')}
          </Link>
        </p>
      </section>
    </>
  );
}
