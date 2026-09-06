import { useEffect } from 'react';
import { recordRecent, type LibraryRef } from './localLibrary';

export function useRecentItem(item: LibraryRef | null | undefined) {
  const type = item?.type;
  const id = item?.id;
  const titleTa = item?.titleTa;
  const titleEn = item?.titleEn;

  useEffect(() => {
    if (!type || !id) return;
    recordRecent({
      type,
      id,
      ...(titleTa !== undefined ? { titleTa } : {}),
      ...(titleEn !== undefined ? { titleEn } : {}),
    });
  }, [type, id, titleTa, titleEn]);
}
