export type ThiruppugazhCorpusPart = {
  id: 'part-1' | 'part-2' | 'part-3' | 'part-4';
  label: string;
  start: number;
  end: number;
  sourceFile: string;
  sourceUrl: string;
  rightsState: 'REFERENCE_ONLY_PERMISSION_PENDING';
};

/**
 * Corpus-level reference only. These ranges come from the governed
 * VERIFIED_SOURCE_ACQUISITION_ROADMAP and must not be interpreted as a
 * statement that all 1,326 song bodies are published in this application.
 *
 * Project Madurai is currently reference-only for OmSaravanaBhava while
 * redistribution conditions are being resolved. We may use these ranges to
 * express coverage and provenance; full digital transcriptions must not be
 * copied into the public catalogue until the publication-rights gate passes.
 */
export const THIRUPPUGAZH_CORPUS_PARTS: readonly ThiruppugazhCorpusPart[] = [
  {
    id: 'part-1',
    label: 'Project Madurai Part I',
    start: 1,
    end: 330,
    sourceFile: 'pmuni0180.html',
    sourceUrl: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0180.html',
    rightsState: 'REFERENCE_ONLY_PERMISSION_PENDING',
  },
  {
    id: 'part-2',
    label: 'Project Madurai Part II',
    start: 331,
    end: 670,
    sourceFile: 'pmuni0187.html',
    sourceUrl: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0187.html',
    rightsState: 'REFERENCE_ONLY_PERMISSION_PENDING',
  },
  {
    id: 'part-3',
    label: 'Project Madurai Part III',
    start: 671,
    end: 1000,
    sourceFile: 'pmuni0189.html',
    sourceUrl: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0189.html',
    rightsState: 'REFERENCE_ONLY_PERMISSION_PENDING',
  },
  {
    id: 'part-4',
    label: 'Project Madurai Part IV',
    start: 1001,
    end: 1326,
    sourceFile: 'pmuni0191.html',
    sourceUrl: 'https://www.projectmadurai.org/pm_etexts/utf8/pmuni0191.html',
    rightsState: 'REFERENCE_ONLY_PERMISSION_PENDING',
  },
] as const;

export const THIRUPPUGAZH_REFERENCE_CORPUS_SIZE = 1326;

export function corpusPartForSongNumber(songNumber: number) {
  return THIRUPPUGAZH_CORPUS_PARTS.find(
    (part) => songNumber >= part.start && songNumber <= part.end,
  );
}
