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
import { useLocale, type UiLocale } from '@/lib/locale';

interface ResolvedItem {
  key: string;
  href: string;
  titleTa: string;
  titleEn?: string | null;
  type: { ta: string; en: string };
  missing?: boolean;
}

const typeLabel: Record<LibraryRef['type'], { ta: string; en: string }> = {
  temple: { ta: 'கோயில்', en: 'Temple' },
  thiruppugazh: { ta: 'திருப்புகழ்', en: 'Thiruppugazh' },
  work: { ta: 'நூல்', en: 'Work' },
  knowledge: { ta: 'அறிவுப் பதிவு', en: 'Knowledge record' },
  prayer: { ta: 'பிரார்த்தனை', en: 'Prayer' },
};

function resolve(ref: LibraryRef): ResolvedItem {
  const key = `${ref.type}:${ref.id}`;
  if (ref.type === 'temple') {
    const item = templeById(ref.id);
    return item
      ? { key, href: `/temples/${item.id}`, titleTa: item.nameTa ?? item.nameEn ?? ref.id, titleEn: item.nameEn, type: typeLabel.temple }
      : { key, href: '/temples', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, type: typeLabel.temple, missing: true };
  }
  if (ref.type === 'thiruppugazh') {
    const item = songById(ref.id);
    return item
      ? { key, href: `/thiruppugazh/${item.id}`, titleTa: item.titleTa ?? item.openingWords ?? ref.id, type: typeLabel.thiruppugazh }
      : { key, href: '/thiruppugazh', titleTa: ref.titleTa ?? ref.id, type: typeLabel.thiruppugazh, missing: true };
  }
  if (ref.type === 'work') {
    const devotional = devotionalWorks.find((item) => item.id === ref.id);
    const work = devotional ?? works.find((item) => item.id === ref.id);
    return work
      ? { key, href: `/works#work-${ref.id}`, titleTa: work.titleTa ?? work.titleEn ?? ref.id, titleEn: work.titleEn, type: typeLabel.work }
      : { key, href: '/works', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, type: typeLabel.work, missing: true };
  }
  if (ref.type === 'knowledge') {
    const item = muruganNames.find((name) => name.id === ref.id);
    return item
      ? { key, href: `/knowledge#name-${ref.id}`, titleTa: item.nameTa ?? item.nameEn ?? ref.id, titleEn: item.nameEn, type: typeLabel.knowledge }
      : { key, href: '/knowledge', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, type: typeLabel.knowledge, missing: true };
  }
  if (ref.type === 'prayer') {
    const prayer = kumarastavam.find((item) => item.id === ref.id);
    if (prayer) {
      return {
        key,
        href: '/prayers',
        titleTa: prayer.titleTa ?? ref.titleTa ?? ref.id,
        type: typeLabel.prayer,
      };
    }
  }
  return { key, href: '/prayers', titleTa: ref.titleTa ?? ref.titleEn ?? ref.id, type: typeLabel.prayer, missing: true };
}

function ItemTitle({ item, locale }: { item: ResolvedItem; locale: UiLocale }) {
  const showEnglishFirst = locale === 'en' && Boolean(item.titleEn);
  if (showEnglishFirst) {
    return (
      <>
        <b lang="en">{item.titleEn}</b>
        {item.titleTa && <small lang="ta">{item.titleTa}</small>}
      </>
    );
  }
  return (
    <>
      <b lang="ta">{item.titleTa}</b>
      {item.titleEn && <small>{item.titleEn}</small>}
    </>
  );
}

export default function Library() {
  const [state, setState] = useState<LocalLibraryState>(() => readLibrary());
  const [notice, setNotice] = useState('');
  const { locale, text } = useLocale();

  useEffect(() => subscribeLibrary(() => setState(readLibrary())), []);

  const saved = useMemo(() => state.saved.map(resolve), [state.saved]);
  const recent = useMemo(() => state.recent.map(resolve), [state.recent]);

  const run = (action: () => boolean, successTa: string, successEn: string) => {
    if (action()) setNotice(text(successTa, successEn));
    else setNotice(text('இந்த உலாவியில் உள்ளூர் சேமிப்பை மாற்ற முடியவில்லை.', 'Could not change local storage in this browser.'));
  };

  return (
    <article className="page library-page">
      <header className="page-head library-head">
        <p className="hero-eyebrow" lang={locale}>{text('இந்த சாதனத்தில் மட்டும்', 'Only on this device')}</p>
        <h1 lang={locale}>{text('என் சேமிப்புகள்', 'My Library')}</h1>
        <p lang={locale}>
          {text(
            'நீங்கள் சேமித்த பதிவுகளும் சமீபத்தில் திறந்த பதிவுகளும் இந்த உலாவியின் உள்ளூர் சேமிப்பில் மட்டுமே இருக்கும். கணக்கு, மேக ஒத்திசைவு அல்லது பகுப்பாய்வு இல்லை.',
            'Records you save and records you recently opened live only in this browser\'s local storage. No account, cloud sync, or analytics.',
          )}
        </p>
        <p className="latin-name" lang="en">My Library · local to this browser</p>
      </header>

      <p className="library-privacy" lang={locale}>
        {text(
          'இந்தத் தரவு சேவையகத்துக்கு அனுப்பப்படாது. கீழே உள்ள கட்டுப்பாடுகள் மூலம் எப்போது வேண்டுமானாலும் நீக்கலாம்.',
          'This data is never sent to a server. You can remove it at any time using the controls below.',
        )}
      </p>

      <section className="library-section" aria-labelledby="saved-h">
        <div className="library-section-head">
          <div>
            <h2 id="saved-h" lang={locale}>{text('சேமிக்கப்பட்டவை', 'Saved')}</h2>
            <p lang={locale}>{text(`${saved.length} பதிவு`, `${saved.length} records`)}</p>
          </div>
          {saved.length > 0 && (
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => run(clearSaved, 'சேமிக்கப்பட்ட பதிவுகள் நீக்கப்பட்டன.', 'Saved records were removed.')}
            >
              <span lang={locale}>{text('அனைத்தையும் நீக்கு', 'Remove all')}</span>
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="library-empty">
            <p lang={locale}>{text('இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை.', 'No records have been saved yet.')}</p>
            <div className="band-links">
              <Link href="/knowledge" lang={locale}>{text('அறிவுக் களத்தைத் திற', 'Open the Knowledge hub')}</Link>
              <Link href="/temples" lang={locale}>{text('கோயில்களைப் பார்க்க', 'View temples')}</Link>
            </div>
          </div>
        ) : (
          <ul className="library-list">
            {saved.map((item) => (
              <li key={item.key} className={item.missing ? 'is-missing' : undefined}>
                <Link href={item.href}>
                  <span className="tag" lang={locale}>{text(item.type.ta, item.type.en)}</span>
                  <ItemTitle item={item} locale={locale} />
                  {item.missing && <em lang={locale}>{text('இந்த வெளியீட்டில் பதிவு இல்லை', 'Not in this release')}</em>}
                </Link>
                <button
                  type="button"
                  className="library-remove"
                  onClick={() =>
                    run(
                      () => unsaveItem({ type: item.key.split(':')[0] as LibraryRef['type'], id: item.key.split(':').slice(1).join(':') }),
                      'சேமிப்பிலிருந்து நீக்கப்பட்டது.',
                      'Removed from saved.',
                    )
                  }
                >
                  <span lang={locale}>{text('நீக்கு', 'Remove')}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-section" aria-labelledby="recent-h">
        <div className="library-section-head">
          <div>
            <h2 id="recent-h" lang={locale}>{text('சமீபத்தில் பார்த்தவை', 'Recently Viewed')}</h2>
            <p lang={locale}>{text('அதிகபட்சம் 20 பதிவு · தேடல் சொற்கள் சேமிக்கப்படாது', 'Up to 20 records · search terms are not saved')}</p>
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => run(clearRecent, 'சமீபப் பதிவுகள் நீக்கப்பட்டன.', 'Recent records were removed.')}
            >
              <span lang={locale}>{text('சமீபத்தை அழி', 'Clear recent')}</span>
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="library-empty" lang={locale}>{text('சமீபப் பதிவுகள் இன்னும் இல்லை.', 'No recent records yet.')}</p>
        ) : (
          <ul className="library-list library-list-recent">
            {recent.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>
                  <span className="tag" lang={locale}>{text(item.type.ta, item.type.en)}</span>
                  <ItemTitle item={item} locale={locale} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-danger" aria-labelledby="clear-h">
        <h2 id="clear-h" lang={locale}>{text('உள்ளூர் தரவை அழி', 'Clear Local Data')}</h2>
        <p lang={locale}>{text('சேமிப்பு மற்றும் சமீபப் பதிவுகள் இரண்டையும் இந்த உலாவியில் இருந்து நீக்கும்.', 'Removes both saved and recent records from this browser.')}</p>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => run(clearAllLibraryData, 'உள்ளூர் நூலகத் தரவு முழுவதும் நீக்கப்பட்டது.', 'All local library data was removed.')}
        >
          <span lang={locale}>{text('எல்லா உள்ளூர் தரவையும் அழி', 'Clear all local data')}</span>
        </button>
      </section>

      <p className="sr-only" aria-live="polite" lang={locale}>{notice}</p>
    </article>
  );
}
