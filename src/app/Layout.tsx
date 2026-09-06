import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import VelMark from '@/components/VelMark';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useRouteMetadata } from '@/lib/routeMeta';

const NAV = [
  { href: '/arupadai-veedu', ta: 'அறுபடை வீடு', en: 'Six abodes' },
  { href: '/temples', ta: 'கோயில்கள்', en: 'Temples' },
  { href: '/knowledge', ta: 'அறிவுக் களம்', en: 'Knowledge' },
  { href: '/thiruppugazh', ta: 'திருப்புகழ்', en: 'Thiruppugazh' },
  { href: '/works', ta: 'நூல்கள்', en: 'Sacred works' },
  { href: '/prayers', ta: 'மந்திரம்', en: 'Prayers' },
  { href: '/practice', ta: 'வழிபாடு', en: 'Practice' },
  { href: '/search', ta: 'தேடல்', en: 'Search' },
];

function isNavActive(location: string, href: string) {
  return location === href || location.startsWith(`${href}/`);
}

const TRUST = [
  { href: '/library', ta: 'என் சேமிப்புகள்' },
  { href: '/sources', ta: 'மூலங்கள்' },
  { href: '/content-completeness', ta: 'உள்ளடக்க நிலை' },
  { href: '/works', ta: 'நூல்கள்' },
  { href: '/about', ta: 'இத்தளம் பற்றி' },
  { href: '/privacy', ta: 'தனியுரிமை' },
  { href: '/terms', ta: 'விதிகள்' },
  { href: '/disclaimer', ta: 'பொறுப்புத் துறப்பு' },
  { href: '/accessibility', ta: 'அணுகல் தன்மை' },
  { href: '/contact', ta: 'தொடர்பு' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useRouteMetadata(location);

  return (
    <>
      <a className="skip-link" href="#main">
        முதன்மை உள்ளடக்கத்திற்குச் செல்
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand" aria-label="ஓம் சரவணபவ — முகப்பு">
            <VelMark size={30} />
            <span className="brand-text">
              <b lang="ta">ஓம் சரவணபவ</b>
              <small>Murugan devotional knowledge</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="முதன்மை வழிசெலுத்தல்">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                aria-current={isNavActive(location, n.href) ? 'page' : undefined}
              >
                <span lang="ta">{n.ta}</span>
              </Link>
            ))}
            <Link
              href="/library"
              className="nav-link nav-link-library"
              aria-current={isNavActive(location, '/library') ? 'page' : undefined}
            >
              <span lang="ta">சேமிப்பு</span>
            </Link>
            <Link
              href="/sources"
              className="nav-link nav-link-trust"
              aria-current={isNavActive(location, '/sources') ? 'page' : undefined}
            >
              <span lang="ta">மூலங்கள்</span>
            </Link>
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="menu-toggle-icon"
              viewBox="0 0 20 20"
              width="18"
              height="18"
              aria-hidden="true"
            >
              {open ? (
                <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5.5 H17 M3 10 H17 M3 14.5 H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            <span lang="ta">{open ? 'மூடு' : 'பட்டி'}</span>
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="முதன்மை வழிசெலுத்தல்">
            {[...NAV, { href: '/library', ta: 'என் சேமிப்புகள்', en: 'My Library' }, { href: '/sources', ta: 'மூலங்கள்', en: '' }].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                aria-current={isNavActive(location, n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <span lang="ta">{n.ta}</span>
              </Link>
            ))}
            <div className="mobile-nav-trust">
              {TRUST.filter((t) => !['/sources', '/works', '/library'].includes(t.href)).map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="mobile-nav-trust-link"
                  onClick={() => setOpen(false)}
                >
                  <span lang="ta">{t.ta}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
        <ConnectionStatus />
      </header>

      <main id="main" tabIndex={-1}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <VelMark size={26} />
            <p className="footer-note" lang="ta">
              ஆளுகை/மூலம்-குறிக்கப்பட்ட உள்ளடக்கம். பொருந்துமிடத்து சரிபார்ப்பு
              மற்றும் முழுமை நிலை ஒவ்வொரு பதிவிலும் காட்டப்படுகிறது.
            </p>
          </div>
          <nav aria-label="நம்பகத்தன்மை">
            {TRUST.map((t) => (
              <Link key={t.href} href={t.href} className="footer-link">
                <span lang="ta">{t.ta}</span>
              </Link>
            ))}
          </nav>
        </div>
        <p className="footer-legal">
          © Om Saravana Bhava · இத்தளம் கோயில் நன்கொடைகளைப் பெறுவதில்லை
        </p>
      </footer>
    </>
  );
}
