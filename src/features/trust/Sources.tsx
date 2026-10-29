import { sourceLedger, works } from '@/content';
import { useLocale } from '@/lib/locale';
import './trust-r213.css';

export default function Sources() {
  const { uiLocale, text } = useLocale();
  const linkedSources = sourceLedger.filter((source) => Boolean(source.url)).length;

  const ui = (
    ta: string,
    en: string,
    te: string,
    ml: string,
    kn: string,
    hi: string,
  ) => text(ta, en, { te, ml, kn, hi });

  return (
    <article className="page trust-page sources-page">
      <header className="page-head trust-hero">
        <div className="trust-hero-copy">
          <p className="trust-eyebrow" lang={uiLocale}>
            {ui(
              'ஆதார வெளிப்படைத்தன்மை',
              'Source transparency',
              'మూల పారదర్శకత',
              'ഉറവിട സുതാര്യത',
              'ಮೂಲ ಪಾರದರ್ಶಕತೆ',
              'स्रोत पारदर्शिता',
            )}
          </p>
          <h1 lang={uiLocale}>
            {ui(
              'மூலங்களும் முறையும்',
              'Sources and Method',
              'మూలాలు మరియు విధానం',
              'ഉറവിടങ്ങളും രീതിയും',
              'ಮೂಲಗಳು ಮತ್ತು ವಿಧಾನ',
              'स्रोत और पद्धति',
            )}
          </h1>
          <p lang={uiLocale}>
            {ui(
              'ஒவ்வொரு பதிவும் அறியப்பட்ட மூலத்திலிருந்து வருகிறது. மூலம் இல்லாத தகவலை இத்தளம் வெளியிடாது.',
              'Every record traces to a known source. This site does not publish information that has no source.',
              'ప్రతి రికార్డు తెలిసిన మూలానికి అనుసంధానించబడుతుంది. మూలం లేని సమాచారాన్ని ఈ సైట్ ప్రచురించదు.',
              'ഓരോ രേഖയും അറിയപ്പെട്ട ഒരു ഉറവിടത്തിലേക്ക് പിന്തുടരാനാകും. ഉറവിടമില്ലാത്ത വിവരങ്ങൾ ഈ സൈറ്റ് പ്രസിദ്ധീകരിക്കില്ല.',
              'ಪ್ರತಿ ದಾಖಲೆಯೂ ತಿಳಿದಿರುವ ಮೂಲಕ್ಕೆ ಹಿಂತಿರುಗಿ ಪತ್ತೆಹಚ್ಚಬಹುದು. ಮೂಲವಿಲ್ಲದ ಮಾಹಿತಿಯನ್ನು ಈ ತಾಣ ಪ್ರಕಟಿಸುವುದಿಲ್ಲ.',
              'हर अभिलेख किसी ज्ञात स्रोत तक पता लगाया जा सकता है। बिना स्रोत वाली जानकारी यह साइट प्रकाशित नहीं करती।',
            )}
          </p>
        </div>

        <dl
          className="trust-summary"
          aria-label={ui(
            'மூலச் சுருக்கம்',
            'Source summary',
            'మూలాల సారాంశం',
            'ഉറവിട സംഗ്രഹം',
            'ಮೂಲ ಸಾರಾಂಶ',
            'स्रोत सारांश',
          )}
        >
          <div>
            <dt lang={uiLocale}>{ui('நூல்கள்', 'Works', 'గ్రంథాలు', 'കൃതികൾ', 'ಕೃತಿಗಳು', 'ग्रंथ')}</dt>
            <dd>{works.length}</dd>
          </div>
          <div>
            <dt lang={uiLocale}>
              {ui(
                'மூலப் பதிவுகள்',
                'Source records',
                'మూల రికార్డులు',
                'ഉറവിട രേഖകൾ',
                'ಮೂಲ ದಾಖಲೆಗಳು',
                'स्रोत अभिलेख',
              )}
            </dt>
            <dd>{sourceLedger.length}</dd>
          </div>
          <div>
            <dt lang={uiLocale}>
              {ui(
                'இணைக்கப்பட்ட மூலங்கள்',
                'Linked sources',
                'లింక్ చేసిన మూలాలు',
                'ലിങ്ക് ചെയ്ത ഉറവിടങ്ങൾ',
                'ಲಿಂಕ್ ಮಾಡಿದ ಮೂಲಗಳು',
                'लिंक किए गए स्रोत',
              )}
            </dt>
            <dd>{linkedSources}</dd>
          </div>
        </dl>
      </header>

      <section className="trust-section" aria-labelledby="method-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={uiLocale}>
            {ui(
              'வெளியீட்டு ஒழுங்கு',
              'Publication discipline',
              'ప్రచురణ క్రమశిక్షణ',
              'പ്രസിദ്ധീകരണ ശാസനം',
              'ಪ್ರಕಟಣೆ ಶಿಸ್ತು',
              'प्रकाशन अनुशासन',
            )}
          </p>
          <h2 id="method-h" lang={uiLocale}>
            {ui('முறை', 'Method', 'విధానం', 'രീതി', 'ವಿಧಾನ', 'पद्धति')}
          </h2>
        </div>
        <ul className="trust-principles" lang={uiLocale}>
          <li>
            {ui(
              'மூலத் தமிழ் உரை மாற்றப்படுவதில்லை.',
              'The canonical Tamil text is never altered.',
              'ప్రామాణిక తమిళ మూలపాఠం ఎప్పుడూ మార్చబడదు.',
              'പ്രാമാണിക തമിഴ് മൂലപാഠം ഒരിക്കലും മാറ്റില്ല.',
              'ಪ್ರಾಮಾಣಿಕ ತಮಿಳು ಮೂಲಪಠ್ಯವನ್ನು ಎಂದಿಗೂ ಬದಲಿಸಲಾಗುವುದಿಲ್ಲ.',
              'प्रामाणिक तमिल मूल पाठ कभी बदला नहीं जाता।',
            )}
          </li>
          <li>
            {ui(
              'மூல உரை, எளிய தமிழ், ஒலிபெயர்ப்பு, பொருள் — தனித்தனி அடுக்குகள்.',
              'Source text, easy-reading Tamil, transliteration, meaning — kept as separate layers.',
              'మూలపాఠం, సులభంగా చదివే తమిళం, లిప్యంతరీకరణ, అర్థం — వేర్వేరు పొరలుగా ఉంచబడతాయి.',
              'മൂലപാഠം, എളുപ്പവായന തമിഴ്, ലിപ്യന്തരണം, അർത്ഥം — വേർതിരിച്ച പാളികളായി സൂക്ഷിക്കുന്നു.',
              'ಮೂಲಪಠ್ಯ, ಸುಲಭ ಓದಿನ ತಮಿಳು, ಲಿಪ್ಯಂತರ, ಅರ್ಥ — ಪ್ರತ್ಯೇಕ ಪದರಗಳಾಗಿ ಇಡಲಾಗುತ್ತದೆ.',
              'मूल पाठ, सरल-पठन तमिल, लिप्यंतरण और अर्थ — अलग-अलग परतों में रखे जाते हैं।',
            )}
          </li>
          <li>
            {ui(
              'சரிபார்க்கப்படாத நிலை மறைக்கப்படுவதில்லை.',
              'An unverified state is never hidden.',
              'ధృవీకరించని స్థితిని ఎప్పుడూ దాచరు.',
              'സ്ഥിരീകരിക്കാത്ത അവസ്ഥ ഒരിക്കലും മറയ്ക്കില്ല.',
              'ಪರಿಶೀಲಿಸದ ಸ್ಥಿತಿಯನ್ನು ಎಂದಿಗೂ ಮರೆಮಾಡುವುದಿಲ್ಲ.',
              'असत्यापित स्थिति कभी छिपाई नहीं जाती।',
            )}
          </li>
          <li>
            {ui(
              'கோயில் நன்கொடைகளை இத்தளம் பெறுவதில்லை.',
              'This site does not receive temple donations.',
              'ఈ సైట్ ఆలయ విరాళాలను స్వీకరించదు.',
              'ഈ സൈറ്റ് ക്ഷേത്ര സംഭാവനകൾ സ്വീകരിക്കുന്നില്ല.',
              'ಈ ತಾಣ ದೇವಾಲಯದ ದೇಣಿಗೆಗಳನ್ನು ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ.',
              'यह साइट मंदिर दान स्वीकार नहीं करती।',
            )}
          </li>
        </ul>
      </section>

      <section className="trust-section" aria-labelledby="works-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={uiLocale}>
            {ui(
              'ஆதார அடுக்கு',
              'Reference layer',
              'సూచన పొర',
              'റഫറൻസ് പാളി',
              'ಉಲ್ಲೇಖ ಪದರ',
              'संदर्भ परत',
            )}
          </p>
          <h2 id="works-h" lang={uiLocale}>
            {ui('நூல்கள்', 'Works', 'గ్రంథాలు', 'കൃതികൾ', 'ಕೃತಿಗಳು', 'ग्रंथ')}
          </h2>
        </div>
        <ul className="trust-work-grid">
          {works.map((work) => (
            <li key={work.id ?? work.titleEn}>
              {/* Work title and author are canonical/source facts: always Tamil when available. */}
              <strong lang={work.titleTa ? 'ta' : 'en'}>{work.titleTa ?? work.titleEn}</strong>
              {work.author && <span>{work.author}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="trust-section trust-ledger" aria-labelledby="ledger-h">
        <div className="trust-section-head">
          <p className="trust-section-kicker" lang={uiLocale}>
            {ui(
              'திறந்த ஆதாரம்',
              'Traceable references',
              'గుర్తించగల సూచనలు',
              'പിന്തുടരാനാകുന്ന റഫറൻസുകൾ',
              'ಹಾದಿ ಪತ್ತೆಹಚ್ಚಬಹುದಾದ ಉಲ್ಲೇಖಗಳು',
              'पता लगाए जा सकने वाले संदर्भ',
            )}
          </p>
          <h2 id="ledger-h" lang={uiLocale}>
            {ui('மூல ஏடு', 'Source Ledger', 'మూల లెడ్జర్', 'ഉറവിട ലെഡ്ജർ', 'ಮೂಲ ಲೆಡ್ಜರ್', 'स्रोत लेखा')}
          </h2>
          <p lang={uiLocale}>
            {ui(
              'இங்கு காட்டப்படுவது ஏற்கனவே பராமரிக்கப்படும் மூல ஏட்டிலுள்ள குறிப்புகள் மட்டுமே.',
              'This view presents only the references already maintained in the governed source ledger.',
              'ఈ వీక్షణలో ఇప్పటికే పరిపాలిత మూల లెడ్జర్‌లో నిర్వహించబడుతున్న సూచనలనే చూపిస్తుంది.',
              'ഈ കാഴ്ചയിൽ നിയന്ത്രിത ഉറവിട ലെഡ്ജറിൽ ഇതിനകം പരിപാലിക്കുന്ന റഫറൻസുകൾ മാത്രമാണ് കാണിക്കുന്നത്.',
              'ಈ ನೋಟವು ನಿಯಂತ್ರಿತ ಮೂಲ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಈಗಾಗಲೇ ನಿರ್ವಹಿಸಲ್ಪಡುವ ಉಲ್ಲೇಖಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ.',
              'यह दृश्य केवल उन्हीं संदर्भों को दिखाता है जिन्हें नियंत्रित स्रोत लेखा में पहले से बनाए रखा गया है।',
            )}
          </p>
        </div>
        <ol className="trust-ledger-list">
          {sourceLedger.map((source, index) => (
            <li key={`${source.reference ?? source.url ?? 'source'}-${index}`}>
              <span className="trust-ledger-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                {source.url ? (
                  <a href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.reference ?? source.url}
                    <span className="sr-only" lang={uiLocale}>
                      {' '}
                      {ui(
                        '(புதிய தாவலில் திறக்கும்)',
                        '(opens in a new tab)',
                        '(కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది)',
                        '(പുതിയ ടാബിൽ തുറക്കും)',
                        '(ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯುತ್ತದೆ)',
                        '(नए टैब में खुलता है)',
                      )}
                    </span>
                  </a>
                ) : (
                  <span>{source.reference ?? '—'}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
