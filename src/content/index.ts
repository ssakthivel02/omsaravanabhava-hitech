/**
 * Typed access layer over the governed devotional registries recovered from
 * the hash-verified Manus R6 archive.
 *
 * Layer separation is deliberate and enforced by these types: canonical Tamil,
 * transliteration, meaning and generated reflection are distinct fields that
 * are never merged. A missing layer is represented by an explicit state
 * string, never by invented content.
 */

import arupadaiRaw from './arupadai-veedu.json';
import thiruppugazhRaw from './thiruppugazh.json';
import namesRaw from './murugan-names.json';
import worksRaw from './works.json';
import sourcesRaw from './sources.json';
import completenessRaw from './completeness.json';
import devotionalWorksRaw from './devotional-works.json';
import namavaliRaw from './namavali.json';
import kumarastavamRaw from './kumarastavam.json';

export interface SourceRef {
  reference?: string | null;
  url?: string | null;
  confidence?: string | null;
  [k: string]: unknown;
}

/**
 * The recovered R6 registries are inconsistent about the field name for a
 * source's confidence: the top-level source ledger uses `confidence`, but
 * per-record `sources[]` arrays (temples, Arupadai Veedu) use
 * `source_confidence`. `SourceRef.confidence` is the only field the UI ever
 * reads, so a raw `source_confidence` value would silently disappear.
 * Normalizing here, once, at the data boundary keeps every consumer honest
 * without asking each feature to know about the legacy field name.
 */
function normalizeSourceRef(raw: SourceRef): SourceRef {
  const legacyConfidence = raw['source_confidence'];
  const rest: SourceRef = { ...raw };
  delete rest['source_confidence'];
  return {
    ...rest,
    confidence: rest.confidence ?? (typeof legacyConfidence === 'string' ? legacyConfidence : null),
  };
}

export const normalizeSources = (sources: SourceRef[] | undefined | null): SourceRef[] =>
  (sources ?? []).map(normalizeSourceRef);

/**
 * `confidence` describes how strongly a source establishes a record's
 * *identity* (is this really Palani / is this really song N). It is a
 * distinct dimension from `coordinateConfidence` (does the site know where
 * the temple physically is) — conflating the two was R2-CODE-005.
 */
export function describeSourceConfidence(
  confidence: string | null | undefined,
): { label: string; tone: StateTone } {
  const c = (confidence ?? '').toUpperCase();
  if (c === 'HIGH') return { label: 'மூல அடையாளம்: உறுதியான மூலம்', tone: 'verified' };
  if (c === 'PARTIAL_IDENTITY')
    return { label: 'மூல அடையாளம்: பகுதி அடையாளச் சான்று', tone: 'pending' };
  if (c === 'LOW') return { label: 'மூல அடையாளம்: குறைந்த சான்று', tone: 'pending' };
  if (c) return { label: `மூல அடையாளம்: ${confidence}`, tone: 'pending' };
  return { label: 'மூல அடையாளம்: மதிப்பீடு செய்யப்படவில்லை', tone: 'absent' };
}

export interface Temple {
  id: string;
  nameTa: string | null;
  nameEn: string | null;
  transliteration: string | null;
  alternateNames: string[];
  deity: string | null;
  muruganForm: string | null;
  classification: string[];
  isArupadaiVeedu: boolean;
  district: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinateConfidence: string;
  history: string | null;
  architecture: string | null;
  sthalaPurana: string | null;
  visitorInformation: string | null;
  officialAuthority: string | null;
  officialWebsite: string | null;
  officialDirectSupportLink: string | null;
  imageStatus: string;
  literaryRelationships: unknown[];
  sources: SourceRef[];
}

/**
 * Current (as opposed to canonical/historical) HR&CE-source facts for an
 * Arupadai Veedu temple: opening hours, contact channel and a freshness
 * stamp. This is a deliberately separate layer from the canonical temple
 * identity fields above — timings and contacts change; identity doesn't —
 * and every field here is copied verbatim from
 * `source-data/ARUPADAI_VEEDU_OFFICIAL_DYNAMIC_SEED_2026-09-04.json`, never
 * derived or invented (R2.5 Priority B).
 */
export interface OfficialCurrentSourceContact {
  phone: string | null;
  email: string | null;
  addressSummary: string | null;
}

export interface OfficialOpeningWindow {
  from: string;
  to: string;
  timezone: string;
  continuous?: boolean;
}

export interface OfficialCurrentSource {
  sourceAuthority: string;
  hrceId: string | null;
  officialBaseUrl: string | null;
  contactSourceUrl: string | null;
  timingSourceUrl: string | null;
  contact: OfficialCurrentSourceContact | null;
  publishedOpeningWindows: OfficialOpeningWindow[];
  publishedScheduleNote: string | null;
  festivalVariation: boolean;
  sourceDisplayQuality: string | null;
  dynamic: boolean;
  retrievedAt: string;
  lastVerifiedAt: string;
  state: string;
}

export interface ArupadaiTemple extends Temple {
  pilgrimageOrder: number;
  officialCurrentSource?: OfficialCurrentSource | null;
}

export interface ThiruppugazhSong {
  id: string;
  openingWords: string | null;
  titleTa: string | null;
  canonicalTextStatus: string;
  canonicalText: string | null;
  attribution: string | null;
  sourceId: string | null;
  edition: string | null;
  sourceNumbering: { system?: string; number?: number } | null;
  rightsStatus: string | null;
  verificationState: string;
  meaningState: string;
  transliterationState: string;
  audioState: string;
  publicationState: string;
}

export interface MuruganName {
  id: string | null;
  nameTa: string | null;
  nameEn: string | null;
  meaning: string | null;
  sources: SourceRef[];
}

export interface Work {
  id: string | null;
  titleTa: string | null;
  titleEn: string | null;
  author: string | null;
  period: string | null;
  verificationState: string;
  sources: SourceRef[];
}

export interface CompletenessDomain {
  key: string;
  labelTa: string;
  labelEn: string;
  records: number;
  withCoordinates?: number;
  withHistory?: number;
  withVisitorInfo?: number;
  withCanonicalText?: number;
  withMeaning?: number;
  withAudio?: number;
}

export const arupadaiVeedu = (arupadaiRaw as ArupadaiTemple[]).map((t) => ({
  ...t,
  sources: normalizeSources(t.sources),
}));
export const thiruppugazh = thiruppugazhRaw as ThiruppugazhSong[];
export const muruganNames = (namesRaw as MuruganName[]).map((n) => ({
  ...n,
  sources: normalizeSources(n.sources),
}));
export const works = (worksRaw as Work[]).map((w) => ({
  ...w,
  sources: normalizeSources(w.sources),
}));
export const sourceLedger = normalizeSources(sourcesRaw as SourceRef[]);
export const completeness = completenessRaw as {
  generatedAt: string;
  sourceArchiveSha256: string;
  note: string;
  domains: CompletenessDomain[];
};

export interface DevotionalWork {
  id: string;
  titleTa: string | null;
  titleEn: string | null;
  authorId: string | null;
  workType: string | null;
  sourceIds: string[];
  rightsState: string;
  textPublicationState: string;
  canonicalTextState: string;
  easyTamilState: string;
  transliterationState: string;
  meaningState: string;
  audioState: string;
}

export interface Kumarastavam {
  id: string;
  titleTa: string | null;
  transliteration: string | null;
  author: string | null;
  edition: string | null;
  invocationsInSource: number | null;
  invocationsPublished: number;
  canonicalTextStatus: string;
  meaningStatus: string;
  audioStatus: string;
}

export const devotionalWorks = devotionalWorksRaw as DevotionalWork[];
export const kumarastavam = kumarastavamRaw as Kumarastavam[];
export const namavali = namavaliRaw as {
  datasetStatus: string;
  researchState: Record<string, string>;
  records: unknown[];
};

export const songById = (id: string): ThiruppugazhSong | undefined =>
  thiruppugazh.find((s) => s.id === id);

/**
 * Human-readable state labels. Every governed record surfaces its real state
 * to the reader; we never render a "pending" record as though it were verified.
 */
export type StateTone = 'verified' | 'pending' | 'absent';

export function describeState(state: string): { label: string; tone: StateTone } {
  const s = state.toUpperCase();
  // Current-official-source freshness states (R2.5) are checked first: they
  // are their own family, distinct from the canonical-content truth states
  // below, and "REVERIFY" does not share a substring with "VERIFIED" so it
  // would otherwise fall through to the raw-enum default.
  if (s === 'OFFICIAL_CURRENT_SOURCE_REVERIFY_RECOMMENDED')
    return { label: 'தற்போதைய மூலம் · மறு-உறுதிப்படுத்தல் பரிந்துரை', tone: 'pending' };
  if (s === 'VERIFIED_CURRENT_OFFICIAL_SOURCE')
    return { label: 'தற்போதைய உத்தியோகபூர்வ மூலத்துடன் சரிபார்க்கப்பட்டது', tone: 'verified' };
  if (s.includes('NO_APPROVED_AUDIO'))
    return { label: 'அங்கீகரிக்கப்பட்ட ஒலி இல்லை', tone: 'absent' };
  if (s.includes('NO_IMAGE_AVAILABLE')) return { label: 'படம் இல்லை', tone: 'absent' };
  if (s.includes('IMAGE_PENDING')) return { label: 'படம் நிலுவையில்', tone: 'pending' };
  if (s === 'UNKNOWN')
    return { label: 'சரிபார்ப்பு நிலை பதிவு செய்யப்படவில்லை', tone: 'pending' };
  if (s.includes('NOT_REIMPORTED'))
    return { label: 'மூலம் இணைக்கப்பட்டது · உரை இன்னும் ஏற்றப்படவில்லை', tone: 'pending' };
  if (s.includes('ZERO_PUBLISHABLE'))
    return { label: 'வெளியிடத்தக்க தொகுப்பு இல்லை', tone: 'absent' };
  if (s.includes('RIGHTS_UNCERTAIN') || s.includes('NO_REPUBLICATION'))
    return { label: 'உரிமை உறுதிசெய்யப்படவில்லை · மறுவெளியீடு இல்லை', tone: 'absent' };
  if (s.includes('METADATA_ONLY'))
    return { label: 'விவரங்கள் மட்டும் · உரை இல்லை', tone: 'pending' };
  if (s.includes('NOT_REPUBLISHED'))
    return { label: 'மறுவெளியீடு செய்யப்படவில்லை', tone: 'absent' };
  if (s.includes('HEADER_PRESERVATION'))
    return {
      label: 'மூல பதிப்பாளர் தலைப்பு/பண்புரிமைக் குறிப்புடன் மட்டுமே மறுவெளியீடு',
      tone: 'pending',
    };
  if (s.includes('SOURCE_REQUIRED'))
    return { label: 'மூலம் தேவை', tone: 'pending' };
  // Checked before the bare NOT_PUBLISHED case below: the temple registry's
  // coordinateConfidence uses two differently-worded values for the exact
  // same real state (zero coordinates published for any of the 376
  // temples) — "COORDINATES_PENDING_VERIFICATION" on 16 records and
  // "not_published_pending_verification" on the other 360. Checking
  // NOT_PUBLISHED first was making the identical ground truth show two
  // different labels/tones depending only on which wording a record
  // happened to use; both now read as pending verification.
  if (s.includes('PENDING_VERIFICATION'))
    return { label: 'சரிபார்ப்பு நிலுவையில்', tone: 'pending' };
  if (s.includes('NOT_PUBLISHED'))
    return { label: 'இன்னும் வெளியிடப்படவில்லை', tone: 'absent' };
  if (s.includes('INHERITED_VERIFIED') || s.includes('VERIFIED'))
    return { label: 'மூலத்துடன் சரிபார்க்கப்பட்டது', tone: 'verified' };
  if (s.includes('ILLUSTRATIVE'))
    return { label: 'விளக்கப் படம் · ஆவணப் படம் அல்ல', tone: 'pending' };
  if (s.includes('PUBLISHED')) return { label: 'வெளியிடப்பட்டது', tone: 'verified' };
  return { label: state, tone: 'pending' };
}
