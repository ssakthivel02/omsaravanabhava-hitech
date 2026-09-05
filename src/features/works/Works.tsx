import { works, devotionalWorks } from '@/content';
import StateBadge from '@/components/StateBadge';

// `works` and `devotionalWorks` are two separate registry chunks that
// overlap on several ids (e.g. "kandar-anubhuti") — `devotionalWorks` is the
// newer, more governed record (author, sources, per-layer publication
// state) for the same work. Rendering both verbatim showed the same title
// twice with two different badges, which reads as either a data error or a
// contradiction rather than two honest states. `devotionalWorks` wins on a
// shared id; `works` only contributes ids it alone still holds.
const devotionalIds = new Set(devotionalWorks.map((w) => w.id));
const catalogue = [
  ...devotionalWorks,
  ...works.filter((w) => !w.id || !devotionalIds.has(w.id)),
];

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
        {catalogue.map((w) => (
          <li key={w.id}>
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
