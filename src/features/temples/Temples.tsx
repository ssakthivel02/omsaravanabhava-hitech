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
  const { locale, text } = useLocale();

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
        <h1 lang={locale}>{text('முருகன் கோயில்கள்', 'Murugan Temples')}</h1>
        <p lang={locale}>
          {text(
            `${temples.length} பதிவுகள். கிடைக்கும் ஆளுமைத் தரவின் அடிப்படையில் பெயர், இடம் அல்லது அறுபடை வீடு நிலையால் வடிகட்டவும்.`,
            `${temples.length} records. Filter by name, location, or Six Abodes status where governed location data is available.`,
          )}
        </p>
      </header>

      <div className="filter">
        <label htmlFor={inputId} lang={locale}>
          {text('கோயில் தேடல்', 'Search temples')}
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
            <label htmlFor={districtId} lang={locale}>
              {text('மாவட்டம்', 'District')}
            </label>
            <select
              id={districtId}
              value={district}
              onChange={(event) => applyFilters({ ...currentFilters(), district: event.target.value })}
            >
              <option value="">{text('அனைத்து மாவட்டங்களும்', 'All districts')}</option>
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
            <label htmlFor={stateId} lang={locale}>
              {text('மாநிலம்', 'State')}
            </label>
            <select
              id={stateId}
              value={state}
              onChange={(event) => applyFilters({ ...currentFilters(), state: event.target.value })}
            >
              <option value="">{text('அனைத்து மாநிலங்களும்', 'All states')}</option>
              {states.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor={arupadaiId} lang={locale}>
          <input
            id={arupadaiId}
            type="checkbox"
            checked={arupadaiOnly}
            onChange={(event) => applyFilters({ ...currentFilters(), arupadaiOnly: event.target.checked })}
          />{' '}
          {text('அறுபடை வீடு மட்டும்', 'Six Abodes only')}
        </label>

        {hasActiveFilters && (
          <button type="button" className="btn btn-quiet" onClick={clearFilters}>
            <span lang={locale}>{text('வடிகட்டிகளை அழி', 'Clear filters')}</span>
          </button>
        )}
      </div>

      <p className="result-count" aria-live="polite" lang={locale}>
        {results.length === 0
          ? text('0 பதிவுகள்', '0 records')
          : text(
              `காட்டப்படுவது ${visible.length} / மொத்தம் ${results.length} பதிவுகள்`,
              `Showing ${visible.length} of ${results.length} records`,
            )}
      </p>

      {results.length === 0 ? (
        <p className="empty" lang={locale}>
          {text(
            'இந்த வடிகட்டல்களுக்கு பதிவு எதுவும் இல்லை. தேடல் அல்லது வடிகட்டிகளை மாற்றவும்.',
            'No records match these filters. Change the search or filters.',
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
                    <em className="tag" lang={locale}>
                      {text('அறுபடை வீடு', 'Six Abodes')}
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
          <span lang={locale}>{text('மேலும் காட்டு', 'Show more')}</span>
        </button>
      )}
    </article>
  );
}
