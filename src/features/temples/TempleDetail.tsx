import { useParams, Link } from 'wouter';
import { templeById, templeCompleteness } from '@/content/temples';
import { describeSourceConfidence, works, arupadaiVeedu } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { useEntityMeta } from '@/lib/routeMeta';
import { useRecentItem } from '@/lib/useRecent';

export default function TempleDetail() {
  const params = useParams<{ id: string }>();
  const temple = params.id ? templeById(params.id) : undefined;
  const title = temple ? (temple.nameTa ?? temple.nameEn) : null;
  useEntityMeta(
    `/temples/${params.id ?? ''}`,
    title,
    title ? `${title} — கோயில் பதிவு, மூலம் மற்றும் நிலையுடன்.` : null,
  );
  useRecentItem(
    temple
      ? { type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn }
      : null,
  );

  if (!temple) {
    return (
      <article className="page">
        <h1 lang="ta">பதிவு காணப்படவில்லை</h1>
        <p lang="ta">இந்த முகவரிக்குக் கோயில் பதிவு இல்லை.</p>
        <Link href="/temples" lang="ta">கோயில் பட்டியலுக்குத் திரும்பு</Link>
      </article>
    );
  }

  const { documentedFields, totalFields } = templeCompleteness(temple);
  const primarySource = temple.sources[0];
  const sourceConfidence = describeSourceConfidence(primarySource?.confidence);
  const pilgrimageStop = arupadaiVeedu.find((a) => a.id === temple.id);

  const facts = [
    temple.deity && { label: 'தெய்வம்', value: temple.deity },
    temple.muruganForm && { label: 'முருகன் வடிவம்', value: temple.muruganForm },
    (temple.district || temple.state) && {
      label: 'இடம்',
      value: [temple.district, temple.state].filter(Boolean).join(', '),
    },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const proseFields = [
    { key: 'sthalaPurana', label: 'தல புராணம்', value: temple.sthalaPurana },
    { key: 'history', label: 'வரலாறு', value: temple.history },
    { key: 'architecture', label: 'கட்டிடக்கலை', value: temple.architecture },
    { key: 'visitorInformation', label: 'பயணத் தகவல்', value: temple.visitorInformation },
  ];
  const populatedProse = proseFields.filter(
    (f): f is { key: string; label: string; value: string } => Boolean(f.value),
  );
  const pendingProse = proseFields.filter((f) => !f.value);

  const literaryLinks = temple.literaryRelationships
    .map((rel) => {
      const r = rel as { work_id?: string };
      const work = r.work_id ? works.find((w) => w.id === r.work_id) : undefined;
      return work ? { id: work.id, titleTa: work.titleTa } : null;
    })
    .filter((w): w is { id: string; titleTa: string | null } => w !== null);

  const readAloudText = [
    temple.nameTa,
    ...facts.map((fact) => `${fact.label}: ${fact.value}`),
    ...populatedProse.map((field) => `${field.label}. ${field.value}`),
  ]
    .filter((value): value is string => Boolean(value))
    .join('. ');

  const officialCurrentUrl = pilgrimageStop?.officialCurrentSource
    ? (pilgrimageStop.officialCurrentSource.timingSourceUrl ??
      pilgrimageStop.officialCurrentSource.contactSourceUrl ??
      pilgrimageStop.officialCurrentSource.officialBaseUrl)
    : null;

  return (
    <article className="page">
      <header className="page-head temple-head">
        <div className="temple-head-top">
          {temple.classification.length > 0 && (
            <p className="tag-row">
              {temple.classification.map((c) => (
                <span key={c} className="tag" lang="ta">{c}</span>
              ))}
            </p>
          )}
          {pilgrimageStop && (
            <span className="temple-pilgrimage-flag" lang="ta">
              அறுபடை வீடு · {String(pilgrimageStop.pilgrimageOrder).padStart(2, '0')}
            </span>
          )}
        </div>
        <h1 lang="ta">{temple.nameTa ?? temple.nameEn}</h1>
        {temple.nameEn && <p className="latin-name">{temple.nameEn}</p>}
        {facts.length > 0 && (
          <p className="temple-facts" lang="ta">
            {facts.map((f, i) => (
              <span key={f.label}>
                {i > 0 ? ' · ' : ''}
                <b lang="ta">{f.label}:</b> {f.value}
              </span>
            ))}
          </p>
        )}
        <div className="record-actions">
          <SaveControl item={{ type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn }} />
          {readAloudText && <ReadAloud text={readAloudText} labelTa="கோயில் பதிவை வாசிக்க" />}
        </div>
      </header>

      {literaryLinks.length > 0 && (
        <p className="stop-literary" lang="ta">
          இலக்கியக் குறிப்பு —{' '}
          {literaryLinks.map((w, i) => (
            <span key={w.id}>
              {i > 0 ? ', ' : ''}
              <span lang="ta">{w.titleTa ?? w.id}</span>
            </span>
          ))}
          . இது பாரம்பரியச் சூழல் மட்டுமே, நவீன பயணத் தகவலுக்கான ஆதாரம் அல்ல.
        </p>
      )}

      {populatedProse.length > 0 && (
        <section className="temple-known" aria-labelledby="known-h">
          <h2 id="known-h" lang="ta">அறியப்பட்ட தகவல்</h2>
          {populatedProse.map((f) => (
            <div className="temple-prose" key={f.key}>
              <h3 lang="ta">{f.label}</h3>
              <p lang="ta">{f.value}</p>
            </div>
          ))}
        </section>
      )}

      {pendingProse.length > 0 && (
        <section className="temple-pending" aria-labelledby="pending-h">
          <h2 id="pending-h" lang="ta">இன்னும் நிலுவையில்</h2>
          <ul className="temple-pending-list">
            {pendingProse.map((f) => <li key={f.key} lang="ta">{f.label}</li>)}
          </ul>
          <p className="note" lang="ta">
            சரிபார்க்கப்படாத தகவலை இத்தளம் வெளியிடாது. இது கோயிலின் அடையாளம்
            குறித்த ஐயத்தைக் குறிக்காது — கீழே &ldquo;மூலமும் நிலையும்&rdquo; பிரிவைப் பார்க்கவும்.
          </p>
        </section>
      )}

      <section className="provenance" aria-labelledby="prov-h">
        <h2 id="prov-h" lang="ta">மூலமும் நிலையும்</h2>
        <p lang="ta" className="note">
          கீழேயுள்ள ஒவ்வொரு நிலையும் ஒரு தனித்தன்மையைக் குறிக்கிறது; ஒன்று மற்றொன்றைப் பொதுமைப்படுத்தாது.
        </p>
        <p className="state-row">
          <span className={`state state-${sourceConfidence.tone}`}>
            <span className="state-dot" aria-hidden="true" />
            <span lang="ta">{sourceConfidence.label}</span>
          </span>
          <StateBadge state={temple.coordinateConfidence} dimension="ஆயத்தொலைவு" />
          <StateBadge state={temple.imageStatus} dimension="படம்" />
        </p>
        <p className="note" lang="ta">முழுமை நிலை: {documentedFields}/{totalFields} விவரப் புலங்கள் கிடைத்துள்ளன.</p>
        {temple.sources.length > 0 && (
          <ul className="source-list">
            {temple.sources.map((s, i) => {
              const conf = describeSourceConfidence(s.confidence);
              return (
                <li key={i}>
                  {s.url ? (
                    <a href={s.url} rel="noopener noreferrer" target="_blank">{s.reference ?? s.url}</a>
                  ) : (
                    (s.reference ?? '—')
                  )}
                  <span className={`state state-${conf.tone} source-confidence`}>
                    <span className="state-dot" aria-hidden="true" />
                    <span lang="ta">{conf.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pilgrimageStop?.officialCurrentSource && (
        <section className="official-current" aria-labelledby="cur-h">
          <h2 id="cur-h" lang="ta">தற்போதைய உத்தியோகபூர்வத் தகவல்</h2>
          <p className="state-row">
            <StateBadge state={pilgrimageStop.officialCurrentSource.state} dimension="தற்போதைமை" />
          </p>
          <p className="note" lang="ta">
            தற்போதைய நேரம், சேவைகள் மற்றும் பயணத் தகவலை உத்தியோகபூர்வ கோயில் / HR&amp;CE மூலத்துடன் பயணத்திற்கு முன் உறுதி செய்யவும்.
          </p>
          {pilgrimageStop.officialCurrentSource.publishedScheduleNote && (
            <div className="official-current-row">
              <b lang="ta">தரிசன நேரம்</b>
              <p lang="ta">{pilgrimageStop.officialCurrentSource.publishedScheduleNote}</p>
              {pilgrimageStop.officialCurrentSource.festivalVariation && <small lang="ta">திருவிழா நாட்களில் நேரம் மாறுபடலாம்.</small>}
            </div>
          )}
          {pilgrimageStop.officialCurrentSource.sourceDisplayQuality && (
            <div className="official-current-row">
              <b lang="ta">மூலக் குறிப்பு</b>
              <p lang="ta">
                மூல அட்டவணையில் வடிவமைப்புச் சிக்கல் இருந்தது; இணைந்த தமிழ் விளக்கத்தின் அடிப்படையில் மேலேயுள்ள நேரம் இயல்பாக்கப்பட்டுள்ளது — பயணத்திற்கு முன் மீண்டும் உறுதி செய்யவும்.
              </p>
            </div>
          )}
          {pilgrimageStop.officialCurrentSource.contact && (
            <dl className="fields">
              {pilgrimageStop.officialCurrentSource.contact.phone && (
                <div className="field"><dt lang="ta">தொலைபேசி</dt><dd>{pilgrimageStop.officialCurrentSource.contact.phone}</dd></div>
              )}
              {pilgrimageStop.officialCurrentSource.contact.email && (
                <div className="field"><dt lang="ta">மின்னஞ்சல்</dt><dd>{pilgrimageStop.officialCurrentSource.contact.email}</dd></div>
              )}
              {pilgrimageStop.officialCurrentSource.contact.addressSummary && (
                <div className="field"><dt lang="ta">முகவரி</dt><dd>{pilgrimageStop.officialCurrentSource.contact.addressSummary}</dd></div>
              )}
            </dl>
          )}
          {officialCurrentUrl && (
            <>
              <p className="note" lang="ta">இணைக்கப்பட்டிருக்கும் உத்தியோகபூர்வ மூலமே நேரம் மற்றும் தொடர்பு விவரங்களுக்கான தற்போதைய ஆதாரம்.</p>
              <a className="btn btn-quiet" href={officialCurrentUrl} rel="noopener noreferrer" target="_blank">
                <span lang="ta">உத்தியோகபூர்வ மூலத்தைத் திற</span>
              </a>
            </>
          )}
        </section>
      )}
    </article>
  );
}
