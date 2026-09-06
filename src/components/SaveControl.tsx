import { useEffect, useState } from 'react';
import {
  isSaved,
  saveItem,
  subscribeLibrary,
  unsaveItem,
  type LibraryRef,
} from '@/lib/localLibrary';

export default function SaveControl({ item }: { item: LibraryRef }) {
  const [saved, setSaved] = useState(() => isSaved(item));
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setSaved(isSaved(item));
    sync();
    return subscribeLibrary(sync);
  }, [item.id, item.type]);

  const toggle = () => {
    const ok = saved ? unsaveItem(item) : saveItem(item);
    if (!ok) {
      setMessage('இந்த உலாவியில் உள்ளூர் சேமிப்பு கிடைக்கவில்லை.');
      return;
    }
    const next = !saved;
    setSaved(next);
    setMessage(next ? 'இந்தப் பதிவு இந்த உலாவியில் சேமிக்கப்பட்டது.' : 'சேமிப்பிலிருந்து நீக்கப்பட்டது.');
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
        <span lang="ta">{saved ? 'சேமிக்கப்பட்டது' : 'சேமி'}</span>
      </button>
      <span className="sr-only" aria-live="polite" lang="ta">
        {message}
      </span>
    </div>
  );
}
