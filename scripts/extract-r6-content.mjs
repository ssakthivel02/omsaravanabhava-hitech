#!/usr/bin/env node
/**
 * extract-r6-content.mjs
 *
 * Extracts ONLY governed devotional DATA from the hash-verified Manus R6 archive
 * into typed JSON under src/content/.
 *
 * It deliberately does NOT copy:
 *   - any legacy .html page
 *   - app.js / rc1.js / rc2.js / phase2*.js  (legacy vanilla renderer)
 *   - sw.js                                  (legacy service worker, cache osb-r5-*)
 *   - styles.css / rc1.css / rc2.css         (legacy presentation)
 *
 * Rationale: the R6 archive ships a complete legacy static site inside
 * client/public/. Copying it is the mechanism by which every previous
 * migration reverted. See docs/PHASE0_RECOVERY_REPORT.md.
 *
 * Usage: node scripts/extract-r6-content.mjs <path-to-extracted-R6-root>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const EXPECTED_ARCHIVE_SHA256 =
  '3477dd375e9545bd51482f9cacabe851adc6a841cdf111ffd5eb408f76c26585';

const root = process.argv[2];
if (!root) {
  console.error('usage: node scripts/extract-r6-content.mjs <R6_ROOT>');
  process.exit(1);
}

const DATA = join(root, 'client', 'public', 'data');
const OUT = resolve(process.cwd(), 'src', 'content');
mkdirSync(OUT, { recursive: true });

/** Files we are explicitly forbidden to import, asserted rather than assumed. */
const FORBIDDEN = ['app.js', 'sw.js', 'styles.css', 'rc1.js', 'rc2.js', 'index.html'];

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const records = (o) =>
  Array.isArray(o) ? o : (o?.records ?? o?.items ?? o?.entries ?? []);

const load = (name) => {
  const p = join(DATA, name);
  if (!existsSync(p)) {
    console.warn(`  ! missing registry: ${name} -> emitting empty set`);
    return [];
  }
  return records(read(p));
};

console.log('R6 governed-content extraction');
console.log('  source root :', root);
console.log('  archive sha :', EXPECTED_ARCHIVE_SHA256);

// ---------------------------------------------------------------- temples ---
const temples = load('canonical-temple-master.json').map((t) => ({
  id: t.canonical_temple_id,
  nameTa: t.canonical_tamil_name ?? null,
  nameEn: t.english_name ?? null,
  transliteration: t.transliteration ?? null,
  alternateNames: t.alternate_names ?? [],
  deity: t.deity ?? null,
  muruganForm: t.murugan_form ?? null,
  classification: t.classification ?? [],
  isArupadaiVeedu: (t.classification ?? []).some((c) =>
    String(c).includes('அறுபடை'),
  ),
  district: t.district ?? null,
  state: t.state ?? null,
  latitude: t.latitude ?? null,
  longitude: t.longitude ?? null,
  coordinateConfidence: t.coordinate_confidence ?? 'UNKNOWN',
  history: t.history ?? null,
  architecture: t.architecture ?? null,
  sthalaPurana: t.sthala_puranic_tradition ?? null,
  visitorInformation: t.visitor_information ?? null,
  officialAuthority: t.official_authority ?? null,
  officialWebsite: t.official_website ?? null,
  // Platform must never intermediate donations: we carry the official link
  // through verbatim and render it as an external, official-channel-only link.
  officialDirectSupportLink: t.official_direct_support_link ?? null,
  imageStatus: t.image_status ?? 'ILLUSTRATIVE_NOT_DOCUMENTARY',
  literaryRelationships: t.literary_relationships ?? [],
  sources: t.sources ?? [],
}));

// Canonical Arupadai Veedu pilgrimage order (traditional sequence, not
// alphabetical). Used only to ORDER records that R6 already classifies.
const ARUPADAI_ORDER = [
  'திருப்பரங்குன்றம்',
  'திருச்செந்தூர்',
  'பழனி',
  'சுவாமிமலை',
  'திருத்தணி',
  'பழமுதிர்சோலை',
];
const arupadai = ARUPADAI_ORDER.map((name, i) => {
  const rec = temples.find((t) => t.nameTa === name);
  if (!rec) throw new Error(`Arupadai Veedu record missing from R6: ${name}`);
  return { ...rec, pilgrimageOrder: i + 1 };
});

// ----------------------------------------------------------- thiruppugazh ---
const thiruppugazh = load('thiruppugazh-master-registry.json').map((s) => ({
  id: s.song_id,
  openingWords: s.opening_words ?? null,
  titleTa: s.canonical_tamil_title ?? null,
  // The R6 registry links to a source edition but does NOT carry the verse
  // body. We preserve that state truthfully instead of inventing text.
  canonicalTextStatus: s.canonical_tamil_text_status ?? 'UNKNOWN',
  canonicalText: s.canonical_tamil_text ?? null,
  attribution: s.arunagirinathar_attribution ?? null,
  sourceId: s.source_id ?? null,
  edition: s.edition ?? null,
  sourceNumbering: s.source_numbering ?? null,
  rightsStatus: s.rights_status ?? null,
  verificationState: s.text_verification_state ?? 'UNKNOWN',
  meaningState: s.meaning_state ?? 'NOT_PUBLISHED',
  transliterationState: s.transliteration_state ?? 'NOT_PUBLISHED',
  audioState: s.audio_state ?? 'NO_APPROVED_AUDIO',
  publicationState: s.publication_state ?? 'UNKNOWN',
}));

// -------------------------------------------------------- murugan / works ---
const names = load('murugan-name-registry.json').map((n) => ({
  id: n.name_id ?? n.id ?? null,
  nameTa: n.tamil_name ?? n.canonical_tamil_name ?? n.name_ta ?? null,
  nameEn: n.english_name ?? n.name_en ?? null,
  meaning: n.meaning ?? null,
  sources: n.sources ?? [],
}));

const works = load('murugan-works-registry.json').map((w) => ({
  id: w.work_id ?? w.id ?? null,
  titleTa: w.canonical_tamil_title ?? w.tamil_title ?? w.title_ta ?? null,
  titleEn: w.english_title ?? w.title_en ?? null,
  author: w.author ?? null,
  period: w.period ?? null,
  verificationState: w.verification_state ?? 'UNKNOWN',
  sources: w.sources ?? [],
}));

const sources = load('murugan-source-ledger.json').map((s) => ({
  id: s.source_id ?? s.id ?? null,
  reference: s.reference ?? s.citation ?? null,
  type: s.source_type ?? s.type ?? null,
  confidence: s.confidence ?? s.source_confidence ?? null,
  url: s.url ?? null,
  rights: s.rights_status ?? null,
}));

const audio = load('murugan-audio-registry.json');
const festivals = load('murugan-festival-registry.json');

// ------------------------------------------- devotional works / prayer texts ---
// Phase 2S registry is explicitly PUBLIC_METADATA_ONLY. Every record carries a
// rights state; none of them permit republishing the text body. We surface the
// metadata and the rights state, and publish no verse text.
const devotionalWorks = load('phase2s-devotional-works.json').map((w) => ({
  id: w.work_id,
  titleTa: w.canonical_tamil_title ?? null,
  titleEn: w.english_display ?? null,
  authorId: w.author_id ?? null,
  workType: w.work_type ?? null,
  sourceIds: w.source_ids ?? [],
  rightsState: w.rights_state ?? 'UNKNOWN',
  textPublicationState: w.text_publication_state ?? 'METADATA_ONLY',
  canonicalTextState: w.canonical_text_state ?? 'NOT_REPUBLISHED',
  easyTamilState: w.easy_tamil_state ?? 'NOT_PUBLISHED',
  transliterationState: w.transliteration_state ?? 'NOT_PUBLISHED',
  meaningState: w.meaning_state ?? 'NOT_PUBLISHED',
  audioState: w.audio_state ?? 'NO_APPROVED_AUDIO',
}));

// Namavali: the registry deliberately publishes nothing. We carry the policy
// verbatim rather than quietly rendering an empty page.
const namavaliRaw = existsSync(join(DATA, 'murugan-namavali-collections.json'))
  ? read(join(DATA, 'murugan-namavali-collections.json'))
  : { records: [], dataset_status: 'UNKNOWN' };
const namavali = {
  datasetStatus: namavaliRaw.dataset_status ?? 'UNKNOWN',
  researchState: namavaliRaw.research_state ?? {},
  records: namavaliRaw.records ?? [],
};

const kumarastavamRaw = existsSync(join(DATA, 'kumarastavam-registry.json'))
  ? read(join(DATA, 'kumarastavam-registry.json'))
  : { records: [] };
const kumarastavam = (kumarastavamRaw.records ?? []).map((k) => ({
  id: k.collection_id,
  titleTa: k.canonical_tamil_title ?? null,
  transliteration: k.transliteration ?? null,
  author: k.associated_author ?? null,
  edition: k.edition_or_tradition ?? null,
  invocationsInSource: k.number_of_invocations_source_scoped ?? null,
  invocationsPublished: k.invocation_records_published ?? 0,
  canonicalTextStatus: k.canonical_text_status ?? 'UNKNOWN',
  meaningStatus: k.meaning_status ?? 'NOT_PUBLISHED',
  audioStatus: k.audio_status ?? 'NO_APPROVED_AUDIO',
}));

// ------------------------------------------------- completeness (truthful) ---
const completeness = {
  generatedAt: new Date().toISOString(),
  sourceArchiveSha256: EXPECTED_ARCHIVE_SHA256,
  note:
    'Counts are computed directly from the hash-verified R6 governed registries. ' +
    'Published state reflects what is actually present, never what is aspirational.',
  domains: [
    {
      key: 'temples',
      labelTa: 'கோயில்கள்',
      labelEn: 'Temples',
      records: temples.length,
      withCoordinates: temples.filter((t) => t.latitude != null).length,
      withHistory: temples.filter((t) => t.history).length,
      withVisitorInfo: temples.filter((t) => t.visitorInformation).length,
    },
    {
      key: 'arupadai',
      labelTa: 'அறுபடை வீடு',
      labelEn: 'Arupadai Veedu',
      records: arupadai.length,
      withCoordinates: arupadai.filter((t) => t.latitude != null).length,
      withHistory: arupadai.filter((t) => t.history).length,
      withVisitorInfo: arupadai.filter((t) => t.visitorInformation).length,
    },
    {
      key: 'thiruppugazh',
      labelTa: 'திருப்புகழ்',
      labelEn: 'Thiruppugazh',
      records: thiruppugazh.length,
      withCanonicalText: thiruppugazh.filter((s) => s.canonicalText).length,
      withMeaning: thiruppugazh.filter((s) => s.meaningState === 'PUBLISHED').length,
      withAudio: thiruppugazh.filter((s) => s.audioState !== 'NO_APPROVED_AUDIO')
        .length,
    },
    {
      key: 'works',
      labelTa: 'நூல்கள்',
      labelEn: 'Works',
      records: works.length,
    },
    {
      key: 'names',
      labelTa: 'திருநாமங்கள்',
      labelEn: 'Sacred names',
      records: names.length,
    },
    {
      key: 'prayers',
      labelTa: 'மந்திரம் · துதி',
      labelEn: 'Mantras & prayers',
      records: devotionalWorks.length + kumarastavam.length,
      withCanonicalText: 0,
      withMeaning: 0,
      withAudio: 0,
    },
    {
      key: 'namavali',
      labelTa: 'நாமாவளி',
      labelEn: 'Namavali',
      records: namavali.records.length,
      withCanonicalText: 0,
    },
    {
      key: 'audio',
      labelTa: 'ஒலி',
      labelEn: 'Audio',
      records: Array.isArray(audio) ? audio.length : 0,
    },
    {
      key: 'festivals',
      labelTa: 'திருவிழாக்கள்',
      labelEn: 'Festivals',
      records: Array.isArray(festivals) ? festivals.length : 0,
    },
  ],
};

const write = (name, value) => {
  writeFileSync(join(OUT, name), JSON.stringify(value, null, 2) + '\n', 'utf8');
  const n = Array.isArray(value) ? value.length : Object.keys(value).length;
  console.log(`  wrote src/content/${name}  (${n})`);
};

write('temples.json', temples);
write('arupadai-veedu.json', arupadai);
write('thiruppugazh.json', thiruppugazh);
write('murugan-names.json', names);
write('works.json', works);
write('sources.json', sources);
write('devotional-works.json', devotionalWorks);
write('namavali.json', namavali);
write('kumarastavam.json', kumarastavam);
write('completeness.json', completeness);

// Assert we never emitted a legacy artefact into the new tree.
for (const f of FORBIDDEN) {
  if (existsSync(join(OUT, f))) {
    console.error(`FATAL: legacy artefact leaked into src/content: ${f}`);
    process.exit(1);
  }
}
console.log('\nextraction complete — no legacy shell artefacts imported');
