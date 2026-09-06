import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { devotionalWorks, kumarastavam, muruganNames, songById, works } from '@/content';
import { templeById } from '@/content/temples';
import {
  clearAllLibraryData,
  clearRecent,
  clearSaved,
  readLibrary,
  subscribeLibrary,
  unsaveItem,
  type LibraryRef,
  type LocalLibraryState,
} from '@/lib/localLibrary';

interface ResolvedItem {
  key: string;
  href: string;
  titleTa: string;
  titleEn?: string | null;
  typeTa: string;
  missing?: boolean;
}

const typeLabel: Record<LibraryRef['type'], string> = {
  temple: 'கோயில்',
  thiruppugazh: 'திருப்புகழ்',
  work: 'நூல்',
  knowledge: 'அறிவுப் பதிவு',
  prayer: 'பிரார்த்தனை',
};

function resolve(ref: LibraryRef): ResolvedItem {
  const key = `${ref.type}:${ref.id}`;
  if (ref.type === 'temple') {
    const item = templeById(ref.id);
    return item
      ? { key, href: `/temples/${item.id}`, titleTa: item.nameTa ?? item.nameEn ?? ref.id, titleEn: item.nameEn, typeTa: typeLabel.temple }
      : { key, href: '/temples', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, typeTa: typeLabel.temple, missing: true };
  }
  if (ref.type === 'thiruppugazh') {
    const item = songById(ref.id);
    return item
      ? { key, href: `/thiruppugazh/${item.id}`, titleTa: item.titleTa ?? item.openingWords ?? ref.id, typeTa: typeLabel.thiruppugazh }
      : { key, href: '/thiruppugazh', titleTa: ref.titleTa ?? ref.id, typeTa: typeLabel.thiruppugazh, missing: true };
  }
  if (ref.type === 'work') {
    const devotional = devotionalWorks.find((item) => item.id === ref.id);
    const work = devotional ?? works.find((item) => item.id === ref.id);
    return work
      ? { key, href: `/works#work-${ref.id}`, titleTa: work.titleTa ?? work.titleEn ?? ref.id, titleEn: work.titleEn, typeTa: typeLabel.work }
      : { key, href: '/works', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, typeTa: typeLabel.work, missing: true };
  }
  if (ref.type === 'knowledge') {
    const item = muruganNames.find((name) => name.id === ref.id);
    return item
      ? { key, href: `/knowledge#name-${ref.id}`, titleTa: item.nameTa ?? item.nameEn ?? ref.id, titleEn: item.nameEn, typeTa: typeLabel.knowledge }
      : { key, href: '/knowledge', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, typeTa: typeLabel.knowledge, missing: true };
  }
  if (ref.type === 'prayer') {
    const prayer = kumarastavam.find((item) => item.id === ref.id);
    if (prayer) {
      return {
        key,
        href: '/prayers',
        titleTa: prayer.titleTa ?? ref.titleTa ?? ref.id,
        typeTa: typeLabel.prayer,
      };
    }
  }
  return { key, href: '/prayers', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, typeTa: typeLabel.prayer, missing: true };
}

export default function Library() {
  const [state, setState] = useState<LocalLibraryState>(() => readLibrary());
  const [notice, setNotice] = useState('');

  useEffect(() => subscribeLibrary(() => setState(readLibrary())), []);

  const saved = useMemo(() => state.saved.map(resolve), [state.saved]);
  const recent = useMemo(() => state.recent.map(resolve), [state.recent]);

  const run = (action: () => boolean, success: string) => {
    if (action()) setNotice(success);
    else setNotice('இந்த உலாவியில் உள்ளூர் சேமிப்பை மாற்ற முடியவில்லை.');
  };

  return (
    <article className="page library-page">
      <header className="page-head library-head">
        <p className="hero-eyebrow" lang="ta">இந்த சாதனத்தில் மட்டும்</p>
        <h1 lang="ta">என் சேமிப்புகள்</h1>
        <p lang="ta">
          நீங்கள் சேமித்த பதிவுகளும் சமீபத்தில் திறந்த பதிவுகளும் இந்த உலாவியின் உள்ளூர்
          சேமிப்பில் மட்டுமே இருக்கும். கணக்கு, மேக ஒத்திசைவு அல்லது பகுப்பாய்வு இல்லை.
        </p>
        <p className="latin-name">My Library · local to this browser</p>
      </header>

      <p className="library-privacy" lang="ta">
        இந்தத் தரவு சேவையகத்துக்கு அனுப்பப்படாது. கீழே உள்ள கட்டுப்பாடுகள் மூலம் எப்போது
        வேண்டுமானாலும் நீக்கலாம்.
      </p>

      <section className="library-section" aria-labelledby="saved-h">
        <div className="library-section-head">
          <div>
            <h2 id="saved-h" lang="ta">சேமிக்கப்பட்டவை</h2>
            <p lang="ta">{saved.length} பதிவு</p>
          </div>
          {saved.length > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => run(clearSaved, 'சேமிக்கப்பட்ட பதிவுகள் நீக்கப்பட்டன.')}>
              <span lang="ta">அனைத்தையும் நீக்கு</span>
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="library-empty">
            <p lang="ta">இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை.</p>
            <div className="band-links">
              <Link href="/knowledge" lang="ta">அறிவுக் களத்தைத் திற</Link>
              <Link href="/temples" lang="ta">கோயில்களைப் பார்க்க</Link>
            </div>
          </div>
        ) : (
          <ul className="library-list">
            {saved.map((item) => (
              <li key={item.key} className={item.missing ? 'is-missing' : undefined}>
                <Link href={item.href}>
                  <span className="tag" lang="ta">{item.typeTa}</span>
                  <b lang="ta">{item.titleTa}</b>
                  {item.titleEn && <small>{item.titleEn}</small>}
                  {item.missing && <em lang="ta">இந்த வெளியீட்டில் பதிவு இல்லை</em>}
                </Link>
                <button
                  type="button"
                  className="library-remove"
                  onClick={() => run(() => unsaveItem({ type: item.key.split(':')[0] as LibraryRef['type'], id: item.key.split(':').slice(1).join(':') }), 'சேமிப்பிலிருந்து நீக்கப்பட்டது.')}
                >
                  <span lang="ta">நீக்கு</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-section" aria-labelledby="recent-h">
        <div className="library-section-head">
          <div>
            <h2 id="recent-h" lang="ta">சமீபத்தில் பார்த்தவை</h2>
            <p lang="ta">அதிகபட்சம் 20 பதிவு · தேடல் சொற்கள் சேமிக்கப்படாது</p>
          </div>
          {recent.length > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => run(clearRecent, 'சமீபப் பதிவுகள் நீக்கப்பட்டன.')}>
              <span lang="ta">சமீபத்தை அழி</span>
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="library-empty" lang="ta">சமீபப் பதிவுகள் இன்னும் இல்லை.</p>
        ) : (
          <ul className="library-list library-list-recent">
            {recent.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>
                  <span className="tag" lang="ta">{item.typeTa}</span>
                  <b lang="ta">{item.titleTa}</b>
                  {item.titleEn && <small>{item.titleEn}</small>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-danger" aria-labelledby="clear-h">
        <h2 id="clear-h" lang="ta">உள்ளூர் தரவை அழி</h2>
        <p lang="ta">சேமிப்பு மற்றும் சமீபப் பதிவுகள் இரண்டையும் இந்த உலாவியில் இருந்து நீக்கும்.</p>
        <button type="button" className="btn btn-quiet" onClick={() => run(clearAllLibraryData, 'உள்ளூர் நூலகத் தரவு முழுவதும் நீக்கப்பட்டது.')}>
          <span lang="ta">எல்லா உள்ளூர் தரவையும் அழி</span>
        </button>
      </section>

      <p className="sr-only" aria-live="polite" lang="ta">{notice}</p>
    </article>
  );
}
