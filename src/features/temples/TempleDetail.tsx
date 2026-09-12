import { useParams, Link } from 'wouter';
import { templeById, templeCompleteness } from '@/content/temples';
import { describeSourceConfidence, works, arupadaiVeedu, resolveOfficialSourceState } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { useEntityMeta } from '@/lib/routeMeta';
import { useRecentItem } from '@/lib/useRecent';
import { useLocale } from '@/lib/locale';
import { evaluateCoordinatePublication } from '@/lib/geographicProvenance';

export default function TempleDetail() {
  const params = useParams<{ id: string }>();
  const temple = params.id ? templeById(params.id) : undefined;
  const { locale, text } = useLocale();
  useEntityMeta(`/temples/${params.id ?? ''}`, {
    titleTa: temple?.nameTa ?? temple?.nameEn ?? null,
    titleEn: temple?.nameEn ?? temple?.nameTa ?? null,
    descriptionTa: temple
      ? `${temple.nameTa ?? temple.nameEn} — கோயில் பதிவு, மூலம் மற்றும் நிலையுடன்.`
      : null,
    descriptionEn: temple
      ? `${temple.nameEn ?? temple.nameTa} — a temple record, with source and state.`
      : null,
  });
  useRecentItem(
    temple
      ? { type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn }
      : null,
  );

  if (!temple) {
    return (
      <article className="page">
        <h1 lang={locale}>{text('பதிவு காணப்படவில்லை', 'Record not found')}</h1>
        <p lang={locale}>{text('இந்த முகவரிக்குக் கோயில் பதிவு இல்லை.', 'There is no temple record at this address.')}</p>
        <Link href="/temples" lang={locale}>
          {text('கோயில் பட்டியலுக்குத் திரும்பு', 'Back to temple list')}
        </Link>
      </article>
    );
  }

  const { documentedFields, totalFields } = templeCompleteness(temple);
  const primarySource = temple.sources[0];
  const sourceConfidence = describeSourceConfidence(primarySource?.confidence, locale);
  const pilgrimageStop = arupadaiVeedu.find((a) => a.id === temple.id);
  const officialSourceState = pilgrimageStop?.officialCurrentSource
    ? resolveOfficialSourceState(pilgrimageStop.officialCurrentSource)
    : null;
  const coordinateDecision = evaluateCoordinatePublication({
    latitude: temple.latitude,
    longitude: temple.longitude,
    coordinateConfidence: temple.coordinateConfidence,
  });
  const showEnglishFirst = locale === 'en' && Boolean(temple.nameEn);

  // Field labels are UI chrome and are localized. Governed values are not
  // translated, but language-of-parts is marked from the script actually used.
  const contentLang = (value: string) => /[\u0B80-\u0BFF]/u.test(value) ? 'ta' : 'en';
  const facts = [
    temple.deity && { labelTa: 'தெய்வம்', labelEn: 'Deity', value: temple.deity },
    temple.muruganForm && { labelTa: 'முருகன் வடிவம்', labelEn: "Murugan's form", value: temple.muruganForm },
    (temple.district || temple.state) && {
      labelTa: 'இடம்',
      labelEn: 'Location',
      value: [temple.district, temple.state].filter(Boolean).join(', '),
    },
  ].filter((f): f is { labelTa: string; labelEn: string; value: string } => Boolean(f));

  const proseFields = [
    { key: 'sthalaPurana', labelTa: 'தல புராணம்', labelEn: 'Sthala Purana', value: temple.sthalaPurana },
    { key: 'history', labelTa: 'வரலாறு', labelEn: 'History', value: temple.history },
    { key: 'architecture', labelTa: 'கட்டிடக்கலை', labelEn: 'Architecture', value: temple.architecture },
    { key: 'visitorInformation', labelTa: 'பயணத் தகவல்', labelEn: 'Visitor information', value: temple.visitorInformation },
  ];
  const populatedProse = proseFields.filter(
    (f): f is { key: string; labelTa: string; labelEn: string; value: string } => Boolean(f.value),
  );
  const pendingProse = proseFields.filter((f) => !f.value);

  const literaryLinks = temple.literaryRelationships
    .map((rel) => {
      const r = rel as { work_id?: string };
      const work = r.work_id ? works.find((w) => w.id === r.work_id) : undefined;
      return work ? { id: work.id, titleTa: work.titleTa } : null;
    })
    .filter((w): w is { id: string; titleTa: string | null } => w !== null);

  // Read Aloud always speaks the canonical Tamil identity, regardless of UI
  // language — see ReadAloud's own note on this.
  const readAloudText = [
    temple.nameTa,
    ...facts.map((fact) => `${fact.labelTa}: ${fact.value}`),
    ...populatedProse.map((field) => `${field.labelTa}. ${field.value}`),
  ]
    .filter((value): value is string => Boolean(value))
    .join('. ');

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
            <span className="temple-pilgrimage-flag" lang={locale}>
              {text('அறுபடை வீடு', 'Six Abodes')} · {String(pilgrimageStop.pilgrimageOrder).padStart(2, '0')}
            </span>
          )}
        </div>
        {showEnglishFirst ? (
          <>
            <h1 lang="en">{temple.nameEn}</h1>
            {temple.nameTa && <p className="latin-name" lang="ta">{temple.nameTa}</p>}
          </>
        ) : (
          <>
            <h1 lang={temple.nameTa ? 'ta' : 'en'}>{temple.nameTa ?? temple.nameEn}</h1>
            {temple.nameEn && <p className="latin-name" lang="en">{temple.nameEn}</p>}
          </>
        )}
        {facts.length > 0 && (
          <p className="temple-facts">
            {facts.map((f, i) => (
              <span key={f.labelTa}>
                {i > 0 ? ' · ' : ''}
                <b lang={locale}>{text(f.labelTa, f.labelEn)}:</b> <span lang={contentLang(f.value)}>{f.value}</span>
              </span>
            ))}
          </p>
        )}
        <div className="record-actions">
          <SaveControl
            item={{ type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn }}
          />
          {readAloudText && (
            <ReadAloud text={readAloudText} labelTa="கோயில் பதிவை வாசிக்க" labelEn="Read the temple record aloud" />
          )}
        </div>
      </header>

      {literaryLinks.length > 0 && (
        <p className="stop-literary" lang={locale}>
          {text('இலக்கியக் குறிப்பு —', 'Literary reference —')}{' '}
          {literaryLinks.map((w, i) => (
            <span key={w.id}>
              {i > 0 ? ', ' : ''}
              <span lang="ta">{w.titleTa ?? w.id}</span>
            </span>
          ))}
          . {text('இது பாரம்பரியச் சூழல் மட்டுமே, நவீன பயணத் தகவலுக்கான ஆதாரம் அல்ல.', 'This is traditional context only, not a source for modern travel information.')}
        </p>
      )}

      {populatedProse.length > 0 && (
        <section className="temple-known" aria-labelledby="known-h">
          <h2 id="known-h" lang={locale}>{text('அறியப்பட்ட தகவல்', 'Known Information')}</h2>
          {populatedProse.map((f) => (
            <div className="temple-prose" key={f.key}>
              <h3 lang={locale}>{text(f.labelTa, f.labelEn)}</h3>
              <p lang={contentLang(f.value)}>{f.value}</p>
            </div>
          ))}
        </section>
      )}

      {pendingProse.length > 0 && (
        <section className="temple-pending" aria-labelledby="pending-h">
          <h2 id="pending-h" lang={locale}>{text('இன்னும் நிலுவையில்', 'Still Pending')}</h2>
          <ul className="temple-pending-list">
            {pendingProse.map((f) => (
              <li key={f.key} lang={locale}>{text(f.labelTa, f.labelEn)}</li>
            ))}
          </ul>
          <p className="note" lang={locale}>
            {text(
              'சரிபார்க்கப்படாத தகவலை இத்தளம் வெளியிடாது. இது கோயிலின் அடையாளம் குறித்த ஐயத்தைக் குறிக்காது — கீழே "மூலமும் நிலையும்" பிரிவைப் பார்க்கவும்.',
              'This site does not publish unverified information. This does not indicate any doubt about the temple\'s identity — see the "Source and State" section below.',
            )}
          </p>
        </section>
      )}

      <section className="provenance" aria-labelledby="prov-h">
        <h2 id="prov-h" lang={locale}>{text('மூலமும் நிலையும்', 'Source and State')}</h2>
        <p lang={locale} className="note">
          {text(
            'கீழேயுள்ள ஒவ்வொரு நிலையும் ஒரு தனித்தன்மையைக் குறிக்கிறது; ஒன்று மற்றொன்றைப் பொதுமைப்படுத்தாது.',
            'Each state below represents one distinct dimension; one is never generalized to imply another.',
          )}
        </p>
        <p className="state-row" data-coordinate-publication-state={coordinateDecision.state}>
          <span className={`state state-${sourceConfidence.tone}`}>
            <span className="state-dot" aria-hidden="true" />
            <span lang={locale}>{sourceConfidence.label}</span>
          </span>
          <StateBadge state={coordinateDecision.state} dimension={text('ஆயத்தொலைவு', 'Coordinates')} />
          <StateBadge state={temple.imageStatus} dimension={text('படம்', 'Image')} />
        </p>
        <p className="note" lang={locale}>
          {text(
            `முழுமை நிலை: ${documentedFields}/${totalFields} விவரப் புலங்கள் கிடைத்துள்ளன.`,
            `Completeness: ${documentedFields}/${totalFields} detail fields are available.`,
          )}
        </p>
        {temple.sources.length > 0 && (
          <ul className="source-list">
            {temple.sources.map((s, i) => {
              const conf = describeSourceConfidence(s.confidence, locale);
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
                    <span lang={locale}>{conf.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pilgrimageStop?.officialCurrentSource && (
        <section className="official-current" aria-labelledby="cur-h">
          <h2 id="cur-h" lang={locale}>{text('தற்போதைய உத்தியோகபூர்வத் தகவல்', 'Current Official Information')}</h2>
          <p className="state-row">
            <StateBadge
              state={officialSourceState ?? pilgrimageStop.officialCurrentSource.state}
              dimension={text('தற்போதைமை', 'Freshness')}
            />
          </p>
          <p className="note" lang={locale}>
            {text(
              'தற்போதைய நேரம், சேவைகள் மற்றும் பயணத் தகவலை உத்தியோகபூர்வ கோயில் / HR&CE மூலத்துடன் பயணத்திற்கு முன் உறுதி செய்யவும்.',
              'Please confirm current timings, services, and visitor information with the official temple / HR&CE source before you travel.',
            )}
          </p>

          {pilgrimageStop.officialCurrentSource.publishedScheduleNote && (
            <div className="official-current-row">
              <b lang={locale}>{text('தரிசன நேரம்', 'Darshan timings')}</b>
              <p lang="ta">{pilgrimageStop.officialCurrentSource.publishedScheduleNote}</p>
              {pilgrimageStop.officialCurrentSource.festivalVariation && (
                <small lang={locale}>{text('திருவிழா நாட்களில் நேரம் மாறுபடலாம்.', 'Timings may vary on festival days.')}</small>
              )}
            </div>
          )}

          {pilgrimageStop.officialCurrentSource.sourceDisplayQuality && (
            <div className="official-current-row">
              <b lang={locale}>{text('மூலக் குறிப்பு', 'Source Note')}</b>
              <p lang={locale}>
                {text(
                  'மூல அட்டவணையில் வடிவமைப்புச் சிக்கல் இருந்தது; இணைந்த தமிழ் விளக்கத்தின் அடிப்படையில் மேலேயுள்ள நேரம் இயல்பாக்கப்பட்டுள்ளது — பயணத்திற்கு முன் மீண்டும் உறுதி செய்யவும்.',
                  'There was a formatting issue in the source table; the timing above has been normalized based on the accompanying Tamil description — please reconfirm before you travel.',
                )}
              </p>
            </div>
          )}

          {pilgrimageStop.officialCurrentSource.contact && (
            <dl className="fields">
              {pilgrimageStop.officialCurrentSource.contact.phone && (
                <div className="field">
                  <dt lang={locale}>{text('தொலைபேசி', 'Phone')}</dt>
                  <dd>{pilgrimageStop.officialCurrentSource.contact.phone}</dd>
                </div>
              )}
              {pilgrimageStop.officialCurrentSource.contact.email && (
                <div className="field">
                  <dt lang={locale}>{text('மின்னஞ்சல்', 'Email')}</dt>
                  <dd>{pilgrimageStop.officialCurrentSource.contact.email}</dd>
                </div>
              )}
              {pilgrimageStop.officialCurrentSource.contact.addressSummary && (
                <div className="field">
                  <dt lang={locale}>{text('முகவரி', 'Address')}</dt>
                  <dd>{pilgrimageStop.officialCurrentSource.contact.addressSummary}</dd>
                </div>
              )}
            </dl>
          )}

          <p className="note" lang={locale}>
            {text('கடைசியாக உறுதிசெய்யப்பட்டது:', 'Last confirmed:')}{' '}
            {pilgrimageStop.officialCurrentSource.lastVerifiedAt.slice(0, 10)} · {text('மூலம்:', 'Source:')}{' '}
            {pilgrimageStop.officialCurrentSource.sourceAuthority}
          </p>
          {(pilgrimageStop.officialCurrentSource.timingSourceUrl ??
            pilgrimageStop.officialCurrentSource.officialBaseUrl) && (
            <a
              className="source-link"
              href={
                pilgrimageStop.officialCurrentSource.timingSourceUrl ??
                pilgrimageStop.officialCurrentSource.officialBaseUrl ??
                undefined
              }
              rel="noopener noreferrer"
              target="_blank"
              lang={locale}
            >
              {text('மூலப் பக்கத்தில் காண்க ↗', 'View on source page ↗')}
            </a>
          )}
        </section>
      )}

      {temple.officialDirectSupportLink && (
        <section className="official" aria-labelledby="off-h">
          <h2 id="off-h" lang={locale}>{text('உத்தியோகபூர்வ தொடர்பு', 'Official Contact')}</h2>
          <p lang={locale}>
            {text(
              'கீழ்க்கண்டது கோயிலின் உத்தியோகபூர்வ சேனல். இத்தளம் நன்கொடைகளைப் பெறுவதோ கையாள்வதோ இல்லை.',
              "Below is the temple's official channel. This site does not receive or handle donations.",
            )}
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
