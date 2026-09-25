import { completeness, namavali } from '@/content';
import type { CompletenessDomain } from '@/content';
import StateBadge, { StateBadgeResolved } from '@/components/StateBadge';
import { useLocale, type UiLocale } from '@/lib/locale';
import './completeness-r213.css';

const NA_LABELS: Record<UiLocale, string> = {
  ta: 'பொருந்தாது',
  en: 'N/A',
  te: 'వర్తించదు',
  ml: 'ബാധകമല്ല',
  kn: 'ಅನ್ವಯಿಸುವುದಿಲ್ಲ',
  hi: 'लागू नहीं',
};

/**
 * Every column below is one independent dimension. R2-CODE-004: the previous
 * table folded canonical text and temple history under one "மூல உரை" header
 * via `withCanonicalText ?? withHistory ?? '—'`, so a temple's history count
 * could render under a "source text" heading. `undefined` (dimension does
 * not apply to this domain) and `0` (dimension applies, nothing published
 * yet) are rendered differently on purpose — collapsing them was the bug.
 */
function Cell({ value, locale }: { value: number | undefined; locale: UiLocale }) {
  if (value === undefined) {
    return (
      <td className="matrix-na" lang={locale}>
        {NA_LABELS[locale]}
      </td>
    );
  }
  return <td className={value === 0 ? 'matrix-zero' : undefined}>{value}</td>;
}

const COLUMNS: Array<{
  key: keyof CompletenessDomain;
  labelTa: string;
  labelEn: string;
  labelTe: string;
  labelMl: string;
  labelKn: string;
  labelHi: string;
}> = [
  { key: 'withCoordinates', labelTa: 'ஆயத்தொலைவு', labelEn: 'Coordinates', labelTe: 'నిర్దేశాంకాలు', labelMl: 'കോഓർഡിനേറ്റുകൾ', labelKn: 'ನಿರ್ದೇಶಾಂಕಗಳು', labelHi: 'निर्देशांक' },
  { key: 'withHistory', labelTa: 'வரலாறு', labelEn: 'History', labelTe: 'చరిత్ర', labelMl: 'ചരിത്രം', labelKn: 'ಇತಿಹಾಸ', labelHi: 'इतिहास' },
  { key: 'withVisitorInfo', labelTa: 'பயணத் தகவல்', labelEn: 'Visitor information', labelTe: 'సందర్శక సమాచారం', labelMl: 'സന്ദർശക വിവരം', labelKn: 'ಭೇಟಿದಾರರ ಮಾಹಿತಿ', labelHi: 'आगंतुक जानकारी' },
  { key: 'withCanonicalText', labelTa: 'மூல உரை', labelEn: 'Source text', labelTe: 'మూల పాఠ్యం', labelMl: 'മൂലപാഠം', labelKn: 'ಮೂಲ ಪಠ್ಯ', labelHi: 'मूल पाठ' },
  { key: 'withMeaning', labelTa: 'பொருள்', labelEn: 'Meaning', labelTe: 'అర్థం', labelMl: 'അർത്ഥം', labelKn: 'ಅರ್ಥ', labelHi: 'अर्थ' },
  { key: 'withAudio', labelTa: 'ஒலி', labelEn: 'Audio', labelTe: 'ఆడియో', labelMl: 'ഓഡിയോ', labelKn: 'ಆಡಿಯೋ', labelHi: 'ऑडियो' },
];

/**
 * `namavali.researchState` carries raw internal research-tracking codes
 * (e.g. "RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS") that were
 * previously rendered verbatim inside a <dd> — a raw-enum leak on the one
 * page whose entire purpose is plain-language provenance. `policy` is
 * already a plain sentence rather than a state code, so it is shown
 * separately instead of being forced into the same key/value list.
 */
const RESEARCH_ITEM_LABELS: Record<string, { ta: string; en: string }> = {
  kumarastavam_44: { ta: 'குமரஸ்தவம் (44 விளி)', en: 'Kumarastavam (44 invocations)' },
  ashtottara_108: { ta: 'அஷ்டோத்தர சத நாமாவளி (108)', en: 'Ashtottara Shata Namavali (108)' },
};
const RESEARCH_STATE_LABELS: Record<string, { ta: string; en: string }> = {
  NOT_TREATED_AS_SYNTHETIC_NAMAVALI: {
    ta: 'இயற்றப்பட்ட/இணைக்கப்பட்ட நாமாவளியாகக் கருதப்படவில்லை',
    en: 'Not treated as a composed/assembled Namavali',
  },
  RESEARCH_REQUIRED_IDENTIFIABLE_EDITION_AND_RIGHTS: {
    ta: 'அடையாளம் தெரிந்த பதிப்பும் உரிமை நிலையும் தேவை',
    en: 'An identifiable edition and rights status are required',
  },
};

export default function Completeness() {
  const { policy, ...researchItems } = namavali.researchState;
  const { uiLocale, locale, text } = useLocale();
  const totalRecords = completeness.domains.reduce((sum, domain) => sum + domain.records, 0);
  const ui = (ta: string, en: string, te: string, ml: string, kn: string, hi: string) =>
    text(ta, en, { te, ml, kn, hi });

  return (
    <article className="page completeness-page">
      <header className="completeness-hero">
        <div className="completeness-hero-copy">
          <p className="completeness-eyebrow" lang={uiLocale}>
            {ui('வெளியீட்டு வெளிப்படைமை', 'Publication transparency', 'ప్రచురణ పారదర్శకత', 'പ്രസിദ്ധീകരണ സുതാര്യത', 'ಪ್ರಕಟಣೆ ಪಾರದರ್ಶಕತೆ', 'प्रकाशन पारदर्शिता')}
          </p>
          <h1 lang={uiLocale}>{ui('உள்ளடக்க நிலை', 'Content Status', 'కంటెంట్ స్థితి', 'ഉള്ളടക്ക നില', 'ವಿಷಯ ಸ್ಥಿತಿ', 'सामग्री स्थिति')}</h1>
          <p lang={uiLocale}>
            {ui(
              'இத்தளத்தில் உண்மையில் உள்ள பதிவுகளின் எண்ணிக்கை. எதிர்பார்ப்பு அல்ல. ஒவ்வொரு நெடுவரிசையும் ஒரு தனித்தன்மையைக் குறிக்கிறது.',
              'The count of records that actually exist on this site — not an aspiration. Each column represents one independent publication dimension.',
              'ఈ సైట్‌లో నిజంగా ఉన్న రికార్డుల సంఖ్య — లక్ష్యం కాదు. ప్రతి కాలమ్ ఒక స్వతంత్ర ప్రచురణ పరిమాణాన్ని సూచిస్తుంది.',
              'ഈ സൈറ്റിൽ യഥാർത്ഥത്തിൽ ഉള്ള രേഖകളുടെ എണ്ണമാണ് ഇത് — ഒരു ലക്ഷ്യമല്ല. ഓരോ കോളവും സ്വതന്ത്ര പ്രസിദ്ധീകരണ അളവിനെ സൂചിപ്പിക്കുന്നു.',
              'ಈ ತಾಣದಲ್ಲಿ ನಿಜವಾಗಿಯೂ ಇರುವ ದಾಖಲೆಗಳ ಸಂಖ್ಯೆಯಿದು — ಗುರಿಯಲ್ಲ. ಪ್ರತಿಯೊಂದು ಕಾಲಮ್ ಸ್ವತಂತ್ರ ಪ್ರಕಟಣೆ ಆಯಾಮವನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
              'यह इस साइट पर वास्तव में मौजूद अभिलेखों की संख्या है — कोई लक्ष्य नहीं। प्रत्येक स्तंभ एक स्वतंत्र प्रकाशन आयाम दर्शाता है।',
            )}
          </p>
        </div>
        <dl className="completeness-summary" aria-label={ui('உள்ளடக்க நிலை சுருக்கம்', 'Content status summary', 'కంటెంట్ స్థితి సారాంశం', 'ഉള്ളടക്ക നിലയുടെ സംഗ്രഹം', 'ವಿಷಯ ಸ್ಥಿತಿ ಸಾರಾಂಶ', 'सामग्री स्थिति सारांश')}>
          <div><dt lang={uiLocale}>{ui('பிரிவுகள்', 'Domains', 'విభాగాలు', 'ഡൊമെയ്‌നുകൾ', 'ವಿಭಾಗಗಳು', 'डोमेन')}</dt><dd>{completeness.domains.length}</dd></div>
          <div><dt lang={uiLocale}>{ui('பதிவுகள்', 'Records', 'రికార్డులు', 'രേഖകൾ', 'ದಾಖಲೆಗಳು', 'अभिलेख')}</dt><dd>{totalRecords}</dd></div>
          <div><dt lang={uiLocale}>{ui('அளவுகள்', 'Dimensions', 'పరిమాణాలు', 'അളവുകൾ', 'ಆಯಾಮಗಳು', 'आयाम')}</dt><dd>{COLUMNS.length}</dd></div>
        </dl>
      </header>

      <section className="completeness-section" aria-labelledby="matrix-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={uiLocale}>{ui('வெளியீட்டு அணி', 'Publication matrix', 'ప్రచురణ మ్యాట్రిక్స్', 'പ്രസിദ്ധീകരണ മാട്രിക്സ്', 'ಪ್ರಕಟಣೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್', 'प्रकाशन मैट्रिक्स')}</p>
          <h2 id="matrix-h" lang={uiLocale}>{ui('எது வெளியிடப்பட்டுள்ளது', 'What is actually published', 'వాస్తవంగా ఏమి ప్రచురించబడింది', 'യഥാർത്ഥത്തിൽ പ്രസിദ്ധീകരിച്ചിരിക്കുന്നത്', 'ನಿಜವಾಗಿ ಪ್ರಕಟಿಸಿರುವುದು', 'वास्तव में क्या प्रकाशित है')}</h2>
          <p lang={uiLocale}>
            {ui(
              '“பொருந்தாது” என்பது அந்த அளவு அந்தப் பிரிவுக்கு பொருந்தாது என்பதைக் குறிக்கும். “0” என்பது அது பொருந்தும், ஆனால் இதுவரை எதுவும் வெளியிடப்படவில்லை என்பதைக் குறிக்கும்.',
              '“N/A” means the dimension does not apply to that domain. “0” means it does apply, but nothing has been published yet.',
              '“వర్తించదు” అంటే ఆ పరిమాణం ఆ విభాగానికి వర్తించదు. “0” అంటే అది వర్తిస్తుంది, కానీ ఇంకా ఏదీ ప్రచురించబడలేదు.',
              '“ബാധകമല്ല” എന്നത് ആ അളവ് ആ വിഭാഗത്തിന് ബാധകമല്ലെന്നർത്ഥം. “0” എന്നത് ബാധകമാണെങ്കിലും ഇതുവരെ ഒന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ലെന്നർത്ഥം.',
              '“ಅನ್ವಯಿಸುವುದಿಲ್ಲ” ಎಂದರೆ ಆ ಆಯಾಮವು ಆ ವಿಭಾಗಕ್ಕೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ. “0” ಎಂದರೆ ಅದು ಅನ್ವಯಿಸುತ್ತದೆ, ಆದರೆ ಇನ್ನೂ ಏನೂ ಪ್ರಕಟವಾಗಿಲ್ಲ.',
              '“लागू नहीं” का अर्थ है कि वह आयाम उस डोमेन पर लागू नहीं होता। “0” का अर्थ है कि वह लागू होता है, लेकिन अभी कुछ प्रकाशित नहीं हुआ है।',
            )}
          </p>
        </div>

        <div className="completeness-legend" aria-label={ui('அணி குறியீடு', 'Matrix legend', 'మ్యాట్రిక్స్ సూచిక', 'മാട്രിക്സ് ലെജൻഡ്', 'ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಸೂಚಿಕೆ', 'मैट्रिक्स संकेत')}>
          <p><span className="legend-chip legend-na" aria-hidden="true">N/A</span><span lang={uiLocale}>{ui('இந்தப் பிரிவுக்கு பொருந்தாது', 'Not applicable to this domain', 'ఈ విభాగానికి వర్తించదు', 'ഈ വിഭാഗത്തിന് ബാധകമല്ല', 'ಈ ವಿಭಾಗಕ್ಕೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ', 'इस डोमेन पर लागू नहीं')}</span></p>
          <p><span className="legend-chip legend-zero" aria-hidden="true">0</span><span lang={uiLocale}>{ui('பொருந்தும்; இன்னும் வெளியிடப்படவில்லை', 'Applicable; nothing published yet', 'వర్తిస్తుంది; ఇంకా ఏదీ ప్రచురించబడలేదు', 'ബാധകം; ഇതുവരെ ഒന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ല', 'ಅನ್ವಯಿಸುತ್ತದೆ; ಇನ್ನೂ ಏನೂ ಪ್ರಕಟವಾಗಿಲ್ಲ', 'लागू है; अभी कुछ प्रकाशित नहीं')}</span></p>
        </div>

        <div className="table-scroll completeness-table-shell" role="region" tabIndex={0} aria-label={ui('உள்ளடக்க முழுமை அட்டவணை — கிடைமட்டமாக உருட்டலாம்', 'Content completeness table — horizontally scrollable', 'కంటెంట్ సంపూర్ణత పట్టిక — అడ్డంగా స్క్రోల్ చేయవచ్చు', 'ഉള്ളടക്ക സമ്പൂർണ്ണത പട്ടിക — തിരശ്ചീനമായി സ്ക്രോൾ ചെയ്യാം', 'ವಿಷಯ ಸಂಪೂರ್ಣತೆ ಪಟ್ಟಿಕೆ — ಅಡ್ಡವಾಗಿ ಸ್ಕ್ರೋಲ್ ಮಾಡಬಹುದು', 'सामग्री पूर्णता तालिका — क्षैतिज रूप से स्क्रॉल की जा सकती है')}>
          <table className="matrix completeness-matrix">
            <caption className="sr-only">{ui('உள்ளடக்க முழுமை அட்டவணை — நெடுவரிசைக்கு நெடுவரிசை தனித்தன்மை', 'Content completeness table — each column is an independent dimension', 'కంటెంట్ సంపూర్ణత పట్టిక — ప్రతి కాలమ్ స్వతంత్ర పరిమాణం', 'ഉള്ളടക്ക സമ്പൂർണ്ണത പട്ടിക — ഓരോ കോളവും സ്വതന്ത്ര അളവാണ്', 'ವಿಷಯ ಸಂಪೂರ್ಣತೆ ಪಟ್ಟಿಕೆ — ಪ್ರತಿಯೊಂದು ಕಾಲಮ್ ಸ್ವತಂತ್ರ ಆಯಾಮ', 'सामग्री पूर्णता तालिका — प्रत्येक स्तंभ स्वतंत्र आयाम है')}</caption>
            <thead>
              <tr>
                <th scope="col" lang={uiLocale}>{ui('பிரிவு', 'Domain', 'విభాగం', 'ഡൊമെയിൻ', 'ವಿಭಾಗ', 'डोमेन')}</th>
                <th scope="col" lang={uiLocale}>{ui('பதிவுகள்', 'Records', 'రికార్డులు', 'രേഖകൾ', 'ದಾಖಲೆಗಳು', 'अभिलेख')}</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} scope="col" lang={uiLocale}>{ui(c.labelTa, c.labelEn, c.labelTe, c.labelMl, c.labelKn, c.labelHi)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completeness.domains.map((d) => (
                <tr key={d.key}>
                  <th scope="row" lang={locale}>{text(d.labelTa, d.labelEn)}</th>
                  <td>{d.records}</td>
                  {COLUMNS.map((c) => <Cell key={c.key} value={d[c.key] as number | undefined} locale={uiLocale} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="completeness-section completeness-research" aria-labelledby="namavali-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={uiLocale}>{ui('ஆய்வு எல்லை', 'Research boundary', 'పరిశోధన పరిమితి', 'ഗവേഷണ പരിധി', 'ಸಂಶೋಧನಾ ಮಿತಿ', 'अनुसंधान सीमा')}</p>
          <h2 id="namavali-h" lang={uiLocale}>{ui('நாமாவளி — ஆய்வு நிலை', 'Namavali — Research State', 'నామావళి — పరిశోధన స్థితి', 'നാമാവലി — ഗവേഷണ നില', 'ನಾಮಾವಳಿ — ಸಂಶೋಧನಾ ಸ್ಥಿತಿ', 'नामावली — अनुसंधान स्थिति')}</h2>
          <p className="completeness-dataset-status" lang={uiLocale}>{ui('தொகுப்பு நிலை:', 'Dataset status:', 'డేటాసెట్ స్థితి:', 'ഡാറ്റാസെറ്റ് നില:', 'ಡೇಟಾಸೆಟ್ ಸ್ಥಿತಿ:', 'डेटासेट स्थिति:')} <StateBadge state={namavali.datasetStatus} /></p>
        </div>
        <dl className="completeness-research-grid">
          {Object.entries(researchItems).map(([k, v]) => (
            <div className="completeness-research-item" key={k}>
              <dt lang={locale}>{text(RESEARCH_ITEM_LABELS[k]?.ta ?? k, RESEARCH_ITEM_LABELS[k]?.en ?? k)}</dt>
              <dd>
                <StateBadgeResolved label={text(RESEARCH_STATE_LABELS[v as string]?.ta ?? (v as string), RESEARCH_STATE_LABELS[v as string]?.en ?? (v as string))} tone="pending" />
              </dd>
            </div>
          ))}
        </dl>
        {typeof policy === 'string' && <p className="completeness-policy" lang="en">{policy}</p>}
      </section>

      <section className="completeness-section completeness-provenance" aria-labelledby="provenance-h">
        <div className="completeness-section-head">
          <p className="completeness-section-kicker" lang={uiLocale}>{ui('ஆதார சான்று', 'Provenance evidence', 'మూలాధార సాక్ష్యం', 'ഉറവിട തെളിവ്', 'ಮೂಲಾಧಾರ ಸಾಕ್ಷ್ಯ', 'स्रोत प्रमाण')}</p>
          <h2 id="provenance-h" lang={uiLocale}>{ui('வெளியீட்டு குறிப்புகள்', 'Release evidence', 'విడుదల ఆధారాలు', 'റിലീസ് തെളിവുകൾ', 'ಬಿಡುಗಡೆ ಸಾಕ್ಷ್ಯ', 'रिलीज़ प्रमाण')}</h2>
        </div>
        {/* Technical/methodological release notes are governed English-only
            fields. They are shown as-is rather than fabricating a translation. */}
        <p className="completeness-technical-note" lang="en">{completeness.note}</p>
        <p className="completeness-hash" lang="en">
          <span>Source archive SHA-256</span>
          <code>{completeness.sourceArchiveSha256}</code>
        </p>
      </section>
    </article>
  );
}
