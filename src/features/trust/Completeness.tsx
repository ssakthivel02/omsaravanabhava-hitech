import { completeness, namavali } from '@/content';
import type { CompletenessDomain } from '@/content';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';
import { useLocale, type UiLocale } from '@/lib/locale';
import './completeness-r213.css';

/**
 * Every column below is one independent dimension. R2-CODE-004: the previous
 * table folded canonical text and temple history under one "மூல உரை" header
 * via `withCanonicalText ?? withHistory ?? '—'`, so a temple's history count
 * could render under a "source text" heading. `undefined` (dimension does
 * not apply to this domain) and `0` (dimension applies, nothing published
 * yet) are rendered differently on purpose — collapsing them was the bug.
 */
function Cell({ value, locale }: { value: number | undefined; locale: UiLocale }) {
  if (value === undefined) {
    return (
      <td className="matrix-na" lang={locale}>
        {locale === 'ta' ? 'பொருந்தாது' : 'N/A'}
      </td>
    );
  }
  return <td className={value === 0 ? 'matrix-zero' : undefined}>{value}</td>;
}

const COLUMNS: Array<{ key: keyof CompletenessDomain; labelTa: string; labelEn: string }> = [
  { key: 'withCoordinates', labelTa: 'ஆயத்தொலைவு', labelEn: 'Coordinates' },
  { key: 'withHistory', labelTa: 'வரலாறு', labelEn: 'History' },
  { key: 'withVisitorInfo', labelTa: 'பயணத் தகவல்', labelEn: 'Visitor information' },
  { key: 'withCanonicalText', labelTa: 'மூல உரை', labelEn: 'Source text' },
  { key: 'withMeaning', labelTa: 'பொருள்', labelEn: 'Meaning' },
  { key: 'withAudio', labelTa: 'ஒலி', labelEn: 'Audio' },
];

/**
 * `namavali.researchState` carries raw internal research-tracking codes
 * (e.g. "RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS") that were
 * previously rendered verbatim inside a <dd> — a raw-enum leak on the one
 * page whose entire purpose is plain-language provenance. `policy` is
 * already a plain sentence rather than a state code, so it is shown
 * separately instead of being forced into the same key/value list.
 */
const RESEARCH_ITEM_LABELS: Record<string, { ta: string; en: string }> = {
  kumarastavam_44: { ta: 'குமரஸ்தவம் (44 விளி)', en: 'Kumarastavam (44 invocations)' },
  ashtottara_108: { ta: 'அஷ்டோத்தர சத நாமாவளி (108)', en: 'Ashtottara Shata Namavali (108)' },
};
const RESEARCH_STATE_LABELS: Record<string, { ta: string; en: string }> = {
  NOT_TREATED_AS_SYNTHETIC_NAMAVALI: {
    ta: 'இயற்றப்பட்ட/இணைக்கப்பட்ட நாமாவளியாகக் கருதப்படவில்லை',
    en: 'Not treated as a composed/assembled Namavali',
  },
  RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS: {
    ta: 'அடையாளம் தெரிந்த பதிப்பும் உரிமை நிலையும் தேவை',
    en: 'An identifiable edition and rights status are required',
  },
};

export default function Completeness() {
  const { policy, ...researchItems } = namavali.researchState;
  const { locale, text } = useLocale();
  const totalRecords = completeness.domains.reduce((sum, domain) => sum + domain.records, 0);

  return (
    <article className="page completeness-page">
      <header className="completeness-hero">
        <div className="completeness-hero-copy">
          <p className="completeness-eyebrow" lang={locale}>
            {text('வெளியீட்டு வெளிப்படைமை', 'Publication transparency')}
          </p>
          <h1 lang={locale}>{text('உள்ளடக்க நிலை', 'Content Status')}</h1>
          <p lang={locale}>
            {text(
              'இத்தளத்தில் உண்மையில் உள்ள பதிவுகளின் எண்ணிக்கை. எதிர்பார்ப்பு அல்ல. ஒவ்வொரு நெடுவரிசையும் ஒரு தனித்தன்மையைக் குறிக்கிறது.',
              'The count of records that actually exist on this site — not an aspiration. Each column represents one independent publication dimension.',
            )}
          </p>
        </div>
        <dl className="completeness-summary" aria-label={text('உள்ளடக்க நிலை சுருக்கம்', 'Content status summary')}>
          <div>
            <dt lang={locale}>{text('பிரிவுகள்', 'Domains')}</dt>
            <dd>{completeness.domains.length}</dd>
          </div>
          <div>
            <dt lang={locale}>{text('பதிவுகள்', 'Records')}</dt>
            <dd>{totalRecords}</dd>
          </div>
          <div>
            <dt lang={locale}>{text('அளவுகள்', 'Dimensions')}</dt>
            <dd>{COLUMNS.length}</dd>
          </div>
        </dl>
      </header>

      <section className="completeness-section" aria-labelledby="matrix-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={locale}>
            {text('வெளியீட்டு அணி', 'Publication matrix')}
          </p>
          <h2 id="matrix-h" lang={locale}>{text('எது வெளியிடப்பட்டுள்ளது', 'What is actually published')}</h2>
          <p lang={locale}>
            {text(
              '“பொருந்தாது” என்பது அந்த அளவு அந்தப் பிரிவுக்கு பொருந்தாது என்பதைக் குறிக்கும். “0” என்பது அது பொருந்தும், ஆனால் இதுவரை எதுவும் வெளியிடப்படவில்லை என்பதைக் குறிக்கும்.',
              '“N/A” means the dimension does not apply to that domain. “0” means it does apply, but nothing has been published yet.',
            )}
          </p>
        </div>

        <div className="completeness-legend" aria-label={text('அணி குறியீடு', 'Matrix legend')}>
          <p><span className="legend-chip legend-na" aria-hidden="true">N/A</span><span lang={locale}>{text('இந்தப் பிரிவுக்கு பொருந்தாது', 'Not applicable to this domain')}</span></p>
          <p><span className="legend-chip legend-zero" aria-hidden="true">0</span><span lang={locale}>{text('பொருந்தும்; இன்னும் வெளியிடப்படவில்லை', 'Applicable; nothing published yet')}</span></p>
        </div>

        <div className="table-scroll completeness-table-shell">
          <table className="matrix completeness-matrix">
            <caption className="sr-only">
              {text(
                'உள்ளடக்க முழுமை அட்டவணை — நெடுவரிசைக்கு நெடுவரிசை தனித்தன்மை',
                'Content completeness table — each column is an independent dimension',
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col" lang={locale}>{text('பிரிவு', 'Domain')}</th>
                <th scope="col" lang={locale}>{text('பதிவுகள்', 'Records')}</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} scope="col" lang={locale}>{text(c.labelTa, c.labelEn)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completeness.domains.map((d) => (
                <tr key={d.key}>
                  <th scope="row" lang={locale}>{text(d.labelTa, d.labelEn)}</th>
                  <td>{d.records}</td>
                  {COLUMNS.map((c) => (
                    <Cell key={c.key} value={d[c.key] as number | undefined} locale={locale} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="completeness-section completeness-research" aria-labelledby="namavali-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={locale}>{text('ஆய்வு எல்லை', 'Research boundary')}</p>
          <h2 id="namavali-h" lang={locale}>{text('நாமாவளி — ஆய்வு நிலை', 'Namavali — Research State')}</h2>
          <p className="completeness-dataset-status" lang={locale}>
            {text('தொகுப்பு நிலை:', 'Dataset status:')} <StateBadge state={namavali.datasetStatus} />
          </p>
        </div>
        <dl className="completeness-research-grid">
          {Object.entries(researchItems).map(([k, v]) => (
            <div className="completeness-research-item" key={k}>
              <dt lang={locale}>{text(RESEARCH_ITEM_LABELS[k]?.ta ?? k, RESEARCH_ITEM_LABELS[k]?.en ?? k)}</dt>
              <dd>
                <StateBadgeResolved
                  label={text(
                    RESEARCH_STATE_LABELS[v as string]?.ta ?? (v as string),
                    RESEARCH_STATE_LABELS[v as string]?.en ?? (v as string),
                  )}
                  tone="pending"
                />
              </dd>
            </div>
          ))}
        </dl>
        {typeof policy === 'string' && <p className="completeness-policy" lang="en">{policy}</p>}
      </section>

      <section className="completeness-section completeness-provenance" aria-labelledby="provenance-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={locale}>{text('ஆதார சான்று', 'Provenance evidence')}</p>
          <h2 id="provenance-h" lang={locale}>{text('வெளியீட்டு குறிப்புகள்', 'Release evidence')}</h2>
        </div>
        {/* Technical/methodological release notes are governed English-only
            fields. They are shown as-is rather than fabricating a translation. */}
        <p className="completeness-technical-note" lang="en">{completeness.note}</p>
        <p className="completeness-hash" lang="en">
          <span>Source archive SHA-256</span>
          <code>{completeness.sourceArchiveSha256}</code>
        </p>
      </section>
    </article>
  );
}
