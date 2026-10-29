import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  arupadaiVeedu,
  devotionalWorks,
  kumarastavam,
  muruganNames,
  thiruppugazh,
  works,
  describeSourceConfidence,
} from '@/content';
import { temples } from '@/content/temples';
import StateBadge from '@/components/StateBadge';
import { useLocale, type LocaleAlternates } from '@/lib/locale';

type Facet = 'all' | 'temple' | 'arupadai' | 'thiruppugazh' | 'work' | 'name';
interface Hit {
  href: string;
  titleTa: string | null;
  titleEn: string | null;
  kind: Exclude<Facet, 'all'>;
  kindTa: string;
  kindEn: string;
  aliases: string[];
  metadata: string[];
  state?: string | null | undefined;
  sourceConfidence?: string | null | undefined;
}

interface UiCopy {
  ta: string;
  en: string;
  alternates: LocaleAlternates;
}

const PAGE_SIZE = 20;
const ARUPADAI_IDS = new Set(arupadaiVeedu.map((item) => item.id));
const devotionalIds = new Set(devotionalWorks.map((item) => item.id));
const workCatalogue = [
  ...devotionalWorks,
  ...works.filter((item) => !item.id || !devotionalIds.has(item.id)),
];
const normalizeSearch = (value: string) =>
  value.normalize('NFKC').toLocaleLowerCase('ta-IN').replace(/\s+/g, ' ').trim();
const VALID_FACETS: readonly Facet[] = ['all', 'temple', 'arupadai', 'thiruppugazh', 'work', 'name'];
const isFacet = (value: string | null): value is Facet =>
  Boolean(value && VALID_FACETS.includes(value as Facet));

const readUrlState = (): { q: string; facet: Facet } => {
  if (typeof window === 'undefined') return { q: '', facet: 'all' };
  const params = new URLSearchParams(window.location.search);
  const rawFacet = params.get('type');
  return { q: params.get('q') ?? '', facet: isFacet(rawFacet) ? rawFacet : 'all' };
};

const writeUrlState = (q: string, facet: Facet) => {
  const params = new URLSearchParams(window.location.search);
  const trimmed = q.trim();
  if (trimmed) params.set('q', trimmed);
  else params.delete('q');
  if (facet === 'all') params.delete('type');
  else params.set('type', facet);
  const search = params.toString();
  const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', next);
};

const INDEX: Hit[] = [
  ...temples.map((temple) => {
    const arupadai = ARUPADAI_IDS.has(temple.id);
    return {
      href: `/temples/${temple.id}`,
      titleTa: temple.nameTa,
      titleEn: temple.nameEn,
      kind: arupadai ? ('arupadai' as const) : ('temple' as const),
      kindTa: arupadai ? 'அறுபடை வீடு' : 'கோயில்',
      kindEn: arupadai ? 'Arupadai Veedu' : 'Temple',
      aliases: [...temple.alternateNames, temple.transliteration].filter(
        (value): value is string => Boolean(value),
      ),
      metadata: [
        temple.deity,
        temple.muruganForm,
        temple.district,
        temple.state,
        ...temple.classification,
      ].filter((value): value is string => Boolean(value)),
      state: temple.coordinateConfidence,
      sourceConfidence: temple.sources[0]?.confidence,
    };
  }),
  ...thiruppugazh.map((song) => ({
    href: `/thiruppugazh/${song.id}`,
    titleTa: song.titleTa ?? song.openingWords,
    titleEn: null,
    kind: 'thiruppugazh' as const,
    kindTa: 'திருப்புகழ்',
    kindEn: 'Thiruppugazh',
    aliases: [song.openingWords].filter((value): value is string => Boolean(value)),
    metadata: [song.attribution, song.edition].filter((value): value is string => Boolean(value)),
    state: song.canonicalTextStatus,
  })),
  ...workCatalogue.map((work) => ({
    href: work.id ? `/works#work-${work.id}` : '/works',
    titleTa: work.titleTa,
    titleEn: work.titleEn,
    kind: 'work' as const,
    kindTa: 'நூல்',
    kindEn: 'Work',
    aliases: [],
    metadata:
      'author' in work
        ? [work.author, work.period].filter((value): value is string => Boolean(value))
        : [],
    state: 'rightsState' in work ? work.rightsState : work.verificationState,
  })),
  ...kumarastavam.map((record) => ({
    href: `/prayers#k-${record.id}`,
    titleTa: record.titleTa,
    titleEn: record.transliteration,
    kind: 'work' as const,
    kindTa: 'துதி',
    kindEn: 'Prayer',
    aliases: [
      record.transliteration,
      record.transliteration?.normalize('NFKD').replace(/\p{M}/gu, ''),
    ].filter((value): value is string => Boolean(value)),
    metadata: [record.author, record.edition].filter((value): value is string => Boolean(value)),
    state: record.canonicalTextStatus,
  })),
  ...muruganNames
    .filter((name) => Boolean(name.nameTa || name.nameEn))
    .map((name, index) => ({
      href: `/knowledge#name-${name.id ?? `name-${index + 1}`}`,
      titleTa: name.nameTa,
      titleEn: name.nameEn,
      kind: 'name' as const,
      kindTa: 'முருகன் பெயர்',
      kindEn: 'Murugan name',
      aliases: [],
      metadata: [name.meaning].filter((value): value is string => Boolean(value)),
      sourceConfidence: name.sources[0]?.confidence,
    })),
];

function scoreHit(hit: Hit, rawNeedle: string): number {
  const needle = normalizeSearch(rawNeedle);
  if (!needle) return 0;
  const titleTa = normalizeSearch(hit.titleTa ?? '');
  const titleEn = normalizeSearch(hit.titleEn ?? '');
  const aliases = hit.aliases.map(normalizeSearch);
  const metadata = hit.metadata.map(normalizeSearch);
  if (titleTa === needle) return 1000;
  if (aliases.some((value) => value === needle)) return 950;
  if (titleEn === needle) return 925;
  if (titleTa.startsWith(needle)) return 850;
  if (titleEn.startsWith(needle)) return 825;
  if (aliases.some((value) => value.startsWith(needle))) return 800;
  if (titleTa.includes(needle)) return 700;
  if (titleEn.includes(needle)) return 675;
  if (aliases.some((value) => value.includes(needle))) return 650;
  if (metadata.some((value) => value.includes(needle))) return 300;
  return 0;
}

const FACET_COPY: Record<Facet, UiCopy> = {
  all: {
    ta: 'அனைத்தும்',
    en: 'All',
    alternates: { te: 'అన్నీ', ml: 'എല്ലാം', kn: 'ಎಲ್ಲವೂ', hi: 'सभी' },
  },
  temple: {
    ta: 'கோயில்கள்',
    en: 'Temples',
    alternates: { te: 'ఆలయాలు', ml: 'ക്ഷേത്രങ്ങൾ', kn: 'ದೇವಾಲಯಗಳು', hi: 'मंदिर' },
  },
  arupadai: {
    ta: 'அறுபடை வீடு',
    en: 'Six Abodes',
    alternates: { te: 'ఆరు పవిత్ర క్షేత్రాలు', ml: 'ആറ് പുണ്യസ്ഥാനങ്ങൾ', kn: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು', hi: 'छह पवित्र धाम' },
  },
  thiruppugazh: {
    ta: 'திருப்புகழ்',
    en: 'Thiruppugazh',
    alternates: { te: 'తిరుప్పుగళ్', ml: 'തിരുപ്പുകഴ്', kn: 'ತಿರುಪ್ಪುಗಳ್', hi: 'तिरुप्पुगल' },
  },
  work: {
    ta: 'நூல்கள்',
    en: 'Works',
    alternates: { te: 'గ్రంథాలు', ml: 'ഗ്രന്ഥങ്ങൾ', kn: 'ಗ್ರಂಥಗಳು', hi: 'ग्रंथ' },
  },
  name: {
    ta: 'முருகன் பெயர்கள்',
    en: 'Murugan names',
    alternates: { te: 'మురుగన్ పేర్లు', ml: 'മുരുകൻ നാമങ്ങൾ', kn: 'ಮುರುಗನ್ ಹೆಸರುಗಳು', hi: 'मुरुगन के नाम' },
  },
};

const KIND_COPY: Record<Exclude<Facet, 'all'>, UiCopy> = {
  temple: {
    ta: 'கோயில்',
    en: 'Temple',
    alternates: { te: 'ఆలయం', ml: 'ക്ഷേത്രം', kn: 'ದೇವಾಲಯ', hi: 'मंदिर' },
  },
  arupadai: FACET_COPY.arupadai,
  thiruppugazh: FACET_COPY.thiruppugazh,
  work: {
    ta: 'நூல் / துதி',
    en: 'Work / Prayer',
    alternates: { te: 'గ్రంథం / ప్రార్థన', ml: 'ഗ്രന്ഥം / പ്രാർത്ഥന', kn: 'ಗ್ರಂಥ / ಪ್ರಾರ್ಥನೆ', hi: 'ग्रंथ / प्रार्थना' },
  },
  name: {
    ta: 'முருகன் பெயர்',
    en: 'Murugan name',
    alternates: { te: 'మురుగన్ పేరు', ml: 'മുരുകൻ നാമം', kn: 'ಮುರುಗನ್ ಹೆಸರು', hi: 'मुरुगन नाम' },
  },
};

const FACETS: Facet[] = ['all', 'temple', 'arupadai', 'thiruppugazh', 'work', 'name'];
const FACET_COUNTS = FACETS.reduce<Record<Facet, number>>(
  (counts, facet) => {
    counts[facet] = facet === 'all' ? INDEX.length : INDEX.filter((hit) => hit.kind === facet).length;
    return counts;
  },
  { all: 0, temple: 0, arupadai: 0, thiruppugazh: 0, work: 0, name: 0 },
);

export default function Search() {
  const initial = readUrlState();
  const [q, setQ] = useState(initial.q);
  const [facet, setFacet] = useState<Facet>(initial.facet);
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();
  const resultsId = useId();
  const { uiLocale, locale, text } = useLocale();

  const t = (copy: UiCopy) => text(copy.ta, copy.en, copy.alternates);

  useEffect(() => {
    const syncFromUrl = () => {
      const next = readUrlState();
      setQ(next.q);
      setFacet(next.facet);
      setShown(PAGE_SIZE);
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const allHits = useMemo(() => {
    const needle = q.trim();
    if (normalizeSearch(needle).length < 2) return [];
    return INDEX.map((hit) => ({ hit, score: scoreHit(hit, needle) }))
      .filter(({ hit, score }) => score > 0 && (facet === 'all' || hit.kind === facet))
      .sort(
        (a, b) =>
          b.score - a.score ||
          (a.hit.titleTa ?? a.hit.titleEn ?? '').localeCompare(
            b.hit.titleTa ?? b.hit.titleEn ?? '',
            'ta',
          ),
      )
      .map(({ hit }) => hit);
  }, [q, facet]);

  const hits = allHits.slice(0, shown);
  const normalizedLength = normalizeSearch(q).length;
  const clearSearch = () => {
    setQ('');
    setFacet('all');
    setShown(PAGE_SIZE);
    writeUrlState('', 'all');
  };

  return (
    <article className="page search-page">
      <header className="page-head">
        <p className="hero-eyebrow" lang={uiLocale}>
          {text('உள்ளூர் · தீர்மானிக்கத்தக்க தேடல்', 'Local · Deterministic Search', {
            te: 'స్థానిక · నిర్ణీత శోధన',
            ml: 'പ്രാദേശികം · നിർണ്ണയിക്കാവുന്ന തിരച്ചിൽ',
            kn: 'ಸ್ಥಳೀಯ · ನಿರ್ಧಿಷ್ಟ ಹುಡುಕಾಟ',
            hi: 'स्थानीय · निर्धारक खोज',
          })}
        </p>
        <h1 lang={uiLocale}>
          {text('தேடல்', 'Search', { te: 'శోధన', ml: 'തിരച്ചിൽ', kn: 'ಹುಡುಕಾಟ', hi: 'खोज' })}
        </h1>
        <p lang={uiLocale}>
          {text(
            'தமிழ், ஆங்கிலம் மற்றும் பதிவிலுள்ள மாற்றுப்பெயர்களில் தேடலாம். முடிவுகள் ஆளுகைப் பதிவுகளிலிருந்து மட்டுமே வருகின்றன; இத்தளம் தேடல் பதிலை உருவாக்காது.',
            'You can search in Tamil, English, and any alternate names in the registry. Results come only from governed records; this site never generates a search answer.',
            {
              te: 'రిజిస్ట్రీలో ఉన్న తమిళం, ఆంగ్లం మరియు ప్రత్యామ్నాయ పేర్లతో శోధించవచ్చు. ఫలితాలు నిర్వహిత రికార్డుల నుంచే వస్తాయి; ఈ సైట్ శోధన సమాధానాలను సృష్టించదు.',
              ml: 'റെജിസ്ട്രിയിലുള്ള തമിഴ്, ഇംഗ്ലീഷ്, പകരപ്പേരുകൾ ഉപയോഗിച്ച് തിരയാം. ഫലങ്ങൾ നിയന്ത്രിത രേഖകളിൽ നിന്നുമാത്രമാണ്; ഈ സൈറ്റ് തിരച്ചിൽ ഉത്തരങ്ങൾ സൃഷ്ടിക്കില്ല.',
              kn: 'ರಿಜಿಸ್ಟ್ರಿಯಲ್ಲಿರುವ ತಮಿಳು, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಪರ್ಯಾಯ ಹೆಸರುಗಳಲ್ಲಿ ಹುಡುಕಬಹುದು. ಫಲಿತಾಂಶಗಳು ನಿರ್ವಹಿತ ದಾಖಲೆಗಳಿಂದ ಮಾತ್ರ ಬರುತ್ತವೆ; ಈ ತಾಣ ಹುಡುಕಾಟ ಉತ್ತರಗಳನ್ನು ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ.',
              hi: 'आप रजिस्ट्री में मौजूद तमिल, अंग्रेज़ी और वैकल्पिक नामों से खोज सकते हैं। परिणाम केवल नियंत्रित अभिलेखों से आते हैं; यह साइट खोज-उत्तर गढ़ती नहीं है।',
            },
          )}
        </p>
      </header>

      <div className="filter search-filter">
        <label htmlFor={inputId} lang={uiLocale}>
          {text('தேடல் சொல்', 'Search term', {
            te: 'శోధన పదం',
            ml: 'തിരച്ചിൽ പദം',
            kn: 'ಹುಡುಕಾಟ ಪದ',
            hi: 'खोज शब्द',
          })}
        </label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(event) => {
            const next = event.target.value;
            setQ(next);
            setShown(PAGE_SIZE);
            writeUrlState(next, facet);
          }}
          placeholder="பழனி / Palani / முத்தைத்தரு"
          autoComplete="off"
        />
        {q.length > 0 && (
          <button
            type="button"
            className="btn btn-quiet"
            onClick={clearSearch}
            aria-label={text('தேடலை அழி', 'Clear search', {
              te: 'శోధనను తొలగించు',
              ml: 'തിരച്ചിൽ മായ്ക്കുക',
              kn: 'ಹುಡುಕಾಟ ಅಳಿಸಿ',
              hi: 'खोज साफ़ करें',
            })}
          >
            <span lang={uiLocale}>
              {text('அழி', 'Clear', { te: 'తొలగించు', ml: 'മായ്ക്കുക', kn: 'ಅಳಿಸಿ', hi: 'साफ़ करें' })}
            </span>
          </button>
        )}
      </div>

      <div
        className="search-facets"
        role="group"
        aria-label={text('உள்ளடக்க வகை', 'Content type', {
          te: 'కంటెంట్ రకం',
          ml: 'ഉള്ളടക്ക തരം',
          kn: 'ವಿಷಯ ಪ್ರಕಾರ',
          hi: 'सामग्री प्रकार',
        })}
      >
        {FACETS.map((item) => {
          const copy = FACET_COPY[item];
          return (
            <button
              key={item}
              type="button"
              className={`search-facet${facet === item ? ' is-active' : ''}`}
              aria-pressed={facet === item}
              aria-label={`${t(copy)} ${FACET_COUNTS[item]}`}
              onClick={() => {
                setFacet(item);
                setShown(PAGE_SIZE);
                writeUrlState(q, item);
              }}
            >
              <span lang={uiLocale}>{t(copy)}</span>
              <small aria-hidden="true">{FACET_COUNTS[item]}</small>
            </button>
          );
        })}
      </div>

      <p className="result-count" aria-live="polite" lang={uiLocale}>
        {normalizedLength < 2
          ? text('குறைந்தது இரண்டு எழுத்துகள்', 'At least two characters', {
              te: 'కనీసం రెండు అక్షరాలు',
              ml: 'കുറഞ്ഞത് രണ്ട് അക്ഷരങ്ങൾ',
              kn: 'ಕನಿಷ್ಠ ಎರಡು ಅಕ್ಷರಗಳು',
              hi: 'कम से कम दो अक्षर',
            })
          : allHits.length === 0
            ? text('0 முடிவுகள்', '0 results', {
                te: '0 ఫలితాలు',
                ml: '0 ഫലങ്ങൾ',
                kn: '0 ಫಲಿತಾಂಶಗಳು',
                hi: '0 परिणाम',
              })
            : text(
                `காட்டப்படுவது ${hits.length} / மொத்தம் ${allHits.length} முடிவுகள்`,
                `Showing ${hits.length} of ${allHits.length} results`,
                {
                  te: `${allHits.length} ఫలితాల్లో ${hits.length} చూపిస్తున్నాం`,
                  ml: `${allHits.length} ഫലങ്ങളിൽ ${hits.length} കാണിക്കുന്നു`,
                  kn: `${allHits.length} ಫಲಿತಾಂಶಗಳಲ್ಲಿ ${hits.length} ತೋರಿಸಲಾಗುತ್ತಿದೆ`,
                  hi: `${allHits.length} परिणामों में से ${hits.length} दिखाए जा रहे हैं`,
                },
              )}
      </p>

      {normalizedLength >= 2 && allHits.length === 0 && (
        <div className="empty search-zero" lang={uiLocale}>
          <p>
            {text(
              'இந்தச் சொல்லுக்கு தற்போதைய ஆளுகைப் பதிவுகளில் முடிவு இல்லை. இத்தளம் இல்லாத உள்ளடக்கத்தை உருவாக்காது.',
              'There is no result for this term in the current governed records. This site does not invent content that does not exist.',
              {
                te: 'ఈ పదానికి ప్రస్తుత నిర్వహిత రికార్డుల్లో ఫలితం లేదు. లేని కంటెంట్‌ను ఈ సైట్ సృష్టించదు.',
                ml: 'ഈ പദത്തിന് നിലവിലെ നിയന്ത്രിത രേഖകളിൽ ഫലം ഇല്ല. ഇല്ലാത്ത ഉള്ളടക്കം ഈ സൈറ്റ് സൃഷ്ടിക്കില്ല.',
                kn: 'ಈ ಪದಕ್ಕೆ ಪ್ರಸ್ತುತ ನಿರ್ವಹಿತ ದಾಖಲೆಗಳಲ್ಲಿ ಫಲಿತಾಂಶವಿಲ್ಲ. ಇಲ್ಲದ ವಿಷಯವನ್ನು ಈ ತಾಣ ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ.',
                hi: 'इस शब्द के लिए मौजूदा नियंत्रित अभिलेखों में कोई परिणाम नहीं है। यह साइट ऐसी सामग्री नहीं गढ़ती जो मौजूद नहीं है।',
              },
            )}
          </p>
          <div className="band-links">
            <Link href="/knowledge">{text('அறிவுக் களம்', 'Knowledge', { te: 'జ్ఞాన కేంద్రం', ml: 'ജ്ഞാനകേന്ദ്രം', kn: 'ಜ್ಞಾನ ಕೇಂದ್ರ', hi: 'ज्ञान केंद्र' })}</Link>
            <Link href="/temples">{text('கோயில் அடைவு', 'Temple directory', { te: 'ఆలయ సూచిక', ml: 'ക്ഷേത്ര ഡയറക്ടറി', kn: 'ದೇವಾಲಯ ಸೂಚಿ', hi: 'मंदिर निर्देशिका' })}</Link>
            <Link href="/sources">{text('மூலங்கள்', 'Sources', { te: 'మూలాలు', ml: 'സ്രോതസ്സുകൾ', kn: 'ಮೂಲಗಳು', hi: 'स्रोत' })}</Link>
          </div>
        </div>
      )}

      {q.trim().length === 0 && (
        <nav
          className="search-starters"
          aria-label={text('தேடலைத் தொடங்க', 'Start a search', {
            te: 'శోధన ప్రారంభించండి',
            ml: 'തിരച്ചിൽ ആരംഭിക്കുക',
            kn: 'ಹುಡುಕಾಟ ಪ್ರಾರಂಭಿಸಿ',
            hi: 'खोज शुरू करें',
          })}
        >
          <Link href="/knowledge" className="search-starter">
            <b lang={uiLocale}>
              {text('முருகன் அறிவுக் களம்', 'Murugan Knowledge Hub', {
                te: 'మురుగన్ జ్ఞాన కేంద్రం',
                ml: 'മുരുകൻ ജ്ഞാനകേന്ദ്രം',
                kn: 'ಮುರುಗನ್ ಜ್ಞಾನ ಕೇಂದ್ರ',
                hi: 'मुरुगन ज्ञान केंद्र',
              })}
            </b>
            <small lang={uiLocale}>
              {text('பெயர்கள், படைவீடுகள், நூல்கள்', 'Names, abodes, works', {
                te: 'పేర్లు, పవిత్ర క్షేత్రాలు, గ్రంథాలు',
                ml: 'നാമങ്ങൾ, പുണ്യസ്ഥാനങ്ങൾ, ഗ്രന്ഥങ്ങൾ',
                kn: 'ಹೆಸರುಗಳು, ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು, ಗ್ರಂಥಗಳು',
                hi: 'नाम, पवित्र धाम, ग्रंथ',
              })}
            </small>
          </Link>
          <Link href="/arupadai-veedu" className="search-starter">
            <b lang={uiLocale}>{t(FACET_COPY.arupadai)}</b>
            <small lang={uiLocale}>
              {text('ஆறு படைவீடுகளும் ஒரே இடத்தில்', 'All six abodes in one place', {
                te: 'ఆరు పవిత్ర క్షేత్రాలు ఒకే చోట',
                ml: 'ആറ് പുണ്യസ്ഥാനങ്ങളും ഒരിടത്ത്',
                kn: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ',
                hi: 'सभी छह पवित्र धाम एक ही जगह',
              })}
            </small>
          </Link>
          <Link href="/temples" className="search-starter">
            <b lang={uiLocale}>
              {text('கோயில் அடைவு', 'Temple directory', {
                te: 'ఆలయ సూచిక',
                ml: 'ക്ഷേത്ര ഡയറക്ടറി',
                kn: 'ದೇವಾಲಯ ಸೂಚಿ',
                hi: 'मंदिर निर्देशिका',
              })}
            </b>
            <small lang={uiLocale}>
              {text('376 ஆளுகைப் பதிவுகள்', '376 governed records', {
                te: '376 నిర్వహిత రికార్డులు',
                ml: '376 നിയന്ത്രിത രേഖകൾ',
                kn: '376 ನಿರ್ವಹಿತ ದಾಖಲೆಗಳು',
                hi: '376 नियंत्रित अभिलेख',
              })}
            </small>
          </Link>
          <Link href="/content-completeness" className="search-starter">
            <b lang={uiLocale}>
              {text('உள்ளடக்க நிலை', 'Content status', {
                te: 'కంటెంట్ స్థితి',
                ml: 'ഉള്ളടക്ക നില',
                kn: 'ವಿಷಯ ಸ್ಥಿತಿ',
                hi: 'सामग्री स्थिति',
              })}
            </b>
            <small lang={uiLocale}>
              {text('எது தயார், எது நிலுவையில்', "What's ready, what's pending", {
                te: 'ఏది సిద్ధంగా ఉంది, ఏది పెండింగ్‌లో ఉంది',
                ml: 'എന്താണ് തയ്യാറായത്, എന്താണ് ശേഷിക്കുന്നത്',
                kn: 'ಯಾವುದು ಸಿದ್ಧ, ಯಾವುದು ಬಾಕಿ',
                hi: 'क्या तैयार है, क्या लंबित है',
              })}
            </small>
          </Link>
        </nav>
      )}

      <section aria-labelledby={resultsId}>
        <h2 id={resultsId} className="sr-only" lang={uiLocale}>
          {text('தேடல் முடிவுகள்', 'Search results', {
            te: 'శోధన ఫలితాలు',
            ml: 'തിരച്ചിൽ ഫലങ്ങൾ',
            kn: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು',
            hi: 'खोज परिणाम',
          })}
        </h2>
        <ul className="temple-list search-results">
          {hits.map((hit) => {
            const sourceState = hit.sourceConfidence
              ? describeSourceConfidence(hit.sourceConfidence, locale)
              : null;
            const showEnglishFirst = locale === 'en' && Boolean(hit.titleEn);
            const kindCopy = KIND_COPY[hit.kind];
            return (
              <li key={`${hit.kind}:${hit.href}:${hit.titleTa ?? hit.titleEn ?? ''}`}>
                <Link href={hit.href} className="temple-row search-result-row">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{hit.titleEn}</b>
                      {hit.titleTa && <small lang="ta">{hit.titleTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={hit.titleTa ? 'ta' : 'en'}>{hit.titleTa ?? hit.titleEn}</b>
                      {hit.titleEn && <small lang="en">{hit.titleEn}</small>}
                    </>
                  )}
                  <em className="tag" lang={uiLocale}>{t(kindCopy)}</em>
                  <span className="search-result-states">
                    {sourceState && (
                      <span className={`state state-${sourceState.tone}`}>
                        <span className="state-dot" aria-hidden="true" />
                        <span lang={locale}>{sourceState.label}</span>
                      </span>
                    )}
                    {hit.state && <StateBadge state={hit.state} />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {shown < allHits.length && (
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => setShown((value) => value + PAGE_SIZE)}
        >
          <span lang={uiLocale}>
            {text('மேலும் காட்டு', 'Show more', {
              te: 'మరిన్ని చూపించు',
              ml: 'കൂടുതൽ കാണിക്കുക',
              kn: 'ಇನ್ನಷ್ಟು ತೋರಿಸಿ',
              hi: 'और दिखाएँ',
            })}
          </span>
        </button>
      )}
    </article>
  );
}
