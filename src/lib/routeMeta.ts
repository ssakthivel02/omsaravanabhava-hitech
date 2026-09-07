import { useEffect } from 'react';
import { useLocale, type UiLocale } from '@/lib/locale';

const SITE_TA = 'ஓம் சரவணபவ';
const SITE_EN = 'Om Saravana Bhava';
const PRODUCTION_ORIGIN = 'https://omsaravanabhava.org';

type Meta = { title: string; description: string; indexable?: boolean | undefined };
type LocalizedMeta = {
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  indexable?: boolean | undefined;
};

const META: Array<[RegExp, LocalizedMeta]> = [
  [/^\/$/, {
    titleTa: `${SITE_TA} — முருகன் பக்தி அறிவுத் தளம்`,
    titleEn: `${SITE_EN} — Murugan devotional knowledge`,
    descriptionTa: 'அறுபடை வீடு, திருப்புகழ், முருகன் கோயில்கள் மற்றும் மூலநிலை குறிக்கப்பட்ட தமிழ் பக்தி அறிவுத் தளம்.',
    descriptionEn: 'A source-aware Murugan devotional knowledge experience covering the Six Abodes, Thiruppugazh, temples and governed sacred works.',
  }],
  [/^\/knowledge\/?$/, {
    titleTa: `முருகன் அறிவுக் களம் — ${SITE_TA}`,
    titleEn: `Murugan Knowledge — ${SITE_EN}`,
    descriptionTa: 'இந்த வெளியீட்டில் உள்ள ஆளுகை/மூலம்-குறிக்கப்பட்ட முருகன் பெயர்கள், அறுபடை வீடுகள், நூல்கள் மற்றும் திருப்புகழ் பதிவுகளின் அறிவுக் களம்.',
    descriptionEn: 'Explore governed and source-aware Murugan names, Six Abodes, sacred works and Thiruppugazh records in this release.',
  }],
  // Browser-local utility, not a public content landing page. Keeping this
  // noindex also prevents a crawler from indexing an empty generic shell that
  // can never contain the visitor's device-local saved state.
  [/^\/library\/?$/, {
    titleTa: `என் சேமிப்புகள் — ${SITE_TA}`,
    titleEn: `My Library — ${SITE_EN}`,
    descriptionTa: 'இந்த உலாவியில் மட்டும் சேமிக்கப்பட்ட மற்றும் சமீபத்தில் பார்த்த OmSaravanaBhava பதிவுகள்.',
    descriptionEn: 'Saved and recently viewed Om Saravana Bhava records stored only in this browser.',
    indexable: false,
  }],
  [/^\/arupadai-veedu\/?$/, {
    titleTa: `அறுபடை வீடு — ${SITE_TA}`,
    titleEn: `Six Abodes — ${SITE_EN}`,
    descriptionTa: 'முருகனின் ஆறு படைவீடுகளை பாரம்பரிய யாத்திரை வரிசையிலும் மூல நிலையுடனும் அறிக.',
    descriptionEn: 'Explore Murugan’s Six Abodes in the traditional pilgrimage sequence with clear source and verification states.',
  }],
  [/^\/temples\/?$/, {
    titleTa: `முருகன் கோயில்கள் — ${SITE_TA}`,
    titleEn: `Murugan Temples — ${SITE_EN}`,
    descriptionTa: 'மூல மற்றும் சரிபார்ப்பு நிலையுடன் தொகுக்கப்பட்ட முருகன் கோயில் அடைவு.',
    descriptionEn: 'A Murugan temple directory with source and verification states shown transparently.',
  }],
  [/^\/temples\//, {
    titleTa: `கோயில் பதிவு — ${SITE_TA}`,
    titleEn: `Temple Record — ${SITE_EN}`,
    descriptionTa: 'மூல ஆதாரம் மற்றும் உள்ளடக்க நிலை தெளிவாகக் காட்டப்படும் முருகன் கோயில் பதிவு.',
    descriptionEn: 'A Murugan temple record with source evidence and content state shown clearly.',
  }],
  [/^\/thiruppugazh\/?$/, {
    titleTa: `திருப்புகழ் — ${SITE_TA}`,
    titleEn: `Thiruppugazh — ${SITE_EN}`,
    descriptionTa: 'அருணகிரிநாதர் திருப்புகழ் பதிவுகள் — மூல உரை, பதிப்பு மற்றும் சரிபார்ப்பு நிலை தனித்தனியாக.',
    descriptionEn: 'Thiruppugazh records attributed to Arunagirinathar, with source text, edition and verification states kept distinct.',
  }],
  [/^\/thiruppugazh\//, {
    titleTa: `திருப்புகழ் பதிவு — ${SITE_TA}`,
    titleEn: `Thiruppugazh Record — ${SITE_EN}`,
    descriptionTa: 'மூல பதிப்பு மற்றும் சரிபார்ப்பு நிலை கொண்ட திருப்புகழ் பதிவு.',
    descriptionEn: 'A Thiruppugazh record with source-edition and verification state information.',
  }],
  [/^\/works\/?$/, {
    titleTa: `முருகன் நூல்கள் — ${SITE_TA}`,
    titleEn: `Sacred Works — ${SITE_EN}`,
    descriptionTa: 'முருகன் பக்தி நூல்கள் மற்றும் அவற்றின் மூல/சரிபார்ப்பு நிலைகள்.',
    descriptionEn: 'Murugan devotional works with their source and verification states.',
  }],
  [/^\/prayers\/?$/, {
    titleTa: `மந்திரம் · துதி — ${SITE_TA}`,
    titleEn: `Prayers — ${SITE_EN}`,
    descriptionTa: 'மூல நிலை தெளிவாகக் காட்டப்படும் முருகன் மந்திரம், துதி மற்றும் பிரார்த்தனைப் பதிவுகள்.',
    descriptionEn: 'Murugan mantra, hymn and prayer records with source state shown clearly.',
  }],
  [/^\/practice\/?$/, {
    titleTa: `தினசரி வழிபாடு — ${SITE_TA}`,
    titleEn: `Daily Practice — ${SITE_EN}`,
    descriptionTa: 'தனியுரிமையை மதிக்கும் முருகன் தினசரி வழிபாடு மற்றும் பயிற்சி அனுபவம்.',
    descriptionEn: 'A privacy-respecting browser-local Murugan daily practice experience.',
  }],
  [/^\/search\/?$/, {
    titleTa: `தேடல் — ${SITE_TA}`,
    titleEn: `Search — ${SITE_EN}`,
    descriptionTa: 'தமிழ் மற்றும் ஆங்கிலத்தில் மூலநிலை குறிக்கப்பட்ட முருகன் உள்ளடக்கத்தைத் தேடுங்கள்.',
    descriptionEn: 'Search source-aware Murugan content using Tamil or English terms.',
  }],
  [/^\/sources\/?$/, {
    titleTa: `மூலங்கள் — ${SITE_TA}`,
    titleEn: `Sources — ${SITE_EN}`,
    descriptionTa: 'OmSaravanaBhava உள்ளடக்கத்தின் மூலங்கள், பதிப்புகள் மற்றும் சரிபார்ப்பு முறை.',
    descriptionEn: 'Sources, editions and verification methodology used by Om Saravana Bhava.',
  }],
  [/^\/content-completeness\/?$/, {
    titleTa: `உள்ளடக்க நிலை — ${SITE_TA}`,
    titleEn: `Content Status — ${SITE_EN}`,
    descriptionTa: 'வெளியிடப்பட்ட, நிலுவையில் உள்ள மற்றும் சரிபார்க்கப்படாத உள்ளடக்கத்தின் வெளிப்படையான நிலை.',
    descriptionEn: 'A transparent view of published, pending and not-yet-verified content.',
  }],
  [/^\/about\/?$/, {
    titleTa: `இத்தளம் பற்றி — ${SITE_TA}`,
    titleEn: `About — ${SITE_EN}`,
    descriptionTa: 'OmSaravanaBhava Sacred-Tech முருகன் பக்தி அறிவுத் தளத்தின் நோக்கம்.',
    descriptionEn: 'Purpose and principles of the Om Saravana Bhava Sacred-Tech Murugan devotional knowledge platform.',
  }],
  [/^\/privacy\/?$/, {
    titleTa: `தனியுரிமை — ${SITE_TA}`,
    titleEn: `Privacy — ${SITE_EN}`,
    descriptionTa: 'OmSaravanaBhava தனியுரிமை நடைமுறைகள்.',
    descriptionEn: 'Privacy practices for Om Saravana Bhava.',
  }],
  [/^\/terms\/?$/, {
    titleTa: `விதிகள் — ${SITE_TA}`,
    titleEn: `Terms — ${SITE_EN}`,
    descriptionTa: 'OmSaravanaBhava பயன்பாட்டு விதிகள்.',
    descriptionEn: 'Terms of use for Om Saravana Bhava.',
  }],
  [/^\/disclaimer\/?$/, {
    titleTa: `பொறுப்புத் துறப்பு — ${SITE_TA}`,
    titleEn: `Disclaimer — ${SITE_EN}`,
    descriptionTa: 'பக்தி, தகவல் மற்றும் உருவாக்கப்பட்ட பிரதிபலிப்புகளுக்கான பொறுப்புத் துறப்பு.',
    descriptionEn: 'Disclaimer for devotional, informational and generated-reflection material.',
  }],
  [/^\/accessibility\/?$/, {
    titleTa: `அணுகல் தன்மை — ${SITE_TA}`,
    titleEn: `Accessibility — ${SITE_EN}`,
    descriptionTa: 'OmSaravanaBhava அணுகல் தரநிலைகள் மற்றும் உதவி.',
    descriptionEn: 'Accessibility standards and support for Om Saravana Bhava.',
  }],
  [/^\/contact\/?$/, {
    titleTa: `தொடர்பு — ${SITE_TA}`,
    titleEn: `Contact — ${SITE_EN}`,
    descriptionTa: 'திருத்தம், ஆதாரம் மற்றும் தள உதவிக்கான தொடர்பு வழிகள்.',
    descriptionEn: 'Contact routes for corrections, source evidence and site support.',
  }],
];

const localizeMeta = (entry: LocalizedMeta, locale: UiLocale): Meta => ({
  title: locale === 'ta' ? entry.titleTa : entry.titleEn,
  description: locale === 'ta' ? entry.descriptionTa : entry.descriptionEn,
  indexable: entry.indexable,
});

const resolveMeta = (path: string, locale: UiLocale): Meta => {
  const entry = META.find(([pattern]) => pattern.test(path))?.[1];
  if (entry) return localizeMeta(entry, locale);
  return locale === 'ta'
    ? {
        title: `பக்கம் காணப்படவில்லை — ${SITE_TA}`,
        description: 'கோரப்பட்ட OmSaravanaBhava பக்கம் கிடைக்கவில்லை.',
        indexable: false,
      }
    : {
        title: `Page not found — ${SITE_EN}`,
        description: 'The requested Om Saravana Bhava page could not be found.',
        indexable: false,
      };
};

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const node = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (node) node.setAttribute(attr, value);
};

function setRobots(value: string) {
  const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  const node = existing ?? document.createElement('meta');
  node.name = 'robots';
  node.content = value;
  if (!existing) document.head.appendChild(node);
}

function applyMeta(path: string, meta: Meta) {
  document.title = meta.title;
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);

  const production = window.location.origin === PRODUCTION_ORIGIN;
  const indexable = meta.indexable !== false;
  setRobots(production && indexable ? 'index,follow' : 'noindex,nofollow,noarchive');

  const canonical = document.querySelector('link[rel="canonical"]');
  if (production && indexable) {
    const link = (canonical ?? document.createElement('link')) as HTMLLinkElement;
    link.rel = 'canonical';
    link.href = `${PRODUCTION_ORIGIN}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
    if (!canonical) document.head.appendChild(link);
    setMeta('meta[property="og:url"]', 'content', link.href);
  } else {
    canonical?.remove();
    setMeta('meta[property="og:url"]', 'content', '');
  }
}

export function useRouteMetadata(path: string) {
  const { locale } = useLocale();
  useEffect(() => {
    applyMeta(path, resolveMeta(path, locale));
  }, [path, locale]);
}

type EntityMetaInput = {
  titleTa?: string | null;
  titleEn?: string | null;
  descriptionTa?: string | null;
  descriptionEn?: string | null;
};

export function useEntityMeta(path: string, input: EntityMetaInput) {
  const { locale } = useLocale();
  useEffect(() => {
    const fallback = resolveMeta(path, locale);
    const rawTitle = locale === 'ta'
      ? (input.titleTa ?? input.titleEn)
      : (input.titleEn ?? input.titleTa);
    if (!rawTitle) return;

    const site = locale === 'ta' ? SITE_TA : SITE_EN;
    const description = locale === 'ta'
      ? (input.descriptionTa ?? input.descriptionEn ?? fallback.description)
      : (input.descriptionEn ?? input.descriptionTa ?? fallback.description);

    applyMeta(path, {
      title: `${rawTitle} — ${site}`,
      description,
      indexable: fallback.indexable,
    });
  }, [path, locale, input.titleTa, input.titleEn, input.descriptionTa, input.descriptionEn]);
}
