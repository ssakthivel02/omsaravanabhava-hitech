import { useParams, Link } from 'wouter';
import { templeById, templeCompleteness } from '@/content/temples';
import { describeSourceConfidence } from '@/content';
import StateBadge from '@/components/StateBadge';
import { useEntityMeta } from '@/lib/routeMeta';

/** A field is rendered only when the registry actually holds it. */
function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="field">
      <dt lang="ta">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

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

  return (
    <article className="page">
      <header className="page-head">
        {temple.isArupadaiVeedu && (
          <p className="tag" lang="ta">
            அறுபடை வீடு
          </p>
        )}
        <h1 lang="ta">{temple.nameTa ?? temple.nameEn}</h1>
        {temple.nameEn && <p className="latin-name">{temple.nameEn}</p>}
      </header>

      <dl className="fields">
        <Field label="தெய்வம்" value={temple.deity} />
        <Field label="மாவட்டம்" value={temple.district} />
        <Field label="மாநிலம்" value={temple.state} />
        <Field label="வரலாறு" value={temple.history} />
        <Field label="கட்டிடக்கலை" value={temple.architecture} />
        <Field label="தல புராணம்" value={temple.sthalaPurana} />
        <Field label="பயணத் தகவல்" value={temple.visitorInformation} />
      </dl>

      {documentedFields === 0 && (
        <p className="empty" lang="ta">
          இந்தக் கோயிலுக்கான வரலாறு, கட்டிடக்கலை மற்றும் பயணத் தகவல்
          ({documentedFields}/{totalFields} புலங்கள்) இன்னும் மூலத்திலிருந்து
          கிடைக்கவில்லை. சரிபார்க்கப்படாத தகவலை இத்தளம் வெளியிடாது. இது
          கோயிலின் அடையாளம் குறித்த ஐயத்தைக் குறிக்காது — கீழே "மூலமும்
          நிலையும்" பிரிவைப் பார்க்கவும்.
        </p>
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
