import { works, devotionalWorks } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import { useLocale } from '@/lib/locale';

const devotionalIds = new Set(devotionalWorks.map((w) => w.id));
const catalogue = [
  ...devotionalWorks,
  ...works.filter((w) => !w.id || !devotionalIds.has(w.id)),
];

const ui = {
  eyebrow: {
    ta: 'ஆளுமை செய்யப்பட்ட பட்டியல்',
    en: 'Governed catalogue',
    te: 'పాలిత జాబితా',
    ml: 'ഭരണവിധേയ പട്ടിക',
    kn: 'ನಿಯಂತ್ರಿತ ಪಟ್ಟಿಗೆ',
    hi: 'शासित सूची',
  },
  title: {
    ta: 'பாடல்களும் நூல்களும்',
    en: 'Songs and Sacred Works',
    te: 'పాటలు మరియు పవిత్ర గ్రంథాలు',
    ml: 'ഗാനങ്ങളും പവിത്ര കൃതികളും',
    kn: 'ಹಾಡುಗಳು ಮತ್ತು ಪವಿತ್ರ ಕೃತಿಗಳು',
    hi: 'गीत और पवित्र कृतियाँ',
  },
  intro: {
    ta: 'முருகன் தொடர்பான பக்தி நூல்கள். ஒவ்வொன்றின் மூலமும் உரிமை நிலையும் கீழே.',
    en: "Devotional works related to Murugan. Each one's source and rights status is shown below.",
    te: 'మురుగన్‌కు సంబంధించిన భక్తి గ్రంథాలు. ప్రతి నమోదుకు మూలం మరియు హక్కుల స్థితి క్రింద చూపబడుతుంది.',
    ml: 'മുരുകനുമായി ബന്ധപ്പെട്ട ഭക്തികൃതികൾ. ഓരോ രേഖയുടെയും ഉറവിടവും അവകാശ നിലയും താഴെ കാണിക്കുന്നു.',
    kn: 'ಮುರುಗನ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ಭಕ್ತಿ ಕೃತಿಗಳು. ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯ ಮೂಲ ಮತ್ತು ಹಕ್ಕುಗಳ ಸ್ಥಿತಿಯನ್ನು ಕೆಳಗೆ ತೋರಿಸಲಾಗಿದೆ.',
    hi: 'मुरुगन से संबंधित भक्ति कृतियाँ। प्रत्येक प्रविष्टि का स्रोत और अधिकार स्थिति नीचे दिखाई गई है।',
  },
  trust: {
    ta: 'ஒரு நூல் பட்டியலில் இருப்பது அதன் முழு உரை வெளியிடப்பட்டுள்ளது என்று பொருளல்ல. இங்கு ஆளுமை செய்யப்பட்ட மெட்டாடேட்டா மற்றும் நிலை மட்டும் காட்டப்படுகிறது.',
    en: 'A work appearing in this catalogue does not mean its full text is published. This view presents governed metadata and publication state only.',
    te: 'ఈ జాబితాలో ఒక కృతి కనిపించడం దాని పూర్తి పాఠ్యం ప్రచురించబడిందని అర్థం కాదు. ఇక్కడ పాలిత మెటాడేటా మరియు ప్రచురణ స్థితి మాత్రమే చూపబడుతుంది.',
    ml: 'ഈ പട്ടികയിൽ ഒരു കൃതി കാണപ്പെടുന്നത് അതിന്റെ പൂർണ്ണപാഠം പ്രസിദ്ധീകരിച്ചുവെന്നർത്ഥമല്ല. ഇവിടെ ഭരണവിധേയ മെറ്റാഡാറ്റയും പ്രസിദ്ധീകരണ നിലയും മാത്രമാണ് കാണിക്കുന്നത്.',
    kn: 'ಈ ಪಟ್ಟಿಯಲ್ಲಿ ಕೃತಿ ಕಾಣಿಸಿಕೊಳ್ಳುವುದರಿಂದ ಅದರ ಪೂರ್ಣ ಪಠ್ಯ ಪ್ರಕಟಿಸಲಾಗಿದೆ ಎಂದರ್ಥವಲ್ಲ. ಇಲ್ಲಿ ನಿಯಂತ್ರಿತ ಮೆಟಾಡೇಟಾ ಮತ್ತು ಪ್ರಕಟಣಾ ಸ್ಥಿತಿಯನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತದೆ.',
    hi: 'इस सूची में किसी कृति का होना यह नहीं दर्शाता कि उसका पूरा पाठ प्रकाशित है। यहाँ केवल शासित मेटाडेटा और प्रकाशन स्थिति दिखाई जाती है।',
  },
  summary: {
    ta: 'நூல் பட்டியல் சுருக்கம்',
    en: 'Works catalogue summary',
    te: 'కృతుల జాబితా సారాంశం',
    ml: 'കൃതികളുടെ പട്ടിക സംഗ്രഹം',
    kn: 'ಕೃತಿಗಳ ಪಟ್ಟಿಯ ಸಾರಾಂಶ',
    hi: 'कृतियों की सूची का सारांश',
  },
  total: {
    ta: 'மொத்த பதிவுகள்',
    en: 'Catalogue records',
    te: 'మొత్తం నమోదులు',
    ml: 'ആകെ രേഖകൾ',
    kn: 'ಒಟ್ಟು ದಾಖಲೆಗಳು',
    hi: 'कुल प्रविष्टियाँ',
  },
  devotional: {
    ta: 'பக்தி நூல் பதிவுகள்',
    en: 'Devotional registry',
    te: 'భక్తి కృతుల నమోదులు',
    ml: 'ഭക്തികൃതി രേഖകൾ',
    kn: 'ಭಕ್ತಿ ಕೃತಿ ದಾಖಲೆಗಳು',
    hi: 'भक्ति कृतियों की प्रविष्टियाँ',
  },
  other: {
    ta: 'பிற ஆளுமைப்பட்ட பதிவுகள்',
    en: 'Other governed records',
    te: 'ఇతర పాలిత నమోదులు',
    ml: 'മറ്റ് ഭരണവിധേയ രേഖകൾ',
    kn: 'ಇತರೆ ನಿಯಂತ್ರಿತ ದಾಖಲೆಗಳು',
    hi: 'अन्य शासित प्रविष्टियाँ',
  },
  sourceState: {
    ta: 'ஆதார நிலை தெளிவாக',
    en: 'Source state, made visible',
    te: 'మూల స్థితి స్పష్టంగా',
    ml: 'ഉറവിട നില വ്യക്തമായി',
    kn: 'ಮೂಲ ಸ್ಥಿತಿ ಸ್ಪಷ್ಟವಾಗಿ',
    hi: 'स्रोत स्थिति स्पष्ट रूप से',
  },
  catalogue: {
    ta: 'நூல் பட்டியல்',
    en: 'Catalogue',
    te: 'కృతుల జాబితా',
    ml: 'കൃതികളുടെ പട്ടിക',
    kn: 'ಕೃತಿಗಳ ಪಟ್ಟಿ',
    hi: 'कृतियों की सूची',
  },
  catalogueHelp: {
    ta: 'ஒவ்வொரு பதிவும் அதன் தற்போதைய உரிமை அல்லது சரிபார்ப்பு நிலையைத் தொடர்ந்து காட்டுகிறது.',
    en: 'Every record continues to expose its current rights or verification state.',
    te: 'ప్రతి నమోదు దాని ప్రస్తుత హక్కుల లేదా ధృవీకరణ స్థితిని స్పష్టంగా చూపిస్తుంది.',
    ml: 'ഓരോ രേഖയും അതിന്റെ നിലവിലെ അവകാശമോ പരിശോധനാ നിലയോ വ്യക്തമായി കാണിക്കുന്നു.',
    kn: 'ಪ್ರತಿ ದಾಖಲೆ ತನ್ನ ಪ್ರಸ್ತುತ ಹಕ್ಕು ಅಥವಾ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸುತ್ತದೆ.',
    hi: 'प्रत्येक प्रविष्टि अपनी वर्तमान अधिकार या सत्यापन स्थिति स्पष्ट रूप से दिखाती है।',
  },
} as const;

/** Devotional works / song corpus. Metadata and rights state only. */
export default function Works() {
  const { locale, uiLocale } = useLocale();
  // Generic interface copy follows the six-language UI selector. Governed work
  // titles continue to use the Tamil/English content fallback via `locale`.
  const t = <K extends keyof typeof ui>(key: K) => ui[key][uiLocale] ?? ui[key].en;
  const otherGovernedCount = Math.max(0, catalogue.length - devotionalWorks.length);

  return (
    <article className="page works-page">
      <header className="page-head works-hero">
        <p className="eyebrow" lang={uiLocale}>{t('eyebrow')}</p>
        <h1 lang={uiLocale}>{t('title')}</h1>
        <p lang={uiLocale}>{t('intro')}</p>
        <p className="works-trust-note" lang={uiLocale}>{t('trust')}</p>
      </header>

      <dl className="works-summary" aria-label={t('summary')}>
        <div>
          <dt lang={uiLocale}>{t('total')}</dt>
          <dd>{catalogue.length}</dd>
        </div>
        <div>
          <dt lang={uiLocale}>{t('devotional')}</dt>
          <dd>{devotionalWorks.length}</dd>
        </div>
        <div>
          <dt lang={uiLocale}>{t('other')}</dt>
          <dd>{otherGovernedCount}</dd>
        </div>
      </dl>

      <section className="works-catalogue" aria-labelledby="works-catalogue-h">
        <header className="works-catalogue-head">
          <p className="eyebrow" lang={uiLocale}>{t('sourceState')}</p>
          <h2 id="works-catalogue-h" lang={uiLocale}>{t('catalogue')}</h2>
          <p lang={uiLocale}>{t('catalogueHelp')}</p>
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
