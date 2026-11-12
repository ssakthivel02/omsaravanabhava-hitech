import { chennaiToday, isPublishablePanchangam } from './validation';
import { useEffect, useState } from 'react';

type DailyRecord = {
  schemaVersion: string;
  date: string;
  timezone: string;
  location: { name: string };
  status: string;
  source: { provider: string | null; citation: string | null; licence: string | null };
  calculation: { method: string | null; verifiedAt: string | null };
  fields: Record<string, string | null>;
  noticeTa: string;
};

const labels: Record<string, string> = {
  tithi: 'திதி', nakshatra: 'நட்சத்திரம்', yoga: 'யோகம்', karana: 'கரணம்',
  rahuKalam: 'ராகு காலம்', yamagandam: 'எமகண்டம்', nallaNeram: 'நல்ல நேரம்',
};


export default function DailyPanchangam() {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [error, setError] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  // Recheck the Chennai date while a tab stays open; never show yesterday's data.
  useEffect(() => {
    const refreshClock = () => setClock(new Date());
    const interval = setInterval(refreshClock, 60_000);
    document.addEventListener('visibilitychange', refreshClock);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshClock);
    };
  }, []);
  const localDate = chennaiToday(clock);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/panchangam/today.json', { cache: 'no-store', signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then((value: DailyRecord) => setRecord(value))
      .catch((err: unknown) => { if (!(err instanceof DOMException && err.name === 'AbortError')) setError(true); });
    return () => controller.abort();
  }, [localDate]);

  const pendingNotice = record?.noticeTa ?? 'சரிபார்க்கப்பட்ட தகவல் இன்னும் கிடைக்கவில்லை.';
  const verified = isPublishablePanchangam(record, clock);

  return (
    <main className="page" lang="ta" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>இன்றைய தமிழ் பஞ்சாங்கம்</h1>
      <p>சென்னை · இந்திய நேரம் (Asia/Kolkata)</p>
      {!verified ? (
        <section role="status" aria-live="polite" style={{ padding: '1.5rem', border: '1px solid currentColor', borderRadius: 12 }}>
          <h2>தகவல் சரிபார்ப்பு நடைபெறுகிறது</h2>
          <p>{error ? 'தினசரி தகவலை இப்போது பெற முடியவில்லை.' : pendingNotice}</p>
          <p>உறுதிப்படுத்தப்படாத சுபநேரங்களை நாங்கள் வெளியிடுவதில்லை.</p>
        </section>
      ) : (
        <section aria-label="சரிபார்க்கப்பட்ட பஞ்சாங்கம்">
          <p>தேதி: {record.date} · ஆதாரம்: {record.source.provider}</p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {Object.entries(labels).map(([key, label]) => (
              <div key={key} style={{ border: '1px solid currentColor', padding: 16, borderRadius: 10 }}>
                <dt style={{ fontWeight: 700 }}>{label}</dt><dd style={{ margin: '8px 0 0' }}>{record.fields[key]}</dd>
              </div>
            ))}
          </dl>
          <p>கணக்கீட்டு முறை: {record.calculation.method}</p>
          <p>ஆதாரக் குறிப்பு: {record.source.citation}</p>
        </section>
      )}
      <p style={{ marginTop: 24, fontSize: '.9rem' }}>இடம், சூரிய உதயம், கணக்கீட்டு மரபு ஆகியவற்றைப் பொறுத்து பஞ்சாங்க நேரங்கள் மாறலாம்.</p>
    </main>
  );
}
