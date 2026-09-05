import { useParams, Link } from 'wouter';
import { templeById, templeCompleteness } from '@/content/temples';
import { describeSourceConfidence, works, arupadaiVeedu } from '@/content';
import StateBadge from '@/components/StateBadge';
import { useEntityMeta } from '@/lib/routeMeta';

export default function TempleDetail() {
  const params = useParams<{ id: string }>();
  const temple = params.id ? templeById(params.id) : undefined;
  const title = temple ? (temple.nameTa ?? temple.nameEn) : null;
  useEntityMeta(
    `/temples/${params.id ?? ''}`,
    title,
    title ? `${title} — கோயில் பதிவு, மூலம் மற்றும் நிலையுடன்.` : null,
  );

  if (!temple) {
    return (
      <article className="page">
        <h1 lang="ta">பதிவு காணப்படவில்லை</h1>
        <p lang="ta">இந்த முகவரிக்குக் கோயில் பதிவு இல்லை.</p>
        <Link href="/temples" lang="ta">
          கோயில் பட்டியலுக்குத் திரும்பு
        </Link>
      </article>
    );
  }

  const { documentedFields, totalFields } = templeCompleteness(temple);
  // The registry's `sources[]` entries carry an identity-confidence signal
  // (HIGH / PARTIAL_IDENTITY / LOW) that is a genuinely separate dimension
  // from `coordinateConfidence` — see R2-CODE-005/012.
  const primarySource = temple.sources[0];
  const sourceConfidence = describeSourceConfidence(primarySource?.confidence);

  // One of the six traditional abodes gets a visible flag on its own detail
  // page — the pilgrimage order is real information (the same 01..06 the
  // Arupadai band and page already use), not decoration.
  const pilgrimageStop = arupadaiVeedu.find((a) => a.id === temple.id);

  // Short categorical facts (deity / form / location) read as an editorial
  // identity line under the name. The longer prose fields — sthala purana,
  // history, architecture, visitor information — are a different kind of
  // content and are handled separately below so a page with only two or
  // three of them populated still reads as "here is what we know," not as
  // a ledger with blank rows.
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

  return (
    <article className="page">
      <header className="page-head temple-head">
        <div className="temple-head-top">
          {temple.classification.length > 0 && (
            <p className="tag-row">
              {temple.classification.map((c) => (
                <span key={c} className="tag" lang="ta">
                  {c}
                </span>
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
          <h2 id="known-h" lang="ta">
            அறியப்பட்ட தகவல்
          </h2>
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
          <h2 id="pending-h" lang="ta">
            இன்னும் நிலுவையில்
          </h2>
          <ul className="temple-pending-list">
            {pendingProse.map((f) => (
              <li key={f.key} lang="ta">
                {f.label}
              </li>
            ))}
          </ul>
          <p className="note" lang="ta">
            சரிபார்க்கப்படாத தகவலை இத்தளம் வெளியிடாது. இது கோயிலின் அடையாளம்
            குறித்த ஐயத்தைக் குறிக்காது — கீழே &ldquo;மூலமும் நிலையும்&rdquo;
            பிரிவைப் பார்க்கவும்.
          </p>
        </section>
      )}

      <section className="provenance" aria-labelledby="prov-h">
        <h2 id="prov-h" lang="ta">
          மூலமும் நிலையும்
        </h2>
        <p lang="ta" className="note">
          கீழேயுள்ள ஒவ்வொரு நிலையும் ஒரு தனித்தன்மையைக் குறிக்கிறது; ஒன்று
          மற்றொன்றைப் பொதுமைப்படுத்தாது.
        </p>
        <p className="state-row">
          <span className={`state state-${sourceConfidence.tone}`}>
            <span className="state-dot" aria-hidden="true" />
            <span lang="ta">{sourceConfidence.label}</span>
          </span>
          <StateBadge state={temple.coordinateConfidence} dimension="ஆயத்தொலைவு" />
          <StateBadge state={temple.imageStatus} dimension="படம்" />
        </p>
        <p className="note" lang="ta">
          முழுமை நிலை: {documentedFields}/{totalFields} விவரப் புலங்கள்
          கிடைத்துள்ளன.
        </p>
        {temple.sources.length > 0 && (
          <ul className="source-list">
            {temple.sources.map((s, i) => {
              const conf = describeSourceConfidence(s.confidence);
              return (
                <li key={i}>
                  {s.url ? (
                    <a href={s.url} rel="noopener noreferrer" target="_blank">
                      {s.reference ?? s.url}
                    </a>
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

      {temple.officialDirectSupportLink && (
        <section className="official" aria-labelledby="off-h">
          <h2 id="off-h" lang="ta">
            உத்தியோகபூர்வ தொடர்பு
          </h2>
          <p lang="ta">
            கீழ்க்கண்டது கோயிலின் உத்தியோகபூர்வ சேனல். இத்தளம் நன்கொடைகளைப்
            பெறுவதோ கையாள்வதோ இல்லை.
          </p>
          <a
            className="official-link"
            href={temple.officialDirectSupportLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            {temple.officialAuthority ?? temple.officialDirectSupportLink}
          </a>
        </section>
      )}
    </article>
  );
}
