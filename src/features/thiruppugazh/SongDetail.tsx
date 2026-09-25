import { useParams, Link } from 'wouter';
import { songById } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { useEntityMeta } from '@/lib/routeMeta';
import { useRecentItem } from '@/lib/useRecent';
import { useLocale, type UiLocale } from '@/lib/locale';

type SongDetailCopy = {
  songNotFound: string;
  thiruppugazhList: string;
  canonicalMissing: string;
  layers: string;
  layerNote: string;
  sourceText: string;
  meaning: string;
  transliteration: string;
  audio: string;
  source: string;
  edition: string;
  author: string;
  rightsStatus: string;
};

const COPY: Record<UiLocale, SongDetailCopy> = {
  ta: {
    songNotFound: 'பாடல் காணப்படவில்லை',
    thiruppugazhList: 'திருப்புகழ் பட்டியல்',
    canonicalMissing:
      'இப்பதிவின் மூலப் பதிப்பு அடையாளம் காணப்பட்டுள்ளது; ஆனால் மூலத் தமிழ் உரை இன்னும் ஏற்றப்படவில்லை. சரிபார்க்கப்படாத உரையை இத்தளம் நிரப்பாது.',
    layers: 'அடுக்குகள்',
    layerNote:
      'மூல உரை, பொருள், ஒலிபெயர்ப்பு, ஒலி — ஒவ்வொன்றும் தனித்தனி வெளியீட்டு நிலை; ஒன்று கிடைத்துவிட்டால் மற்றொன்றும் கிடைத்துவிட்டதாகக் கருதப்படாது.',
    sourceText: 'மூல உரை',
    meaning: 'பொருள்',
    transliteration: 'ஒலிபெயர்ப்பு',
    audio: 'ஒலி',
    source: 'மூலம்',
    edition: 'பதிப்பு',
    author: 'ஆசிரியர்',
    rightsStatus: 'உரிமை நிலை',
  },
  en: {
    songNotFound: 'Song not found',
    thiruppugazhList: 'Thiruppugazh list',
    canonicalMissing:
      "This record's source edition has been identified, but the canonical Tamil text has not yet been imported. This site will not fill the gap with unverified text.",
    layers: 'Layers',
    layerNote:
      'Source text, meaning, transliteration, audio — each has its own separate publication state; one being available never means another is too.',
    sourceText: 'Source text',
    meaning: 'Meaning',
    transliteration: 'Transliteration',
    audio: 'Audio',
    source: 'Source',
    edition: 'Edition',
    author: 'Author',
    rightsStatus: 'Rights status',
  },
  te: {
    songNotFound: 'పాట కనబడలేదు',
    thiruppugazhList: 'తిరుప్పుగళ్ జాబితా',
    canonicalMissing:
      'ఈ రికార్డు యొక్క మూల సంచిక గుర్తించబడింది; కానీ ప్రామాణిక తమిళ పాఠ్యం ఇంకా దిగుమతి చేయలేదు. ధృవీకరించని పాఠ్యంతో ఈ సైట్ ఖాళీని పూరించదు.',
    layers: 'పొరలు',
    layerNote:
      'మూల పాఠ్యం, అర్థం, లిప్యంతరీకరణ, ఆడియో — ప్రతి దానికి వేరు ప్రచురణ స్థితి ఉంది; ఒకటి అందుబాటులో ఉండటం మరొకటి కూడా అందుబాటులో ఉందని అర్థం కాదు.',
    sourceText: 'మూల పాఠ్యం',
    meaning: 'అర్థం',
    transliteration: 'లిప్యంతరీకరణ',
    audio: 'ఆడియో',
    source: 'మూలం',
    edition: 'సంచిక',
    author: 'రచయిత',
    rightsStatus: 'హక్కుల స్థితి',
  },
  ml: {
    songNotFound: 'ഗാനം കണ്ടെത്താനായില്ല',
    thiruppugazhList: 'തിരുപ്പുകഴ് പട്ടിക',
    canonicalMissing:
      'ഈ രേഖയുടെ മൂല പതിപ്പ് തിരിച്ചറിഞ്ഞിട്ടുണ്ട്; എന്നാൽ പ്രാമാണിക തമിഴ് പാഠം ഇതുവരെ ഇറക്കുമതി ചെയ്തിട്ടില്ല. പരിശോധിക്കാത്ത പാഠം ഉപയോഗിച്ച് ഈ സൈറ്റ് ആ വിടവ് നിറയ്ക്കില്ല.',
    layers: 'പാളികൾ',
    layerNote:
      'മൂലപാഠം, അർത്ഥം, ലിപ്യന്തരണം, ഓഡിയോ — ഓരോന്നിനും സ്വതന്ത്ര പ്രസിദ്ധീകരണ നിലയുണ്ട്; ഒന്ന് ലഭ്യമാണെന്നത് മറ്റൊന്നും ലഭ്യമാണെന്ന് അർത്ഥമല്ല.',
    sourceText: 'മൂലപാഠം',
    meaning: 'അർത്ഥം',
    transliteration: 'ലിപ്യന്തരണം',
    audio: 'ഓഡിയോ',
    source: 'മൂലം',
    edition: 'പതിപ്പ്',
    author: 'രചയിതാവ്',
    rightsStatus: 'അവകാശ നില',
  },
  kn: {
    songNotFound: 'ಹಾಡು ಕಂಡುಬಂದಿಲ್ಲ',
    thiruppugazhList: 'ತಿರುಪ್ಪುಗಝ್ ಪಟ್ಟಿ',
    canonicalMissing:
      'ಈ ದಾಖಲೆಯ ಮೂಲ ಆವೃತ್ತಿಯನ್ನು ಗುರುತಿಸಲಾಗಿದೆ; ಆದರೆ ಪ್ರಾಮಾಣಿಕ ತಮಿಳು ಪಠ್ಯವನ್ನು ಇನ್ನೂ ಆಮದು ಮಾಡಿಲ್ಲ. ಪರಿಶೀಲಿಸದ ಪಠ್ಯದಿಂದ ಈ ತಾಣವು ಖಾಲಿಯನ್ನು ತುಂಬುವುದಿಲ್ಲ.',
    layers: 'ಪದರಗಳು',
    layerNote:
      'ಮೂಲ ಪಠ್ಯ, ಅರ್ಥ, ಲಿಪ್ಯಂತರಣ, ಆಡಿಯೋ — ಪ್ರತಿಯೊಂದಕ್ಕೂ ಸ್ವತಂತ್ರ ಪ್ರಕಟಣಾ ಸ್ಥಿತಿ ಇದೆ; ಒಂದು ಲಭ್ಯವಿರುವುದರಿಂದ ಮತ್ತೊಂದೂ ಲಭ್ಯವಿದೆ ಎಂದರ್ಥವಲ್ಲ.',
    sourceText: 'ಮೂಲ ಪಠ್ಯ',
    meaning: 'ಅರ್ಥ',
    transliteration: 'ಲಿಪ್ಯಂತರಣ',
    audio: 'ಆಡಿಯೋ',
    source: 'ಮೂಲ',
    edition: 'ಆವೃತ್ತಿ',
    author: 'ಲೇಖಕ',
    rightsStatus: 'ಹಕ್ಕುಗಳ ಸ್ಥಿತಿ',
  },
  hi: {
    songNotFound: 'गीत नहीं मिला',
    thiruppugazhList: 'तिरुप्पुग़ल सूची',
    canonicalMissing:
      'इस रिकॉर्ड के स्रोत संस्करण की पहचान हो चुकी है, लेकिन प्रमाणित तमिल पाठ अभी आयात नहीं किया गया है। यह साइट अप्रमाणित पाठ से इस कमी को नहीं भरेगी।',
    layers: 'परतें',
    layerNote:
      'स्रोत पाठ, अर्थ, लिप्यंतरण और ऑडियो — प्रत्येक की अलग प्रकाशन स्थिति है; किसी एक के उपलब्ध होने का अर्थ यह नहीं कि दूसरा भी उपलब्ध है।',
    sourceText: 'स्रोत पाठ',
    meaning: 'अर्थ',
    transliteration: 'लिप्यंतरण',
    audio: 'ऑडियो',
    source: 'स्रोत',
    edition: 'संस्करण',
    author: 'लेखक',
    rightsStatus: 'अधिकार स्थिति',
  },
};

export default function SongDetail() {
  const params = useParams<{ id: string }>();
  const song = params.id ? songById(params.id) : undefined;
  const title = song ? (song.titleTa ?? song.openingWords) : null;
  const { uiLocale } = useLocale();
  const copy = COPY[uiLocale];
  useEntityMeta(`/thiruppugazh/${params.id ?? ''}`, {
    titleTa: title,
    titleEn: title,
    descriptionTa: title
      ? `${title} — திருப்புகழ் பதிவு, மூல பதிப்பு மற்றும் நிலையுடன்.`
      : null,
    descriptionEn: title
      ? `${title} — a Thiruppugazh record, with source edition and state.`
      : null,
  });
  useRecentItem(
    song
      ? { type: 'thiruppugazh', id: song.id, titleTa: song.titleTa ?? song.openingWords }
      : null,
  );

  if (!song) {
    return (
      <article className="page">
        <h1 lang={uiLocale}>{copy.songNotFound}</h1>
        <Link href="/thiruppugazh" lang={uiLocale}>
          {copy.thiruppugazhList}
        </Link>
      </article>
    );
  }

  return (
    <article className="page">
      <header className="page-head">
        {/* Canonical song title: always Tamil, regardless of UI language. */}
        <h1 lang="ta">{song.titleTa ?? song.openingWords}</h1>
        <p className="latin-name" lang="en">{song.edition}</p>
        <SaveControl
          item={{ type: 'thiruppugazh', id: song.id, titleTa: song.titleTa ?? song.openingWords }}
        />
      </header>

      {/* Canonical layer. Rendered only when the registry actually holds the
          verse body — never reconstructed, never paraphrased. Browser TTS is
          only offered for that governed canonical body, never for a guessed
          reconstruction or for the placeholder message. */}
      {song.canonicalText ? (
        <>
          <div className="canonical" lang="ta">{song.canonicalText}</div>
          <ReadAloud text={song.canonicalText} labelTa="மூல உரையை வாசிக்க" labelEn="Read source text aloud" />
        </>
      ) : (
        <p className="empty" lang={uiLocale}>{copy.canonicalMissing}</p>
      )}

      <section className="layers" aria-labelledby="layers-h">
        <h2 id="layers-h" lang={uiLocale}>{copy.layers}</h2>
        <p className="note" lang={uiLocale}>{copy.layerNote}</p>
        <p className="state-row">
          <StateBadge state={song.canonicalTextStatus} dimension={copy.sourceText} />
          <StateBadge state={song.meaningState} dimension={copy.meaning} />
          <StateBadge state={song.transliterationState} dimension={copy.transliteration} />
          <StateBadge state={song.audioState} dimension={copy.audio} />
        </p>
      </section>

      <section className="provenance">
        <h2 lang={uiLocale}>{copy.source}</h2>
        <dl className="fields">
          <div className="field">
            <dt lang={uiLocale}>{copy.edition}</dt>
            <dd lang={song.edition ? 'en' : undefined}>{song.edition ?? '—'}</dd>
          </div>
          <div className="field">
            <dt lang={uiLocale}>{copy.author}</dt>
            {/* Author's name is canonical/source content: always Tamil. */}
            <dd lang="ta">அருணகிரிநாதர்</dd>
          </div>
          <div className="field">
            <dt lang={uiLocale}>{copy.rightsStatus}</dt>
            <dd>{song.rightsStatus ? <StateBadge state={song.rightsStatus} /> : '—'}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
