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
  const otherGovernedCount = Math.max(0, catalogue.length - devotionalWorks.length);

  return (
    <article className="page works-page">
      <header className="page-head works-hero">
        <p className="eyebrow" lang={locale}>{text('ஆளுமை செய்யப்பட்ட பட்டியல்', 'Governed catalogue')}</p>
        <h1 lang={locale}>{text('பாடல்களும் நூல்களும்', 'Songs and Sacred Works')}</h1>
        <p lang={locale}>
          {text(
            'முருகன் தொடர்பான பக்தி நூல்கள். ஒவ்வொன்றின் மூலமும் உரிமை நிலையும் கீழே.',
            "Devotional works related to Murugan. Each one's source and rights status is shown below.",
          )}
        </p>
        <p className="works-trust-note" lang={locale}>
          {text(
            'ஒரு நூல் பட்டியலில் இருப்பது அதன் முழு உரை வெளியிடப்பட்டுள்ளது என்று பொருளல்ல. இங்கு ஆளுமை செய்யப்பட்ட மெட்டாடேட்டா மற்றும் நிலை மட்டும் காட்டப்படுகிறது.',
            'A work appearing in this catalogue does not mean its full text is published. This view presents governed metadata and publication state only.',
          )}
        </p>
      </header>

      <dl className="works-summary" aria-label={text('நூல் பட்டியல் சுருக்கம்', 'Works catalogue summary')}>
        <div>
          <dt lang={locale}>{text('மொத்த பதிவுகள்', 'Catalogue records')}</dt>
          <dd>{catalogue.length}</dd>
        </div>
        <div>
          <dt lang={locale}>{text('பக்தி நூல் பதிவுகள்', 'Devotional registry')}</dt>
          <dd>{devotionalWorks.length}</dd>
        </div>
        <div>
          <dt lang={locale}>{text('பிற ஆளுமைப்பட்ட பதிவுகள்', 'Other governed records')}</dt>
          <dd>{otherGovernedCount}</dd>
        </div>
      </dl>

      <section className="works-catalogue" aria-labelledby="works-catalogue-h">
        <header className="works-catalogue-head">
          <p className="eyebrow" lang={locale}>{text('ஆதார நிலை தெளிவாக', 'Source state, made visible')}</p>
          <h2 id="works-catalogue-h" lang={locale}>{text('நூல் பட்டியல்', 'Catalogue')}</h2>
          <p lang={locale}>
            {text(
              'ஒவ்வொரு பதிவும் அதன் தற்போதைய உரிமை அல்லது சரிபார்ப்பு நிலையைத் தொடர்ந்து காட்டுகிறது.',
              'Every record continues to expose its current rights or verification state.',
            )}
          </p>
        </header>

        <ol className="temple-list works-list">
          {catalogue.map((w, index) => {
            const id = w.id ?? `work-${index + 1}`;
            const titleEn = w.titleEn;
            // titleEn is governed content, not a translation this UI invents —
            // it may lead in English mode when the registry actually has it.
            const showEnglishFirst = locale === 'en' && Boolean(titleEn);
            return (
              <li key={id} id={w.id ? `work-${w.id}` : undefined} className="works-entry">
                <div className="work-row works-entry-row">
                  <span className="works-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="works-entry-copy">
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
                  </div>
                  <div className="works-entry-actions">
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
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </article>
  );
}
