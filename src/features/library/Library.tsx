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
  type: { ta: string; en: string; te: string; ml: string; kn: string; hi: string };
  missing?: boolean;
}

const typeLabel: Record<LibraryRef['type'], ResolvedItem['type']> = {
  temple: { ta: 'கோயில்', en: 'Temple', te: 'దేవాలయం', ml: 'ക്ഷേത്രം', kn: 'ದೇವಾಲಯ', hi: 'मंदिर' },
  thiruppugazh: { ta: 'திருப்புகழ்', en: 'Thiruppugazh', te: 'తిరుప్పుగళ్', ml: 'തിരുപ്പുകഴ്', kn: 'ತಿರುಪ್ಪುಗಳ್', hi: 'तिरुप्पुग़ल' },
  work: { ta: 'நூல்', en: 'Work', te: 'గ్రంథం', ml: 'ഗ്രന്ഥം', kn: 'ಗ್ರಂಥ', hi: 'ग्रंथ' },
  knowledge: { ta: 'அறிவுப் பதிவு', en: 'Knowledge record', te: 'జ్ఞాన నమోదు', ml: 'ജ്ഞാന രേഖ', kn: 'ಜ್ಞಾನ ದಾಖಲೆ', hi: 'ज्ञान अभिलेख' },
  prayer: { ta: 'பிரார்த்தனை', en: 'Prayer', te: 'ప్రార్థన', ml: 'പ്രാർത്ഥന', kn: 'ಪ್ರಾರ್ಥನೆ', hi: 'प्रार्थना' },
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
      {item.titleEn && <small lang="en">{item.titleEn}</small>}
    </>
  );
}

export default function Library() {
  const [state, setState] = useState<LocalLibraryState>(() => readLibrary());
  const [notice, setNotice] = useState('');
  const { locale, uiLocale, text } = useLocale();

  const ui = (
    ta: string,
    en: string,
    te: string,
    ml: string,
    kn: string,
    hi: string,
  ) => text(ta, en, { te, ml, kn, hi });

  useEffect(() => subscribeLibrary(() => setState(readLibrary())), []);

  const saved = useMemo(() => state.saved.map(resolve), [state.saved]);
  const recent = useMemo(() => state.recent.map(resolve), [state.recent]);

  const run = (action: () => boolean, success: [string, string, string, string, string, string]) => {
    if (action()) setNotice(ui(...success));
    else {
      setNotice(
        ui(
          'இந்த உலாவியில் உள்ளூர் சேமிப்பை மாற்ற முடியவில்லை.',
          'Could not change local storage in this browser.',
          'ఈ బ్రౌజర్‌లో స్థానిక నిల్వను మార్చలేకపోయాము.',
          'ഈ ബ്രൗസറിലെ ലോക്കൽ സ്റ്റോറേജ് മാറ്റാനായില്ല.',
          'ಈ ಬ್ರೌಸರ್‌ನ ಸ್ಥಳೀಯ ಸಂಗ್ರಹವನ್ನು ಬದಲಾಯಿಸಲಾಗಲಿಲ್ಲ.',
          'इस ब्राउज़र में स्थानीय संग्रहण बदला नहीं जा सका।',
        ),
      );
    }
  };

  const itemType = (item: ResolvedItem) =>
    ui(item.type.ta, item.type.en, item.type.te, item.type.ml, item.type.kn, item.type.hi);

  return (
    <article className="page library-page">
      <header className="page-head library-head">
        <p className="hero-eyebrow" lang={uiLocale}>
          {ui('இந்த சாதனத்தில் மட்டும்', 'Only on this device', 'ఈ పరికరంలో మాత్రమే', 'ഈ ഉപകരണത്തിൽ മാത്രം', 'ಈ ಸಾಧನದಲ್ಲೇ ಮಾತ್ರ', 'केवल इस डिवाइस पर')}
        </p>
        <h1 lang={uiLocale}>
          {ui('என் சேமிப்புகள்', 'My Library', 'నా గ్రంథాలయం', 'എന്റെ ലൈബ്രറി', 'ನನ್ನ ಗ್ರಂಥಾಲಯ', 'मेरी लाइब्रेरी')}
        </h1>
        <p lang={uiLocale}>
          {ui(
            'நீங்கள் சேமித்த பதிவுகளும் சமீபத்தில் திறந்த பதிவுகளும் இந்த உலாவியின் உள்ளூர் சேமிப்பில் மட்டுமே இருக்கும். கணக்கு, மேக ஒத்திசைவு அல்லது பகுப்பாய்வு இல்லை.',
            "Records you save and records you recently opened live only in this browser's local storage. No account, cloud sync, or analytics.",
            'మీరు సేవ్ చేసిన మరియు ఇటీవల తెరిచిన నమోదులు ఈ బ్రౌజర్ స్థానిక నిల్వలోనే ఉంటాయి. ఖాతా, క్లౌడ్ సమకాలీకరణ లేదా విశ్లేషణలు లేవు.',
            'നിങ്ങൾ സംരക്ഷിച്ചതും അടുത്തിടെ തുറന്നതുമായ രേഖകൾ ഈ ബ്രൗസറിന്റെ ലോക്കൽ സ്റ്റോറേജിൽ മാത്രം നിലനിൽക്കും. അക്കൗണ്ട്, ക്ലൗഡ് സിങ്ക്, അനലിറ്റിക്സ് ഒന്നുമില്ല.',
            'ನೀವು ಉಳಿಸಿದ ಮತ್ತು ಇತ್ತೀಚೆಗೆ ತೆರೆಯಲಾದ ದಾಖಲೆಗಳು ಈ ಬ್ರೌಸರ್‌ನ ಸ್ಥಳೀಯ ಸಂಗ್ರಹದಲ್ಲೇ ಇರುತ್ತವೆ. ಖಾತೆ, ಕ್ಲೌಡ್ ಸಿಂಕ್ ಅಥವಾ ವಿಶ್ಲೇಷಣೆಗಳಿಲ್ಲ.',
            'आपके सहेजे और हाल में खोले गए रिकॉर्ड केवल इस ब्राउज़र के स्थानीय संग्रहण में रहते हैं। कोई खाता, क्लाउड सिंक या एनालिटिक्स नहीं है।',
          )}
        </p>
        <p className="latin-name" lang={uiLocale}>
          {ui('என் சேமிப்புகள் · இந்த உலாவியில் மட்டும்', 'My Library · local to this browser', 'నా గ్రంథాలయం · ఈ బ్రౌజర్‌లో మాత్రమే', 'എന്റെ ലൈബ്രറി · ഈ ബ്രൗസറിൽ മാത്രം', 'ನನ್ನ ಗ್ರಂಥಾಲಯ · ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ', 'मेरी लाइब्रेरी · केवल इस ब्राउज़र में')}
        </p>
      </header>

      <p className="library-privacy" lang={uiLocale}>
        {ui(
          'இந்தத் தரவு சேவையகத்துக்கு அனுப்பப்படாது. கீழே உள்ள கட்டுப்பாடுகள் மூலம் எப்போது வேண்டுமானாலும் நீக்கலாம்.',
          'This data is never sent to a server. You can remove it at any time using the controls below.',
          'ఈ డేటా ఎప్పుడూ సర్వర్‌కు పంపబడదు. క్రింది నియంత్రణలతో ఎప్పుడైనా తొలగించవచ్చు.',
          'ഈ ഡാറ്റ ഒരിക്കലും സർവറിലേക്ക് അയയ്ക്കില്ല. താഴെയുള്ള നിയന്ത്രണങ്ങൾ ഉപയോഗിച്ച് ഏത് സമയത്തും നീക്കം ചെയ്യാം.',
          'ಈ ಡೇಟಾವನ್ನು ಎಂದಿಗೂ ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ. ಕೆಳಗಿನ ನಿಯಂತ್ರಣಗಳಿಂದ ಯಾವಾಗ ಬೇಕಾದರೂ ತೆಗೆದುಹಾಕಬಹುದು.',
          'यह डेटा कभी सर्वर पर नहीं भेजा जाता। नीचे दिए नियंत्रणों से इसे कभी भी हटाया जा सकता है।',
        )}
      </p>

      <section className="library-section" aria-labelledby="saved-h">
        <div className="library-section-head">
          <div>
            <h2 id="saved-h" lang={uiLocale}>
              {ui('சேமிக்கப்பட்டவை', 'Saved', 'సేవ్ చేసినవి', 'സംരക്ഷിച്ചവ', 'ಉಳಿಸಿದವು', 'सहेजे गए')}
            </h2>
            <p lang={uiLocale}>
              {ui(`${saved.length} பதிவு`, `${saved.length} records`, `${saved.length} నమోదులు`, `${saved.length} രേഖകൾ`, `${saved.length} ದಾಖಲೆಗಳು`, `${saved.length} रिकॉर्ड`)}
            </p>
          </div>
          {saved.length > 0 && (
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() =>
                run(clearSaved, [
                  'சேமிக்கப்பட்ட பதிவுகள் நீக்கப்பட்டன.',
                  'Saved records were removed.',
                  'సేవ్ చేసిన నమోదులు తొలగించబడ్డాయి.',
                  'സംരക്ഷിച്ച രേഖകൾ നീക്കം ചെയ്തു.',
                  'ಉಳಿಸಿದ ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
                  'सहेजे गए रिकॉर्ड हटा दिए गए।',
                ])
              }
            >
              <span lang={uiLocale}>
                {ui('அனைத்தையும் நீக்கு', 'Remove all', 'అన్నింటినీ తొలగించు', 'എല്ലാം നീക്കം ചെയ്യുക', 'ಎಲ್ಲವನ್ನೂ ತೆಗೆದುಹಾಕಿ', 'सभी हटाएँ')}
              </span>
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="library-empty">
            <p lang={uiLocale}>
              {ui('இன்னும் எந்தப் பதிவும் சேமிக்கப்படவில்லை.', 'No records have been saved yet.', 'ఇంకా ఏ నమోదు సేవ్ కాలేదు.', 'ഇതുവരെ രേഖകളൊന്നും സംരക്ഷിച്ചിട്ടില്ല.', 'ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆ ಉಳಿಸಲಾಗಿಲ್ಲ.', 'अभी तक कोई रिकॉर्ड सहेजा नहीं गया है।')}
            </p>
            <div className="band-links">
              <Link href="/knowledge" lang={uiLocale}>
                {ui('அறிவுக் களத்தைத் திற', 'Open the Knowledge hub', 'జ్ఞాన కేంద్రాన్ని తెరువు', 'ജ്ഞാനകേന്ദ്രം തുറക്കുക', 'ಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು ತೆರೆಯಿರಿ', 'ज्ञान केंद्र खोलें')}
              </Link>
              <Link href="/temples" lang={uiLocale}>
                {ui('கோயில்களைப் பார்க்க', 'View temples', 'దేవాలయాలను చూడండి', 'ക്ഷേത്രങ്ങൾ കാണുക', 'ದೇವಾಲಯಗಳನ್ನು ನೋಡಿ', 'मंदिर देखें')}
              </Link>
            </div>
          </div>
        ) : (
          <ul className="library-list">
            {saved.map((item) => (
              <li key={item.key} className={item.missing ? 'is-missing' : undefined}>
                <Link href={item.href}>
                  <span className="tag" lang={uiLocale}>{itemType(item)}</span>
                  <ItemTitle item={item} locale={locale} />
                  {item.missing && (
                    <em lang={uiLocale}>
                      {ui('இந்த வெளியீட்டில் பதிவு இல்லை', 'Not in this release', 'ఈ విడుదలలో లేదు', 'ഈ പതിപ്പിൽ ഇല്ല', 'ಈ ಬಿಡುಗಡೆಯಲ್ಲಿ ಇಲ್ಲ', 'इस रिलीज़ में नहीं है')}
                    </em>
                  )}
                </Link>
                <button
                  type="button"
                  className="library-remove"
                  onClick={() =>
                    run(
                      () => unsaveItem({ type: item.key.split(':')[0] as LibraryRef['type'], id: item.key.split(':').slice(1).join(':') }),
                      [
                        'சேமிப்பிலிருந்து நீக்கப்பட்டது.',
                        'Removed from saved.',
                        'సేవ్ చేసిన వాటి నుండి తొలగించబడింది.',
                        'സംരക്ഷിച്ചതിൽ നിന്ന് നീക്കം ചെയ്തു.',
                        'ಉಳಿಸಿದವುಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
                        'सहेजे गए से हटा दिया गया।',
                      ],
                    )
                  }
                >
                  <span lang={uiLocale}>
                    {ui('நீக்கு', 'Remove', 'తొలగించు', 'നീക്കം ചെയ്യുക', 'ತೆಗೆದುಹಾಕಿ', 'हटाएँ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-section" aria-labelledby="recent-h">
        <div className="library-section-head">
          <div>
            <h2 id="recent-h" lang={uiLocale}>
              {ui('சமீபத்தில் பார்த்தவை', 'Recently Viewed', 'ఇటీవల చూసినవి', 'അടുത്തിടെ കണ്ടത്', 'ಇತ್ತೀಚೆಗೆ ವೀಕ್ಷಿಸಿದವು', 'हाल में देखे गए')}
            </h2>
            <p lang={uiLocale}>
              {ui(
                'அதிகபட்சம் 20 பதிவு · தேடல் சொற்கள் சேமிக்கப்படாது',
                'Up to 20 records · search terms are not saved',
                'గరిష్టంగా 20 నమోదులు · శోధన పదాలు సేవ్ చేయబడవు',
                'പരമാവധി 20 രേഖകൾ · തിരച്ചിൽ പദങ്ങൾ സംരക്ഷിക്കില്ല',
                'ಗರಿಷ್ಠ 20 ದಾಖಲೆಗಳು · ಹುಡುಕಾಟ ಪದಗಳನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ',
                'अधिकतम 20 रिकॉर्ड · खोज शब्द सहेजे नहीं जाते',
              )}
            </p>
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() =>
                run(clearRecent, [
                  'சமீபப் பதிவுகள் நீக்கப்பட்டன.',
                  'Recent records were removed.',
                  'ఇటీవలి నమోదులు తొలగించబడ్డాయి.',
                  'അടുത്തകാല രേഖകൾ നീക്കം ചെയ്തു.',
                  'ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
                  'हाल के रिकॉर्ड हटा दिए गए।',
                ])
              }
            >
              <span lang={uiLocale}>
                {ui('சமீபத்தை அழி', 'Clear recent', 'ఇటీవలి వాటిని తొలగించు', 'അടുത്തകാല രേഖകൾ മായ്ക്കുക', 'ಇತ್ತೀಚಿನವುಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ', 'हाल का इतिहास साफ़ करें')}
              </span>
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="library-empty" lang={uiLocale}>
            {ui('சமீபப் பதிவுகள் இன்னும் இல்லை.', 'No recent records yet.', 'ఇంకా ఇటీవలి నమోదులు లేవు.', 'ഇതുവരെ അടുത്തകാല രേഖകളില്ല.', 'ಇನ್ನೂ ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳಿಲ್ಲ.', 'अभी हाल के कोई रिकॉर्ड नहीं हैं।')}
          </p>
        ) : (
          <ul className="library-list library-list-recent">
            {recent.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>
                  <span className="tag" lang={uiLocale}>{itemType(item)}</span>
                  <ItemTitle item={item} locale={locale} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="library-danger" aria-labelledby="clear-h">
        <h2 id="clear-h" lang={uiLocale}>
          {ui('உள்ளூர் தரவை அழி', 'Clear Local Data', 'స్థానిక డేటాను తొలగించు', 'ലോക്കൽ ഡാറ്റ മായ്ക്കുക', 'ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸಿ', 'स्थानीय डेटा साफ़ करें')}
        </h2>
        <p lang={uiLocale}>
          {ui(
            'சேமிப்பு மற்றும் சமீபப் பதிவுகள் இரண்டையும் இந்த உலாவியில் இருந்து நீக்கும்.',
            'Removes both saved and recent records from this browser.',
            'ఈ బ్రౌజర్ నుండి సేవ్ చేసిన మరియు ఇటీవలి నమోదుల రెండింటినీ తొలగిస్తుంది.',
            'ഈ ബ്രൗസറിൽ നിന്ന് സംരക്ഷിച്ചവയും അടുത്തകാല രേഖകളും രണ്ടും നീക്കം ചെയ്യും.',
            'ಈ ಬ್ರೌಸರ್‌ನಿಂದ ಉಳಿಸಿದ ಮತ್ತು ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳನ್ನೆರಡನ್ನೂ ತೆಗೆದುಹಾಕುತ್ತದೆ.',
            'इस ब्राउज़र से सहेजे गए और हाल के दोनों रिकॉर्ड हटाता है।',
          )}
        </p>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() =>
            run(clearAllLibraryData, [
              'உள்ளூர் நூலகத் தரவு முழுவதும் நீக்கப்பட்டது.',
              'All local library data was removed.',
              'స్థానిక గ్రంథాలయ డేటా మొత్తం తొలగించబడింది.',
              'എല്ലാ ലോക്കൽ ലൈബ്രറി ഡാറ്റയും നീക്കം ചെയ്തു.',
              'ಎಲ್ಲಾ ಸ್ಥಳೀಯ ಗ್ರಂಥಾಲಯ ಡೇಟಾವನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
              'सारा स्थानीय लाइब्रेरी डेटा हटा दिया गया।',
            ])
          }
        >
          <span lang={uiLocale}>
            {ui('எல்லா உள்ளூர் தரவையும் அழி', 'Clear all local data', 'అన్ని స్థానిక డేటాను తొలగించు', 'എല്ലാ ലോക്കൽ ഡാറ്റയും മായ്ക്കുക', 'ಎಲ್ಲಾ ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸಿ', 'सारा स्थानीय डेटा साफ़ करें')}
          </span>
        </button>
      </section>

      <p className="sr-only" aria-live="polite" lang={uiLocale}>{notice}</p>
    </article>
  );
}
