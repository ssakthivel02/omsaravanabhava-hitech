import { Link } from 'wouter';
import { useLocale } from '@/lib/locale';

export default function NotFound() {
  const { uiLocale, text } = useLocale();

  return (
    <article className="page">
      <h1 lang={uiLocale}>
        {text('பக்கம் காணப்படவில்லை', 'Page not found', {
          te: 'పేజీ కనబడలేదు',
          ml: 'പേജ് കണ്ടെത്തിയില്ല',
          kn: 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ',
          hi: 'पृष्ठ नहीं मिला',
        })}
      </h1>
      <p lang={uiLocale}>
        {text(
          'இந்த முகவரிக்குப் பக்கம் இல்லை. கீழ்க்கண்ட வழிகளில் தொடரலாம்.',
          'There is no page at this address. You can continue from the links below.',
          {
            te: 'ఈ చిరునామాలో పేజీ లేదు. దిగువ లింకుల ద్వారా కొనసాగవచ్చు.',
            ml: 'ഈ വിലാസത്തിൽ ഒരു പേജില്ല. താഴെയുള്ള ലിങ്കുകളിൽ നിന്ന് തുടരാം.',
            kn: 'ಈ ವಿಳಾಸದಲ್ಲಿ ಯಾವುದೇ ಪುಟ ಇಲ್ಲ. ಕೆಳಗಿನ ಲಿಂಕ್‌ಗಳಿಂದ ಮುಂದುವರಿಯಬಹುದು.',
            hi: 'इस पते पर कोई पृष्ठ नहीं है। आप नीचे दिए गए लिंक से आगे बढ़ सकते हैं।',
          },
        )}
      </p>
      <p className="band-links">
        <Link href="/" lang={uiLocale}>
          {text('முகப்பு', 'Home', {
            te: 'హోమ్',
            ml: 'ഹോം',
            kn: 'ಮುಖಪುಟ',
            hi: 'मुखपृष्ठ',
          })}
        </Link>
        <Link href="/arupadai-veedu" lang={uiLocale}>
          {text('அறுபடை வீடு', 'Six Abodes', {
            te: 'ఆరు పవిత్ర క్షేత్రాలు',
            ml: 'ആറ് പുണ്യസ്ഥാനങ്ങൾ',
            kn: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು',
            hi: 'छह पवित्र धाम',
          })}
        </Link>
        <Link href="/search" lang={uiLocale}>
          {text('தேடல்', 'Search', {
            te: 'శోధన',
            ml: 'തിരയുക',
            kn: 'ಹುಡುಕು',
            hi: 'खोज',
          })}
        </Link>
      </p>
    </article>
  );
}
