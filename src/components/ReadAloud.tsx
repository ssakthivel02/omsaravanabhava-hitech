import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  text: string;
  lang?: string;
  labelTa?: string;
}

type Status = 'idle' | 'speaking' | 'paused';

export default function ReadAloud({ text, lang = 'ta-IN', labelTa = 'வாசித்துக் கேட்க' }: Props) {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cleanText = useMemo(() => text.replace(/\s+/g, ' ').trim(), [text]);

  useEffect(() => {
    return () => {
      if (supported && utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, [supported]);

  if (!cleanText) return null;

  if (!supported) {
    return (
      <p className="read-aloud-note" lang="ta">
        இந்த உலாவியில் வாசித்துக் கேட்கும் வசதி இல்லை.
      </p>
    );
  }

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus('idle');
    setMessage('வாசித்துக் கேட்கும் செயல்பாடு நிறுத்தப்பட்டது.');
  };

  const start = () => {
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('speaking');
      setMessage('வாசித்துக் கேட்கும் செயல்பாடு தொடர்கிறது.');
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('ta'));
    if (!tamilVoice) {
      setMessage('இந்த உலாவி அல்லது சாதனத்தில் தமிழ் வாசிப்பு குரல் கிடைக்கவில்லை.');
      setStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = tamilVoice.lang || lang;
    utterance.voice = tamilVoice;
    utterance.rate = 0.92;
    utterance.onend = () => {
      utteranceRef.current = null;
      setStatus('idle');
      setMessage('வாசித்துக் கேட்கும் செயல்பாடு முடிந்தது.');
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setStatus('idle');
      setMessage('இந்த உலாவியில் வாசிப்பைத் தொடங்க முடியவில்லை.');
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setStatus('speaking');
    setMessage('உலாவி தமிழ் குரலில் வாசிக்கிறது. இது அதிகாரப்பூர்வ ஒலிப்பதிவு அல்ல.');
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
    setMessage('வாசித்துக் கேட்கும் செயல்பாடு இடைநிறுத்தப்பட்டது.');
  };

  return (
    <section className="read-aloud" aria-label={labelTa}>
      <div className="read-aloud-actions">
        <button type="button" className="btn btn-quiet" onClick={start}>
          <span lang="ta">{status === 'paused' ? 'தொடர்க' : labelTa}</span>
        </button>
        {status === 'speaking' && (
          <button type="button" className="btn btn-quiet" onClick={pause}>
            <span lang="ta">இடைநிறுத்து</span>
          </button>
        )}
        {status !== 'idle' && (
          <button type="button" className="btn btn-quiet" onClick={stop}>
            <span lang="ta">நிறுத்து</span>
          </button>
        )}
      </div>
      <p className="read-aloud-note" lang="ta" aria-live="polite">
        {message || 'உலாவி வழி வாசிப்பு; இது அதிகாரப்பூர்வ பக்தி ஒலிப்பதிவு அல்ல.'}
      </p>
    </section>
  );
}
