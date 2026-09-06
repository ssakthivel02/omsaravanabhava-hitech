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

const devotionalIds = new Set(devotionalWorks.map((w) => w.id));
const workCatalogue = [
  ...devotionalWorks,
  ...works.filter((w) => !w.id || !devotionalIds.has(w.id)),
];

export default function Knowledge() {
  return (
    <article className="page knowledge-page">
      <header className="page-head knowledge-head">
        <p className="hero-eyebrow" lang="ta">ஆளுகை செய்யப்பட்ட அறிவு</p>
        <h1 lang="ta">முருகன் அறிவுக் களம்</h1>
        <p lang="ta">
          இந்த வெளியீட்டில் உள்ள ஆளுகை/மூலம்-குறிக்கப்பட்ட பதிவுகளை மட்டுமே இப்பக்கம்
          ஒருங்கிணைக்கிறது. இல்லாத வரலாறு, பொருள் அல்லது பக்திக் கதைகளை இத்தளம்
          உருவாக்காது.
        </p>
        <p className="latin-name">Murugan Knowledge · governed records only</p>
      </header>

      <section className="knowledge-stats" aria-label="தற்போதைய உள்ளடக்க அளவு">
        <div><b>{muruganNames.length}</b><span lang="ta">முருகன் பெயர்கள்</span></div>
        <div><b>{arupadaiVeedu.length}</b><span lang="ta">அறுபடை வீடுகள்</span></div>
        <div><b>{workCatalogue.length}</b><span lang="ta">நூல் பதிவுகள்</span></div>
        <div><b>{thiruppugazh.length}</b><span lang="ta">திருப்புகழ் பதிவுகள்</span></div>
      </section>

      <section className="knowledge-section" aria-labelledby="names-h">
        <div className="band-head">
          <h2 id="names-h" lang="ta">திருப்பெயர்கள்</h2>
          <p lang="ta">ஆளுகைப் பதிவில் உள்ள பெயர் மற்றும் பொருள் மட்டுமே கீழே காட்டப்படுகிறது.</p>
        </div>
        <div className="knowledge-grid">
          {muruganNames.map((name, index) => {
            const id = name.id ?? `name-${index + 1}`;
            const sourceState = describeSourceConfidence(name.sources[0]?.confidence);
            return (
              <article className="knowledge-item" id={`name-${id}`} key={id}>
                <div>
                  <h3 lang="ta">{name.nameTa ?? name.nameEn ?? 'பெயர் நிலுவையில்'}</h3>
                  {name.nameEn && <p className="latin-name">{name.nameEn}</p>}
                  {name.meaning ? (
                    <p lang="ta">{name.meaning}</p>
                  ) : (
                    <p className="note" lang="ta">பொருள் பதிவு இந்த வெளியீட்டில் இல்லை.</p>
                  )}
                </div>
                <div className="knowledge-item-foot">
                  <span className={`state state-${sourceState.tone}`}>
                    <span className="state-dot" aria-hidden="true" />
                    <span lang="ta">{sourceState.label}</span>
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
      </section>

      <section className="knowledge-section knowledge-pilgrimage" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang="ta">ஆறு புனிதப் படைவீடுகள்</h2>
          <p lang="ta">பாரம்பரிய யாத்திரை வரிசையில் ஆறு கோயில் அடையாளப் பதிவுகள்.</p>
        </div>
        <ol className="knowledge-abodes">
          {arupadaiVeedu.map((temple) => (
            <li key={temple.id}>
              <span className="knowledge-order">{String(temple.pilgrimageOrder).padStart(2, '0')}</span>
              <Link href={`/temples/${temple.id}`}>
                <b lang="ta">{temple.nameTa ?? temple.nameEn}</b>
                {temple.nameEn && <small>{temple.nameEn}</small>}
              </Link>
            </li>
          ))}
        </ol>
        <Link href="/arupadai-veedu" className="btn btn-quiet">
          <span lang="ta">முழு யாத்திரைப் பாதையைத் திற</span>
        </Link>
      </section>

      <section className="knowledge-section" aria-labelledby="works-h">
        <div className="band-head">
          <h2 id="works-h" lang="ta">பக்தி நூல்கள்</h2>
          <p lang="ta">உரிமை மற்றும் வெளியீட்டு நிலை தனித்தனியாகக் காட்டப்படும் தற்போதைய நூல் பதிவுகள்.</p>
        </div>
        <ul className="knowledge-ledger">
          {workCatalogue.map((work, index) => {
            const id = work.id ?? `work-${index + 1}`;
            const state = 'rightsState' in work
              ? work.rightsState
              : (work.verificationState ?? 'UNKNOWN');
            return (
              <li id={`work-${id}`} key={id}>
                <div>
                  <b lang="ta">{work.titleTa ?? work.titleEn ?? id}</b>
                  {'titleEn' in work && work.titleEn && <small>{work.titleEn}</small>}
                </div>
                <StateBadge state={state} />
                {work.id && (
                  <SaveControl
                    item={{
                      type: 'work',
                      id: work.id,
                      titleTa: work.titleTa,
                      titleEn: 'titleEn' in work ? work.titleEn : null,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
        <Link href="/works" className="btn btn-quiet">
          <span lang="ta">நூல் பட்டியல்</span>
        </Link>
      </section>

      <section className="knowledge-section" aria-labelledby="tp-h">
        <div className="band-head">
          <h2 id="tp-h" lang="ta">திருப்புகழ்</h2>
          <p lang="ta">
            {thiruppugazh.length} பதிவு அடையாளங்கள் உள்ளன. மூலத் தமிழ் உரை கிடைக்காத இடங்களில்
            அது வெளிப்படையாக நிலுவையில் காட்டப்படுகிறது.
          </p>
        </div>
        <Link href="/thiruppugazh" className="btn btn-primary">
          <span lang="ta">திருப்புகழ் பதிவுகளைப் பார்க்க</span>
        </Link>
      </section>

      <section className="knowledge-trust" aria-labelledby="trust-h">
        <h2 id="trust-h" lang="ta">மூலமும் முழுமையும்</h2>
        <p lang="ta">
          இந்த அறிவுக் களம் முழுமையான முருகன் களஞ்சியம் என்று கூறாது. ஒவ்வொரு வெளியீடும்
          கிடைத்துள்ள ஆளுகைப் பதிவுகளால் மட்டுமே கட்டுப்படுத்தப்படுகிறது.
        </p>
        <div className="band-links">
          <Link href="/sources" lang="ta">மூலங்கள்</Link>
          <Link href="/content-completeness" lang="ta">உள்ளடக்க நிலை</Link>
        </div>
      </section>
    </article>
  );
}
