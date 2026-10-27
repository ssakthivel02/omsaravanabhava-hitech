import type { ThiruppugazhSong } from '@/content';

/** Move among existing catalogue records, never infer missing verse records. */
export function neighboringSongs(
  songs: readonly ThiruppugazhSong[],
  currentId: string,
): { previous?: ThiruppugazhSong; next?: ThiruppugazhSong } {
  const position = songs.findIndex((song) => song.id === currentId);
  if (position < 0) return {};
  return {
    previous: position > 0 ? songs[position - 1] : undefined,
    next: position + 1 < songs.length ? songs[position + 1] : undefined,
  };
}
