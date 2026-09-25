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
  const { locale, uiLocale, text } = useLocale();

  return (
    <article className="page knowledge-page">
      <header className="page-head knowledge-head">
        <p className="hero-eyebrow" lang={uiLocale}>
          {text('ஆளுகை செய்யப்பட்ட அறிவு', 'Governed Knowledge', {
            te: 'పరిపాలిత జ్ఞానం',
            ml: 'ഭരണത്തിലുള്ള അറിവ്',
            kn: 'ನಿಯಂತ್ರಿತ ಜ್ಞಾನ',
            hi: 'शासित ज्ञान',
          })}
        </p>
        <h1 lang={uiLocale}>
          {text('முருகன் அறிவுக் களம்', 'Murugan Knowledge Hub', {
            te: 'మురుగన్ జ్ఞాన కేంద్రం',
            ml: 'മുരുകൻ വിജ്ഞാനകേന്ദ്രം',
            kn: 'ಮುರುಗನ್ ಜ್ಞಾನ ಕೇಂದ್ರ',
            hi: 'मुरुगन ज्ञान केंद्र',
          })}
        </h1>
        <p lang={uiLocale}>
          {text(
            'இந்த வெளியீட்டில் உள்ள ஆளுகை/மூலம்-குறிக்கப்பட்ட பதிவுகளை மட்டுமே இப்பக்கம் ஒருங்கிணைக்கிறது. இல்லாத வரலாறு, பொருள் அல்லது பக்திக் கதைகளை இத்தளம் உருவாக்காது.',
            'This page brings together only the governed, source-linked records that exist in this release. This site does not invent history, meaning, or devotional stories that do not exist.',
            {
              te: 'ఈ విడుదలలో ఉన్న పరిపాలిత, మూలాలతో అనుసంధానించిన నమోదులను మాత్రమే ఈ పేజీ సమీకరిస్తుంది. లేని చరిత్ర, అర్థం లేదా భక్తి కథలను ఈ సైట్ సృష్టించదు.',
              ml: 'ഈ റിലീസിൽ ലഭ്യമായ ഭരണത്തിലുള്ള, ഉറവിടവുമായി ബന്ധിപ്പിച്ച രേഖകൾ മാത്രമാണ് ഈ പേജ് ഒരുമിപ്പിക്കുന്നത്. ഇല്ലാത്ത ചരിത്രം, അർത്ഥം, ഭക്തികഥകൾ എന്നിവ ഈ സൈറ്റ് സൃഷ്ടിക്കില്ല.',
              kn: 'ಈ ಬಿಡುಗಡೆಯಲ್ಲಿ ಇರುವ ನಿಯಂತ್ರಿತ, ಮೂಲ-ಸಂಪರ್ಕಿತ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ಈ ಪುಟ ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ. ಇಲ್ಲದ ಇತಿಹಾಸ, ಅರ್ಥ ಅಥವಾ ಭಕ್ತಿಕಥೆಗಳನ್ನು ಈ ತಾಣ ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ.',
              hi: 'यह पृष्ठ केवल इस रिलीज़ में मौजूद शासित और स्रोत-संबद्ध अभिलेखों को एक साथ प्रस्तुत करता है। यह साइट अनुपलब्ध इतिहास, अर्थ या भक्ति कथाएँ गढ़ती नहीं है।',
            },
          )}
        </p>
        <p className="latin-name" lang="en">Murugan Knowledge · governed records only</p>
      </header>

      <section
        className="knowledge-stats"
        aria-label={text('தற்போதைய உள்ளடக்க அளவு', 'Current content volume', {
          te: 'ప్రస్తుత కంటెంట్ పరిమాణం',
          ml: 'നിലവിലെ ഉള്ളടക്ക അളവ്',
          kn: 'ಪ್ರಸ್ತುತ ವಿಷಯದ ಪ್ರಮಾಣ',
          hi: 'वर्तमान सामग्री की मात्रा',
        })}
      >
        <div>
          <b>{publishableNames.length}</b>
          <span lang={uiLocale}>
            {text('வெளியிடப்பட்ட திருப்பெயர்கள்', 'Published sacred names', {
              te: 'ప్రచురిత పవిత్ర నామాలు',
              ml: 'പ്രസിദ്ധീകരിച്ച പവിത്ര നാമങ്ങൾ',
              kn: 'ಪ್ರಕಟಿತ ಪವಿತ್ರ ನಾಮಗಳು',
              hi: 'प्रकाशित पवित्र नाम',
            })}
          </span>
        </div>
        <div>
          <b>{arupadaiVeedu.length}</b>
          <span lang={uiLocale}>
            {text('அறுபடை வீடுகள்', 'Six Abodes', {
              te: 'ఆరు పవిత్ర నివాసాలు',
              ml: 'ആറ് പുണ്യസ്ഥാനങ്ങൾ',
              kn: 'ಆರು ಪವಿತ್ರ ಸ್ಥಳಗಳು',
              hi: 'छह पवित्र धाम',
            })}
          </span>
        </div>
        <div>
          <b>{workCatalogue.length}</b>
          <span lang={uiLocale}>
            {text('நூல் பதிவுகள்', 'Work records', {
              te: 'గ్రంథ నమోదులు',
              ml: 'കൃതി രേഖകൾ',
              kn: 'ಕೃತಿ ದಾಖಲೆಗಳು',
              hi: 'ग्रंथ अभिलेख',
            })}
          </span>
        </div>
        <div>
          <b>{thiruppugazh.length}</b>
          <span lang={uiLocale}>
            {text('திருப்புகழ் பதிவுகள்', 'Thiruppugazh records', {
              te: 'తిరుప్పుగళ్ నమోదులు',
              ml: 'തിരുപ്പുകഴ് രേഖകൾ',
              kn: 'ತಿರುಪ್ಪುಗಳ್ ದಾಖಲೆಗಳು',
              hi: 'तिरुप्पुगळ अभिलेख',
            })}
          </span>
        </div>
      </section>

      <section className="knowledge-section" aria-labelledby="names-h">
        <div className="band-head">
          <h2 id="names-h" lang={uiLocale}>
            {text('திருப்பெயர்கள்', 'Sacred Names', {
              te: 'పవిత్ర నామాలు',
              ml: 'പവിത്ര നാമങ്ങൾ',
              kn: 'ಪವಿತ್ರ ನಾಮಗಳು',
              hi: 'पवित्र नाम',
            })}
          </h2>
          <p lang={uiLocale}>
            {text(
              'ஆளுகைப் பதிவில் பெயர் உரை உள்ள பதிவுகள் மட்டுமே வெளியிடப்படுகின்றன.',
              'Only records whose governed registry has name text are published.',
              {
                te: 'పరిపాలిత రిజిస్ట్రీలో పేరు పాఠ్యం ఉన్న నమోదులు మాత్రమే ప్రచురించబడతాయి.',
                ml: 'ഭരണത്തിലുള്ള രജിസ്ട്രിയിൽ പേരിന്റെ പാഠ്യം ഉള്ള രേഖകൾ മാത്രം പ്രസിദ്ധീകരിക്കുന്നു.',
                kn: 'ನಿಯಂತ್ರಿತ ನೋಂದಣಿಯಲ್ಲಿ ಹೆಸರಿನ ಪಠ್ಯವಿರುವ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',
                hi: 'केवल वे अभिलेख प्रकाशित किए जाते हैं जिनकी शासित रजिस्ट्री में नाम का पाठ उपलब्ध है।',
              },
            )}
          </p>
        </div>
        {publishableNames.length === 0 ? (
          <div className="empty" lang={uiLocale}>
            <p>
              {text(
                `இந்த வெளியீட்டில் வெளியிடத்தக்க திருப்பெயர் உரைகள் இன்னும் இல்லை. ${muruganNames.length} பதிவு அடையாளங்கள் உள்ளன; ஆனால் அவற்றின் பெயர், பொருள் மற்றும் மூல விவரங்கள் தற்போதைய ஆளுகைப் பதிவில் நிரப்பப்படவில்லை.`,
                `There are no publishable sacred-name texts in this release yet. ${muruganNames.length} identity records exist, but their name, meaning, and source details have not been filled into the current governed registry.`,
                {
                  te: `ఈ విడుదలలో ప్రచురించదగిన పవిత్ర నామ పాఠ్యాలు ఇంకా లేవు. ${muruganNames.length} గుర్తింపు నమోదులు ఉన్నప్పటికీ, వాటి పేరు, అర్థం మరియు మూల వివరాలు ప్రస్తుత పరిపాలిత రిజిస్ట్రీలో ఇంకా నమోదు కాలేదు.`,
                  ml: `ഈ റിലീസിൽ പ്രസിദ്ധീകരിക്കാവുന്ന പവിത്ര നാമപാഠങ്ങൾ ഇതുവരെ ഇല്ല. ${muruganNames.length} തിരിച്ചറിയൽ രേഖകൾ നിലവിലുണ്ടെങ്കിലും, അവയുടെ പേര്, അർത്ഥം, ഉറവിട വിശദാംശങ്ങൾ നിലവിലെ ഭരണത്തിലുള്ള രജിസ്ട്രിയിൽ ഇതുവരെ ചേർത്തിട്ടില്ല.`,
                  kn: `ಈ ಬಿಡುಗಡೆಯಲ್ಲಿ ಪ್ರಕಟಿಸಬಹುದಾದ ಪವಿತ್ರ ನಾಮಪಠ್ಯಗಳು ಇನ್ನೂ ಇಲ್ಲ. ${muruganNames.length} ಗುರುತು ದಾಖಲೆಗಳಿದ್ದರೂ, ಅವುಗಳ ಹೆಸರು, ಅರ್ಥ ಮತ್ತು ಮೂಲ ವಿವರಗಳು ಪ್ರಸ್ತುತ ನಿಯಂತ್ರಿತ ನೋಂದಣಿಯಲ್ಲಿ ಇನ್ನೂ ತುಂಬಲ್ಪಟ್ಟಿಲ್ಲ.`,
                  hi: `इस रिलीज़ में अभी कोई प्रकाशित किए जा सकने वाले पवित्र नाम-पाठ उपलब्ध नहीं हैं। ${muruganNames.length} पहचान अभिलेख मौजूद हैं, लेकिन उनके नाम, अर्थ और स्रोत विवरण अभी वर्तमान शासित रजिस्ट्री में भरे नहीं गए हैं।`,
                },
              )}
            </p>
            <p>
              {text(
                'இல்லாத பெயர் அல்லது பொருளை இத்தளம் அடையாளக் குறியீட்டிலிருந்து ஊகிக்காது.',
                'This site does not guess a missing name or meaning from an identity code.',
                {
                  te: 'గుర్తింపు కోడ్ ఆధారంగా లేని పేరు లేదా అర్థాన్ని ఈ సైట్ ఊహించదు.',
                  ml: 'ഒരു തിരിച്ചറിയൽ കോഡിൽ നിന്ന് ഇല്ലാത്ത പേര് അല്ലെങ്കിൽ അർത്ഥം ഈ സൈറ്റ് അനുമാനിക്കില്ല.',
                  kn: 'ಗುರುತು ಕೋಡ್‌ನಿಂದ ಇಲ್ಲದ ಹೆಸರು ಅಥವಾ ಅರ್ಥವನ್ನು ಈ ತಾಣ ಊಹಿಸುವುದಿಲ್ಲ.',
                  hi: 'यह साइट पहचान कोड से अनुपलब्ध नाम या अर्थ का अनुमान नहीं लगाती।',
                },
              )}
            </p>
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
                    {name.meaning ? (
                      <p lang="ta">{name.meaning}</p>
                    ) : (
                      <p className="note" lang={uiLocale}>
                        {text('பொருள் பதிவு இந்த வெளியீட்டில் இல்லை.', 'No meaning record exists in this release.', {
                          te: 'ఈ విడుదలలో అర్థం నమోదు లేదు.',
                          ml: 'ഈ റിലീസിൽ അർത്ഥരേഖ ലഭ്യമല്ല.',
                          kn: 'ಈ ಬಿಡುಗಡೆಯಲ್ಲಿ ಅರ್ಥದ ದಾಖಲೆ ಇಲ್ಲ.',
                          hi: 'इस रिलीज़ में अर्थ का अभिलेख उपलब्ध नहीं है।',
                        })}
                      </p>
                    )}
                  </div>
                  <div className="knowledge-item-foot">
                    <span className={`state state-${sourceState.tone}`}>
                      <span className="state-dot" aria-hidden="true" />
                      <span lang={locale}>{sourceState.label}</span>
                    </span>
                    {name.id && (
                      <SaveControl item={{ type: 'knowledge', id: name.id, titleTa: name.nameTa, titleEn: name.nameEn }} />
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
          <h2 id="abodes-h" lang={uiLocale}>
            {text('ஆறு புனிதப் படைவீடுகள்', 'The Six Sacred Abodes', {
              te: 'ఆరు పవిత్ర నిలయాలు',
              ml: 'ആറ് പവിത്ര പടைவീடുകൾ',
              kn: 'ಆರು ಪವಿತ್ರ ಪಡೈವೀಡುಗಳು',
              hi: 'छह पवित्र धाम',
            })}
          </h2>
          <p lang={uiLocale}>
            {text(
              'பாரம்பரிய யாத்திரை வரிசையில் ஆறு கோயில் அடையாளப் பதிவுகள்.',
              'Six temple identity records in the traditional pilgrimage order.',
              {
                te: 'సాంప్రదాయ యాత్ర క్రమంలో ఆరు ఆలయ గుర్తింపు నమోదులు.',
                ml: 'പരമ്പരാഗത തീർത്ഥയാത്രാ ക്രമത്തിലുള്ള ആറ് ക്ഷേത്ര തിരിച്ചറിയൽ രേഖകൾ.',
                kn: 'ಪಾರಂಪರಿಕ ಯಾತ್ರಾ ಕ್ರಮದಲ್ಲಿರುವ ಆರು ದೇವಾಲಯ ಗುರುತು ದಾಖಲೆಗಳು.',
                hi: 'पारंपरिक तीर्थयात्रा क्रम में छह मंदिर पहचान अभिलेख।',
              },
            )}
          </p>
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
          <span lang={uiLocale}>{text('முழு யாத்திரைப் பாதையைத் திற', 'Open the full pilgrimage route', { te: 'పూర్తి యాత్ర మార్గాన్ని తెరవండి', ml: 'പൂർണ്ണ തീർത്ഥയാത്രാ പാത തുറക്കുക', kn: 'ಪೂರ್ಣ ಯಾತ್ರಾ ಮಾರ್ಗವನ್ನು ತೆರೆಯಿರಿ', hi: 'पूरा तीर्थयात्रा मार्ग खोलें' })}</span>
        </Link>
      </section>

      <section className="knowledge-section" aria-labelledby="works-h">
        <div className="band-head">
          <h2 id="works-h" lang={uiLocale}>{text('பக்தி நூல்கள்', 'Devotional Works', { te: 'భక్తి గ్రంథాలు', ml: 'ഭക്തി കൃതികൾ', kn: 'ಭಕ್ತಿ ಕೃತಿಗಳು', hi: 'भक्ति ग्रंथ' })}</h2>
          <p lang={uiLocale}>{text('உரிமை மற்றும் வெளியீட்டு நிலை தனித்தனியாகக் காட்டப்படும் தற்போதைய நூல் பதிவுகள்.', 'Current work records, with rights and publication state shown separately.', { te: 'హక్కులు మరియు ప్రచురణ స్థితి విడిగా చూపబడే ప్రస్తుత గ్రంథ నమోదులు.', ml: 'അവകാശവും പ്രസിദ്ധീകരണ നിലയും വേർതിരിച്ച് കാണിക്കുന്ന നിലവിലെ കൃതി രേഖകൾ.', kn: 'ಹಕ್ಕುಗಳು ಮತ್ತು ಪ್ರಕಟಣೆ ಸ್ಥಿತಿಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ತೋರಿಸುವ ಪ್ರಸ್ತುತ ಕೃತಿ ದಾಖಲೆಗಳು.', hi: 'वर्तमान ग्रंथ अभिलेख, जिनमें अधिकार और प्रकाशन स्थिति अलग-अलग दिखाई जाती है।' })}</p>
        </div>
        <ul className="knowledge-ledger">
          {workCatalogue.map((work, index) => {
            const id = work.id ?? `work-${index + 1}`;
            const state = 'rightsState' in work ? work.rightsState : (work.verificationState ?? 'UNKNOWN');
            const workTitleEn = 'titleEn' in work ? work.titleEn : null;
            const showEnglishFirst = locale === 'en' && Boolean(workTitleEn);
            return (
              <li id={`work-${id}`} key={id}>
                <div>
                  {showEnglishFirst ? <><b lang="en">{workTitleEn}</b>{work.titleTa && <small lang="ta">{work.titleTa}</small>}</> : <><b lang={work.titleTa ? 'ta' : 'en'}>{work.titleTa ?? workTitleEn ?? id}</b>{workTitleEn && <small>{workTitleEn}</small>}</>}
                </div>
                <StateBadge state={state} />
                {work.id && <SaveControl item={{ type: 'work', id: work.id, titleTa: work.titleTa, titleEn: workTitleEn }} />}
              </li>
            );
          })}
        </ul>
        <Link href="/works" className="btn btn-quiet"><span lang={uiLocale}>{text('நூல் பட்டியல்', 'Work list', { te: 'గ్రంథాల జాబితా', ml: 'കൃതികളുടെ പട്ടിക', kn: 'ಕೃತಿಗಳ ಪಟ್ಟಿ', hi: 'ग्रंथ सूची' })}</span></Link>
      </section>

      <section className="knowledge-section" aria-labelledby="tp-h">
        <div className="band-head">
          <h2 id="tp-h" lang="ta">திருப்புகழ்</h2>
          <p lang={uiLocale}>{text(`${thiruppugazh.length} பதிவு அடையாளங்கள் உள்ளன. மூலத் தமிழ் உரை கிடைக்காத இடங்களில் அது வெளிப்படையாக நிலுவையில் காட்டப்படுகிறது.`, `${thiruppugazh.length} identity records exist. Where the canonical Tamil text is not yet available, that is shown as openly pending.`, { te: `${thiruppugazh.length} గుర్తింపు నమోదులు ఉన్నాయి. ప్రామాణిక తమిళ పాఠ్యం ఇంకా అందుబాటులో లేని చోట అది స్పష్టంగా పెండింగ్‌గా చూపబడుతుంది.`, ml: `${thiruppugazh.length} തിരിച്ചറിയൽ രേഖകൾ നിലവിലുണ്ട്. പ്രാമാണിക തമിഴ് പാഠം ഇതുവരെ ലഭ്യമല്ലാത്തിടത്ത് അത് വ്യക്തമായി നിലുവയിൽ എന്ന് കാണിക്കുന്നു.`, kn: `${thiruppugazh.length} ಗುರುತು ದಾಖಲೆಗಳಿವೆ. ಪ್ರಾಮಾಣಿಕ ತಮಿಳು ಪಠ್ಯ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲದ ಸ್ಥಳದಲ್ಲಿ ಅದನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಬಾಕಿ ಎಂದು ತೋರಿಸಲಾಗುತ್ತದೆ.`, hi: `${thiruppugazh.length} पहचान अभिलेख मौजूद हैं। जहाँ प्रामाणिक तमिल पाठ अभी उपलब्ध नहीं है, वहाँ उसे स्पष्ट रूप से लंबित दिखाया जाता है।` })}</p>
        </div>
        <Link href="/thiruppugazh" className="btn btn-primary"><span lang={uiLocale}>{text('திருப்புகழ் பதிவுகளைப் பார்க்க', 'View Thiruppugazh records', { te: 'తిరుప్పుగళ్ నమోదులను చూడండి', ml: 'തിരുപ്പുകഴ് രേഖകൾ കാണുക', kn: 'ತಿರುಪ್ಪುಗಳ್ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ', hi: 'तिरुप्पुगळ अभिलेख देखें' })}</span></Link>
      </section>

      <section className="knowledge-trust" aria-labelledby="trust-h">
        <h2 id="trust-h" lang={uiLocale}>{text('மூலமும் முழுமையும்', 'Source and Completeness', { te: 'మూలం మరియు సంపూర్ణత', ml: 'ഉറവിടവും സമ്പൂർണ്ണതയും', kn: 'ಮೂಲ ಮತ್ತು ಪೂರ್ಣತೆ', hi: 'स्रोत और पूर्णता' })}</h2>
        <p lang={uiLocale}>{text('இந்த அறிவுக் களம் முழுமையான முருகன் களஞ்சியம் என்று கூறாது. ஒவ்வொரு வெளியீடும் கிடைத்துள்ள ஆளுகைப் பதிவுகளால் மட்டுமே கட்டுப்படுத்தப்படுகிறது.', 'This knowledge hub does not claim to be a complete Murugan repository. Every publication is bounded only by the governed records that are actually available.', { te: 'ఈ జ్ఞాన కేంద్రం సంపూర్ణ మురుగన్ భాండాగారమని చెప్పదు. ప్రతి ప్రచురణ నిజంగా అందుబాటులో ఉన్న పరిపాలిత నమోదుల పరిమితిలోనే ఉంటుంది.', ml: 'ഈ വിജ്ഞാനകേന്ദ്രം സമ്പൂർണ്ണ മുരുകൻ ശേഖരമാണെന്ന് അവകാശപ്പെടുന്നില്ല. ഓരോ പ്രസിദ്ധീകരണവും യഥാർത്ഥത്തിൽ ലഭ്യമായ ഭരണത്തിലുള്ള രേഖകൾക്കുള്ളിലാണ് പരിമിതപ്പെടുത്തിയിരിക്കുന്നത്.', kn: 'ಈ ಜ್ಞಾನ ಕೇಂದ್ರವು ಸಂಪೂರ್ಣ ಮುರುಗನ್ ಸಂಗ್ರಹವಾಗಿದೆ ಎಂದು ಹೇಳುವುದಿಲ್ಲ. ಪ್ರತಿಯೊಂದು ಪ್ರಕಟಣೆಯೂ ನಿಜವಾಗಿ ಲಭ್ಯವಿರುವ ನಿಯಂತ್ರಿತ ದಾಖಲೆಗಳ ಮಿತಿಯಲ್ಲಿರುತ್ತದೆ.', hi: 'यह ज्ञान केंद्र स्वयं को पूर्ण मुरुगन भंडार नहीं मानता। प्रत्येक प्रकाशन केवल वास्तव में उपलब्ध शासित अभिलेखों की सीमा तक ही है।' })}</p>
        <div className="band-links">
          <Link href="/sources" lang={uiLocale}>{text('மூலங்கள்', 'Sources', { te: 'మూలాలు', ml: 'ഉറവിടങ്ങൾ', kn: 'ಮೂಲಗಳು', hi: 'स्रोत' })}</Link>
          <Link href="/content-completeness" lang={uiLocale}>{text('உள்ளடக்க நிலை', 'Content status', { te: 'కంటెంట్ స్థితి', ml: 'ഉള്ളടക്ക നില', kn: 'ವಿಷಯ ಸ್ಥಿತಿ', hi: 'सामग्री की स्थिति' })}</Link>
        </div>
      </section>
    </article>
  );
}
