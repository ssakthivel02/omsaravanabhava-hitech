import { Link } from 'wouter';
import { devotionalWorks, kumarastavam } from '@/content';
import StateBadge from '@/components/StateBadge';

/**
 * Mantras, prayers and Namavali.
 *
 * Every record in the governed registry is PUBLIC_METADATA_ONLY with an
 * unresolved rights state. This page therefore publishes the work, its author,
 * its source edition and its real rights state — and no verse text at all.
 * That is a deliberate rights decision, not an unfinished page.
 */
export default function Prayers() {
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">மந்திரம், துதி, நாமாவளி</h1>
        <p lang="ta">
          இப்பகுதியில் உள்ள நூல்களின் விவரங்களும் மூலங்களும் மட்டுமே
          வெளியிடப்படுகின்றன. உரிமை உறுதிசெய்யப்படாத உரைகளை இத்தளம்
          மறுவெளியிடாது.
        </p>
      </header>

      <section aria-labelledby="works-h">
        <h2 id="works-h" lang="ta">
          பக்தி நூல்கள்
        </h2>
        <ul className="temple-list">
          {devotionalWorks.map((w) => (
            <li key={w.id}>
              <div className="temple-row">
                <b lang="ta">{w.titleTa ?? w.titleEn}</b>
                <small>{w.titleEn}</small>
                <StateBadge state={w.rightsState} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {kumarastavam.map((k) => (
        <section key={k.id} aria-labelledby={`k-${k.id}`}>
          <h2 id={`k-${k.id}`} lang="ta">
            {k.titleTa}
          </h2>
          <dl className="fields">
            <div className="field">
              <dt lang="ta">ஆசிரியர்</dt>
              <dd lang="ta">{k.author ?? '—'}</dd>
            </div>
            <div className="field">
              <dt lang="ta">பதிப்பு</dt>
              <dd>{k.edition ?? '—'}</dd>
            </div>
            <div className="field">
              <dt lang="ta">மூலத்தில் உள்ள துதிகள்</dt>
              <dd>{k.invocationsInSource ?? '—'}</dd>
            </div>
            <div className="field">
              <dt lang="ta">வெளியிடப்பட்டவை</dt>
              <dd>{k.invocationsPublished}</dd>
            </div>
            <div className="field">
              <dt lang="ta">உரை நிலை</dt>
              <dd>
                <StateBadge state={k.canonicalTextStatus} />
              </dd>
            </div>
          </dl>
        </section>
      ))}

      <section aria-labelledby="nam-h">
        <h2 id="nam-h" lang="ta">
          நாமாவளி
        </h2>
        <p className="empty" lang="ta">
          தற்போது வெளியிடத்தக்க நாமாவளித் தொகுப்பு எதுவும் இல்லை. படங்கள்,
          சுவரொட்டிகள் அல்லது சரிபார்க்கப்படாத இணையப் பட்டியல்களிலிருந்து
          திருநாமங்களை இத்தளம் வெளியிடாது. ஆய்வு நிலையின் விரிவான குறிப்புகள்{' '}
          <Link href="/content-completeness" lang="ta">
            உள்ளடக்க நிலை
          </Link>{' '}
          பக்கத்தில் உள்ளன.
        </p>
      </section>
    </article>
  );
}
