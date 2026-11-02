import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, type UiLocale } from '@/lib/locale';

interface Props {
  text: string;
  lang?: string;
  labelTa?: string;
  labelEn?: string;
}

type Status = 'idle' | 'speaking' | 'paused';

type ReadAloudCopy = {
  readAloud: string;
  resume: string;
  pause: string;
  stop: string;
  unavailable: string;
  stopped: string;
  continuing: string;
  noTamilVoice: string;
  finished: string;
  couldNotStart: string;
  readingTamil: string;
  paused: string;
  disclaimer: string;
};

const COPY: Record<UiLocale, ReadAloudCopy> = {
  ta: {
    readAloud: 'வாசித்துக் கேட்க',
    resume: 'தொடர்க',
    pause: 'இடைநிறுத்து',
    stop: 'நிறுத்து',
    unavailable: 'இந்த உலாவியில் வாசித்துக் கேட்கும் வசதி இல்லை.',
    stopped: 'வாசித்துக் கேட்கும் செயல்பாடு நிறுத்தப்பட்டது.',
    continuing: 'வாசித்துக் கேட்கும் செயல்பாடு தொடர்கிறது.',
    noTamilVoice: 'இந்த உலாவி அல்லது சாதனத்தில் தமிழ் வாசிப்பு குரல் கிடைக்கவில்லை.',
    finished: 'வாசித்துக் கேட்கும் செயல்பாடு முடிந்தது.',
    couldNotStart: 'இந்த உலாவியில் வாசிப்பைத் தொடங்க முடியவில்லை.',
    readingTamil: 'உலாவி தமிழ் குரலில் வாசிக்கிறது. இது அதிகாரப்பூர்வ ஒலிப்பதிவு அல்ல.',
    paused: 'வாசித்துக் கேட்கும் செயல்பாடு இடைநிறுத்தப்பட்டது.',
    disclaimer: 'உலாவி வழி வாசிப்பு; இது அதிகாரப்பூர்வ பக்தி ஒலிப்பதிவு அல்ல.',
  },
  en: {
    readAloud: 'Read aloud',
    resume: 'Resume',
    pause: 'Pause',
    stop: 'Stop',
    unavailable: 'Read-aloud is not available in this browser.',
    stopped: 'Read-aloud was stopped.',
    continuing: 'Read-aloud is continuing.',
    noTamilVoice: 'No Tamil voice is available on this browser or device.',
    finished: 'Read-aloud finished.',
    couldNotStart: 'Could not start read-aloud in this browser.',
    readingTamil: 'The browser is reading aloud in a Tamil voice. This is not an official audio recording.',
    paused: 'Read-aloud was paused.',
    disclaimer: 'Browser-based read-aloud; this is not an official devotional audio recording.',
  },
  te: {
    readAloud: 'చదివి వినిపించు',
    resume: 'కొనసాగించు',
    pause: 'విరామం',
    stop: 'ఆపు',
    unavailable: 'ఈ బ్రౌజర్‌లో చదివి వినిపించే సౌకర్యం అందుబాటులో లేదు.',
    stopped: 'చదివి వినిపించడం ఆపబడింది.',
    continuing: 'చదివి వినిపించడం కొనసాగుతోంది.',
    noTamilVoice: 'ఈ బ్రౌజర్ లేదా పరికరంలో తమిళ వాయిస్ అందుబాటులో లేదు.',
    finished: 'చదివి వినిపించడం పూర్తైంది.',
    couldNotStart: 'ఈ బ్రౌజర్‌లో చదివి వినిపించడం ప్రారంభించలేకపోయాం.',
    readingTamil: 'బ్రౌజర్ తమిళ వాయిస్‌తో చదివి వినిపిస్తోంది. ఇది అధికారిక ఆడియో రికార్డింగ్ కాదు.',
    paused: 'చదివి వినిపించడం విరామంలో ఉంది.',
    disclaimer: 'ఇది బ్రౌజర్ ఆధారిత చదివి వినిపింపు; అధికారిక భక్తి ఆడియో రికార్డింగ్ కాదు.',
  },
  ml: {
    readAloud: 'വായിച്ചു കേൾപ്പിക്കുക',
    resume: 'തുടരുക',
    pause: 'താൽക്കാലികമായി നിർത്തുക',
    stop: 'നിർത്തുക',
    unavailable: 'ഈ ബ്രൗസറിൽ വായിച്ചു കേൾപ്പിക്കൽ ലഭ്യമല്ല.',
    stopped: 'വായിച്ചു കേൾപ്പിക്കൽ നിർത്തി.',
    continuing: 'വായിച്ചു കേൾപ്പിക്കൽ തുടരുന്നു.',
    noTamilVoice: 'ഈ ബ്രൗസറിലോ ഉപകരണത്തിലോ തമിഴ് ശബ്ദം ലഭ്യമല്ല.',
    finished: 'വായിച്ചു കേൾപ്പിക്കൽ പൂർത്തിയായി.',
    couldNotStart: 'ഈ ബ്രൗസറിൽ വായിച്ചു കേൾപ്പിക്കൽ ആരംഭിക്കാനായില്ല.',
    readingTamil: 'ബ്രൗസർ തമിഴ് ശബ്ദത്തിൽ വായിച്ചു കേൾപ്പിക്കുന്നു. ഇത് ഔദ്യോഗിക ഓഡിയോ റെക്കോർഡിംഗ് അല്ല.',
    paused: 'വായിച്ചു കേൾപ്പിക്കൽ താൽക്കാലികമായി നിർത്തി.',
    disclaimer: 'ഇത് ബ്രൗസർ അടിസ്ഥാനത്തിലുള്ള വായിച്ചു കേൾപ്പിക്കൽ ആണ്; ഔദ്യോഗിക ഭക്തി ഓഡിയോ റെക്കോർഡിംഗ് അല്ല.',
  },
  kn: {
    readAloud: 'ಓದಿ ಕೇಳಿಸಿ',
    resume: 'ಮುಂದುವರಿಸಿ',
    pause: 'ವಿರಾಮ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    unavailable: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಓದಿ ಕೇಳಿಸುವ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.',
    stopped: 'ಓದಿ ಕೇಳಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಲಾಗಿದೆ.',
    continuing: 'ಓದಿ ಕೇಳಿಸುವುದು ಮುಂದುವರಿಯುತ್ತಿದೆ.',
    noTamilVoice: 'ಈ ಬ್ರೌಸರ್ ಅಥವಾ ಸಾಧನದಲ್ಲಿ ತಮಿಳು ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ.',
    finished: 'ಓದಿ ಕೇಳಿಸುವುದು ಪೂರ್ಣಗೊಂಡಿದೆ.',
    couldNotStart: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಓದಿ ಕೇಳಿಸುವುದನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗಲಿಲ್ಲ.',
    readingTamil: 'ಬ್ರೌಸರ್ ತಮಿಳು ಧ್ವನಿಯಲ್ಲಿ ಓದಿ ಕೇಳಿಸುತ್ತಿದೆ. ಇದು ಅಧಿಕೃತ ಆಡಿಯೋ ದಾಖಲೆ ಅಲ್ಲ.',
    paused: 'ಓದಿ ಕೇಳಿಸುವುದನ್ನು ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ.',
    disclaimer: 'ಇದು ಬ್ರೌಸರ್ ಆಧಾರಿತ ಓದಿ ಕೇಳಿಸುವಿಕೆ; ಅಧಿಕೃತ ಭಕ್ತಿ ಆಡಿಯೋ ದಾಖಲೆ ಅಲ್ಲ.',
  },
  hi: {
    readAloud: 'पढ़कर सुनाएँ',
    resume: 'जारी रखें',
    pause: 'रोकें',
    stop: 'बंद करें',
    unavailable: 'इस ब्राउज़र में पढ़कर सुनाने की सुविधा उपलब्ध नहीं है।',
    stopped: 'पढ़कर सुनाना बंद कर दिया गया।',
    continuing: 'पढ़कर सुनाना जारी है।',
    noTamilVoice: 'इस ब्राउज़र या डिवाइस पर तमिल आवाज़ उपलब्ध नहीं है।',
    finished: 'पढ़कर सुनाना पूरा हुआ।',
    couldNotStart: 'इस ब्राउज़र में पढ़कर सुनाना शुरू नहीं किया जा सका।',
    readingTamil: 'ब्राउज़र तमिल आवाज़ में पढ़कर सुना रहा है। यह आधिकारिक ऑडियो रिकॉर्डिंग नहीं है।',
    paused: 'पढ़कर सुनाना रोका गया है।',
    disclaimer: 'यह ब्राउज़र-आधारित पढ़कर सुनाने की सुविधा है; यह आधिकारिक भक्ति ऑडियो रिकॉर्डिंग नहीं है।',
  },
};

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
  const { uiLocale } = useLocale();
  const copy = COPY[uiLocale];
  const label = uiLocale === 'ta' ? labelTa : uiLocale === 'en' ? labelEn : copy.readAloud;
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
      <p className="read-aloud-note" lang={uiLocale}>
        {copy.unavailable}
      </p>
    );
  }

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus('idle');
    setMessage(copy.stopped);
  };

  const start = () => {
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('speaking');
      setMessage(copy.continuing);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('ta'));
    if (!tamilVoice) {
      setMessage(copy.noTamilVoice);
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
      setMessage(copy.finished);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setStatus('idle');
      setMessage(copy.couldNotStart);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setStatus('speaking');
    setMessage(copy.readingTamil);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus('paused');
    setMessage(copy.paused);
  };

  return (
    <section className="read-aloud" aria-label={label}>
      <div className="read-aloud-actions">
        <button type="button" className="btn btn-quiet" onClick={start}>
          <span lang={uiLocale}>{status === 'paused' ? copy.resume : label}</span>
        </button>
        {status === 'speaking' && (
          <button type="button" className="btn btn-quiet" onClick={pause}>
            <span lang={uiLocale}>{copy.pause}</span>
          </button>
        )}
        {status !== 'idle' && (
          <button type="button" className="btn btn-quiet" onClick={stop}>
            <span lang={uiLocale}>{copy.stop}</span>
          </button>
        )}
      </div>
      <p className="read-aloud-note" lang={uiLocale} aria-live="polite">
        {message || copy.disclaimer}
      </p>
    </section>
  );
}
