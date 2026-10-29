import { useParams, Link } from 'wouter';
import { templeById, templeCompleteness } from '@/content/temples';
import { describeSourceConfidence, works, arupadaiVeedu, resolveOfficialSourceState } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { useEntityMeta } from '@/lib/routeMeta';
import { useRecentItem } from '@/lib/useRecent';
import { useLocale, type UiLocale } from '@/lib/locale';
import { evaluateCoordinatePublication } from '@/lib/geographicProvenance';

type TempleDetailCopy = {
  recordNotFound: string;
  noRecord: string;
  backToList: string;
  sixAbodes: string;
  deity: string;
  muruganForm: string;
  location: string;
  sthalaPurana: string;
  history: string;
  architecture: string;
  visitorInformation: string;
  literaryReference: string;
  traditionalContextOnly: string;
  knownInformation: string;
  stillPending: string;
  pendingNote: string;
  sourceAndState: string;
  stateDimensionsNote: string;
  coordinates: string;
  image: string;
  completeness: (documented: number, total: number) => string;
  currentOfficialInformation: string;
  freshness: string;
  currentTravelNote: string;
  darshanTimings: string;
  festivalVariation: string;
  sourceNote: string;
  sourceFormattingNote: string;
  phone: string;
  email: string;
  address: string;
  lastConfirmed: string;
  source: string;
  viewSourcePage: string;
  officialContact: string;
  donationNote: string;
};

const COPY: Record<UiLocale, TempleDetailCopy> = {
  ta: {
    recordNotFound: 'பதிவு காணப்படவில்லை',
    noRecord: 'இந்த முகவரிக்குக் கோயில் பதிவு இல்லை.',
    backToList: 'கோயில் பட்டியலுக்குத் திரும்பு',
    sixAbodes: 'அறுபடை வீடு',
    deity: 'தெய்வம்',
    muruganForm: 'முருகன் வடிவம்',
    location: 'இடம்',
    sthalaPurana: 'தல புராணம்',
    history: 'வரலாறு',
    architecture: 'கட்டிடக்கலை',
    visitorInformation: 'பயணத் தகவல்',
    literaryReference: 'இலக்கியக் குறிப்பு —',
    traditionalContextOnly: 'இது பாரம்பரியச் சூழல் மட்டுமே, நவீன பயணத் தகவலுக்கான ஆதாரம் அல்ல.',
    knownInformation: 'அறியப்பட்ட தகவல்',
    stillPending: 'இன்னும் நிலுவையில்',
    pendingNote: 'சரிபார்க்கப்படாத தகவலை இத்தளம் வெளியிடாது. இது கோயிலின் அடையாளம் குறித்த ஐயத்தைக் குறிக்காது — கீழே "மூலமும் நிலையும்" பிரிவைப் பார்க்கவும்.',
    sourceAndState: 'மூலமும் நிலையும்',
    stateDimensionsNote: 'கீழேயுள்ள ஒவ்வொரு நிலையும் ஒரு தனித்தன்மையைக் குறிக்கிறது; ஒன்று மற்றொன்றைப் பொதுமைப்படுத்தாது.',
    coordinates: 'ஆயத்தொலைவு',
    image: 'படம்',
    completeness: (documented, total) => `முழுமை நிலை: ${documented}/${total} விவரப் புலங்கள் கிடைத்துள்ளன.`,
    currentOfficialInformation: 'தற்போதைய உத்தியோகபூர்வத் தகவல்',
    freshness: 'தற்போதைமை',
    currentTravelNote: 'தற்போதைய நேரம், சேவைகள் மற்றும் பயணத் தகவலை உத்தியோகபூர்வ கோயில் / HR&CE மூலத்துடன் பயணத்திற்கு முன் உறுதி செய்யவும்.',
    darshanTimings: 'தரிசன நேரம்',
    festivalVariation: 'திருவிழா நாட்களில் நேரம் மாறுபடலாம்.',
    sourceNote: 'மூலக் குறிப்பு',
    sourceFormattingNote: 'மூல அட்டவணையில் வடிவமைப்புச் சிக்கல் இருந்தது; இணைந்த தமிழ் விளக்கத்தின் அடிப்படையில் மேலேயுள்ள நேரம் இயல்பாக்கப்பட்டுள்ளது — பயணத்திற்கு முன் மீண்டும் உறுதி செய்யவும்.',
    phone: 'தொலைபேசி',
    email: 'மின்னஞ்சல்',
    address: 'முகவரி',
    lastConfirmed: 'கடைசியாக உறுதிசெய்யப்பட்டது:',
    source: 'மூலம்:',
    viewSourcePage: 'மூலப் பக்கத்தில் காண்க ↗',
    officialContact: 'உத்தியோகபூர்வ தொடர்பு',
    donationNote: 'கீழ்க்கண்டது கோயிலின் உத்தியோகபூர்வ சேனல். இத்தளம் நன்கொடைகளைப் பெறுவதோ கையாள்வதோ இல்லை.',
  },
  en: {
    recordNotFound: 'Record not found',
    noRecord: 'There is no temple record at this address.',
    backToList: 'Back to temple list',
    sixAbodes: 'Six Abodes',
    deity: 'Deity',
    muruganForm: "Murugan's form",
    location: 'Location',
    sthalaPurana: 'Sthala Purana',
    history: 'History',
    architecture: 'Architecture',
    visitorInformation: 'Visitor information',
    literaryReference: 'Literary reference —',
    traditionalContextOnly: 'This is traditional context only, not a source for modern travel information.',
    knownInformation: 'Known Information',
    stillPending: 'Still Pending',
    pendingNote: 'This site does not publish unverified information. This does not indicate any doubt about the temple\'s identity — see the "Source and State" section below.',
    sourceAndState: 'Source and State',
    stateDimensionsNote: 'Each state below represents one distinct dimension; one is never generalized to imply another.',
    coordinates: 'Coordinates',
    image: 'Image',
    completeness: (documented, total) => `Completeness: ${documented}/${total} detail fields are available.`,
    currentOfficialInformation: 'Current Official Information',
    freshness: 'Freshness',
    currentTravelNote: 'Please confirm current timings, services, and visitor information with the official temple / HR&CE source before you travel.',
    darshanTimings: 'Darshan timings',
    festivalVariation: 'Timings may vary on festival days.',
    sourceNote: 'Source Note',
    sourceFormattingNote: 'There was a formatting issue in the source table; the timing above has been normalized based on the accompanying Tamil description — please reconfirm before you travel.',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    lastConfirmed: 'Last confirmed:',
    source: 'Source:',
    viewSourcePage: 'View on source page ↗',
    officialContact: 'Official Contact',
    donationNote: "Below is the temple's official channel. This site does not receive or handle donations.",
  },
  te: {
    recordNotFound: 'రికార్డు కనబడలేదు',
    noRecord: 'ఈ చిరునామాకు ఆలయ రికార్డు లేదు.',
    backToList: 'ఆలయాల జాబితాకు తిరిగి వెళ్ళండి',
    sixAbodes: 'ఆరు పవిత్ర క్షేత్రాలు',
    deity: 'దేవత',
    muruganForm: 'మురుగన్ రూపం',
    location: 'స్థానం',
    sthalaPurana: 'స్థల పురాణం',
    history: 'చరిత్ర',
    architecture: 'వాస్తుశిల్పం',
    visitorInformation: 'సందర్శకుల సమాచారం',
    literaryReference: 'సాహిత్య సూచన —',
    traditionalContextOnly: 'ఇది సంప్రదాయ సందర్భం మాత్రమే; ఆధునిక ప్రయాణ సమాచారానికి మూలం కాదు.',
    knownInformation: 'తెలిసిన సమాచారం',
    stillPending: 'ఇంకా పెండింగ్‌లో ఉంది',
    pendingNote: 'ధృవీకరించని సమాచారాన్ని ఈ సైట్ ప్రచురించదు. ఇది ఆలయ గుర్తింపుపై సందేహాన్ని సూచించదు — దిగువనున్న "మూలం మరియు స్థితి" విభాగాన్ని చూడండి.',
    sourceAndState: 'మూలం మరియు స్థితి',
    stateDimensionsNote: 'క్రింద ఉన్న ప్రతి స్థితి వేర్వేరు అంశాన్ని సూచిస్తుంది; ఒకదానిని మరొకదానికి సాధారణీకరించరు.',
    coordinates: 'నిర్దేశాంకాలు',
    image: 'చిత్రం',
    completeness: (documented, total) => `పూర్తితనం: ${documented}/${total} వివరాల ఫీల్డులు అందుబాటులో ఉన్నాయి.`,
    currentOfficialInformation: 'ప్రస్తుత అధికారిక సమాచారం',
    freshness: 'తాజాదనం',
    currentTravelNote: 'ప్రయాణానికి ముందు ప్రస్తుత సమయాలు, సేవలు మరియు సందర్శకుల సమాచారాన్ని అధికారిక ఆలయం / HR&CE మూలంతో నిర్ధారించండి.',
    darshanTimings: 'దర్శన సమయాలు',
    festivalVariation: 'పండుగ రోజులలో సమయాలు మారవచ్చు.',
    sourceNote: 'మూల గమనిక',
    sourceFormattingNote: 'మూల పట్టికలో ఫార్మాటింగ్ సమస్య ఉంది; అనుబంధ తమిళ వివరణ ఆధారంగా పై సమయాన్ని సాధారణీకరించారు — ప్రయాణానికి ముందు మళ్లీ నిర్ధారించండి.',
    phone: 'ఫోన్',
    email: 'ఇమెయిల్',
    address: 'చిరునామా',
    lastConfirmed: 'చివరిసారిగా నిర్ధారించబడింది:',
    source: 'మూలం:',
    viewSourcePage: 'మూల పేజీలో చూడండి ↗',
    officialContact: 'అధికారిక సంప్రదింపు',
    donationNote: 'క్రిందది ఆలయ అధికారిక ఛానల్. ఈ సైట్ విరాళాలను స్వీకరించదు లేదా నిర్వహించదు.',
  },
  ml: {
    recordNotFound: 'രേഖ കണ്ടെത്താനായില്ല',
    noRecord: 'ഈ വിലാസത്തിന് ക്ഷേത്രരേഖയില്ല.',
    backToList: 'ക്ഷേത്രപ്പട്ടികയിലേക്ക് മടങ്ങുക',
    sixAbodes: 'ആറ് പുണ്യസ്ഥാനങ്ങൾ',
    deity: 'ദേവത',
    muruganForm: 'മുരുകന്റെ രൂപം',
    location: 'സ്ഥലം',
    sthalaPurana: 'സ്ഥലപുരാണം',
    history: 'ചരിത്രം',
    architecture: 'വാസ്തുശിൽപം',
    visitorInformation: 'സന്ദർശക വിവരം',
    literaryReference: 'സാഹിത്യ പരാമർശം —',
    traditionalContextOnly: 'ഇത് പാരമ്പര്യ പശ്ചാത്തലം മാത്രമാണ്; ആധുനിക യാത്രാവിവരത്തിനുള്ള ഉറവിടമല്ല.',
    knownInformation: 'അറിയാവുന്ന വിവരം',
    stillPending: 'ഇനിയും ബാക്കി',
    pendingNote: 'സ്ഥിരീകരിക്കാത്ത വിവരം ഈ സൈറ്റ് പ്രസിദ്ധീകരിക്കില്ല. ഇത് ക്ഷേത്രത്തിന്റെ തിരിച്ചറിയലിനെക്കുറിച്ചുള്ള സംശയം സൂചിപ്പിക്കുന്നതല്ല — താഴെയുള്ള "ഉറവിടവും നിലയും" വിഭാഗം കാണുക.',
    sourceAndState: 'ഉറവിടവും നിലയും',
    stateDimensionsNote: 'താഴെയുള്ള ഓരോ നിലയും വ്യത്യസ്തമായ ഒരു ഘടകത്തെ സൂചിപ്പിക്കുന്നു; ഒന്നിനെ മറ്റൊന്നിനെ സൂചിപ്പിക്കുന്നതായി പൊതുവാക്കില്ല.',
    coordinates: 'നിർദ്ദേശാങ്കങ്ങൾ',
    image: 'ചിത്രം',
    completeness: (documented, total) => `പൂർണ്ണത: ${documented}/${total} വിശദവിവര ഫീൽഡുകൾ ലഭ്യമാണ്.`,
    currentOfficialInformation: 'നിലവിലെ ഔദ്യോഗിക വിവരം',
    freshness: 'പുതുക്കൽ നില',
    currentTravelNote: 'യാത്രയ്ക്ക് മുമ്പ് നിലവിലെ സമയങ്ങൾ, സേവനങ്ങൾ, സന്ദർശക വിവരം എന്നിവ ഔദ്യോഗിക ക്ഷേത്ര / HR&CE ഉറവിടത്തിൽ സ്ഥിരീകരിക്കുക.',
    darshanTimings: 'ദർശന സമയം',
    festivalVariation: 'ഉത്സവ ദിവസങ്ങളിൽ സമയത്തിൽ മാറ്റമുണ്ടാകാം.',
    sourceNote: 'ഉറവിട കുറിപ്പ്',
    sourceFormattingNote: 'ഉറവിട പട്ടികയിൽ ഫോർമാറ്റിംഗ് പ്രശ്നമുണ്ടായിരുന്നു; അനുബന്ധ തമിഴ് വിവരണത്തിന്റെ അടിസ്ഥാനത്തിൽ മുകളിലെ സമയം സാധാരണപ്പെടുത്തിയതാണ് — യാത്രയ്ക്ക് മുമ്പ് വീണ്ടും സ്ഥിരീകരിക്കുക.',
    phone: 'ഫോൺ',
    email: 'ഇമെയിൽ',
    address: 'വിലാസം',
    lastConfirmed: 'അവസാനം സ്ഥിരീകരിച്ചത്:',
    source: 'ഉറവിടം:',
    viewSourcePage: 'ഉറവിട പേജിൽ കാണുക ↗',
    officialContact: 'ഔദ്യോഗിക ബന്ധപ്പെടൽ',
    donationNote: 'താഴെ കൊടുത്തിരിക്കുന്നത് ക്ഷേത്രത്തിന്റെ ഔദ്യോഗിക ചാനലാണ്. ഈ സൈറ്റ് സംഭാവനകൾ സ്വീകരിക്കുകയോ കൈകാര്യം ചെയ്യുകയോ ചെയ്യുന്നില്ല.',
  },
  kn: {
    recordNotFound: 'ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ',
    noRecord: 'ಈ ವಿಳಾಸಕ್ಕೆ ದೇವಾಲಯದ ದಾಖಲೆ ಇಲ್ಲ.',
    backToList: 'ದೇವಾಲಯಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ',
    sixAbodes: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು',
    deity: 'ದೇವತೆ',
    muruganForm: 'ಮುರುಗನ ರೂಪ',
    location: 'ಸ್ಥಳ',
    sthalaPurana: 'ಸ್ಥಳಪುರಾಣ',
    history: 'ಇತಿಹಾಸ',
    architecture: 'ವಾಸ್ತುಶಿಲ್ಪ',
    visitorInformation: 'ಸಂದರ್ಶಕರ ಮಾಹಿತಿ',
    literaryReference: 'ಸಾಹಿತ್ಯ ಉಲ್ಲೇಖ —',
    traditionalContextOnly: 'ಇದು ಪರಂಪರাগত ಸಂದರ್ಭ ಮಾತ್ರ; ಆಧುನಿಕ ಪ್ರಯಾಣ ಮಾಹಿತಿಗೆ ಮೂಲವಲ್ಲ.',
    knownInformation: 'ತಿಳಿದಿರುವ ಮಾಹಿತಿ',
    stillPending: 'ಇನ್ನೂ ಬಾಕಿ',
    pendingNote: 'ದೃಢೀಕರಿಸದ ಮಾಹಿತಿಯನ್ನು ಈ ತಾಣ ಪ್ರಕಟಿಸುವುದಿಲ್ಲ. ಇದು ದೇವಾಲಯದ ಗುರುತಿನ ಬಗ್ಗೆ ಅನುಮಾನವನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ — ಕೆಳಗಿನ "ಮೂಲ ಮತ್ತು ಸ್ಥಿತಿ" ವಿಭಾಗವನ್ನು ನೋಡಿ.',
    sourceAndState: 'ಮೂಲ ಮತ್ತು ಸ್ಥಿತಿ',
    stateDimensionsNote: 'ಕೆಳಗಿನ ಪ್ರತಿಯೊಂದು ಸ್ಥಿತಿಯೂ ಪ್ರತ್ಯೇಕ ಆಯಾಮವನ್ನು ಸೂಚಿಸುತ್ತದೆ; ಒಂದನ್ನು ಮತ್ತೊಂದರ ಸೂಚಕವಾಗಿ ಸಾಮಾನ್ಯೀಕರಿಸುವುದಿಲ್ಲ.',
    coordinates: 'ನಿರ್ದೇಶಾಂಕಗಳು',
    image: 'ಚಿತ್ರ',
    completeness: (documented, total) => `ಪೂರ್ಣತೆ: ${documented}/${total} ವಿವರ ಕ್ಷೇತ್ರಗಳು ಲಭ್ಯವಿವೆ.`,
    currentOfficialInformation: 'ಪ್ರಸ್ತುತ ಅಧಿಕೃತ ಮಾಹಿತಿ',
    freshness: 'ನವೀನತೆ',
    currentTravelNote: 'ಪ್ರಯಾಣಕ್ಕೂ ಮೊದಲು ಪ್ರಸ್ತುತ ಸಮಯ, ಸೇವೆಗಳು ಮತ್ತು ಸಂದರ್ಶಕರ ಮಾಹಿತಿಯನ್ನು ಅಧಿಕೃತ ದೇವಾಲಯ / HR&CE ಮೂಲದೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
    darshanTimings: 'ದರ್ಶನ ಸಮಯ',
    festivalVariation: 'ಹಬ್ಬದ ದಿನಗಳಲ್ಲಿ ಸಮಯ ಬದಲಾಗಬಹುದು.',
    sourceNote: 'ಮೂಲ ಟಿಪ್ಪಣಿ',
    sourceFormattingNote: 'ಮೂಲ ಪಟ್ಟಿಯಲ್ಲಿ ವಿನ್ಯಾಸ ಸಮಸ್ಯೆ ಇತ್ತು; ಜೊತೆಯ ತಮಿಳು ವಿವರಣೆಯ ಆಧಾರದ ಮೇಲೆ ಮೇಲಿನ ಸಮಯವನ್ನು ಸಾಮಾನ್ಯೀಕರಿಸಲಾಗಿದೆ — ಪ್ರಯಾಣಕ್ಕೂ ಮೊದಲು ಮರುದೃಢೀಕರಿಸಿ.',
    phone: 'ದೂರವಾಣಿ',
    email: 'ಇಮೇಲ್',
    address: 'ವಿಳಾಸ',
    lastConfirmed: 'ಕೊನೆಯದಾಗಿ ದೃಢೀಕರಿಸಿದ್ದು:',
    source: 'ಮೂಲ:',
    viewSourcePage: 'ಮೂಲ ಪುಟದಲ್ಲಿ ನೋಡಿ ↗',
    officialContact: 'ಅಧಿಕೃತ ಸಂಪರ್ಕ',
    donationNote: 'ಕೆಳಗಿನದು ದೇವಾಲಯದ ಅಧಿಕೃತ ಚಾನಲ್. ಈ ತಾಣ ದೇಣಿಗೆಗಳನ್ನು ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ ಅಥವಾ ನಿರ್ವಹಿಸುವುದಿಲ್ಲ.',
  },
  hi: {
    recordNotFound: 'रिकॉर्ड नहीं मिला',
    noRecord: 'इस पते के लिए कोई मंदिर रिकॉर्ड उपलब्ध नहीं है।',
    backToList: 'मंदिर सूची पर वापस जाएँ',
    sixAbodes: 'छह पवित्र धाम',
    deity: 'देवता',
    muruganForm: 'मुरुगन का स्वरूप',
    location: 'स्थान',
    sthalaPurana: 'स्थल पुराण',
    history: 'इतिहास',
    architecture: 'वास्तुकला',
    visitorInformation: 'आगंतुक जानकारी',
    literaryReference: 'साहित्यिक संदर्भ —',
    traditionalContextOnly: 'यह केवल पारंपरिक संदर्भ है; आधुनिक यात्रा जानकारी का स्रोत नहीं है।',
    knownInformation: 'ज्ञात जानकारी',
    stillPending: 'अभी लंबित',
    pendingNote: 'यह साइट अपुष्ट जानकारी प्रकाशित नहीं करती। इसका अर्थ मंदिर की पहचान पर संदेह नहीं है — नीचे "स्रोत और स्थिति" अनुभाग देखें।',
    sourceAndState: 'स्रोत और स्थिति',
    stateDimensionsNote: 'नीचे दी गई प्रत्येक स्थिति एक अलग आयाम दर्शाती है; एक को दूसरे का संकेत मानकर सामान्यीकृत नहीं किया जाता।',
    coordinates: 'निर्देशांक',
    image: 'छवि',
    completeness: (documented, total) => `पूर्णता: ${documented}/${total} विवरण फ़ील्ड उपलब्ध हैं।`,
    currentOfficialInformation: 'वर्तमान आधिकारिक जानकारी',
    freshness: 'नवीनता',
    currentTravelNote: 'यात्रा से पहले वर्तमान समय, सेवाओं और आगंतुक जानकारी की पुष्टि आधिकारिक मंदिर / HR&CE स्रोत से करें।',
    darshanTimings: 'दर्शन समय',
    festivalVariation: 'त्योहार के दिनों में समय बदल सकता है।',
    sourceNote: 'स्रोत टिप्पणी',
    sourceFormattingNote: 'स्रोत तालिका में फ़ॉर्मैटिंग समस्या थी; साथ दिए गए तमिल विवरण के आधार पर ऊपर का समय सामान्यीकृत किया गया है — यात्रा से पहले फिर से पुष्टि करें।',
    phone: 'फ़ोन',
    email: 'ईमेल',
    address: 'पता',
    lastConfirmed: 'अंतिम पुष्टि:',
    source: 'स्रोत:',
    viewSourcePage: 'स्रोत पृष्ठ पर देखें ↗',
    officialContact: 'आधिकारिक संपर्क',
    donationNote: 'नीचे मंदिर का आधिकारिक चैनल है। यह साइट दान प्राप्त या प्रबंधित नहीं करती।',
  },
};

export default function TempleDetail() {
  const params = useParams<{ id: string }>();
  const temple = params.id ? templeById(params.id) : undefined;
  const { uiLocale, locale } = useLocale();
  const copy = COPY[uiLocale];
  useEntityMeta(`/temples/${params.id ?? ''}`, {
    titleTa: temple?.nameTa ?? temple?.nameEn ?? null,
    titleEn: temple?.nameEn ?? temple?.nameTa ?? null,
    descriptionTa: temple ? `${temple.nameTa ?? temple.nameEn} — கோயில் பதிவு, மூலம் மற்றும் நிலையுடன்.` : null,
    descriptionEn: temple ? `${temple.nameEn ?? temple.nameTa} — a temple record, with source and state.` : null,
  });
  useRecentItem(temple ? { type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn } : null);

  if (!temple) {
    return (
      <article className="page">
        <h1 lang={uiLocale}>{copy.recordNotFound}</h1>
        <p lang={uiLocale}>{copy.noRecord}</p>
        <Link href="/temples" lang={uiLocale}>{copy.backToList}</Link>
      </article>
    );
  }

  const { documentedFields, totalFields } = templeCompleteness(temple);
  const primarySource = temple.sources[0];
  const sourceConfidence = describeSourceConfidence(primarySource?.confidence, locale);
  const pilgrimageStop = arupadaiVeedu.find((a) => a.id === temple.id);
  const officialSourceState = pilgrimageStop?.officialCurrentSource ? resolveOfficialSourceState(pilgrimageStop.officialCurrentSource) : null;
  const coordinateDecision = evaluateCoordinatePublication({
    latitude: temple.latitude,
    longitude: temple.longitude,
    coordinateConfidence: temple.coordinateConfidence,
  });
  const showEnglishFirst = locale === 'en' && Boolean(temple.nameEn);
  const contentLang = (value: string) => /[\u0B80-\u0BFF]/u.test(value) ? 'ta' : 'en';
  const facts = [
    temple.deity && { labelTa: 'தெய்வம்', labelUi: copy.deity, value: temple.deity },
    temple.muruganForm && { labelTa: 'முருகன் வடிவம்', labelUi: copy.muruganForm, value: temple.muruganForm },
    (temple.district || temple.state) && { labelTa: 'இடம்', labelUi: copy.location, value: [temple.district, temple.state].filter(Boolean).join(', ') },
  ].filter((f): f is { labelTa: string; labelUi: string; value: string } => Boolean(f));

  const proseFields = [
    { key: 'sthalaPurana', labelTa: 'தல புராணம்', labelUi: copy.sthalaPurana, value: temple.sthalaPurana },
    { key: 'history', labelTa: 'வரலாறு', labelUi: copy.history, value: temple.history },
    { key: 'architecture', labelTa: 'கட்டிடக்கலை', labelUi: copy.architecture, value: temple.architecture },
    { key: 'visitorInformation', labelTa: 'பயணத் தகவல்', labelUi: copy.visitorInformation, value: temple.visitorInformation },
  ];
  const populatedProse = proseFields.filter((f): f is { key: string; labelTa: string; labelUi: string; value: string } => Boolean(f.value));
  const pendingProse = proseFields.filter((f) => !f.value);

  const literaryLinks = temple.literaryRelationships
    .map((rel) => {
      const r = rel as { work_id?: string };
      const work = r.work_id ? works.find((w) => w.id === r.work_id) : undefined;
      return work ? { id: work.id, titleTa: work.titleTa } : null;
    })
    .filter((w): w is { id: string; titleTa: string | null } => w !== null);

  const readAloudText = [
    temple.nameTa,
    ...facts.map((fact) => `${fact.labelTa}: ${fact.value}`),
    ...populatedProse.map((field) => `${field.labelTa}. ${field.value}`),
  ].filter((value): value is string => Boolean(value)).join('. ');

  return (
    <article className="page">
      <header className="page-head temple-head">
        <div className="temple-head-top">
          {temple.classification.length > 0 && (
            <p className="tag-row">{temple.classification.map((c) => <span key={c} className="tag" lang="ta">{c}</span>)}</p>
          )}
          {pilgrimageStop && (
            <span className="temple-pilgrimage-flag" lang={uiLocale}>{copy.sixAbodes} · {String(pilgrimageStop.pilgrimageOrder).padStart(2, '0')}</span>
          )}
        </div>
        {showEnglishFirst ? (
          <><h1 lang="en">{temple.nameEn}</h1>{temple.nameTa && <p className="latin-name" lang="ta">{temple.nameTa}</p>}</>
        ) : (
          <><h1 lang={temple.nameTa ? 'ta' : 'en'}>{temple.nameTa ?? temple.nameEn}</h1>{temple.nameEn && <p className="latin-name" lang="en">{temple.nameEn}</p>}</>
        )}
        {facts.length > 0 && (
          <p className="temple-facts">
            {facts.map((f, i) => <span key={f.labelTa}>{i > 0 ? ' · ' : ''}<b lang={uiLocale}>{f.labelUi}:</b> <span lang={contentLang(f.value)}>{f.value}</span></span>)}
          </p>
        )}
        <div className="record-actions">
          <SaveControl item={{ type: 'temple', id: temple.id, titleTa: temple.nameTa, titleEn: temple.nameEn }} />
          {readAloudText && <ReadAloud text={readAloudText} labelTa="கோயில் பதிவை வாசிக்க" labelEn="Read the temple record aloud" />}
        </div>
      </header>

      {literaryLinks.length > 0 && (
        <p className="stop-literary" lang={uiLocale}>
          {copy.literaryReference}{' '}
          {literaryLinks.map((w, i) => <span key={w.id}>{i > 0 ? ', ' : ''}<span lang="ta">{w.titleTa ?? w.id}</span></span>)}
          . {copy.traditionalContextOnly}
        </p>
      )}

      {populatedProse.length > 0 && (
        <section className="temple-known" aria-labelledby="known-h">
          <h2 id="known-h" lang={uiLocale}>{copy.knownInformation}</h2>
          {populatedProse.map((f) => <div className="temple-prose" key={f.key}><h3 lang={uiLocale}>{f.labelUi}</h3><p lang={contentLang(f.value)}>{f.value}</p></div>)}
        </section>
      )}

      {pendingProse.length > 0 && (
        <section className="temple-pending" aria-labelledby="pending-h">
          <h2 id="pending-h" lang={uiLocale}>{copy.stillPending}</h2>
          <ul className="temple-pending-list">{pendingProse.map((f) => <li key={f.key} lang={uiLocale}>{f.labelUi}</li>)}</ul>
          <p className="note" lang={uiLocale}>{copy.pendingNote}</p>
        </section>
      )}

      <section className="provenance" aria-labelledby="prov-h">
        <h2 id="prov-h" lang={uiLocale}>{copy.sourceAndState}</h2>
        <p lang={uiLocale} className="note">{copy.stateDimensionsNote}</p>
        <p className="state-row" data-coordinate-publication-state={coordinateDecision.state}>
          <span className={`state state-${sourceConfidence.tone}`}><span className="state-dot" aria-hidden="true" /><span lang={locale}>{sourceConfidence.label}</span></span>
          <StateBadge state={coordinateDecision.state} dimension={copy.coordinates} />
          <StateBadge state={temple.imageStatus} dimension={copy.image} />
        </p>
        <p className="note" lang={uiLocale}>{copy.completeness(documentedFields, totalFields)}</p>
        {temple.sources.length > 0 && (
          <ul className="source-list">
            {temple.sources.map((s, i) => {
              const conf = describeSourceConfidence(s.confidence, locale);
              return (
                <li key={i}>
                  {s.url ? <a href={s.url} rel="noopener noreferrer" target="_blank">{s.reference ?? s.url}</a> : (s.reference ?? '—')}
                  <span className={`state state-${conf.tone} source-confidence`}><span className="state-dot" aria-hidden="true" /><span lang={locale}>{conf.label}</span></span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pilgrimageStop?.officialCurrentSource && (
        <section className="official-current" aria-labelledby="cur-h">
          <h2 id="cur-h" lang={uiLocale}>{copy.currentOfficialInformation}</h2>
          <p className="state-row"><StateBadge state={officialSourceState ?? pilgrimageStop.officialCurrentSource.state} dimension={copy.freshness} /></p>
          <p className="note" lang={uiLocale}>{copy.currentTravelNote}</p>

          {pilgrimageStop.officialCurrentSource.publishedScheduleNote && (
            <div className="official-current-row">
              <b lang={uiLocale}>{copy.darshanTimings}</b>
              <p lang="ta">{pilgrimageStop.officialCurrentSource.publishedScheduleNote}</p>
              {pilgrimageStop.officialCurrentSource.festivalVariation && <small lang={uiLocale}>{copy.festivalVariation}</small>}
            </div>
          )}

          {pilgrimageStop.officialCurrentSource.sourceDisplayQuality && (
            <div className="official-current-row"><b lang={uiLocale}>{copy.sourceNote}</b><p lang={uiLocale}>{copy.sourceFormattingNote}</p></div>
          )}

          {pilgrimageStop.officialCurrentSource.contact && (
            <dl className="fields">
              {pilgrimageStop.officialCurrentSource.contact.phone && <div className="field"><dt lang={uiLocale}>{copy.phone}</dt><dd>{pilgrimageStop.officialCurrentSource.contact.phone}</dd></div>}
              {pilgrimageStop.officialCurrentSource.contact.email && <div className="field"><dt lang={uiLocale}>{copy.email}</dt><dd>{pilgrimageStop.officialCurrentSource.contact.email}</dd></div>}
              {pilgrimageStop.officialCurrentSource.contact.addressSummary && <div className="field"><dt lang={uiLocale}>{copy.address}</dt><dd>{pilgrimageStop.officialCurrentSource.contact.addressSummary}</dd></div>}
            </dl>
          )}

          <p className="note" lang={uiLocale}>{copy.lastConfirmed}{' '}{pilgrimageStop.officialCurrentSource.lastVerifiedAt.slice(0, 10)} · {copy.source}{' '}{pilgrimageStop.officialCurrentSource.sourceAuthority}</p>
          {(pilgrimageStop.officialCurrentSource.timingSourceUrl ?? pilgrimageStop.officialCurrentSource.officialBaseUrl) && (
            <a className="source-link" href={pilgrimageStop.officialCurrentSource.timingSourceUrl ?? pilgrimageStop.officialCurrentSource.officialBaseUrl ?? undefined} rel="noopener noreferrer" target="_blank" lang={uiLocale}>{copy.viewSourcePage}</a>
          )}
        </section>
      )}

      {temple.officialDirectSupportLink && (
        <section className="official" aria-labelledby="off-h">
          <h2 id="off-h" lang={uiLocale}>{copy.officialContact}</h2>
          <p lang={uiLocale}>{copy.donationNote}</p>
          <a className="official-link" href={temple.officialDirectSupportLink} rel="noopener noreferrer" target="_blank">{temple.officialAuthority ?? temple.officialDirectSupportLink}</a>
        </section>
      )}
    </article>
  );
}
