import { works, devotionalWorks } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import { useLocale } from '@/lib/locale';

const devotionalIds = new Set(devotionalWorks.map((w) => w.id));
const catalogue = [
  ...devotionalWorks,
  ...works.filter((w) => !w.id || !devotionalIds.has(w.id)),
];

/** Devotional works / song corpus. Metadata and rights state only. */
export default function Works() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('பாடல்களும் நூல்களும்', 'Songs and Sacred Works')}</h1>
        <p lang={locale}>
          {text(
            'முருகன் தொடர்பான பக்தி நூல்கள். ஒவ்வொன்றின் மூலமும் உரிமை நிலையும் கீழே.',
            "Devotional works related to Murugan. Each one's source and rights status is shown below.",
          )}
        </p>
      </header>

      <ul className="temple-list">
        {catalogue.map((w, index) => {
          const id = w.id ?? `work-${index + 1}`;
          const titleEn = w.titleEn;
          // titleEn is governed content, not a translation this UI invents —
          // it may lead in English mode when the registry actually has it.
          const showEnglishFirst = locale === 'en' && Boolean(titleEn);
          return (
            <li key={id} id={w.id ? `work-${w.id}` : undefined}>
              <div className="temple-row work-row">
                {showEnglishFirst ? (
                  <>
                    <b lang="en">{titleEn}</b>
                    {w.titleTa && <small lang="ta">{w.titleTa}</small>}
                  </>
                ) : (
                  <>
                    <b lang={w.titleTa ? 'ta' : 'en'}>{w.titleTa ?? titleEn}</b>
                    {titleEn && <small lang="en">{titleEn}</small>}
                  </>
                )}
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
