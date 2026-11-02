import type { ThiruppugazhSong } from '@/content';

/** Exact-number lookup; never infer nonexistent records from corpus bounds. */
export function findSongByReferenceNumber(
  songs: readonly ThiruppugazhSong[],
  input: string,
): ThiruppugazhSong | undefined {
  const normalized = input.trim();
  if (!/^[0-9]{1,4}$/.test(normalized)) return undefined;
  const number = Number(normalized);
  if (number < 1 || number > 1326) return undefined;
  return songs.find((song) => song.sourceNumbering?.number === number);
}
