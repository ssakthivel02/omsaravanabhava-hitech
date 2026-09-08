import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '@/lib/locale';

interface Props {
  text: string;
  lang?: string;
  labelTa?: string;
  labelEn?: string;
}

type Status = 'idle' | 'speaking' | 'paused';

// Read Aloud always speaks the canonical Tamil source text via a Tamil
// browser voice, regardless of the visitor's chosen UI language — the
// content being read is canonical, not a UI string, so it is never
// translated. Only the surrounding controls (buttons, status messages)
// follow the UI locale.
export default function ReadAloud({
  text: sourceText,
  lang = 'ta-IN',
  labelTa = 'வாசித்துக் கேட்க',
  labelEn = 'Read aloud',
}: Props) {
  const { locale, text } = useLocale();
  const label = locale === 'ta' ? labelTa : labelEn;
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cleanText = useMemo(() => sourceText.replace(/\s+/g, ' ').trim(), [sourceText]);

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
      <p className="read-aloud-note" lang={locale}>
        {text('இந்த உலாவியில் வாசித்துக் கேட்கும் வசதி இல்லை.', 'Read-aloud is not available in this browser.')}
      </p>
    );
  }

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus('idle');
    setMessage(text('வாசித்துக் கேட்கும் செயல்பாடு நிறுத்தப்பட்டது.', 'Read-aloud was stopped.'));
  };

  const start = () => {
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('speaking');
      setMessage(text('வாசித்துக் கேட்கும் செயல்பாடு தொடர்கிறது.', 'Read-aloud is continuing.'));
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('ta'));
    if (!tamilVoice) {
      setMessage(
        text(
          'இந்த உலாவி அல்லது சாதனத்தில் தமிழ் வாசிப்பு குரல் கிடைக்கவில்லை.',
          'No Tamil voice is available on this browser or device.',
        ),
      );
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
      setMessage(text('வாசித்துக் கேட்கும் செயல்பாடு முடிந்தது.', 'Read-aloud finished.'));
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setStatus('idle');
      setMessage(text('இந்த உலாவியில் வாசிப்பைத் தொடங்க முடியவில்லை.', 'Could not start read-aloud in this browser.'));
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setStatus('speaking');
    setMessage(
      text(
        'உலாவி தமிழ் குரலில் வாசிக்கிறது. இது அதிகாரப்பூர்வ ஒலிப்பதிவு அல்ல.',
        'The browser is reading aloud in a Tamil voice. This is not an official audio recording.',
      ),
    );
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
    setMessage(text('வாசித்துக் கேட்கும் செயல்பாடு இடைநிறுத்தப்பட்டது.', 'Read-aloud was paused.'));
  };

  return (
    <section className="read-aloud" aria-label={label}>
      <div className="read-aloud-actions">
        <button type="button" className="btn btn-quiet" onClick={start}>
          <span lang={locale}>{status === 'paused' ? text('தொடர்க', 'Resume') : label}</span>
        </button>
        {status === 'speaking' && (
          <button type="button" className="btn btn-quiet" onClick={pause}>
            <span lang={locale}>{text('இடைநிறுத்து', 'Pause')}</span>
          </button>
        )}
        {status !== 'idle' && (
          <button type="button" className="btn btn-quiet" onClick={stop}>
            <span lang={locale}>{text('நிறுத்து', 'Stop')}</span>
          </button>
        )}
      </div>
      <p className="read-aloud-note" lang={locale} aria-live="polite">
        {message || text('உலாவி வழி வாசிப்பு; இது அதிகாரப்பூர்வ பக்தி ஒலிப்பதிவு அல்ல.', 'Browser-based read-aloud; this is not an official devotional audio recording.')}
      </p>
    </section>
  );
}
