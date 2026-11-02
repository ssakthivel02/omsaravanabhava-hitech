import { Link } from 'wouter';
import { arupadaiVeedu, describeSourceConfidence } from '@/content';
import ArupadaiVelMap from '@/components/ArupadaiVelMap';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';
import { useLocale } from '@/lib/locale';
import { evaluateCoordinatePublication } from '@/lib/geographicProvenance';

export default function ArupadaiVeedu() {
  const { uiLocale, locale, text } = useLocale();
  return (
    <article className="page arupadai-page">
      <div className="arupadai-intro">
        <header className="page-head arupadai-page-head">
          <h1 lang={uiLocale}>
            {text('அறுபடை வீடு', 'Six Abodes (Arupadai Veedu)', {
              te: 'ఆరు పుణ్యక్షేత్రాలు (అరుపడై వీడు)',
              ml: 'ആറ് പുണ്യസ്ഥലങ്ങൾ (അറുപടൈ വീട്)',
              kn: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು (ಅರುಪಡೈ ವೀಡು)',
              hi: 'छह पवित्र धाम (अरुपडै वीडु)',
            })}
          </h1>
          <p lang={uiLocale}>
            {text(
              'முருகனின் ஆறு படைவீடுகள். வரிசை பாரம்பரிய யாத்திரை முறையைப் பின்பற்றுகிறது. ஒவ்வொரு பதிவும் அதன் ஆயத்தொலைவு நிலையையும் மூல அடையாள நிலையையும் தனித்தனியாகக் காட்டுகிறது — ஒன்று மற்றொன்றைக் குறிக்காது.',
              "Murugan's six abodes. The order follows the traditional pilgrimage sequence. Each record shows its coordinate state and source-identity state separately — one is never taken to imply the other.",
              {
                te: 'మురుగన్ యొక్క ఆరు పుణ్యక్షేత్రాలు. క్రమం సంప్రదాయ యాత్రా క్రమాన్ని అనుసరిస్తుంది. ప్రతి నమోదు తన భౌగోళిక స్థానం స్థితి మరియు మూల గుర్తింపు స్థితిని వేర్వేరుగా చూపిస్తుంది — ఒకటి మరొకదాన్ని నిర్ధారించదు.',
                ml: 'മുരുകന്റെ ആറ് പുണ്യസ്ഥലങ്ങൾ. ക്രമം പരമ്പരാഗത തീർത്ഥയാത്രാ ക്രമമാണ് പിന്തുടരുന്നത്. ഓരോ രേഖയും സ്ഥാനം സംബന്ധിച്ച നിലയും ഉറവിട-തിരിച്ചറിയൽ നിലയും വേർതിരിച്ചാണ് കാണിക്കുന്നത് — ഒന്നും മറ്റൊന്നിന്റെ തെളിവായി കണക്കാക്കുന്നില്ല.',
                kn: 'ಮುರುಗನ ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು. ಕ್ರಮವು ಪರಂಪರೆಯ ಯಾತ್ರಾ ಕ್ರಮವನ್ನು ಅನುಸರಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯೂ ಭೌಗೋಳಿಕ ಸ್ಥಳದ ಸ್ಥಿತಿ ಮತ್ತು ಮೂಲ ಗುರುತಿನ ಸ್ಥಿತಿಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ತೋರಿಸುತ್ತದೆ — ಒಂದು ಮತ್ತೊಂದನ್ನು ದೃಢಪಡಿಸುವುದಿಲ್ಲ.',
                hi: 'मुरुगन के छह पवित्र धाम। क्रम पारंपरिक तीर्थ-यात्रा क्रम का अनुसरण करता है। हर रिकॉर्ड में स्थान-निर्देशांक की स्थिति और स्रोत-पहचान की स्थिति अलग-अलग दिखाई जाती है — एक को दूसरे का प्रमाण नहीं माना जाता।',
              },
            )}
          </p>
          <p className="arupadai-map-key" lang={uiLocale}>
            {text(
              'வலப்புற வேலில் 01–06 குறியீடுகள் இதே ஆறு படைவீடுகளின் யாத்திரை வரிசையைக் குறிக்கின்றன.',
              'The 01–06 markers on the Vel at right represent this same six-abode pilgrimage order.',
              {
                te: 'కుడివైపు ఉన్న వేల్‌పై 01–06 గుర్తులు ఇదే ఆరు పుణ్యక్షేత్రాల యాత్రా క్రమాన్ని సూచిస్తాయి.',
                ml: 'വലതുവശത്തെ വേലിലെ 01–06 അടയാളങ്ങൾ ഇതേ ആറ് പുണ്യസ്ഥലങ്ങളുടെ തീർത്ഥയാത്രാ ക്രമത്തെ സൂചിപ്പിക്കുന്നു.',
                kn: 'ಬಲಭಾಗದ ವೇಲ್‌ನಲ್ಲಿರುವ 01–06 ಗುರುತುಗಳು ಇದೇ ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳ ಯಾತ್ರಾ ಕ್ರಮವನ್ನು ಸೂಚಿಸುತ್ತವೆ.',
                hi: 'दाईं ओर के वेल पर 01–06 चिह्न इन्हीं छह पवित्र धामों के तीर्थ-क्रम को दर्शाते हैं।',
              },
            )}
          </p>
        </header>
        <aside
          className="arupadai-visual"
          aria-label={text('அறுபடை வீடு யாத்திரை வேல் வரைபடம்', 'Arupadai Veedu pilgrimage Vel map', {
            te: 'అరుపడై వీడు యాత్ర వేల్ పటం',
            ml: 'അറുപടൈ വീട് തീർത്ഥയാത്രാ വേൽ ഭൂപടം',
            kn: 'ಅರುಪಡೈ ವೀಡು ಯಾತ್ರಾ ವೇಲ್ ನಕ್ಷೆ',
            hi: 'अरुपडै वीडु तीर्थ-यात्रा वेल मानचित्र',
          })}
        >
          <ArupadaiVelMap />
        </aside>
      </div>

      <ol className="pilgrimage">
        {arupadaiVeedu.map((t) => {
          const primarySource = t.sources[0];
          const coordinateDecision = evaluateCoordinatePublication(t);
          const literary = t.literaryRelationships[0] as
            | { work_id?: string; assertion_status?: string }
            | undefined;
          const showEnglishFirst = locale === 'en' && Boolean(t.nameEn);
          return (
            <li
              key={t.id}
              className="pilgrimage-stop"
              data-coordinate-publication-state={coordinateDecision.state}
            >
              <Link href={`/temples/${t.id}`} className="stop-link">
                <span className="stop-num" aria-hidden="true">
                  {String(t.pilgrimageOrder).padStart(2, '0')}
                </span>
                <span className="stop-body">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{t.nameEn}</b>
                      <small lang="ta">{t.nameTa}</small>
                    </>
                  ) : (
                    <>
                      <b lang="ta">{t.nameTa}</b>
                      <small>
                        {t.nameEn}
                        {t.transliteration && t.transliteration !== t.nameEn
                          ? ` · ${t.transliteration}`
                          : ''}
                      </small>
                    </>
                  )}
                  <span className="state-row">
                    <StateBadge
                      state={coordinateDecision.state}
                      dimension={text('ஆயத்தொலைவு', 'Coordinates', {
                        te: 'నిర్దేశాంకాలు',
                        ml: 'സ്ഥാനം',
                        kn: 'ನಿರ್ದೇಶಾಂಕಗಳು',
                        hi: 'निर्देशांक',
                      })}
                    />
                    {primarySource &&
                      (() => {
                        const { label, tone } = describeSourceConfidence(
                          primarySource.confidence,
                          locale,
                        );
                        return <StateBadgeResolved label={label} tone={tone} />;
                      })()}
                    {t.officialCurrentSource && (
                      <StateBadge
                        state={t.officialCurrentSource.state}
                        dimension={text('தற்போதைய மூலம்', 'Current source', {
                          te: 'ప్రస్తుత మూలం',
                          ml: 'നിലവിലെ ഉറവിടം',
                          kn: 'ಪ್ರಸ್ತುತ ಮೂಲ',
                          hi: 'वर्तमान स्रोत',
                        })}
                      />
                    )}
                  </span>
                  {literary && (
                    <span className="stop-literary" lang={uiLocale}>
                      {text(
                        'இலக்கியக் குறிப்பு — பாரம்பரியச் சூழல் மட்டுமே, நவீன பயணத் தகவலுக்கான ஆதாரம் அல்ல.',
                        'Literary reference — traditional context only, not a source for modern travel information.',
                        {
                          te: 'సాహిత్య సూచన — సంప్రదాయ సందర్భం కోసం మాత్రమే; ఆధునిక ప్రయాణ సమాచారానికి మూలం కాదు.',
                          ml: 'സാഹിത്യ സൂചന — പരമ്പരാഗത പശ്ചാത്തലത്തിനായി മാത്രം; ആധുനിക യാത്രാ വിവരങ്ങളുടെ ഉറവിടമല്ല.',
                          kn: 'ಸಾಹಿತ್ಯ ಉಲ್ಲೇಖ — ಪರಂಪರೆಯ ಸಂದರ್ಭಕ್ಕಾಗಿ ಮಾತ್ರ; ಆಧುನಿಕ ಪ್ರಯಾಣ ಮಾಹಿತಿಯ ಮೂಲವಲ್ಲ.',
                          hi: 'साहित्यिक संदर्भ — केवल पारंपरिक संदर्भ के लिए; आधुनिक यात्रा जानकारी का स्रोत नहीं।',
                        },
                      )}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="note" lang={uiLocale}>
        {text(
          'ஆறு பதிவுகளுக்கும் HR&CE-யிடமிருந்து தற்போதைய தரிசன நேரமும் தொடர்புத் தகவலும் இப்போது கிடைக்கின்றன — ஒவ்வொரு பதிவின் பக்கத்திலும் “தற்போதைய உத்தியோகபூர்வத் தகவல்” பிரிவில் காணலாம். இவை மாறக்கூடியவை என்பதால் பயணத்திற்கு முன் மூலத்துடன் மீண்டும் உறுதி செய்யவும். ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் ஆகியவை தற்போதும் ஒவ்வொரு பதிவிலும் நிலுவையில் உள்ளன — இணையம் மூலம் உறுதி செய்யப்பட்ட தகவல் கிடைத்தவுடன் இங்கு புதுப்பிக்கப்படும். தற்போதைய நிலைக்கு',
          'Current visiting hours and contact information from HR&CE are now available for all six records — see the “Current official information” section on each record’s page. These can change, so please reconfirm with the source before you travel. Coordinates, history and visitor information remain pending for every record for now — this will be updated here as verified information becomes available. For the current state, see',
          {
            te: 'ఆరు నమోదులకు HR&CE నుండి ప్రస్తుత దర్శన సమయాలు మరియు సంప్రదింపు సమాచారం ఇప్పుడు అందుబాటులో ఉన్నాయి — ప్రతి నమోదు పేజీలోని “ప్రస్తుత అధికారిక సమాచారం” విభాగాన్ని చూడండి. ఇవి మారవచ్చు కాబట్టి ప్రయాణానికి ముందు మూలంతో మళ్లీ నిర్ధారించండి. నిర్దేశాంకాలు, చరిత్ర మరియు సందర్శకుల సమాచారం ప్రస్తుతం ప్రతి నమోదులో ఇంకా పెండింగ్‌లో ఉన్నాయి — ధృవీకరించిన సమాచారం లభించినప్పుడు ఇక్కడ నవీకరించబడుతుంది. ప్రస్తుత స్థితికి',
            ml: 'ആറ് രേഖകൾക്കും HR&CE-യിൽ നിന്നുള്ള നിലവിലെ ദർശനസമയവും ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും ലഭ്യമാണ് — ഓരോ രേഖയുടെ പേജിലെ “നിലവിലെ ഔദ്യോഗിക വിവരം” വിഭാഗം കാണുക. ഇവ മാറാവുന്നതിനാൽ യാത്രയ്ക്കു മുമ്പ് ഉറവിടവുമായി വീണ്ടും സ്ഥിരീകരിക്കുക. സ്ഥാനം, ചരിത്രം, സന്ദർശക വിവരങ്ങൾ ഇപ്പോഴും ഓരോ രേഖയിലും അപൂർണ്ണമാണ് — സ്ഥിരീകരിച്ച വിവരം ലഭിക്കുമ്പോൾ ഇവിടെ പുതുക്കും. നിലവിലെ നിലയ്ക്കായി',
            kn: 'ಎಲ್ಲ ಆರು ದಾಖಲೆಗಳಿಗೂ HR&CE ಯಿಂದ ಪ್ರಸ್ತುತ ದರ್ಶನ ಸಮಯ ಮತ್ತು ಸಂಪರ್ಕ ಮಾಹಿತಿ ಈಗ ಲಭ್ಯವಿದೆ — ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯ ಪುಟದಲ್ಲಿರುವ “ಪ್ರಸ್ತುತ ಅಧಿಕೃತ ಮಾಹಿತಿ” ವಿಭಾಗವನ್ನು ನೋಡಿ. ಇವು ಬದಲಾಗಬಹುದು, ಆದ್ದರಿಂದ ಪ್ರಯಾಣಕ್ಕೂ ಮುನ್ನ ಮೂಲದೊಂದಿಗೆ ಮರುದೃಢೀಕರಿಸಿ. ನಿರ್ದೇಶಾಂಕಗಳು, ಇತಿಹಾಸ ಮತ್ತು ಭೇಟಿದಾರರ ಮಾಹಿತಿ ಈಗಲೂ ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯಲ್ಲೂ ಬಾಕಿಯಿದೆ — ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ನವೀಕರಿಸಲಾಗುತ್ತದೆ. ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಗಾಗಿ',
            hi: 'सभी छह रिकॉर्ड के लिए HR&CE से वर्तमान दर्शन समय और संपर्क जानकारी अब उपलब्ध है — प्रत्येक रिकॉर्ड के पृष्ठ पर “वर्तमान आधिकारिक जानकारी” अनुभाग देखें। यह जानकारी बदल सकती है, इसलिए यात्रा से पहले स्रोत से दोबारा पुष्टि करें। निर्देशांक, इतिहास और आगंतुक जानकारी अभी भी हर रिकॉर्ड में लंबित है — सत्यापित जानकारी उपलब्ध होने पर यहां अपडेट की जाएगी। वर्तमान स्थिति के लिए',
          },
        )}{' '}
        <Link href="/content-completeness" lang={uiLocale}>
          {text('உள்ளடக்க நிலை', 'Content status', {
            te: 'కంటెంట్ స్థితి',
            ml: 'ഉള്ളടക്ക നില',
            kn: 'ವಿಷಯ ಸ್ಥಿತಿ',
            hi: 'सामग्री स्थिति',
          })}
        </Link>{' '}
        {text('பக்கத்தைப் பார்க்கவும்.', 'page.', {
          te: 'పేజీని చూడండి.',
          ml: 'പേജ് കാണുക.',
          kn: 'ಪುಟವನ್ನು ನೋಡಿ.',
          hi: 'पृष्ठ देखें।',
        })}
      </p>
    </article>
  );
}
