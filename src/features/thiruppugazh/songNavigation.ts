import type { ThiruppugazhSong } from '@/content';

/** Move among existing catalogue records, never infer missing verse records. */
export function neighboringSongs(
  songs: readonly ThiruppugazhSong[],
  currentId: string,
): { previous?: ThiruppugazhSong; next?: ThiruppugazhSong } {
  const position = songs.findIndex((song) => song.id === currentId);
  if (position < 0) return {};
  return {
    ...(position > 0 && songs[position - 1] ? { previous: songs[position - 1] } : {}),
    ...(position + 1 < songs.length && songs[position + 1] ? { next: songs[position + 1] } : {}),
  };
}
