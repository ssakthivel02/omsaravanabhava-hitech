import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { thiruppugazh } from '@/content';
import {
  THIRUPPUGAZH_CORPUS_PARTS,
  THIRUPPUGAZH_REFERENCE_CORPUS_SIZE,
  corpusPartForSongNumber,
} from '@/content/thiruppugazh-corpus';
import StateBadge from '@/components/StateBadge';
import { useLocale } from '@/lib/locale';

export default function Thiruppugazh() {
  const { locale, text } = useLocale();
  const [query, setQuery] = useState('');
  const [partFilter, setPartFilter] = useState('all');

  const ui = (
    ta: string,
    en: string,
    te: string,
    ml: string,
    kn: string,
    hi: string,
  ) => {
    switch (locale) {
      case 'te': return te;
      case 'ml': return ml;
      case 'kn': return kn;
      case 'hi': return hi;
      default: return text(ta, en);
    }
  };

  const publishedCanonicalTextCount = thiruppugazh.filter(
    (song) => Boolean(song.canonicalText),
  ).length;
  const approvedAudioCount = thiruppugazh.filter(
    (song) => song.audioState && song.audioState !== 'NO_APPROVED_AUDIO',
  ).length;

  const rows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ta');
    return thiruppugazh.filter((song) => {
      const number = song.sourceNumbering?.number;
      const part = typeof number === 'number' ? corpusPartForSongNumber(number) : undefined;
      const matchesPart = partFilter === 'all' || part?.id === partFilter;
      if (!matchesPart) return false;
      if (!normalized) return true;
      const haystack = [
        song.titleTa,
        song.openingWords,
        number?.toString(),
        song.sourceNumbering?.system,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('ta');
      return haystack.includes(normalized);
    });
  }, [partFilter, query]);

  return (
    <article className="page thiruppugazh-page">
      <header className="page-head">
        <h1 lang={locale}>திருப்புகழ் <span className="latin-name" lang="en">· Thiruppugazh</span></h1>
        <p lang={locale}>
          {ui(
            `அருணகிரிநாதர் அருளிய திருப்புகழின் 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} பாடல்கள் கொண்ட மூல-குறிப்பு வரம்பில், தற்போது ${thiruppugazh.length} பதிவுகள் மட்டுமே தனிப்பட்ட மூல இணைப்புடன் சரிபார்க்கப்பட்டுள்ளன.`,
            `Within the 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} source-reference corpus for Arunagirinathar's Thiruppugazh, only ${thiruppugazh.length} records are currently individually source-linked in this application.`,
            `అరుణగిరినాథర్ రచించిన తిరుప్పుగళ్ 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} మూల-సూచన కార్పస్‌లో, ప్రస్తుతం ${thiruppugazh.length} రికార్డులు మాత్రమే ఈ యాప్‌లో వ్యక్తిగత మూలాలతో అనుసంధానించి ధృవీకరించబడ్డాయి.`,
            `അരുണഗിരിനാഥർ രചിച്ച തിരുപ്പുകഴിന്റെ 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} ഉറവിട-റഫറൻസ് കോർപ്പസിൽ, നിലവിൽ ${thiruppugazh.length} രേഖകൾ മാത്രമാണ് ഈ ആപ്പിൽ വ്യക്തിഗത ഉറവിടങ്ങളുമായി ബന്ധിപ്പിച്ച് സ്ഥിരീകരിച്ചിരിക്കുന്നത്.`,
            `ಅರುಣಗಿರಿನಾಥರ್ ರಚಿಸಿದ ತಿರುಪ್ಪುಗ಴್‌ನ 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} ಮೂಲ-ಉಲ್ಲೇಖ ಕಾರ್ಪಸ್‌ನಲ್ಲಿ, ಪ್ರಸ್ತುತ ${thiruppugazh.length} ದಾಖಲೆಗಳು ಮಾತ್ರ ಈ ಆಪ್‌ನಲ್ಲಿ ಪ್ರತ್ಯೇಕ ಮೂಲಗಳಿಗೆ ಸಂಪರ್ಕಿಸಿ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.`,
            `अरुणगिरिनाथर द्वारा रचित तिरुप्पुगऴ के 1–${THIRUPPUGAZH_REFERENCE_CORPUS_SIZE} स्रोत-संदर्भ कॉर्पस में, इस ऐप में अभी केवल ${thiruppugazh.length} अभिलेख व्यक्तिगत स्रोतों से जोड़े और सत्यापित किए गए हैं।`,
          )}
        </p>
      </header>

      <section className="corpus-summary" aria-labelledby="corpus-summary-title">
        <div>
          <p className="eyebrow" id="corpus-summary-title" lang={locale}>
            {ui(
              'வெளியீட்டு உண்மை நிலை',
              'Publication truth',
              'ప్రచురణ వాస్తవ స్థితి',
              'പ്രസിദ്ധീകരണ യാഥാർത്ഥ്യസ്ഥിതി',
              'ಪ್ರಕಟಣೆ ಯಥಾರ್ಥ ಸ್ಥಿತಿ',
              'प्रकाशन की वास्तविक स्थिति',
            )}
          </p>
          <p lang={locale}>
            {ui(
              'முழு 1,326 பாடல்களும் இத்தளத்தில் வெளியிடப்பட்டதாக இந்த எண் பொருளல்ல. உரிமை மற்றும் பதிப்பு சரிபார்ப்பு முடிந்த பதிவுகள் மட்டுமே திறக்கப்படும்.',
              'The 1,326 reference count does not mean all song texts are published here. Only records that pass source and publication checks are opened as catalogue entries.',
              '1,326 అనే సూచన సంఖ్య అన్ని పాటల పాఠాలు ఇక్కడ ప్రచురించబడ్డాయని అర్థం కాదు. మూలం మరియు ప్రచురణ తనిఖీలు పూర్తి చేసిన రికార్డులనే కాటలాగ్‌లో తెరవబడతాయి.',
              '1,326 എന്ന റഫറൻസ് എണ്ണം എല്ലാ ഗാനരചനകളും ഇവിടെ പ്രസിദ്ധീകരിച്ചിട്ടുണ്ടെന്നർത്ഥമല്ല. ഉറവിടവും പ്രസിദ്ധീകരണവും പരിശോധിച്ച രേഖകൾ മാത്രമാണ് കാറ്റലോഗ് എൻട്രികളായി തുറക്കുന്നത്.',
              '1,326 ಎಂಬ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಎಲ್ಲಾ ಹಾಡುಗಳ ಪಠ್ಯವೂ ಇಲ್ಲಿ ಪ್ರಕಟವಾಗಿದೆ ಎಂದರ್ಥವಲ್ಲ. ಮೂಲ ಮತ್ತು ಪ್ರಕಟಣೆ ಪರಿಶೀಲನೆ ಪೂರೈಸಿದ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ಕ್ಯಾಟಲಾಗ್ ನಮೂದುಗಳಾಗಿ ತೆರೆಯಲಾಗುತ್ತದೆ.',
              '1,326 की संदर्भ संख्या का अर्थ यह नहीं है कि सभी गीत-पाठ यहाँ प्रकाशित हैं। केवल वे अभिलेख कैटलॉग प्रविष्टि के रूप में खुलते हैं जो स्रोत और प्रकाशन जाँच पूरी करते हैं।',
            )}
          </p>
        </div>
        <dl className="corpus-counts">
          <div><dt lang={locale}>{ui('மூல இணைப்புள்ள பதிவுகள்', 'Source-linked records', 'మూలంతో అనుసంధానమైన రికార్డులు', 'ഉറവിടവുമായി ബന്ധിപ്പിച്ച രേഖകൾ', 'ಮೂಲಕ್ಕೆ ಸಂಪರ್ಕಿಸಿದ ದಾಖಲೆಗಳು', 'स्रोत से जुड़े अभिलेख')}</dt><dd>{thiruppugazh.length}</dd></div>
          <div><dt lang={locale}>{ui('குறிப்பு பாடல் வரம்பு', 'Reference corpus', 'సూచన కార్పస్', 'റഫറൻസ് കോർപ്പസ്', 'ಉಲ್ಲೇಖ ಕಾರ್ಪಸ್', 'संदर्भ कॉर्पस')}</dt><dd>{THIRUPPUGAZH_REFERENCE_CORPUS_SIZE}</dd></div>
          <div><dt lang={locale}>{ui('முழு மூல உரை வெளியீடு', 'Canonical texts published', 'ప్రామాణిక పాఠాలు ప్రచురించబడ్డవి', 'കാനോനിക്കൽ പാഠങ്ങൾ പ്രസിദ്ധീകരിച്ചത്', 'ಕ್ಯಾನಾನಿಕಲ್ ಪಠ್ಯಗಳು ಪ್ರಕಟಿತ', 'प्रामाणिक पाठ प्रकाशित')}</dt><dd>{publishedCanonicalTextCount}</dd></div>
          <div><dt lang={locale}>{ui('அங்கீகரிக்கப்பட்ட ஒலி', 'Approved audio', 'ఆమోదిత ఆడియో', 'അംഗീകരിച്ച ഓഡിയോ', 'ಅನುಮೋದಿತ ಆಡಿಯೋ', 'स्वीकृत ऑडियो')}</dt><dd>{approvedAudioCount}</dd></div>
        </dl>
      </section>

      <section className="corpus-parts" aria-labelledby="corpus-parts-title">
        <div className="section-heading">
          <h2 id="corpus-parts-title" lang={locale}>{ui('மூலப் பகுதி வரைபடம்', 'Source-part map', 'మూల భాగాల మ్యాప్', 'ഉറവിട ഭാഗങ്ങളുടെ മാപ്പ്', 'ಮೂಲ ಭಾಗಗಳ ನಕ್ಷೆ', 'स्रोत-भाग मानचित्र')}</h2>
          <p lang={locale}>{ui('நான்கு Project Madurai பகுதிகளும் தற்போது குறிப்பு மற்றும் ஒப்பீட்டு பயன்பாட்டிற்கே.', 'All four Project Madurai parts are currently reference-only for source comparison and coverage.', 'నాలుగు Project Madurai భాగాలు ప్రస్తుతం మూలాల పోలిక మరియు కవరేజ్ కోసం సూచన ప్రయోజనాలకే ఉపయోగించబడుతున్నాయి.', 'നാല് Project Madurai ഭാഗങ്ങളും നിലവിൽ ഉറവിട താരതമ്യത്തിനും കവറേജ് പരിശോധനയ്ക്കുമുള്ള റഫറൻസായി മാത്രമാണ് ഉപയോഗിക്കുന്നത്.', 'ನಾಲ್ಕು Project Madurai ಭಾಗಗಳೂ ಪ್ರಸ್ತುತ ಮೂಲ ಹೋಲಿಕೆ ಮತ್ತು ವ್ಯಾಪ್ತಿ ಪರಿಶೀಲನೆಗಾಗಿ ಉಲ್ಲೇಖ ಉದ್ದೇಶಕ್ಕಷ್ಟೇ ಬಳಸಲಾಗುತ್ತಿವೆ.', 'चारों Project Madurai भाग अभी स्रोत तुलना और कवरेज जाँच के लिए केवल संदर्भ के रूप में उपयोग किए जा रहे हैं।')}</p>
        </div>
        <div className="corpus-part-grid">
          {THIRUPPUGAZH_CORPUS_PARTS.map((part) => {
            const linked = thiruppugazh.filter((song) => {
              const number = song.sourceNumbering?.number;
              return typeof number === 'number' && number >= part.start && number <= part.end;
            }).length;
            return (
              <article className="corpus-part" key={part.id}>
                <b>{part.label}</b>
                <span>{part.start}–{part.end}</span>
                <small lang={locale}>{ui(`${linked} பதிவுகள் இணைக்கப்பட்டுள்ளன`, `${linked} records linked`, `${linked} రికార్డులు అనుసంధానించబడ్డాయి`, `${linked} രേഖകൾ ബന്ധിപ്പിച്ചിട്ടുണ്ട്`, `${linked} ದಾಖಲೆಗಳು ಸಂಪರ್ಕಿಸಲ್ಪಟ್ಟಿವೆ`, `${linked} अभिलेख जुड़े हैं`)}</small>
                <a href={part.sourceUrl} target="_blank" rel="noreferrer" lang={locale}>
                  {ui('மூலத்தை காண்க', 'View source', 'మూలాన్ని చూడండి', 'ഉറവിടം കാണുക', 'ಮೂಲವನ್ನು ನೋಡಿ', 'स्रोत देखें')}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="catalog-controls" aria-labelledby="catalog-title">
        <div className="section-heading">
          <h2 id="catalog-title" lang={locale}>{ui('சரிபார்க்கப்பட்ட பட்டியல்', 'Verified catalogue', 'ధృవీకరించిన కాటలాగ్', 'സ്ഥിരീകരിച്ച കാറ്റലോഗ്', 'ಪರಿಶೀಲಿತ ಕ್ಯಾಟಲಾಗ್', 'सत्यापित कैटलॉग')}</h2>
          <p lang={locale}>{ui('தமிழ் தொடக்கச் சொல் அல்லது பாடல் எண்ணால் தேடலாம்.', 'Search by Tamil opening words or source song number.', 'తమిళ ప్రారంభ పదాలు లేదా మూల పాట సంఖ్యతో వెతకండి.', 'തമിഴ് ആരംഭ വാക്കുകളോ ഉറവിട ഗാന നമ്പറോ ഉപയോഗിച്ച് തിരയുക.', 'ತಮಿಳು ಆರಂಭ ಪದಗಳು ಅಥವಾ ಮೂಲ ಹಾಡಿನ ಸಂಖ್ಯೆಯಿಂದ ಹುಡುಕಿ.', 'तमिल आरंभिक शब्दों या स्रोत गीत संख्या से खोजें।')}</p>
        </div>
        <div className="catalog-filter-row">
          <label>
            <span lang={locale}>{ui('திருப்புகழ் தேடல்', 'Search Thiruppugazh', 'తిరుప్పుగళ్‌లో వెతకండి', 'തിരുപ്പുകഴിൽ തിരയുക', 'ತಿರುಪ್ಪುಗ಴್‌ನಲ್ಲಿ ಹುಡುಕಿ', 'तिरुप्पुगऴ खोजें')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ui('உதா: முத்தைத்தரு அல்லது 6', 'e.g. முத்தைத்தரு or 6', 'ఉదా: முத்தைத்தரு లేదా 6', 'ഉദാ: முத்தைத்தரு അല്ലെങ്കിൽ 6', 'ಉದಾ: முத்தைத்தரு ಅಥವಾ 6', 'उदा.: முத்தைத்தரு या 6')}
            />
          </label>
          <label>
            <span lang={locale}>{ui('மூல பகுதி', 'Source part', 'మూల భాగం', 'ഉറവിട ഭാഗം', 'ಮೂಲ ಭಾಗ', 'स्रोत भाग')}</span>
            <select value={partFilter} onChange={(event) => setPartFilter(event.target.value)}>
              <option value="all">{ui('அனைத்து பகுதிகள்', 'All parts', 'అన్ని భాగాలు', 'എല്ലാ ഭാഗങ്ങളും', 'ಎಲ್ಲಾ ಭಾಗಗಳು', 'सभी भाग')}</option>
              {THIRUPPUGAZH_CORPUS_PARTS.map((part) => (
                <option key={part.id} value={part.id}>{part.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="catalog-result-count" aria-live="polite" lang={locale}>
          {ui(`காட்டப்படுவது ${rows.length} / ${thiruppugazh.length}`, `Showing ${rows.length} / ${thiruppugazh.length}`, `${rows.length} / ${thiruppugazh.length} చూపబడుతున్నాయి`, `${rows.length} / ${thiruppugazh.length} കാണിക്കുന്നു`, `${rows.length} / ${thiruppugazh.length} ತೋರಿಸಲಾಗುತ್ತಿದೆ`, `${rows.length} / ${thiruppugazh.length} दिखाए जा रहे हैं`)}
        </p>
      </section>

      {rows.length > 0 ? (
        <ul className="song-list">
          {rows.map((song) => (
            <li key={song.id}>
              <Link href={`/thiruppugazh/${song.id}`} className="song-row">
                <b lang="ta">{song.titleTa ?? song.openingWords}</b>
                <small>
                  {song.sourceNumbering?.system}
                  {song.sourceNumbering?.number ? ` · ${song.sourceNumbering.number}` : ''}
                </small>
                <StateBadge state={song.canonicalTextStatus} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="catalog-empty" role="status" lang={locale}>
          {ui('இந்த வடிகட்டலில் சரிபார்க்கப்பட்ட பதிவு இல்லை. இத்தளம் காணாமல் உள்ள பாடலை உருவாக்காது.', 'No verified record matches this filter. The site will not invent a missing song entry.', 'ఈ ఫిల్టర్‌కు సరిపడే ధృవీకరించిన రికార్డు లేదు. కనిపించని పాట రికార్డును ఈ సైట్ కల్పించదు.', 'ഈ ഫിൽറ്ററുമായി പൊരുത്തപ്പെടുന്ന സ്ഥിരീകരിച്ച രേഖയില്ല. ഇല്ലാത്ത ഗാന എൻട്രി ഈ സൈറ്റ് സൃഷ്ടിക്കില്ല.', 'ಈ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದುವ ಪರಿಶೀಲಿತ ದಾಖಲೆ ಇಲ್ಲ. ಕಾಣೆಯಾದ ಹಾಡಿನ ದಾಖಲೆಯನ್ನು ಈ ತಾಣ ಕಲ್ಪಿಸದು.', 'इस फ़िल्टर से मेल खाने वाला कोई सत्यापित अभिलेख नहीं है। यह साइट किसी अनुपस्थित गीत प्रविष्टि को गढ़ेगी नहीं।')}
        </p>
      )}
    </article>
  );
}
