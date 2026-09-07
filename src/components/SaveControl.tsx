import { useEffect, useState } from 'react';
import {
  isSaved,
  saveItem,
  subscribeLibrary,
  unsaveItem,
  type LibraryRef,
} from '@/lib/localLibrary';
import { useLocale } from '@/lib/locale';

export default function SaveControl({ item }: { item: LibraryRef }) {
  const [saved, setSaved] = useState(() => isSaved(item));
  const [message, setMessage] = useState('');
  const itemType = item.type;
  const itemId = item.id;
  const { locale, text } = useLocale();

  useEffect(() => {
    const sync = () => setSaved(isSaved({ type: itemType, id: itemId }));
    sync();
    return subscribeLibrary(sync);
  }, [itemId, itemType]);

  const toggle = () => {
    const ok = saved ? unsaveItem(item) : saveItem(item);
    if (!ok) {
      setMessage(text('இந்த உலாவியில் உள்ளூர் சேமிப்பு கிடைக்கவில்லை.', 'Local saving is not available in this browser.'));
      return;
    }
    const next = !saved;
    setSaved(next);
    setMessage(
      next
        ? text('இந்தப் பதிவு இந்த உலாவியில் சேமிக்கப்பட்டது.', 'This record was saved in this browser.')
        : text('சேமிப்பிலிருந்து நீக்கப்பட்டது.', 'Removed from saved.'),
    );
  };

  return (
    <div className="save-control-wrap">
      <button
        type="button"
        className={`save-control${saved ? ' is-saved' : ''}`}
        aria-pressed={saved}
        onClick={toggle}
      >
        <span aria-hidden="true">{saved ? '✓' : '+'}</span>
        <span lang={locale}>{saved ? text('சேமிக்கப்பட்டது', 'Saved') : text('சேமி', 'Save')}</span>
      </button>
      <span className="sr-only" aria-live="polite" lang={locale}>
        {message}
      </span>
    </div>
  );
}
