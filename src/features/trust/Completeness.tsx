import { completeness, namavali } from '@/content';
import type { CompletenessDomain } from '@/content';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';

/**
 * Every column below is one independent dimension. R2-CODE-004: the previous
 * table folded canonical text and temple history under one "மூல உரை" header
 * via `withCanonicalText ?? withHistory ?? '—'`, so a temple's history count
 * could render under a "source text" heading. `undefined` (dimension does
 * not apply to this domain) and `0` (dimension applies, nothing published
 * yet) are rendered differently on purpose — collapsing them was the bug.
 */
function Cell({ value }: { value: number | undefined }) {
  if (value === undefined) {
    return (
      <td className="matrix-na" lang="ta">
        பொருந்தாது
      </td>
    );
  }
  return <td className={value === 0 ? 'matrix-zero' : undefined}>{value}</td>;
}

const COLUMNS: Array<{ key: keyof CompletenessDomain; labelTa: string }> = [
  { key: 'withCoordinates', labelTa: 'ஆயத்தொலைவு' },
  { key: 'withHistory', labelTa: 'வரலாறு' },
  { key: 'withVisitorInfo', labelTa: 'பயணத் தகவல்' },
  { key: 'withCanonicalText', labelTa: 'மூல உரை' },
  { key: 'withMeaning', labelTa: 'பொருள்' },
  { key: 'withAudio', labelTa: 'ஒலி' },
];

/**
 * `namavali.researchState` carries raw internal research-tracking codes
 * (e.g. "RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS") that were
 * previously rendered verbatim inside a <dd> — a raw-enum leak on the one
 * page whose entire purpose is plain-language provenance. `policy` is
 * already a plain sentence rather than a state code, so it is shown
 * separately instead of being forced into the same key/value list.
 */
const RESEARCH_ITEM_LABELS: Record<string, string> = {
  kumarastavam_44: 'குமரஸ்தவம் (44 விளி)',
  ashtottara_108: 'அஷ்டோத்தர சத நாமாவளி (108)',
};
const RESEARCH_STATE_LABELS: Record<string, string> = {
  NOT_TREATED_AS_SYNTHETIC_NAMAVALI:
    'இயற்றப்பட்ட/இணைக்கப்பட்ட நாமாவளியாகக் கருதப்படவில்லை',
  RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS:
    'அடையாளம் தெரிந்த பதிப்பும் உரிமை நிலையும் தேவை',
};

export default function Completeness() {
  const { policy, ...researchItems } = namavali.researchState;

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">உள்ளடக்க நிலை</h1>
        <p lang="ta">
          இத்தளத்தில் உண்மையில் உள்ள பதிவுகளின் எண்ணிக்கை. எதிர்பார்ப்பு அல்ல.
          ஒவ்வொரு நெடுவரிசையும் ஒரு தனித்தன்மையைக் குறிக்கிறது — &ldquo;
          பொருந்தாது&rdquo; என்பது அந்தப் பிரிவுக்கு அந்த நெடுவரிசை
          பொருந்தாது என்பதைக் குறிக்கும்; &ldquo;0&rdquo; என்பது அந்தப் புலம்
          பொருந்தும், ஆனால் இதுவரை எதுவும் வெளியிடப்படவில்லை என்பதைக்
          குறிக்கும்.
        </p>
      </header>

      <div className="table-scroll">
        <table className="matrix">
          <caption className="sr-only">உள்ளடக்க முழுமை அட்டவணை — நெடுவரிசைக்கு நெடுவரிசை தனித்தன்மை</caption>
          <thead>
            <tr>
              <th scope="col" lang="ta">
                பிரிவு
              </th>
              <th scope="col" lang="ta">
                பதிவுகள்
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" lang="ta">
                  {c.labelTa}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completeness.domains.map((d) => (
              <tr key={d.key}>
                <th scope="row" lang="ta">
                  {d.labelTa}
                </th>
                <td>{d.records}</td>
                {COLUMNS.map((c) => (
                  <Cell key={c.key} value={d[c.key] as number | undefined} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="layers" aria-labelledby="namavali-h">
        <h2 id="namavali-h" lang="ta">
          நாமாவளி — ஆய்வு நிலை
        </h2>
        <p className="note" lang="ta">
          தொகுப்பு நிலை: <StateBadge state={namavali.datasetStatus} />
        </p>
        <dl className="fields">
          {Object.entries(researchItems).map(([k, v]) => (
            <div className="field" key={k}>
              <dt lang="ta">{RESEARCH_ITEM_LABELS[k] ?? k}</dt>
              <dd>
                <StateBadgeResolved
                  label={RESEARCH_STATE_LABELS[v] ?? v}
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

      <p className="note" lang="en">
        {completeness.note}
      </p>
      <p className="note" lang="en">
        Source archive SHA-256: <code>{completeness.sourceArchiveSha256}</code>
      </p>
    </article>
  );
}
