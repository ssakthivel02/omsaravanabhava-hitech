import { useMemo, useState, useId, useEffect } from 'react';
import { Link } from 'wouter';
import { temples } from '@/content/temples';
import { useLocale } from '@/lib/locale';

const PAGE_SIZE = 200;
const QUERY_PARAM = 'q';
const DISTRICT_PARAM = 'district';
const STATE_PARAM = 'state';
const ARUPADAI_PARAM = 'arupadai';

const districts = Array.from(
  new Set(temples.map((temple) => temple.district).filter((value): value is string => Boolean(value))),
).sort((a, b) => a.localeCompare(b, 'en'));

const states = Array.from(
  new Set(temples.map((temple) => temple.state).filter((value): value is string => Boolean(value))),
).sort((a, b) => a.localeCompare(b, 'en'));

interface TempleFilterState {
  q: string;
  district: string;
  state: string;
  arupadaiOnly: boolean;
}

function readTempleFilters(): TempleFilterState {
  if (typeof window === 'undefined') {
    return { q: '', district: '', state: '', arupadaiOnly: false };
  }

  const params = new URLSearchParams(window.location.search);
  const district = params.get(DISTRICT_PARAM) ?? '';
  const state = params.get(STATE_PARAM) ?? '';

  return {
    q: params.get(QUERY_PARAM) ?? '',
    district: districts.includes(district) ? district : '',
    state: states.includes(state) ? state : '',
    arupadaiOnly: params.get(ARUPADAI_PARAM) === '1',
  };
}

function syncTempleFilters(filters: TempleFilterState) {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (filters.q.trim()) url.searchParams.set(QUERY_PARAM, filters.q.trim());
  else url.searchParams.delete(QUERY_PARAM);

  if (filters.district && districts.includes(filters.district)) {
    url.searchParams.set(DISTRICT_PARAM, filters.district);
  } else {
    url.searchParams.delete(DISTRICT_PARAM);
  }

  if (filters.state && states.includes(filters.state)) {
    url.searchParams.set(STATE_PARAM, filters.state);
  } else {
    url.searchParams.delete(STATE_PARAM);
  }

  if (filters.arupadaiOnly) url.searchParams.set(ARUPADAI_PARAM, '1');
  else url.searchParams.delete(ARUPADAI_PARAM);

  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function Temples() {
  const initial = readTempleFilters();
  const [q, setQ] = useState(initial.q);
  const [district, setDistrict] = useState(initial.district);
  const [state, setState] = useState(initial.state);
  const [arupadaiOnly, setArupadaiOnly] = useState(initial.arupadaiOnly);
  const [shown, setShown] = useState(PAGE_SIZE);
  const inputId = useId();
  const districtId = useId();
  const stateId = useId();
  const arupadaiId = useId();
  const { locale, uiLocale, text } = useLocale();

  useEffect(() => {
    const restoreFromUrl = () => {
      const next = readTempleFilters();
      setQ(next.q);
      setDistrict(next.district);
      setState(next.state);
      setArupadaiOnly(next.arupadaiOnly);
      setShown(PAGE_SIZE);
    };
    window.addEventListener('popstate', restoreFromUrl);
    return () => window.removeEventListener('popstate', restoreFromUrl);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return temples.filter((temple) => {
      const matchesQuery =
        !needle ||
        [temple.nameTa, temple.nameEn, temple.transliteration, temple.district, temple.state]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      const matchesDistrict = !district || temple.district === district;
      const matchesState = !state || temple.state === state;
      const matchesArupadai = !arupadaiOnly || temple.isArupadaiVeedu;

      return matchesQuery && matchesDistrict && matchesState && matchesArupadai;
    });
  }, [q, district, state, arupadaiOnly]);

  const visible = results.slice(0, shown);
  const hasActiveFilters = Boolean(q.trim() || district || state || arupadaiOnly);

  const applyFilters = (next: TempleFilterState) => {
    setQ(next.q);
    setDistrict(next.district);
    setState(next.state);
    setArupadaiOnly(next.arupadaiOnly);
    setShown(PAGE_SIZE);
    syncTempleFilters(next);
  };

  const currentFilters = (): TempleFilterState => ({ q, district, state, arupadaiOnly });

  const clearFilters = () => {
    applyFilters({ q: '', district: '', state: '', arupadaiOnly: false });
  };

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={uiLocale}>
          {text('முருகன் கோயில்கள்', 'Murugan Temples', {
            te: 'మురుగన్ ఆలయాలు',
            ml: 'മുരുകൻ ക്ഷേത്രങ്ങൾ',
            kn: 'ಮುರುಗನ್ ದೇವಾಲಯಗಳು',
            hi: 'मुरुगन मंदिर',
          })}
        </h1>
        <p lang={uiLocale}>
          {text(
            `${temples.length} பதிவுகள். கிடைக்கும் ஆளுமைத் தரவின் அடிப்படையில் பெயர், இடம் அல்லது அறுபடை வீடு நிலையால் வடிகட்டவும்.`,
            `${temples.length} records. Filter by name, location, or Six Abodes status where governed location data is available.`,
            {
              te: `${temples.length} రికార్డులు. అందుబాటులో ఉన్న ధృవీకరించిన స్థల సమాచారాన్ని ఆధారంగా పేరు, స్థానం లేదా ఆరు పవిత్ర నివాసాల స్థితి ద్వారా వడపోసుకోండి.`,
              ml: `${temples.length} രേഖകൾ. ലഭ്യമായ നിയന്ത്രിത സ്ഥലവിവരത്തെ അടിസ്ഥാനമാക്കി പേര്, സ്ഥലം, അല്ലെങ്കിൽ ആറുപടൈവീട് നില പ്രകാരം ഫിൽറ്റർ ചെയ്യുക.`,
              kn: `${temples.length} ದಾಖಲೆಗಳು. ಲಭ್ಯವಿರುವ ನಿಯಂತ್ರಿತ ಸ್ಥಳ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಹೆಸರು, ಸ್ಥಳ ಅಥವಾ ಆರು ಪವಿತ್ರ ನಿವಾಸಗಳ ಸ್ಥಿತಿಯಿಂದ ಶೋಧಿಸಿ.`,
              hi: `${temples.length} अभिलेख। उपलब्ध सत्यापित स्थान जानकारी के आधार पर नाम, स्थान या छह पवित्र निवास की स्थिति से फ़िल्टर करें।`,
            },
          )}
        </p>
      </header>

      <div className="filter">
        <label htmlFor={inputId} lang={uiLocale}>
          {text('கோயில் தேடல்', 'Search temples', {
            te: 'ఆలయాలను వెతకండి',
            ml: 'ക്ഷേത്രങ്ങൾ തിരയുക',
            kn: 'ದೇವಾಲಯಗಳನ್ನು ಹುಡುಕಿ',
            hi: 'मंदिर खोजें',
          })}
        </label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(event) => {
            const next = event.target.value;
            applyFilters({ ...currentFilters(), q: next });
          }}
          placeholder="திருச்செந்தூர் / Palani"
        />

        {districts.length > 0 && (
          <>
            <label htmlFor={districtId} lang={uiLocale}>
              {text('மாவட்டம்', 'District', {
                te: 'జిల్లా',
                ml: 'ജില്ല',
                kn: 'ಜಿಲ್ಲೆ',
                hi: 'ज़िला',
              })}
            </label>
            <select
              id={districtId}
              value={district}
              onChange={(event) => applyFilters({ ...currentFilters(), district: event.target.value })}
            >
              <option value="">
                {text('அனைத்து மாவட்டங்களும்', 'All districts', {
                  te: 'అన్ని జిల్లాలు',
                  ml: 'എല്ലാ ജില്ലകളും',
                  kn: 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
                  hi: 'सभी ज़िले',
                })}
              </option>
              {districts.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </>
        )}

        {states.length > 0 && (
          <>
            <label htmlFor={stateId} lang={uiLocale}>
              {text('மாநிலம்', 'State', {
                te: 'రాష్ట్రం',
                ml: 'സംസ്ഥാനം',
                kn: 'ರಾಜ್ಯ',
                hi: 'राज्य',
              })}
            </label>
            <select
              id={stateId}
              value={state}
              onChange={(event) => applyFilters({ ...currentFilters(), state: event.target.value })}
            >
              <option value="">
                {text('அனைத்து மாநிலங்களும்', 'All states', {
                  te: 'అన్ని రాష్ట్రాలు',
                  ml: 'എല്ലാ സംസ്ഥാനങ്ങളും',
                  kn: 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು',
                  hi: 'सभी राज्य',
                })}
              </option>
              {states.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor={arupadaiId} lang={uiLocale}>
          <input
            id={arupadaiId}
            type="checkbox"
            checked={arupadaiOnly}
            onChange={(event) => applyFilters({ ...currentFilters(), arupadaiOnly: event.target.checked })}
          />{' '}
          {text('அறுபடை வீடு மட்டும்', 'Six Abodes only', {
            te: 'ఆరు పవిత్ర నివాసాలు మాత్రమే',
            ml: 'ആറുപടൈവീട് മാത്രം',
            kn: 'ಆರು ಪವಿತ್ರ ನಿವಾಸಗಳು ಮಾತ್ರ',
            hi: 'केवल छह पवित्र निवास',
          })}
        </label>

        {hasActiveFilters && (
          <button type="button" className="btn btn-quiet" onClick={clearFilters}>
            <span lang={uiLocale}>
              {text('வடிகட்டிகளை அழி', 'Clear filters', {
                te: 'ఫిల్టర్లను తొలగించండి',
                ml: 'ഫിൽറ്ററുകൾ നീക്കുക',
                kn: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
                hi: 'फ़िल्टर साफ़ करें',
              })}
            </span>
          </button>
        )}
      </div>

      <p className="result-count" aria-live="polite" lang={uiLocale}>
        {results.length === 0
          ? text('0 பதிவுகள்', '0 records', {
              te: '0 రికార్డులు',
              ml: '0 രേഖകൾ',
              kn: '0 ದಾಖಲೆಗಳು',
              hi: '0 अभिलेख',
            })
          : text(
              `காட்டப்படுவது ${visible.length} / மொத்தம் ${results.length} பதிவுகள்`,
              `Showing ${visible.length} of ${results.length} records`,
              {
                te: `${results.length} రికార్డుల్లో ${visible.length} చూపిస్తున్నాం`,
                ml: `${results.length} രേഖകളിൽ ${visible.length} കാണിക്കുന്നു`,
                kn: `${results.length} ದಾಖಲೆಗಳಲ್ಲಿ ${visible.length} ತೋರಿಸಲಾಗುತ್ತಿದೆ`,
                hi: `${results.length} अभिलेखों में से ${visible.length} दिखाए जा रहे हैं`,
              },
            )}
      </p>

      {results.length === 0 ? (
        <p className="empty" lang={uiLocale}>
          {text(
            'இந்த வடிகட்டல்களுக்கு பதிவு எதுவும் இல்லை. தேடல் அல்லது வடிகட்டிகளை மாற்றவும்.',
            'No records match these filters. Change the search or filters.',
            {
              te: 'ఈ ఫిల్టర్లకు సరిపోయే రికార్డులు లేవు. శోధన లేదా ఫిల్టర్లను మార్చండి.',
              ml: 'ഈ ഫിൽറ്ററുകൾക്ക് പൊരുത്തപ്പെടുന്ന രേഖകളില്ല. തിരച്ചിൽ അല്ലെങ്കിൽ ഫിൽറ്ററുകൾ മാറ്റുക.',
              kn: 'ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದುವ ದಾಖಲೆಗಳಿಲ್ಲ. ಹುಡುಕಾಟ ಅಥವಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ.',
              hi: 'इन फ़िल्टरों से मेल खाने वाले अभिलेख नहीं हैं। खोज या फ़िल्टर बदलें।',
            },
          )}
        </p>
      ) : (
        <ul className="temple-list">
          {visible.map((temple) => {
            const showEnglishFirst = locale === 'en' && Boolean(temple.nameEn);
            return (
              <li key={temple.id}>
                <Link href={`/temples/${temple.id}`} className="temple-row">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{temple.nameEn}</b>
                      {temple.nameTa && <small lang="ta">{temple.nameTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={temple.nameTa ? 'ta' : 'en'}>{temple.nameTa ?? temple.nameEn}</b>
                      <small>{temple.nameEn}</small>
                    </>
                  )}
                  {temple.isArupadaiVeedu && (
                    <em className="tag" lang={uiLocale}>
                      {text('அறுபடை வீடு', 'Six Abodes', {
                        te: 'ఆరు పవిత్ర నివాసాలు',
                        ml: 'ആറുപടൈവീട്',
                        kn: 'ಆರು ಪವಿತ್ರ ನಿವಾಸಗಳು',
                        hi: 'छह पवित्र निवास',
                      })}
                    </em>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {shown < results.length && (
        <button type="button" className="btn btn-quiet" onClick={() => setShown((count) => count + PAGE_SIZE)}>
          <span lang={uiLocale}>
            {text('மேலும் காட்டு', 'Show more', {
              te: 'మరిన్ని చూపించండి',
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
