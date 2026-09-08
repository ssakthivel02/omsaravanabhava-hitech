import { completeness, namavali } from '@/content';
import type { CompletenessDomain } from '@/content';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';
import { useLocale, type UiLocale } from '@/lib/locale';

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

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('உள்ளடக்க நிலை', 'Content Status')}</h1>
        <p lang={locale}>
          {text(
            'இத்தளத்தில் உண்மையில் உள்ள பதிவுகளின் எண்ணிக்கை. எதிர்பார்ப்பு அல்ல. ஒவ்வொரு நெடுவரிசையும் ஒரு தனித்தன்மையைக் குறிக்கிறது — "பொருந்தாது" என்பது அந்தப் பிரிவுக்கு அந்த நெடுவரிசை பொருந்தாது என்பதைக் குறிக்கும்; "0" என்பது அந்தப் புலம் பொருந்தும், ஆனால் இதுவரை எதுவும் வெளியிடப்படவில்லை என்பதைக் குறிக்கும்.',
            'The count of records that actually exist on this site — not an aspiration. Each column represents one independent dimension — "N/A" means that column does not apply to that domain; "0" means the field applies, but nothing has been published yet.',
          )}
        </p>
      </header>

      <div className="table-scroll">
        <table className="matrix">
          <caption className="sr-only">
            {text(
              'உள்ளடக்க முழுமை அட்டவணை — நெடுவரிசைக்கு நெடுவரிசை தனித்தன்மை',
              'Content completeness table — each column is an independent dimension',
            )}
          </caption>
          <thead>
            <tr>
              <th scope="col" lang={locale}>
                {text('பிரிவு', 'Domain')}
              </th>
              <th scope="col" lang={locale}>
                {text('பதிவுகள்', 'Records')}
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" lang={locale}>
                  {text(c.labelTa, c.labelEn)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completeness.domains.map((d) => (
              <tr key={d.key}>
                <th scope="row" lang={locale}>
                  {text(d.labelTa, d.labelEn)}
                </th>
                <td>{d.records}</td>
                {COLUMNS.map((c) => (
                  <Cell key={c.key} value={d[c.key] as number | undefined} locale={locale} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="layers" aria-labelledby="namavali-h">
        <h2 id="namavali-h" lang={locale}>
          {text('நாமாவளி — ஆய்வு நிலை', 'Namavali — Research State')}
        </h2>
        <p className="note" lang={locale}>
          {text('தொகுப்பு நிலை:', 'Dataset status:')} <StateBadge state={namavali.datasetStatus} />
        </p>
        <dl className="fields">
          {Object.entries(researchItems).map(([k, v]) => (
            <div className="field" key={k}>
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
        {typeof policy === 'string' && (
          <p className="note" lang="en">
            {policy}
          </p>
        )}
      </section>

      {/* Technical/methodological release notes: governed English-only
          fields (no Tamil counterpart exists), shown as-is regardless of UI
          language rather than fabricating a translation. */}
      <p className="note" lang="en">
        {completeness.note}
      </p>
      <p className="note" lang="en">
        Source archive SHA-256: <code>{completeness.sourceArchiveSha256}</code>
      </p>
    </article>
  );
}
