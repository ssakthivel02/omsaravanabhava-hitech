import { Link } from 'wouter';
import { useLocale } from '@/lib/locale';

export default function NotFound() {
  const { locale, text } = useLocale();

  return (
    <article className="page">
      <h1 lang={locale}>{text('பக்கம் காணப்படவில்லை', 'Page not found')}</h1>
      <p lang={locale}>
        {text(
          'இந்த முகவரிக்குப் பக்கம் இல்லை. கீழ்க்கண்ட வழிகளில் தொடரலாம்.',
          'There is no page at this address. You can continue from the links below.',
        )}
      </p>
      <p className="band-links">
        <Link href="/" lang={locale}>
          {text('முகப்பு', 'Home')}
        </Link>
        <Link href="/arupadai-veedu" lang={locale}>
          {text('அறுபடை வீடு', 'Six Abodes')}
        </Link>
        <Link href="/search" lang={locale}>
          {text('தேடல்', 'Search')}
        </Link>
      </p>
    </article>
  );
}
