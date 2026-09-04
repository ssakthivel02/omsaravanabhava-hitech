import { completeness, namavali } from '@/content';
import type { CompletenessDomain } from '@/content';

/**
 * Every column below is one independent dimension. R2-CODE-004: the previous
 * table folded canonical text and temple history under one "மூல உரை" header
 * via `withCanonicalText ?? withHistory ?? '—'`, so a temple's history count
 * could render under a "source text" heading. `undefined` (dimension does
 * not apply to this domain) and `0` (dimension applies, nothing published
 * yet) are rendered differently on purpose — collapsing them was the bug.
 */
function Cell({ value }: { value: number | undefined }) {
  if (value === undefined) return <td lang="ta">பொருந்தாது</td>;
  return <td>{value}</td>;
}

const COLUMNS: Array<{ key: keyof CompletenessDomain; labelTa: string }> = [
  { key: 'withCoordinates', labelTa: 'ஆயத்தொலைவு' },
  { key: 'withHistory', labelTa: 'வரலாறு' },
  { key: 'withVisitorInfo', labelTa: 'பயணத் தகவல்' },
  { key: 'withCanonicalText', labelTa: 'மூல உரை' },
  { key: 'withMeaning', labelTa: 'பொருள்' },
  { key: 'withAudio', labelTa: 'ஒலி' },
];

export default function Completeness() {
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

      <section aria-labelledby="namavali-h">
        <h2 id="namavali-h" lang="ta">
          நாமாவளி — ஆய்வு நிலை (மேம்பட்ட)
        </h2>
        <p className="note" lang="ta">
          தொகுப்பு நிலை: {namavali.datasetStatus}
        </p>
        <dl className="fields">
          {Object.entries(namavali.researchState).map(([k, v]) => (
            <div className="field" key={k}>
              <dt><code>{k}</code></dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="note">{completeness.note}</p>
      <p className="note">
        Source archive SHA-256: <code>{completeness.sourceArchiveSha256}</code>
      </p>
    </article>
  );
}
