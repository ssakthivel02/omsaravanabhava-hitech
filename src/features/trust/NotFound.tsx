import { Link } from 'wouter';

export default function NotFound() {
  return (
    <article className="page">
      <h1 lang="ta">பக்கம் காணப்படவில்லை</h1>
      <p lang="ta">
        இந்த முகவரிக்குப் பக்கம் இல்லை. கீழ்க்கண்ட வழிகளில் தொடரலாம்.
      </p>
      <p className="band-links">
        <Link href="/" lang="ta">
          முகப்பு
        </Link>
        <Link href="/arupadai-veedu" lang="ta">
          அறுபடை வீடு
        </Link>
        <Link href="/search" lang="ta">
          தேடல்
        </Link>
      </p>
    </article>
  );
}
