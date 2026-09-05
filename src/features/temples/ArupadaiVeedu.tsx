import { Link } from 'wouter';
import { arupadaiVeedu, describeSourceConfidence } from '@/content';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';

export default function ArupadaiVeedu() {
  return (
    <article className="page arupadai-page">
      <header className="page-head">
        <h1 lang="ta">அறுபடை வீடு</h1>
        <p lang="ta">
          முருகனின் ஆறு படைவீடுகள். வரிசை பாரம்பரிய யாத்திரை முறையைப்
          பின்பற்றுகிறது. ஒவ்வொரு பதிவும் அதன் ஆயத்தொலைவு நிலையையும் மூல
          அடையாள நிலையையும் தனித்தனியாகக் காட்டுகிறது — ஒன்று மற்றொன்றைக்
          குறிக்காது.
        </p>
      </header>

      <ol className="pilgrimage">
        {arupadaiVeedu.map((t) => {
          const primarySource = t.sources[0];
          const literary = t.literaryRelationships[0] as
            | { work_id?: string; assertion_status?: string }
            | undefined;
          return (
            <li key={t.id} className="pilgrimage-stop">
              <Link href={`/temples/${t.id}`} className="stop-link">
                <span className="stop-num" aria-hidden="true">
                  {String(t.pilgrimageOrder).padStart(2, '0')}
                </span>
                <span className="stop-body">
                  <b lang="ta">{t.nameTa}</b>
                  <small>
                    {t.nameEn}
                    {t.transliteration && t.transliteration !== t.nameEn
                      ? ` · ${t.transliteration}`
                      : ''}
                  </small>
                  <span className="state-row">
                    <StateBadge state={t.coordinateConfidence} dimension="ஆயத்தொலைவு" />
                    {primarySource &&
                      (() => {
                        const { label, tone } = describeSourceConfidence(
                          primarySource.confidence,
                        );
                        return <StateBadgeResolved label={label} tone={tone} />;
                      })()}
                  </span>
                  {literary && (
                    <span className="stop-literary" lang="ta">
                      இலக்கியக் குறிப்பு — பாரம்பரியச் சூழல் மட்டுமே, நவீன
                      பயணத் தகவலுக்கான ஆதாரம் அல்ல.
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="note" lang="ta">
        மேலேயுள்ள வரிசையில் ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் தற்போது ஒவ்வொரு
        பதிவிலும் நிலுவையில் உள்ளது. இணையம் மூலம் உறுதி செய்யப்பட்ட தகவல்
        கிடைத்தவுடன் இங்கு புதுப்பிக்கப்படும் —{' '}
        <Link href="/content-completeness" lang="ta">
          உள்ளடக்க நிலை
        </Link>{' '}
        பக்கத்தில் தற்போதைய நிலையைக் காணலாம்.
      </p>
    </article>
  );
}
