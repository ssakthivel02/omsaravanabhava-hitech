import { Link } from 'wouter';
import {
  arupadaiVeedu,
  devotionalWorks,
  muruganNames,
  thiruppugazh,
  works,
  describeSourceConfidence,
} from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import { useLocale } from '@/lib/locale';

const devotionalIds = new Set(devotionalWorks.map((w) => w.id));
const workCatalogue = [
  ...devotionalWorks,
  ...works.filter((w) => !w.id || !devotionalIds.has(w.id)),
];
const publishableNames = muruganNames.filter((name) => Boolean(name.nameTa || name.nameEn));

export default function Knowledge() {
  const { locale, text } = useLocale();

  return (
    <article className="page knowledge-page">
      <header className="page-head knowledge-head">
        <p className="hero-eyebrow" lang={locale}>{text('ஆளுகை செய்யப்பட்ட அறிவு', 'Governed Knowledge')}</p>
        <h1 lang={locale}>{text('முருகன் அறிவுக் களம்', 'Murugan Knowledge Hub')}</h1>
        <p lang={locale}>
          {text(
            'இந்த வெளியீட்டில் உள்ள ஆளுகை/மூலம்-குறிக்கப்பட்ட பதிவுகளை மட்டுமே இப்பக்கம் ஒருங்கிணைக்கிறது. இல்லாத வரலாறு, பொருள் அல்லது பக்திக் கதைகளை இத்தளம் உருவாக்காது.',
            'This page brings together only the governed, source-linked records that exist in this release. This site does not invent history, meaning, or devotional stories that do not exist.',
          )}
        </p>
        <p className="latin-name" lang="en">Murugan Knowledge · governed records only</p>
      </header>

      <section className="knowledge-stats" aria-label={text('தற்போதைய உள்ளடக்க அளவு', 'Current content volume')}>
        <div><b>{publishableNames.length}</b><span lang={locale}>{text('வெளியிடப்பட்ட திருப்பெயர்கள்', 'Published sacred names')}</span></div>
        <div><b>{arupadaiVeedu.length}</b><span lang={locale}>{text('அறுபடை வீடுகள்', 'Six Abodes')}</span></div>
        <div><b>{workCatalogue.length}</b><span lang={locale}>{text('நூல் பதிவுகள்', 'Work records')}</span></div>
        <div><b>{thiruppugazh.length}</b><span lang={locale}>{text('திருப்புகழ் பதிவுகள்', 'Thiruppugazh records')}</span></div>
      </section>

      <section className="knowledge-section" aria-labelledby="names-h">
        <div className="band-head">
          <h2 id="names-h" lang={locale}>{text('திருப்பெயர்கள்', 'Sacred Names')}</h2>
          <p lang={locale}>{text('ஆளுகைப் பதிவில் பெயர் உரை உள்ள பதிவுகள் மட்டுமே வெளியிடப்படுகின்றன.', 'Only records whose governed registry has name text are published.')}</p>
        </div>
        {publishableNames.length === 0 ? (
          <div className="empty" lang={locale}>
            <p>
              {text(
                `இந்த வெளியீட்டில் வெளியிடத்தக்க திருப்பெயர் உரைகள் இன்னும் இல்லை. ${muruganNames.length} பதிவு அடையாளங்கள் உள்ளன; ஆனால் அவற்றின் பெயர், பொருள் மற்றும் மூல விவரங்கள் தற்போதைய ஆளுகைப் பதிவில் நிரப்பப்படவில்லை.`,
                `There are no publishable sacred-name texts in this release yet. ${muruganNames.length} identity records exist, but their name, meaning, and source details have not been filled into the current governed registry.`,
              )}
            </p>
            <p>{text('இல்லாத பெயர் அல்லது பொருளை இத்தளம் அடையாளக் குறியீட்டிலிருந்து ஊகிக்காது.', 'This site does not guess a missing name or meaning from an identity code.')}</p>
          </div>
        ) : (
          <div className="knowledge-grid">
            {publishableNames.map((name, index) => {
              const id = name.id ?? `name-${index + 1}`;
              const sourceState = describeSourceConfidence(name.sources[0]?.confidence, locale);
              const showEnglishFirst = locale === 'en' && Boolean(name.nameEn);
              return (
                <article className="knowledge-item" id={`name-${id}`} key={id}>
                  <div>
                    {showEnglishFirst ? (
                      <>
                        <h3 lang="en">{name.nameEn}</h3>
                        {name.nameTa && <p className="latin-name" lang="ta">{name.nameTa}</p>}
                      </>
                    ) : (
                      <>
                        <h3 lang={name.nameTa ? 'ta' : 'en'}>{name.nameTa ?? name.nameEn}</h3>
                        {name.nameEn && <p className="latin-name" lang="en">{name.nameEn}</p>}
                      </>
                    )}
                    {/* The devotional "meaning" is a governed content layer of
                        its own, distinct from UI chrome — shown as recorded,
                        always Tamil, never machine-translated. */}
                    {name.meaning ? (
                      <p lang="ta">{name.meaning}</p>
                    ) : (
                      <p className="note" lang={locale}>{text('பொருள் பதிவு இந்த வெளியீட்டில் இல்லை.', 'No meaning record exists in this release.')}</p>
                    )}
                  </div>
                  <div className="knowledge-item-foot">
                    <span className={`state state-${sourceState.tone}`}>
                      <span className="state-dot" aria-hidden="true" />
                      <span lang={locale}>{sourceState.label}</span>
                    </span>
                    {name.id && (
                      <SaveControl
                        item={{
                          type: 'knowledge',
                          id: name.id,
                          titleTa: name.nameTa,
                          titleEn: name.nameEn,
                        }}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="knowledge-section knowledge-pilgrimage" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang={locale}>{text('ஆறு புனிதப் படைவீடுகள்', 'The Six Sacred Abodes')}</h2>
          <p lang={locale}>{text('பாரம்பரிய யாத்திரை வரிசையில் ஆறு கோயில் அடையாளப் பதிவுகள்.', 'Six temple identity records in the traditional pilgrimage order.')}</p>
        </div>
        <ol className="knowledge-abodes">
          {arupadaiVeedu.map((temple) => {
            const showEnglishFirst = locale === 'en' && Boolean(temple.nameEn);
            return (
              <li key={temple.id}>
                <span className="knowledge-order">{String(temple.pilgrimageOrder).padStart(2, '0')}</span>
                <Link href={`/temples/${temple.id}`}>
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{temple.nameEn}</b>
                      {temple.nameTa && <small lang="ta">{temple.nameTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={temple.nameTa ? 'ta' : 'en'}>{temple.nameTa ?? temple.nameEn}</b>
                      {temple.nameEn && <small>{temple.nameEn}</small>}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
        <Link href="/arupadai-veedu" className="btn btn-quiet">
          <span lang={locale}>{text('முழு யாத்திரைப் பாதையைத் திற', 'Open the full pilgrimage route')}</span>
        </Link>
      </section>

      <section className="knowledge-section" aria-labelledby="works-h">
        <div className="band-head">
          <h2 id="works-h" lang={locale}>{text('பக்தி நூல்கள்', 'Devotional Works')}</h2>
          <p lang={locale}>{text('உரிமை மற்றும் வெளியீட்டு நிலை தனித்தனியாகக் காட்டப்படும் தற்போதைய நூல் பதிவுகள்.', 'Current work records, with rights and publication state shown separately.')}</p>
        </div>
        <ul className="knowledge-ledger">
          {workCatalogue.map((work, index) => {
            const id = work.id ?? `work-${index + 1}`;
            const state = 'rightsState' in work
              ? work.rightsState
              : (work.verificationState ?? 'UNKNOWN');
            const workTitleEn = 'titleEn' in work ? work.titleEn : null;
            const showEnglishFirst = locale === 'en' && Boolean(workTitleEn);
            return (
              <li id={`work-${id}`} key={id}>
                <div>
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{workTitleEn}</b>
                      {work.titleTa && <small lang="ta">{work.titleTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={work.titleTa ? 'ta' : 'en'}>{work.titleTa ?? workTitleEn ?? id}</b>
                      {workTitleEn && <small>{workTitleEn}</small>}
                    </>
                  )}
                </div>
                <StateBadge state={state} />
                {work.id && (
                  <SaveControl
                    item={{
                      type: 'work',
                      id: work.id,
                      titleTa: work.titleTa,
                      titleEn: workTitleEn,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
        <Link href="/works" className="btn btn-quiet">
          <span lang={locale}>{text('நூல் பட்டியல்', 'Work list')}</span>
        </Link>
      </section>

      <section className="knowledge-section" aria-labelledby="tp-h">
        <div className="band-head">
          <h2 id="tp-h" lang={locale}>{text('திருப்புகழ்', 'Thiruppugazh')}</h2>
          <p lang={locale}>
            {text(
              `${thiruppugazh.length} பதிவு அடையாளங்கள் உள்ளன. மூலத் தமிழ் உரை கிடைக்காத இடங்களில் அது வெளிப்படையாக நிலுவையில் காட்டப்படுகிறது.`,
              `${thiruppugazh.length} identity records exist. Where the canonical Tamil text is not yet available, that is shown as openly pending.`,
            )}
          </p>
        </div>
        <Link href="/thiruppugazh" className="btn btn-primary">
          <span lang={locale}>{text('திருப்புகழ் பதிவுகளைப் பார்க்க', 'View Thiruppugazh records')}</span>
        </Link>
      </section>

      <section className="knowledge-trust" aria-labelledby="trust-h">
        <h2 id="trust-h" lang={locale}>{text('மூலமும் முழுமையும்', 'Source and Completeness')}</h2>
        <p lang={locale}>
          {text(
            'இந்த அறிவுக் களம் முழுமையான முருகன் களஞ்சியம் என்று கூறாது. ஒவ்வொரு வெளியீடும் கிடைத்துள்ள ஆளுகைப் பதிவுகளால் மட்டுமே கட்டுப்படுத்தப்படுகிறது.',
            'This knowledge hub does not claim to be a complete Murugan repository. Every publication is bounded only by the governed records that are actually available.',
          )}
        </p>
        <div className="band-links">
          <Link href="/sources" lang={locale}>{text('மூலங்கள்', 'Sources')}</Link>
          <Link href="/content-completeness" lang={locale}>{text('உள்ளடக்க நிலை', 'Content status')}</Link>
        </div>
      </section>
    </article>
  );
}
