import { useEffect } from 'react';

const SITE = 'ஓம் சரவணபவ';
const PRODUCTION_ORIGIN = 'https://omsaravanabhava.org';

type Meta = { title: string; description: string };

const META: Array<[RegExp, Meta]> = [
  [/^\/$/, { title: `${SITE} — முருகன் பக்தி அறிவுத் தளம்`, description: 'அறுபடை வீடு, திருப்புகழ், முருகன் கோயில்கள் மற்றும் மூலநிலை குறிக்கப்பட்ட தமிழ் பக்தி அறிவுத் தளம்.' }],
  [/^\/arupadai-veedu\/?$/, { title: `அறுபடை வீடு — ${SITE}`, description: 'முருகனின் ஆறு படைவீடுகளை பாரம்பரிய யாத்திரை வரிசையிலும் மூல நிலையுடனும் அறிக.' }],
  [/^\/temples\/?$/, { title: `முருகன் கோயில்கள் — ${SITE}`, description: 'மூல மற்றும் சரிபார்ப்பு நிலையுடன் தொகுக்கப்பட்ட முருகன் கோயில் அடைவு.' }],
  [/^\/temples\//, { title: `கோயில் பதிவு — ${SITE}`, description: 'மூல ஆதாரம் மற்றும் உள்ளடக்க நிலை தெளிவாகக் காட்டப்படும் முருகன் கோயில் பதிவு.' }],
  [/^\/thiruppugazh\/?$/, { title: `திருப்புகழ் — ${SITE}`, description: 'அருணகிரிநாதர் திருப்புகழ் பதிவுகள் — மூல உரை, பதிப்பு மற்றும் சரிபார்ப்பு நிலை தனித்தனியாக.' }],
  [/^\/thiruppugazh\//, { title: `திருப்புகழ் பதிவு — ${SITE}`, description: 'மூல பதிப்பு மற்றும் சரிபார்ப்பு நிலை கொண்ட திருப்புகழ் பதிவு.' }],
  [/^\/works\/?$/, { title: `முருகன் நூல்கள் — ${SITE}`, description: 'முருகன் பக்தி நூல்கள் மற்றும் அவற்றின் மூல/சரிபார்ப்பு நிலைகள்.' }],
  [/^\/prayers\/?$/, { title: `மந்திரம் · துதி — ${SITE}`, description: 'மூல நிலை தெளிவாகக் காட்டப்படும் முருகன் மந்திரம், துதி மற்றும் பிரார்த்தனைப் பதிவுகள்.' }],
  [/^\/practice\/?$/, { title: `தினசரி வழிபாடு — ${SITE}`, description: 'தனியுரிமையை மதிக்கும் முருகன் தினசரி வழிபாடு மற்றும் பயிற்சி அனுபவம்.' }],
  [/^\/search\/?$/, { title: `தேடல் — ${SITE}`, description: 'தமிழ் மற்றும் ஆங்கிலத்தில் மூலநிலை குறிக்கப்பட்ட முருகன் உள்ளடக்கத்தைத் தேடுங்கள்.' }],
  [/^\/sources\/?$/, { title: `மூலங்கள் — ${SITE}`, description: 'OmSaravanaBhava உள்ளடக்கத்தின் மூலங்கள், பதிப்புகள் மற்றும் சரிபார்ப்பு முறை.' }],
  [/^\/content-completeness\/?$/, { title: `உள்ளடக்க நிலை — ${SITE}`, description: 'வெளியிடப்பட்ட, நிலுவையில் உள்ள மற்றும் சரிபார்க்கப்படாத உள்ளடக்கத்தின் வெளிப்படையான நிலை.' }],
  [/^\/about\/?$/, { title: `இத்தளம் பற்றி — ${SITE}`, description: 'OmSaravanaBhava Sacred-Tech முருகன் பக்தி அறிவுத் தளத்தின் நோக்கம்.' }],
  [/^\/privacy\/?$/, { title: `தனியுரிமை — ${SITE}`, description: 'OmSaravanaBhava தனியுரிமை நடைமுறைகள்.' }],
  [/^\/terms\/?$/, { title: `விதிகள் — ${SITE}`, description: 'OmSaravanaBhava பயன்பாட்டு விதிகள்.' }],
  [/^\/disclaimer\/?$/, { title: `பொறுப்புத் துறப்பு — ${SITE}`, description: 'பக்தி, தகவல் மற்றும் உருவாக்கப்பட்ட பிரதிபலிப்புகளுக்கான பொறுப்புத் துறப்பு.' }],
  [/^\/accessibility\/?$/, { title: `அணுகல் தன்மை — ${SITE}`, description: 'OmSaravanaBhava அணுகல் தரநிலைகள் மற்றும் உதவி.' }],
  [/^\/contact\/?$/, { title: `தொடர்பு — ${SITE}`, description: 'திருத்தம், ஆதாரம் மற்றும் தள உதவிக்கான தொடர்பு வழிகள்.' }],
];

const resolveMeta = (path: string): Meta =>
  META.find(([pattern]) => pattern.test(path))?.[1] ?? {
    title: `பக்கம் காணப்படவில்லை — ${SITE}`,
    description: 'கோரப்பட்ட OmSaravanaBhava பக்கம் கிடைக்கவில்லை.',
  };

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const node = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (node) node.setAttribute(attr, value);
};

function applyMeta(path: string, meta: Meta) {
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);

  const production = window.location.origin === PRODUCTION_ORIGIN;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (production) {
    const link = (canonical ?? document.createElement('link')) as HTMLLinkElement;
    link.rel = 'canonical';
    link.href = `${PRODUCTION_ORIGIN}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
    if (!canonical) document.head.appendChild(link);
    setMeta('meta[property="og:url"]', 'content', link.href);
  } else {
    canonical?.remove();
  }
}

export function useRouteMetadata(path: string) {
  useEffect(() => {
    applyMeta(path, resolveMeta(path));
  }, [path]);
}

/**
 * R2-CODE-018: a temple/Thiruppugazh *detail* route was titled generically
 * ("கோயில் பதிவு — ...") regardless of which record was open. Detail pages
 * call this after `useRouteMetadata` has set the generic fallback, replacing
 * it with the real governed record name once it is known. `title`/`description`
 * are omitted (not overridden) when the record itself has no name, so a
 * missing record never produces a fabricated title.
 */
export function useEntityMeta(path: string, title: string | null, description?: string | null) {
  useEffect(() => {
    if (!title) return;
    const fallback = resolveMeta(path);
    applyMeta(path, { title, description: description ?? fallback.description });
  }, [path, title, description]);
}
