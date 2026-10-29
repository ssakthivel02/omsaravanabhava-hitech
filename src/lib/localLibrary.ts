export type LibraryItemType = 'temple' | 'thiruppugazh' | 'work' | 'knowledge' | 'prayer';

export interface LibraryRef {
  type: LibraryItemType;
  id: string;
  titleTa?: string | null | undefined;
  titleEn?: string | null | undefined;
}

export interface SavedLibraryRef extends LibraryRef {
  savedAt: string;
}

export interface RecentLibraryRef extends LibraryRef {
  visitedAt: string;
}

export interface LocalLibraryState {
  version: 1;
  saved: SavedLibraryRef[];
  recent: RecentLibraryRef[];
}

const STORAGE_KEY = 'omsaravanabhava-hitech-library-v1';
const CHANGE_EVENT = 'omsaravanabhava-library-change';
const MAX_RECENT = 20;
const MAX_SAVED = 200;

// Always return a fresh empty state. A shared mutable singleton would retain
// saved/recent items in memory after localStorage itself has been cleared.
const emptyState = (): LocalLibraryState => ({ version: 1, saved: [], recent: [] });

const keyOf = (item: Pick<LibraryRef, 'type' | 'id'>) => `${item.type}:${item.id}`;

function isItemType(value: unknown): value is LibraryItemType {
  return ['temple', 'thiruppugazh', 'work', 'knowledge', 'prayer'].includes(String(value));
}

function cleanText(value: unknown): string | null | undefined {
  if (value === null) return null;
  return typeof value === 'string' ? value.slice(0, 240) : undefined;
}

function sanitizeSaved(value: unknown): SavedLibraryRef[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: SavedLibraryRef[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    if (!isItemType(item.type) || typeof item.id !== 'string' || !item.id.trim()) continue;
    const ref: SavedLibraryRef = {
      type: item.type,
      id: item.id.slice(0, 180),
      titleTa: cleanText(item.titleTa),
      titleEn: cleanText(item.titleEn),
      savedAt: typeof item.savedAt === 'string' ? item.savedAt : new Date(0).toISOString(),
    };
    const key = keyOf(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(ref);
    if (result.length >= MAX_SAVED) break;
  }
  return result;
}

function sanitizeRecent(value: unknown): RecentLibraryRef[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: RecentLibraryRef[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    if (!isItemType(item.type) || typeof item.id !== 'string' || !item.id.trim()) continue;
    const ref: RecentLibraryRef = {
      type: item.type,
      id: item.id.slice(0, 180),
      titleTa: cleanText(item.titleTa),
      titleEn: cleanText(item.titleEn),
      visitedAt: typeof item.visitedAt === 'string' ? item.visitedAt : new Date(0).toISOString(),
    };
    const key = keyOf(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(ref);
    if (result.length >= MAX_RECENT) break;
  }
  return result;
}

export function readLibrary(): LocalLibraryState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed?.version !== 1) return emptyState();
    return {
      version: 1,
      saved: sanitizeSaved(parsed.saved),
      recent: sanitizeRecent(parsed.recent),
    };
  } catch {
    return emptyState();
  }
}

function emitChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT));
}

function writeLibrary(state: LocalLibraryState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    emitChange();
    return true;
  } catch {
    return false;
  }
}

export function subscribeLibrary(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function isSaved(ref: Pick<LibraryRef, 'type' | 'id'>): boolean {
  const key = keyOf(ref);
  return readLibrary().saved.some((item) => keyOf(item) === key);
}

export function saveItem(ref: LibraryRef): boolean {
  const state = readLibrary();
  const key = keyOf(ref);
  const next: SavedLibraryRef = { ...ref, savedAt: new Date().toISOString() };
  state.saved = [next, ...state.saved.filter((item) => keyOf(item) !== key)].slice(0, MAX_SAVED);
  return writeLibrary(state);
}

export function unsaveItem(ref: Pick<LibraryRef, 'type' | 'id'>): boolean {
  const state = readLibrary();
  const key = keyOf(ref);
  state.saved = state.saved.filter((item) => keyOf(item) !== key);
  return writeLibrary(state);
}

export function recordRecent(ref: LibraryRef): boolean {
  const state = readLibrary();
  const key = keyOf(ref);
  const next: RecentLibraryRef = { ...ref, visitedAt: new Date().toISOString() };
  state.recent = [next, ...state.recent.filter((item) => keyOf(item) !== key)].slice(0, MAX_RECENT);
  return writeLibrary(state);
}

export function clearSaved(): boolean {
  const state = readLibrary();
  state.saved = [];
  return writeLibrary(state);
}

export function clearRecent(): boolean {
  const state = readLibrary();
  state.recent = [];
  return writeLibrary(state);
}

export function clearAllLibraryData(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    emitChange();
    return true;
  } catch {
    return false;
  }
}
