import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import arupadaiVeedu from '@/content/arupadai-veedu.json';
import completeness from '@/content/completeness.json';
import { localDayIndex } from '@/lib/localDay';
import { useLocale } from '@/lib/locale';

const STOP_COLORS = [
  'var(--gold)',
  'var(--gold-soft)',
  'var(--saffron)',
  'var(--copper)',
  'var(--vel)',
  'var(--vel-bright)',
];

/**
 * Flagship sacred visual. Desktop and mobile use two responsive crops of the
 * same approved artwork so Murugan, Valli, Deivanai, the Vel and peacock stay
 * legible without stretching or squeezing faces on narrow screens.
 */
function HomeSacredVisual({ alt }: { alt: string }) {
  return (
    <figure className="home-sacred-visual">
      <picture>
        <source
          media="(max-width: 47.99rem)"
          srcSet="/images/home-murugan-valli-deivanai-mobile.webp"
          type="image/webp"
        />
        <img
          src="/images/home-murugan-valli-deivanai-1920.webp"
          alt={alt}
          width="1920"
          height="1080"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <span className="home-sacred-visual-shade" aria-hidden="true" />
    </figure>
  );
}

export default function Home() {
  const { uiLocale, locale, text } = useLocale();
  const uiText = (
    ta: string,
    en: string,
    te: string,
    ml: string,
    kn: string,
    hi: string,
  ) => text(ta, en, { te, ml, kn, hi });

  const templeDomain = completeness.domains.find((d) => d.key === 'temples');
  const templeCount = templeDomain?.records ?? 0;
  const thiruppugazhDomain = completeness.domains.find((d) => d.key === 'thiruppugazh');
  const songCount = thiruppugazhDomain?.records ?? 0;
  const songsWithCanonicalText = thiruppugazhDomain?.withCanonicalText ?? 0;
  const worksDomain = completeness.domains.find((d) => d.key === 'works');
  const namesDomain = completeness.domains.find((d) => d.key === 'names');
  const prayersDomain = completeness.domains.find((d) => d.key === 'prayers');

  const todayIndex = localDayIndex(arupadaiVeedu.length);
  const todayFocus = arupadaiVeedu[todayIndex];

  const sacredVisualAlt = uiText(
    'முருகன், வள்ளி, தெய்வானை, வேல் மற்றும் மயில் கொண்ட பக்தி காட்சி',
    'Devotional scene of Murugan with Valli, Deivanai, the Vel and peacock',
    'మురుగన్, వల్లీ, దేవయానై, వేల్ మరియు నెమలితో భక్తి దృశ్యం',
    'മുരുകൻ, വള്ളി, ദേവയാനൈ, വേൽ, മയിൽ എന്നിവയുള്ള ഭക്തിദൃശ്യം',
    'ಮುರುಗನ್, ವಳ್ಳಿ, ದೇವಯಾನೈ, ವೇಲ್ ಮತ್ತು ನವಿಲಿನ ಭಕ್ತಿದೃಶ್ಯ',
    'मुरुगन, वल्ली, देवयानै, वेल और मोर का भक्तिमय दृश्य',
  );

  return (
    <>
      <section className="hero hero-sacred-family">
        <span className="hero-edge" aria-hidden="true" />
        <HomeSacredVisual alt={sacredVisualAlt} />
        <div className="hero-copy">
          <p className="hero-eyebrow" lang={uiLocale}>
            {uiText(
              'வேல் · அறுபடை வீடு · திருப்புகழ்',
              'Vel · Six Abodes · Thiruppugazh',
              'వేల్ · ఆరు పవిత్ర క్షేత్రాలు · తిరుప్పుగళ్',
              'വേൽ · ആറ് പുണ്യസ്ഥാനങ്ങൾ · തിരുപ്പുകഴ്',
              'ವೇಲ್ · ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು · ತಿರುಪ್ಪುಗ಴್',
              'वेल · छह पवित्र धाम · तिरुप्पुगळ',
            )}
          </p>
          <h1 lang={uiLocale}>
            {uiText('வேலின் வழியே', 'Through the Vel', 'వేల్ మార్గంగా', 'വേലിന്റെ വഴിയായി', 'ವೇಲಿನ ಮಾರ್ಗವಾಗಿ', 'वेल के मार्ग से')}
            <br />
            {uiText(
              'முருகன் அறிவுலகம்',
              "into Murugan's World of Knowledge",
              'మురుగన్ జ్ఞాన ప్రపంచంలోకి',
              'മുരുകന്റെ ജ്ഞാനലോകത്തിലേക്ക്',
              'ಮುರುಗನ ಜ್ಞಾನಲೋಕದೊಳಗೆ',
              'मुरुगन के ज्ञान-जगत में',
            )}
          </h1>
          <p className="hero-lead" lang={uiLocale}>
            {uiText(
              'அறுபடை வீடு, திருப்புகழ், முருகன் கோயில்கள் — ஒவ்வொரு பதிவும் அதன் மூலத்துடனும், சரிபார்ப்பு நிலையுடனும்.',
              'Six Abodes, Thiruppugazh, Murugan temples — every record with its source and its verification state.',
              'ఆరు పవిత్ర క్షేత్రాలు, తిరుప్పుగళ్, మురుగన్ ఆలయాలు — ప్రతి నమోదుతో దాని మూలం మరియు ధృవీకరణ స్థితి.',
              'ആറ് പുണ്യസ്ഥാനങ്ങൾ, തിരുപ്പുകഴ്, മുരുകൻ ക്ഷേത്രങ്ങൾ — ഓരോ രേഖയ്ക്കും അതിന്റെ ഉറവിടവും പരിശോധന നിലയും.',
              'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು, ತಿರುಪ್ಪುಗ಴್, ಮುರುಗನ್ ದೇವಾಲಯಗಳು — ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯಿಗೂ ಅದರ ಮೂಲ ಮತ್ತು ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ.',
              'छह पवित्र धाम, तिरुप्पुगळ, मुरुगन मंदिर — हर रिकॉर्ड के साथ उसका स्रोत और सत्यापन स्थिति।',
            )}
          </p>
          <p className="hero-sub" lang={uiLocale}>
            {uiText(
              'ஒவ்வொரு பதிவிலும் அதன் மூலமும் சரிபார்ப்பு நிலையும் காட்டப்படும். இங்கே ஊகத்தின் அடிப்படையில் எதுவும் நிரப்பப்படாது.',
              'Every record carries its source and its verification state. Nothing here is filled in by guesswork.',
              'ప్రతి నమోదులో దాని మూలం మరియు ధృవీకరణ స్థితి ఉంటాయి. ఇక్కడ ఊహాపోహలతో ఏదీ నింపబడదు.',
              'ഓരോ രേഖയിലും അതിന്റെ ഉറവിടവും പരിശോധന നിലയും കാണിക്കും. അനുമാനത്തെ ആശ്രയിച്ച് ഇവിടെ ഒന്നും പൂരിപ്പിക്കില്ല.',
              'ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯಲ್ಲೂ ಅದರ ಮೂಲ ಮತ್ತು ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ ಇರುತ್ತದೆ. ಊಹೆಯ ಆಧಾರದಲ್ಲಿ ಇಲ್ಲಿ ಯಾವುದನ್ನೂ ತುಂಬುವುದಿಲ್ಲ.',
              'हर रिकॉर्ड के साथ उसका स्रोत और सत्यापन स्थिति दी जाती है। यहाँ अनुमान के आधार पर कुछ भी नहीं भरा जाता।',
            )}
          </p>
          <div className="hero-actions">
            <Link href="/arupadai-veedu" className="btn btn-primary">
              <span lang={uiLocale}>
                {uiText('அறுபடை வீடு காண்க', 'See the Six Abodes', 'ఆరు పవిత్ర క్షేత్రాలు చూడండి', 'ആറ് പുണ്യസ്ഥാനങ്ങൾ കാണുക', 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳನ್ನು ನೋಡಿ', 'छह पवित्र धाम देखें')}
              </span>
            </Link>
            <Link href="/search" className="btn btn-quiet">
              <span lang={uiLocale}>{uiText('தேடல்', 'Search', 'శోధన', 'തിരയുക', 'ಹುಡುಕಿ', 'खोजें')}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="band band-thread" aria-labelledby="abodes-h">
        <div className="band-head">
          <h2 id="abodes-h" lang={uiLocale}>
            {uiText('அறுபடை வீடு', 'Six Abodes', 'ఆరు పవిత్ర క్షేత్రాలు', 'ആറ് പുണ്യസ്ഥാനങ്ങൾ', 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು', 'छह पवित्र धाम')}
          </h2>
          <p lang={uiLocale}>
            {uiText(
              'முருகனின் ஆறு படைவீடுகள், பாரம்பரிய யாத்திரை வரிசையில்.',
              "Murugan's six abodes, in the traditional pilgrimage order.",
              'మురుగన్ యొక్క ఆరు పవిత్ర క్షేత్రాలు, సంప్రదాయ యాత్రా క్రమంలో.',
              'മുരുകന്റെ ആറ് പുണ്യസ്ഥാനങ്ങൾ, പരമ്പരാഗത തീർത്ഥയാത്രാക്രമത്തിൽ.',
              'ಮುರುಗನ ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು, ಪರಂಪರাগত ಯಾತ್ರಾ ಕ್ರಮದಲ್ಲಿ.',
              'मुरुगन के छह पवित्र धाम, पारंपरिक तीर्थयात्रा क्रम में।',
            )}
          </p>
        </div>
        <ol className="abode-list">
          {arupadaiVeedu.map((t, i) => {
            const showEnglishFirst = locale === 'en' && Boolean(t.nameEn);
            return (
              <li key={t.id}>
                <Link
                  href={`/temples/${t.id}`}
                  className="abode"
                  style={{ '--abode-accent': STOP_COLORS[i % STOP_COLORS.length] } as CSSProperties}
                >
                  <span className="abode-num">{String(t.pilgrimageOrder).padStart(2, '0')}</span>
                  <span className="abode-body">
                    {showEnglishFirst ? (
                      <>
                        <b lang="en">{t.nameEn}</b>
                        <small lang="ta">{t.nameTa}</small>
                      </>
                    ) : (
                      <>
                        <b lang="ta">{t.nameTa}</b>
                        <small lang="en">{t.nameEn}</small>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="band" aria-labelledby="works-constellation-h">
        <div className="band-head">
          <h2 id="works-constellation-h" lang={uiLocale}>
            {uiText('பக்தி நூல் தொகுப்பு', 'Devotional Works Collection', 'భక్తి గ్రంథాల సమాహారం', 'ഭക്തിഗ്രന്ഥ ശേഖരം', 'ಭಕ್ತಿ ಗ್ರಂಥ ಸಂಗ್ರಹ', 'भक्ति ग्रंथ संग्रह')}
          </h2>
          <p lang={uiLocale}>
            {uiText(
              'திருப்புகழ், மந்திரம்-துதி, பிற பக்தி நூல்கள், திருநாமங்கள் — ஒவ்வொன்றும் அதன் மூல நிலையுடன்.',
              'Thiruppugazh, mantras and prayers, other devotional works, sacred names — each with its own source state.',
              'తిరుప్పుగళ్, మంత్రాలు మరియు ప్రార్థనలు, ఇతర భక్తి గ్రంథాలు, పవిత్ర నామాలు — ప్రతి దానికి దాని మూల స్థితి.',
              'തിരുപ്പുകഴ്, മന്ത്രങ്ങളും പ്രാർത്ഥനകളും, മറ്റ് ഭക്തിഗ്രന്ഥങ്ങൾ, തിരുനാമങ്ങൾ — ഓരോന്നിനും അതിന്റെ ഉറവിടനില.',
              'ತಿರುಪ್ಪುಗ಴್, ಮಂತ್ರಗಳು ಮತ್ತು ಪ್ರಾರ್ಥನೆಗಳು, ಇತರ ಭಕ್ತಿ ಕೃತಿಗಳು, ಪವಿತ್ರ ನಾಮಗಳು — ಪ್ರತಿಯೊಂದಕ್ಕೂ ಅದರ ಮೂಲ ಸ್ಥಿತಿ.',
              'तिरुप्पुगळ, मंत्र और प्रार्थनाएँ, अन्य भक्ति ग्रंथ, पवित्र नाम — प्रत्येक के साथ उसकी स्रोत स्थिति।',
            )}
          </p>
        </div>
        <div className="constellation">
          <Link href="/thiruppugazh" className="portal portal-lead">
            <b lang={uiLocale}>{uiText('திருப்புகழ்', 'Thiruppugazh', 'తిరుప్పుగళ్', 'തിരുപ്പുകഴ്', 'ತಿರುಪ್ಪುಗ಴್', 'तिरुप्पुगळ')}</b>
            <p lang={uiLocale}>
              {uiText(
                `${songCount} மூலம்-இணைக்கப்பட்ட பாடல்கள் · மூல தமிழ் உரை இறக்குமதி ${songsWithCanonicalText}/${songCount}`,
                `${songCount} source-linked songs · canonical Tamil text imported ${songsWithCanonicalText}/${songCount}`,
                `${songCount} మూలంతో అనుసంధానమైన పాటలు · ప్రామాణిక తమిళ పాఠ్యం దిగుమతి ${songsWithCanonicalText}/${songCount}`,
                `${songCount} ഉറവിടബന്ധമുള്ള ഗാനങ്ങൾ · പ്രാമാണിക തമിഴ് പാഠം ഇറക്കുമതി ${songsWithCanonicalText}/${songCount}`,
                `${songCount} ಮೂಲ-ಸಂಪರ್ಕಿತ ಹಾಡುಗಳು · ಪ್ರಮಾಣಿತ ತಮಿಳು ಪಠ್ಯ ಆಮದು ${songsWithCanonicalText}/${songCount}`,
                `${songCount} स्रोत-संबद्ध गीत · प्रामाणिक तमिल पाठ आयात ${songsWithCanonicalText}/${songCount}`,
              )}
            </p>
          </Link>
          <Link href="/prayers" className="portal">
            <b lang={uiLocale}>{uiText('மந்திரம் · துதி · நாமாவளி', 'Mantras · Prayers · Namavali', 'మంత్రాలు · ప్రార్థనలు · నామావళి', 'മന്ത്രങ്ങൾ · പ്രാർത്ഥനകൾ · നാമാവലി', 'ಮಂತ್ರಗಳು · ಪ್ರಾರ್ಥನೆಗಳು · ನಾಮಾವಳಿ', 'मंत्र · प्रार्थनाएँ · नामावली')}</b>
            <p lang={uiLocale}>
              {uiText(
                `${prayersDomain?.records ?? 0} பதிவு · விவரங்கள் மட்டும்`,
                `${prayersDomain?.records ?? 0} records · details only`,
                `${prayersDomain?.records ?? 0} నమోదులు · వివరాలు మాత్రమే`,
                `${prayersDomain?.records ?? 0} രേഖകൾ · വിശദാംശങ്ങൾ മാത്രം`,
                `${prayersDomain?.records ?? 0} ದಾಖಲೆಗಳು · ವಿವರಗಳು ಮಾತ್ರ`,
                `${prayersDomain?.records ?? 0} रिकॉर्ड · केवल विवरण`,
              )}
            </p>
          </Link>
          <Link href="/works" className="portal">
            <b lang={uiLocale}>{uiText('பாடல்களும் நூல்களும்', 'Songs and Sacred Works', 'పాటలు మరియు పవిత్ర గ్రంథాలు', 'ഗാനങ്ങളും പുണ്യഗ്രന്ഥങ്ങളും', 'ಹಾಡುಗಳು ಮತ್ತು ಪವಿತ್ರ ಕೃತಿಗಳು', 'गीत और पवित्र ग्रंथ')}</b>
            <p lang={uiLocale}>
              {uiText(
                `${worksDomain?.records ?? 0} நூல் பதிவுகள்`,
                `${worksDomain?.records ?? 0} work records`,
                `${worksDomain?.records ?? 0} గ్రంథ నమోదులు`,
                `${worksDomain?.records ?? 0} ഗ്രന്ഥ രേഖകൾ`,
                `${worksDomain?.records ?? 0} ಕೃತಿ ದಾಖಲೆಗಳು`,
                `${worksDomain?.records ?? 0} ग्रंथ रिकॉर्ड`,
              )}
            </p>
          </Link>
          <Link href="/content-completeness" className="portal portal-minor">
            <b lang={uiLocale}>{uiText('திருநாமங்கள்', 'Sacred Names', 'పవిత్ర నామాలు', 'തിരുനാമങ്ങൾ', 'ಪವಿತ್ರ ನಾಮಗಳು', 'पवित्र नाम')}</b>
            <p lang={uiLocale}>
              {uiText(
                `${namesDomain?.records ?? 0} பதிவு · நிலை காண்க`,
                `${namesDomain?.records ?? 0} records · see status`,
                `${namesDomain?.records ?? 0} నమోదులు · స్థితి చూడండి`,
                `${namesDomain?.records ?? 0} രേഖകൾ · നില കാണുക`,
                `${namesDomain?.records ?? 0} ದಾಖಲೆಗಳು · ಸ್ಥಿತಿ ನೋಡಿ`,
                `${namesDomain?.records ?? 0} रिकॉर्ड · स्थिति देखें`,
              )}
            </p>
          </Link>
        </div>
      </section>

      <section className="band band-split" aria-labelledby="temple-intel-h">
        <div>
          <h2 id="temple-intel-h" lang={uiLocale}>
            {uiText('கோயில் அறிவுத்திறன்', 'Temple Intelligence', 'ఆలయ సమాచార కేంద్రం', 'ക്ഷേത്ര അറിവുകേന്ദ്രം', 'ದೇವಾಲಯ ಜ್ಞಾನಕೇಂದ್ರ', 'मंदिर ज्ञान केंद्र')}
          </h2>
          <p lang={uiLocale}>
            {uiText(
              `${templeCount} ஆளுகைப் பதிவுகள் — இதில் ${arupadaiVeedu.length} அறுபடை வீடு. ஆயத்தொலைவு, வரலாறு, பயணத் தகவல் கொண்ட பதிவுகள்: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. பதிவு எண்ணிக்கை இருப்பையே காட்டும், முழுமையை அல்ல.`,
              `${templeCount} governed records — including ${arupadaiVeedu.length} Six Abodes. Records with coordinates, history, or visitor information: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. The record count shows presence only, not completeness.`,
              `${templeCount} పరిపాలిత నమోదులు — అందులో ${arupadaiVeedu.length} ఆరు పవిత్ర క్షేత్రాలు. స్థానాంకాలు, చరిత్ర లేదా సందర్శకుల సమాచారం ఉన్న నమోదులు: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. ఈ సంఖ్య ఉనికిని మాత్రమే చూపుతుంది, సంపూర్ణతను కాదు.`,
              `${templeCount} നിയന്ത്രിത രേഖകൾ — അതിൽ ${arupadaiVeedu.length} ആറ് പുണ്യസ്ഥാനങ്ങൾ. സ്ഥാനം, ചരിത്രം അല്ലെങ്കിൽ സന്ദർശക വിവരമുള്ള രേഖകൾ: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. ഈ എണ്ണം സാന്നിധ്യം മാത്രം കാണിക്കുന്നു, സമ്പൂർണതയല്ല.`,
              `${templeCount} ಆಡಳಿತದ ದಾಖಲೆಗಳು — ಅವುಗಳಲ್ಲಿ ${arupadaiVeedu.length} ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು. ಸ್ಥಳಾಂಕ, ಇತಿಹಾಸ ಅಥವಾ ಭೇಟಿ ಮಾಹಿತಿ ಇರುವ ದಾಖಲೆಗಳು: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. ಈ ಸಂಖ್ಯೆ ಇರುವಿಕೆಯನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ, ಸಂಪೂರ್ಣತೆಯನ್ನು ಅಲ್ಲ.`,
              `${templeCount} नियंत्रित रिकॉर्ड — इनमें ${arupadaiVeedu.length} छह पवित्र धाम। निर्देशांक, इतिहास या आगंतुक जानकारी वाले रिकॉर्ड: ${templeDomain?.withCoordinates ?? 0}/${templeCount}. यह संख्या केवल उपलब्धता दिखाती है, पूर्णता नहीं।`,
            )}
          </p>
          <p className="band-links">
            <Link href="/temples" lang={uiLocale}>
              {uiText('கோயில் அடைவு', 'Temple directory', 'ఆలయ సూచిక', 'ക്ഷേത്ര പട്ടിക', 'ದೇವಾಲಯ ಸೂಚಿ', 'मंदिर सूची')}
            </Link>
            <Link href="/arupadai-veedu" lang={uiLocale}>
              {uiText('அறுபடை வீடு', 'Six Abodes', 'ఆరు పవిత్ర క్షేత్రాలు', 'ആറ് പുണ്യസ്ഥാനങ്ങൾ', 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು', 'छह पवित्र धाम')}
            </Link>
          </p>
        </div>
        <dl className="counts">
          {completeness.domains.slice(0, 4).map((d) => (
            <div key={d.key} className="count">
              <dt lang={locale}>{text(d.labelTa, d.labelEn)}</dt>
              <dd>{d.records}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="band-note" lang={uiLocale}>
        {uiText(
          'மேலேயுள்ள எண்கள் பதிவு இருப்பைக் காட்டுகின்றன, முழுமையை அல்ல. விரிவான நிலைக்கு',
          'The numbers above show record presence, not completeness. For the detailed state, see the',
          'పైన ఉన్న సంఖ్యలు నమోదుల ఉనికిని మాత్రమే చూపిస్తాయి, సంపూర్ణతను కాదు. వివరమైన స్థితి కోసం',
          'മുകളിലെ സംഖ്യകൾ രേഖകളുടെ സാന്നിധ്യം മാത്രം കാണിക്കുന്നു, സമ്പൂർണതയല്ല. വിശദമായ നിലയ്ക്ക്',
          'ಮೇಲಿನ ಸಂಖ್ಯೆಗಳು ದಾಖಲೆಗಳ ಇರುವಿಕೆಯನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತವೆ, ಸಂಪೂರ್ಣತೆಯನ್ನು ಅಲ್ಲ. ವಿವರವಾದ ಸ್ಥಿತಿಗಾಗಿ',
          'ऊपर की संख्याएँ केवल रिकॉर्ड की उपलब्धता दिखाती हैं, पूर्णता नहीं। विस्तृत स्थिति के लिए',
        )}{' '}
        <Link href="/content-completeness" lang={uiLocale}>
          {uiText('உள்ளடக்க நிலை', 'Content status', 'కంటెంట్ స్థితి', 'ഉള്ളടക്ക നില', 'ವಿಷಯ ಸ್ಥಿತಿ', 'सामग्री स्थिति')}
        </Link>{' '}
        {uiText('பக்கத்தைப் பார்க்கவும்.', 'page.', 'పేజీని చూడండి.', 'പേജ് കാണുക.', 'ಪುಟವನ್ನು ನೋಡಿ.', 'पृष्ठ देखें।')}
      </p>

      {todayFocus && (
        <section className="band devotion-band" aria-labelledby="devotion-h">
          <div className="band-head">
            <h2 id="devotion-h" lang={uiLocale}>
              {uiText('இன்றைய வழிபாடு', "Today's Practice", 'ఈరోజు సాధన', 'ഇന്നത്തെ ആചരണം', 'ಇಂದಿನ ಆಚರಣೆ', 'आज की साधना')}
            </h2>
            <p lang={uiLocale}>
              {uiText("இன்றைய நினைவு: ", "Today's focus: ", 'ఈరోజు దృష్టి: ', 'ഇന്നത്തെ ശ്രദ്ധ: ', 'ಇಂದಿನ ಗಮನ: ', 'आज का ध्यान: ')}
              <b lang="ta">{todayFocus.nameTa}</b>
              {uiText(
                '. எண்ணிக்கை இந்த உலாவியில் மட்டுமே சேமிக்கப்படுகிறது — கணக்கு தேவையில்லை, தொடர் இழப்பு அழுத்தமும் இல்லை.',
                '. The count is saved only in this browser — no account needed, no streak pressure.',
                '. లెక్క ఈ బ్రౌజర్‌లో మాత్రమే నిల్వ అవుతుంది — ఖాతా అవసరం లేదు, వరుస కోల్పోతామనే ఒత్తిడి లేదు.',
                '. എണ്ണം ഈ ബ്രൗസറിൽ മാത്രം സൂക്ഷിക്കും — അക്കൗണ്ട് വേണ്ട, തുടർച്ച നഷ്ടപ്പെടുമെന്ന സമ്മർദ്ദവും ഇല്ല.',
                '. ಎಣಿಕೆ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ — ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ, ಸರಣಿ ತಪ್ಪುವ ಒತ್ತಡವೂ ಇಲ್ಲ.',
                '. गिनती केवल इस ब्राउज़र में सहेजी जाती है — खाते की जरूरत नहीं, लगातार दिनों की कोई बाध्यता नहीं।',
              )}
            </p>
            <p className="band-links">
              <Link href="/practice" lang={uiLocale}>
                {uiText('தினசரி வழிபாட்டைத் திற', 'Open Daily Practice', 'రోజువారీ సాధనను తెరవండి', 'ദൈനംദിന ആചരണം തുറക്കുക', 'ದೈನಂದಿನ ಆಚರಣೆ ತೆರೆಯಿರಿ', 'दैनिक साधना खोलें')}
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="band trust-band">
        <p lang={uiLocale}>
          {uiText(
            'இத்தளம் எந்தக் கோயில் நன்கொடையையும் பெறவோ, கையாளவோ இல்லை. உத்தியோகபூர்வ தொடர்புகள் மட்டுமே காட்டப்படுகின்றன. மூலங்கள் எவ்வாறு சரிபார்க்கப்படுகின்றன என்பதையும், "நிலுவையில்" என்றால் என்ன என்பதையும் கீழே காணலாம்.',
            'This site does not receive or handle any temple donations. Only official contacts are shown. Below you can see how sources are verified and what "pending" means.',
            'ఈ సైట్ ఎలాంటి ఆలయ విరాళాలను స్వీకరించదు లేదా నిర్వహించదు. అధికారిక సంప్రదింపు వివరాలే చూపబడతాయి. మూలాలను ఎలా ధృవీకరిస్తామో మరియు "పెండింగ్" అంటే ఏమిటో క్రింద చూడవచ్చు.',
            'ഈ സൈറ്റ് ക്ഷേത്ര സംഭാവനകൾ സ്വീകരിക്കുകയോ കൈകാര്യം ചെയ്യുകയോ ചെയ്യുന്നില്ല. ഔദ്യോഗിക ബന്ധങ്ങൾ മാത്രമാണ് കാണിക്കുന്നത്. ഉറവിടങ്ങൾ എങ്ങനെ പരിശോധിക്കുന്നു, "നിലുവിൽ" എന്നത് എന്താണ് എന്നതും താഴെ കാണാം.',
            'ಈ ತಾಣ ಯಾವುದೇ ದೇವಾಲಯದ ದೇಣಿಗೆಯನ್ನು ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ ಅಥವಾ ನಿರ್ವಹಿಸುವುದಿಲ್ಲ. ಅಧಿಕೃತ ಸಂಪರ್ಕಗಳನ್ನಷ್ಟೇ ತೋರಿಸಲಾಗುತ್ತದೆ. ಮೂಲಗಳನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ ಮತ್ತು "ಬಾಕಿ" ಎಂದರೇನು ಎಂಬುದನ್ನು ಕೆಳಗೆ ನೋಡಬಹುದು.',
            'यह साइट किसी मंदिर का दान प्राप्त या संचालित नहीं करती। केवल आधिकारिक संपर्क दिखाए जाते हैं। नीचे आप देख सकते हैं कि स्रोत कैसे सत्यापित किए जाते हैं और "लंबित" का क्या अर्थ है।',
          )}
        </p>
        <p className="band-links">
          <Link href="/sources" lang={uiLocale}>
            {uiText('மூலங்கள்', 'Sources', 'మూలాలు', 'ഉറവിടങ്ങൾ', 'ಮೂಲಗಳು', 'स्रोत')}
          </Link>
          <Link href="/content-completeness" lang={uiLocale}>
            {uiText('உள்ளடக்க நிலை', 'Content status', 'కంటెంట్ స్థితి', 'ഉള്ളടക്ക നില', 'ವಿಷಯ ಸ್ಥಿತಿ', 'सामग्री स्थिति')}
          </Link>
        </p>
      </section>
    </>
  );
}
