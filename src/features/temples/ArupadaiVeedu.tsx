import { Link } from 'wouter';
import { arupadaiVeedu, describeSourceConfidence } from '@/content';
import ArupadaiVelMap from '@/components/ArupadaiVelMap';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';
import { useLocale } from '@/lib/locale';
import { evaluateCoordinatePublication } from '@/lib/geographicProvenance';

export default function ArupadaiVeedu() {
  const { locale, text } = useLocale();
  return (
    <article className="page arupadai-page">
      <div className="arupadai-intro">
        <header className="page-head arupadai-page-head">
          <h1 lang={locale}>{text('அறுபடை வீடு', 'Six Abodes (Arupadai Veedu)')}</h1>
          <p lang={locale}>
            {text(
              'முருகனின் ஆறு படைவீடுகள். வரிசை பாரம்பரிய யாத்திரை முறையைப் பின்பற்றுகிறது. ஒவ்வொரு பதிவும் அதன் ஆயத்தொலைவு நிலையையும் மூல அடையாள நிலையையும் தனித்தனியாகக் காட்டுகிறது — ஒன்று மற்றொன்றைக் குறிக்காது.',
              "Murugan's six abodes. The order follows the traditional pilgrimage sequence. Each record shows its coordinate state and source-identity state separately — one is never taken to imply the other.",
            )}
          </p>
          <p className="arupadai-map-key" lang={locale}>
            {text(
              'வலப்புற வேலில் 01–06 குறியீடுகள் இதே ஆறு படைவீடுகளின் யாத்திரை வரிசையைக் குறிக்கின்றன.',
              'The 01–06 markers on the Vel at right represent this same six-abode pilgrimage order.',
            )}
          </p>
        </header>
        <aside className="arupadai-visual" aria-label={text('அறுபடை வீடு யாத்திரை வேல் வரைபடம்', 'Arupadai Veedu pilgrimage Vel map')}>
          <ArupadaiVelMap />
        </aside>
      </div>

      <ol className="pilgrimage">
        {arupadaiVeedu.map((t) => {
          const primarySource = t.sources[0];
          const coordinateDecision = evaluateCoordinatePublication(t);
          const literary = t.literaryRelationships[0] as
            | { work_id?: string; assertion_status?: string }
            | undefined;
          const showEnglishFirst = locale === 'en' && Boolean(t.nameEn);
          return (
            <li
              key={t.id}
              className="pilgrimage-stop"
              data-coordinate-publication-state={coordinateDecision.state}
            >
              <Link href={`/temples/${t.id}`} className="stop-link">
                <span className="stop-num" aria-hidden="true">
                  {String(t.pilgrimageOrder).padStart(2, '0')}
                </span>
                <span className="stop-body">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{t.nameEn}</b>
                      <small lang="ta">{t.nameTa}</small>
                    </>
                  ) : (
                    <>
                      <b lang="ta">{t.nameTa}</b>
                      <small>
                        {t.nameEn}
                        {t.transliteration && t.transliteration !== t.nameEn
                          ? ` · ${t.transliteration}`
                          : ''}
                      </small>
                    </>
                  )}
                  <span className="state-row">
                    <StateBadge state={coordinateDecision.state} dimension={text('ஆயத்தொலைவு', 'Coordinates')} />
                    {primarySource &&
                      (() => {
                        const { label, tone } = describeSourceConfidence(
                          primarySource.confidence,
                          locale,
                        );
                        return <StateBadgeResolved label={label} tone={tone} />;
                      })()}
                    {t.officialCurrentSource && (
                      <StateBadge
                        state={t.officialCurrentSource.state}
                        dimension={text('தற்போதைய மூலம்', 'Current source')}
                      />
                    )}
                  </span>
                  {literary && (
                    <span className="stop-literary" lang={locale}>
                      {text(
                        'இலக்கியக் குறிப்பு — பாரம்பரியச் சூழல் மட்டுமே, நவீன பயணத் தகவலுக்கான ஆதாரம் அல்ல.',
                        'Literary reference — traditional context only, not a source for modern travel information.',
                      )}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="note" lang={locale}>
        {locale === 'ta' ? (
          <>
            ஆறு பதிவுகளுக்கும் HR&amp;CE-யிடமிருந்து தற்போதைய தரிசன நேரமும்
            தொடர்புத் தகவலும் இப்போது கிடைக்கின்றன — ஒவ்வொரு பதிவின் பக்கத்திலும்
            &ldquo;தற்போதைய உத்தியோகபூர்வத் தகவல்&rdquo; பிரிவில் காணலாம். இவை
            மாறக்கூடியவை என்பதால் பயணத்திற்கு முன் மூலத்துடன் மீண்டும் உறுதி
            செய்யவும். ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் ஆகியவை தற்போதும் ஒவ்வொரு
            பதிவிலும் நிலுவையில் உள்ளன — இணையம் மூலம் உறுதி செய்யப்பட்ட தகவல்
            கிடைத்தவுடன் இங்கு புதுப்பிக்கப்படும் —{' '}
            <Link href="/content-completeness" lang="ta">
              உள்ளடக்க நிலை
            </Link>{' '}
            பக்கத்தில் தற்போதைய நிலையைக் காணலாம்.
          </>
        ) : (
          <>
            Current visiting hours and contact information from HR&amp;CE are
            now available for all six records — see the &ldquo;Current
            official information&rdquo; section on each record&apos;s page.
            These can change, so please reconfirm with the source before you
            travel. Coordinates, history and visitor information remain
            pending for every record for now — this will be updated here as
            verified information becomes available. See the{' '}
            <Link href="/content-completeness" lang="en">
              Content status
            </Link>{' '}
            page for the current state.
          </>
        )}
      </p>
    </article>
  );
}
