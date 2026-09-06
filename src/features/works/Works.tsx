import { works, devotionalWorks } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';

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
        {catalogue.map((w, index) => {
          const id = w.id ?? `work-${index + 1}`;
          const titleEn = w.titleEn;
          return (
            <li key={id} id={w.id ? `work-${w.id}` : undefined}>
              <div className="temple-row work-row">
                <b lang="ta">{w.titleTa ?? titleEn}</b>
                <small>{titleEn}</small>
                <StateBadge
                  state={
                    'rightsState' in w
                      ? w.rightsState
                      : (w.verificationState ?? 'UNKNOWN')
                  }
                />
                {w.id && (
                  <SaveControl
                    item={{
                      type: 'work',
                      id: w.id,
                      titleTa: w.titleTa,
                      titleEn,
                    }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
