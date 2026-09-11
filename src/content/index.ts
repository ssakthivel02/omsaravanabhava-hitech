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
import thiruppugazhBatch002Raw from './intake/thiruppugazh-batch-002.json';
import thiruppugazhBatch003Raw from './intake/thiruppugazh-batch-003.json';
import thiruppugazhBatch004Raw from './intake/thiruppugazh-batch-004.json';
import thiruppugazhBatch005Raw from './intake/thiruppugazh-batch-005.json';
import thiruppugazhBatch006Raw from './intake/thiruppugazh-batch-006.json';
import thiruppugazhBatch007Raw from './intake/thiruppugazh-batch-007.json';
import thiruppugazhBatch008Raw from './intake/thiruppugazh-batch-008.json';
import thiruppugazhBatch009Raw from './intake/thiruppugazh-batch-009.json';
import thiruppugazhBatch010Raw from './intake/thiruppugazh-batch-010.json';
import thiruppugazhBatch011Raw from './intake/thiruppugazh-batch-011.json';
import thiruppugazhBatch012Raw from './intake/thiruppugazh-batch-012.json';
import thiruppugazhBatch013Raw from './intake/thiruppugazh-batch-013.json';
import thiruppugazhBatch014Raw from './intake/thiruppugazh-batch-014.json';
import thiruppugazhBatch015Raw from './intake/thiruppugazh-batch-015.json';
import thiruppugazhBatch016Raw from './intake/thiruppugazh-batch-016.json';
import thiruppugazhBatch017Raw from './intake/thiruppugazh-batch-017.json';
import thiruppugazhBatch018Raw from './intake/thiruppugazh-batch-018.json';
import thiruppugazhBatch019Raw from './intake/thiruppugazh-batch-019.json';
import thiruppugazhBatch020Raw from './intake/thiruppugazh-batch-020.json';
import thiruppugazhBatch021Raw from './intake/thiruppugazh-batch-021.json';
import thiruppugazhBatch022Raw from './intake/thiruppugazh-batch-022.json';
import thiruppugazhBatch023Raw from './intake/thiruppugazh-batch-023.json';
import thiruppugazhBatch024Raw from './intake/thiruppugazh-batch-024.json';
import thiruppugazhBatch025Raw from './intake/thiruppugazh-batch-025.json';
import thiruppugazhBatch026Raw from './intake/thiruppugazh-batch-026.json';
import thiruppugazhBatch027Raw from './intake/thiruppugazh-batch-027.json';
import thiruppugazhBatch028Raw from './intake/thiruppugazh-batch-028.json';
import thiruppugazhBatch029Raw from './intake/thiruppugazh-batch-029.json';
import thiruppugazhBatch030Raw from './intake/thiruppugazh-batch-030.json';
import thiruppugazhBatch031Raw from './intake/thiruppugazh-batch-031.json';
import thiruppugazhBatch032Raw from './intake/thiruppugazh-batch-032.json';
import thiruppugazhBatch033Raw from './intake/thiruppugazh-batch-033.json';
import thiruppugazhBatch034Raw from './intake/thiruppugazh-batch-034.json';
import thiruppugazhBatch035Raw from './intake/thiruppugazh-batch-035.json';
import thiruppugazhBatch036Raw from './intake/thiruppugazh-batch-036.json';
import thiruppugazhBatch037Raw from './intake/thiruppugazh-batch-037.json';
import thiruppugazhBatch038Raw from './intake/thiruppugazh-batch-038.json';
import thiruppugazhBatch039Raw from './intake/thiruppugazh-batch-039.json';
import thiruppugazhBatch040Raw from './intake/thiruppugazh-batch-040.json';
import thiruppugazhBatch041Raw from './intake/thiruppugazh-batch-041.json';
import thiruppugazhBatch042Raw from './intake/thiruppugazh-batch-042.json';
import thiruppugazhBatch043Raw from './intake/thiruppugazh-batch-043.json';
import thiruppugazhBatch044Raw from './intake/thiruppugazh-batch-044.json';
import thiruppugazhBatch045Raw from './intake/thiruppugazh-batch-045.json';
import thiruppugazhBatch046Raw from './intake/thiruppugazh-batch-046.json';
import thiruppugazhBatch047Raw from './intake/thiruppugazh-batch-047.json';
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

export type StateTone = 'verified' | 'pending' | 'absent';

export function describeSourceConfidence(
  confidence: string | null | undefined,
  locale: 'ta' | 'en' = 'ta',
): { label: string; tone: StateTone } {
  const c = (confidence ?? '').toUpperCase();
  const t = (ta: string, en: string) => (locale === 'ta' ? ta : en);
  if (c === 'HIGH')
    return { label: t('மூல அடையாளம்: உறுதியான மூலம்', 'Source identity: confirmed source'), tone: 'verified' };
  if (c === 'PARTIAL_IDENTITY')
    return {
      label: t('மூல அடையாளம்: பகுதி அடையாளச் சான்று', 'Source identity: partial identity evidence'),
      tone: 'pending',
    };
  if (c === 'LOW')
    return { label: t('மூல அடையாளம்: குறைந்த சான்று', 'Source identity: low evidence'), tone: 'pending' };
  if (c) return { label: t(`மூல அடையாளம்: ${confidence}`, `Source identity: ${confidence}`), tone: 'pending' };
  return {
    label: t('மூல அடையாளம்: மதிப்பீடு செய்யப்படவில்லை', 'Source identity: not yet assessed'),
    tone: 'absent',
  };
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

export const OFFICIAL_CURRENT_SOURCE_REVERIFY_AFTER_DAYS = 60;

export function resolveOfficialSourceState(
  source: OfficialCurrentSource,
  now: Date = new Date(),
  maxAgeDays: number = OFFICIAL_CURRENT_SOURCE_REVERIFY_AFTER_DAYS,
): string {
  if (source.state === 'OFFICIAL_CURRENT_SOURCE_REVERIFY_RECOMMENDED') return source.state;

  const verifiedAt = Date.parse(source.lastVerifiedAt);
  const nowMs = now.getTime();
  if (!Number.isFinite(verifiedAt) || !Number.isFinite(nowMs) || !Number.isFinite(maxAgeDays) || maxAgeDays < 0) {
    return 'OFFICIAL_CURRENT_SOURCE_REVERIFY_RECOMMENDED';
  }

  const ageMs = Math.max(0, nowMs - verifiedAt);
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  return ageMs > maxAgeMs
    ? 'OFFICIAL_CURRENT_SOURCE_REVERIFY_RECOMMENDED'
    : source.state;
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

function promoteThiruppugazhMetadataBatch(raw: unknown): ThiruppugazhSong[] {
  return (raw as ThiruppugazhSong[]).map((song) => ({
    ...song,
    publicationState: 'PUBLISHED_METADATA_ONLY_SOURCE_LINKED',
  }));
}

const promotedThiruppugazhBatches = [
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch002Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch003Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch004Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch005Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch006Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch007Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch008Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch009Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch010Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch011Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch012Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch013Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch014Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch015Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch016Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch017Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch018Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch019Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch020Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch021Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch022Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch023Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch024Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch025Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch026Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch027Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch028Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch029Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch030Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch031Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch032Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch033Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch034Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch035Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch036Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch037Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch038Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch039Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch040Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch041Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch042Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch043Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch044Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch045Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch046Raw),
  ...promoteThiruppugazhMetadataBatch(thiruppugazhBatch047Raw),
];

export const thiruppugazh: ThiruppugazhSong[] = [
  ...(thiruppugazhRaw as ThiruppugazhSong[]),
  ...promotedThiruppugazhBatches,
].sort((a, b) => (a.sourceNumbering?.number ?? Number.MAX_SAFE_INTEGER) - (b.sourceNumbering?.number ?? Number.MAX_SAFE_INTEGER));

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

export function describeState(
  state: string,
  locale: 'ta' | 'en' = 'ta',
): { label: string; tone: StateTone } {
  const s = state.toUpperCase();
  const t = (ta: string, en: string) => (locale === 'ta' ? ta : en);
  if (s === 'OFFICIAL_CURRENT_SOURCE_REVERIFY_RECOMMENDED')
    return {
      label: t('தற்போதைய மூலம் · மறு-உறுதிப்படுத்தல் பரிந்துரை', 'Current source · re-verification recommended'),
      tone: 'pending',
    };
  if (s === 'VERIFIED_CURRENT_OFFICIAL_SOURCE')
    return {
      label: t('தற்போதைய உத்தியோகபூர்வ மூலத்துடன் சரிபார்க்கப்பட்டது', 'Verified against current official source'),
      tone: 'verified',
    };
  if (s.includes('NO_APPROVED_AUDIO'))
    return { label: t('அங்கீகரிக்கப்பட்ட ஒலி இல்லை', 'No approved audio'), tone: 'absent' };
  if (s.includes('NO_IMAGE_AVAILABLE'))
    return { label: t('படம் இல்லை', 'No image'), tone: 'absent' };
  if (s.includes('IMAGE_PENDING'))
    return { label: t('படம் நிலுவையில்', 'Image pending'), tone: 'pending' };
  if (s === 'UNKNOWN')
    return { label: t('சரிபார்ப்பு நிலை பதிவு செய்யப்படவில்லை', 'Verification state not recorded'), tone: 'pending' };
  if (s.includes('NOT_REIMPORTED'))
    return {
      label: t('மூலம் இணைக்கப்பட்டது · உரை இன்னும் ஏற்றப்படவில்லை', 'Source linked · text not yet imported'),
      tone: 'pending',
    };
  if (s.includes('ZERO_PUBLISHABLE'))
    return { label: t('வெளியிடத்தக்க தொகுப்பு இல்லை', 'No publishable set'), tone: 'absent' };
  if (s.includes('RIGHTS_UNCERTAIN') || s.includes('NO_REPUBLICATION'))
    return {
      label: t('உரிமை உறுதிசெய்யப்படவில்லை · மறுவெளியீடு இல்லை', 'Rights not confirmed · not republished'),
      tone: 'absent',
    };
  if (s.includes('METADATA_ONLY'))
    return { label: t('விவரங்கள் மட்டும் · உரை இல்லை', 'Metadata only · no text'), tone: 'pending' };
  if (s.includes('NOT_REPUBLISHED'))
    return { label: t('மறுவெளியீடு செய்யப்படவில்லை', 'Not republished'), tone: 'absent' };
  if (s.includes('HEADER_PRESERVATION'))
    return {
      label: t(
        'மூல பதிப்பாளர் தலைப்பு/பண்புரிமைக் குறிப்புடன் மட்டுமே மறுவெளியீடு',
        "Republished only with the source publisher's title/attribution note",
      ),
      tone: 'pending',
    };
  if (s.includes('SOURCE_REQUIRED'))
    return { label: t('மூலம் தேவை', 'Source required'), tone: 'pending' };
  if (s.includes('PENDING_VERIFICATION'))
    return { label: t('சரிபார்ப்பு நிலுவையில்', 'Verification pending'), tone: 'pending' };
  if (s.includes('NOT_PUBLISHED'))
    return { label: t('இன்னும் வெளியிடப்படவில்லை', 'Not yet published'), tone: 'absent' };
  if (s.includes('INHERITED_VERIFIED') || s.includes('VERIFIED'))
    return { label: t('மூலத்துடன் சரிபார்க்கப்பட்டது', 'Verified against source'), tone: 'verified' };
  if (s.includes('ILLUSTRATIVE'))
    return { label: t('விளக்கப் படம் · ஆவணப் படம் அல்ல', 'Illustrative image · not a documentary photo'), tone: 'pending' };
  if (s.includes('PUBLISHED'))
    return { label: t('வெளியிடப்பட்டது', 'Published'), tone: 'verified' };
  return { label: state, tone: 'pending' };
}
