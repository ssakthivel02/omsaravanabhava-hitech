import { works, devotionalWorks } from '@/content';
import StateBadge from '@/components/StateBadge';

/** Devotional works / song corpus. Metadata and rights state only. */
export default function Works() {
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">பாடல்களும் நூல்களும்</h1>
        <p lang="ta">
          முருகன் தொடர்பான பக்தி நூல்கள். ஒவ்வொன்றின் மூலமும் உரிமை நிலையும்
          கீழே.
        </p>
      </header>

      <ul className="temple-list">
        {[...works, ...devotionalWorks].map((w, i) => (
          <li key={(w.id ?? '') + i}>
            <div className="temple-row">
              <b lang="ta">{w.titleTa ?? w.titleEn}</b>
              <small>{w.titleEn}</small>
              <StateBadge
                state={
                  'rightsState' in w
                    ? w.rightsState
                    : (w.verificationState ?? 'UNKNOWN')
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
