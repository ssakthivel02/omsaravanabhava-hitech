import { useEffect, useState } from 'react';

export default function ConnectionStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const handleOnline = () => {
      setOnline(true);
      setReconnected(true);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setReconnected(false), 3500);
    };
    const handleOffline = () => {
      if (timer) window.clearTimeout(timer);
      setReconnected(false);
      setOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online && !reconnected) return null;

  return (
    <div className={`connection-status ${online ? 'is-online' : 'is-offline'}`} role="status" aria-live="polite">
      <span aria-hidden="true">{online ? '✓' : '○'}</span>
      <span lang="ta">
        {online
          ? 'இணைய இணைப்பு மீண்டும் கிடைத்தது.'
          : 'இணைய இணைப்பு இல்லை. முன்பு தற்காலிகமாக சேமிக்கப்பட்ட பக்கங்கள் மட்டும் கிடைக்கலாம்.'}
      </span>
    </div>
  );
}
