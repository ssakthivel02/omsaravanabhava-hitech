import { Link } from 'wouter';
import { arupadaiVeedu } from '@/content';
import StateBadge from '@/components/StateBadge';

export default function ArupadaiVeedu() {
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">அறுபடை வீடு</h1>
        <p lang="ta">
          முருகனின் ஆறு படைவீடுகள். வரிசை பாரம்பரிய யாத்திரை முறையைப்
          பின்பற்றுகிறது. ஒவ்வொரு பதிவும் அதன் ஆயத்தொலைவு நிலையையும் மூல
          அடையாள நிலையையும் தனித்தனியாகக் காட்டுகிறது — ஒன்று மற்றொன்றைக்
          குறிக்காது.
        </p>
      </header>
      <ol className="abode-list abode-list-full">
        {arupadaiVeedu.map((t) => (
          <li key={t.id}>
            <Link href={`/temples/${t.id}`} className="abode">
              <span className="abode-num">
                {String(t.pilgrimageOrder).padStart(2, '0')}
              </span>
              <span className="abode-body">
                <b lang="ta">{t.nameTa}</b>
                <small>{t.nameEn}</small>
                <span className="state-row">
                  <StateBadge state={t.coordinateConfidence} dimension="ஆயத்தொலைவு" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}
