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
  const { uiLocale, text } = useLocale();

  useEffect(() => {
    const sync = () => setSaved(isSaved({ type: itemType, id: itemId }));
    sync();
    return subscribeLibrary(sync);
  }, [itemId, itemType]);

  const toggle = () => {
    const ok = saved ? unsaveItem(item) : saveItem(item);
    if (!ok) {
      setMessage(
        text(
          'இந்த உலாவியில் உள்ளூர் சேமிப்பு கிடைக்கவில்லை.',
          'Local saving is not available in this browser.',
          {
            te: 'ఈ బ్రౌజర్‌లో స్థానికంగా సేవ్ చేసే సౌకర్యం అందుబాటులో లేదు.',
            ml: 'ഈ ബ്രൗസറിൽ പ്രാദേശികമായി സേവ് ചെയ്യാനുള്ള സൗകര്യം ലഭ്യമല്ല.',
            kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸುವ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.',
            hi: 'इस ब्राउज़र में स्थानीय रूप से सहेजने की सुविधा उपलब्ध नहीं है।',
          },
        ),
      );
      return;
    }
    const next = !saved;
    setSaved(next);
    setMessage(
      next
        ? text(
            'இந்தப் பதிவு இந்த உலாவியில் சேமிக்கப்பட்டது.',
            'This record was saved in this browser.',
            {
              te: 'ఈ రికార్డు ఈ బ్రౌజర్‌లో సేవ్ చేయబడింది.',
              ml: 'ഈ രേഖ ഈ ബ്രൗസറിൽ സേവ് ചെയ്തു.',
              kn: 'ಈ ದಾಖಲೆಯನ್ನು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.',
              hi: 'यह रिकॉर्ड इस ब्राउज़र में सहेजा गया।',
            },
          )
        : text(
            'சேமிப்பிலிருந்து நீக்கப்பட்டது.',
            'Removed from saved.',
            {
              te: 'సేవ్ చేసిన వాటి నుంచి తొలగించబడింది.',
              ml: 'സേവ് ചെയ്തവയിൽ നിന്ന് നീക്കി.',
              kn: 'ಉಳಿಸಿದ ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
              hi: 'सहेजी गई सूची से हटा दिया गया।',
            },
          ),
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
        <span lang={uiLocale}>
          {saved
            ? text('சேமிக்கப்பட்டது', 'Saved', {
                te: 'సేవ్ చేయబడింది',
                ml: 'സേവ് ചെയ്തു',
                kn: 'ಉಳಿಸಲಾಗಿದೆ',
                hi: 'सहेजा गया',
              })
            : text('சேமி', 'Save', {
                te: 'సేవ్ చేయండి',
                ml: 'സേവ് ചെയ്യുക',
                kn: 'ಉಳಿಸಿ',
                hi: 'सहेजें',
              })}
        </span>
      </button>
      <span className="sr-only" aria-live="polite" lang={uiLocale}>
        {message}
      </span>
    </div>
  );
}
