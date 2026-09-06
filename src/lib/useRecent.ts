import { useEffect } from 'react';
import { recordRecent, type LibraryRef } from './localLibrary';

export function useRecentItem(item: LibraryRef | null | undefined) {
  useEffect(() => {
    if (!item) return;
    recordRecent(item);
  }, [item?.type, item?.id, item?.titleTa, item?.titleEn]);
}
