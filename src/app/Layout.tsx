import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import VelMark from '@/components/VelMark';
import ConnectionStatus from '@/components/ConnectionStatus';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLocale } from '@/lib/locale';
import { useRouteMetadata } from '@/lib/routeMeta';

const NAV = [
  { href: '/arupadai-veedu', ta: 'அறுபடை வீடு', en: 'Six Abodes' },
  { href: '/temples', ta: 'கோயில்கள்', en: 'Temples' },
  { href: '/knowledge', ta: 'அறிவுக் களம்', en: 'Knowledge' },
  { href: '/thiruppugazh', ta: 'திருப்புகழ்', en: 'Thiruppugazh' },
  { href: '/practice', ta: 'வழிபாடு', en: 'Practice' },
  { href: '/search', ta: 'தேடல்', en: 'Search' },
];

function isNavActive(location: string, href: string) {
  return location === href || location.startsWith(`${href}/`);
}

const MORE = [
  { href: '/works', ta: 'நூல்கள்', en: 'Sacred works' },
  { href: '/prayers', ta: 'மந்திரம்', en: 'Prayers' },
];

const TRUST = [
  { href: '/library', ta: 'என் சேமிப்புகள்', en: 'My Library' },
  { href: '/sources', ta: 'மூலங்கள்', en: 'Sources' },
  { href: '/content-completeness', ta: 'உள்ளடக்க நிலை', en: 'Content status' },
  { href: '/works', ta: 'நூல்கள்', en: 'Sacred works' },
  { href: '/about', ta: 'இத்தளம் பற்றி', en: 'About' },
  { href: '/privacy', ta: 'தனியுரிமை', en: 'Privacy' },
  { href: '/terms', ta: 'விதிகள்', en: 'Terms' },
  { href: '/disclaimer', ta: 'பொறுப்புத் துறப்பு', en: 'Disclaimer' },
  { href: '/accessibility', ta: 'அணுகல் தன்மை', en: 'Accessibility' },
  { href: '/contact', ta: 'தொடர்பு', en: 'Contact' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { locale, text } = useLocale();
  useRouteMetadata(location);

  // Client-side navigation must feel like a real page transition. Without
  // this reset, the browser can preserve the previous route's scroll offset,
  // leaving the next page's title hidden beneath the sticky header.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  const itemText = (item: { ta: string; en: string }) => (locale === 'ta' ? item.ta : item.en);

  return (
    <>
      <a className="skip-link" href="#main">
        {text('முதன்மை உள்ளடக்கத்திற்குச் செல்', 'Skip to main content')}
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <Link
            href="/"
            className="brand"
            aria-label={text('ஓம் சரவணபவ — முகப்பு', 'Om Saravana Bhava — Home')}
          >
            <VelMark size={30} />
            <span className="brand-text">
              <b lang="ta">ஓம் சரவணபவ</b>
              <small>{text('முருகன் பக்தி அறிவுக் களம்', 'Murugan devotional knowledge')}</small>
            </span>
          </Link>

          <nav
            className="desktop-nav"
            aria-label={text('முதன்மை வழிசெலுத்தல்', 'Primary navigation')}
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                aria-current={isNavActive(location, n.href) ? 'page' : undefined}
              >
                <span lang={locale}>{itemText(n)}</span>
              </Link>
            ))}
            <Link
              href="/library"
              className="nav-link nav-link-library"
              aria-current={isNavActive(location, '/library') ? 'page' : undefined}
            >
              <span lang={locale}>{text('சேமிப்பு', 'Saved')}</span>
            </Link>
            <Link
              href="/sources"
              className="nav-link nav-link-trust"
              aria-current={isNavActive(location, '/sources') ? 'page' : undefined}
            >
              <span lang={locale}>{text('மூலங்கள்', 'Sources')}</span>
            </Link>
          </nav>

          <LanguageSwitch />

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
            <span lang={locale}>{open ? text('மூடு', 'Close') : text('பட்டி', 'Menu')}</span>
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label={text('முதன்மை வழிசெலுத்தல்', 'Primary navigation')}
          >
            {[
              ...NAV,
              ...MORE,
              { href: '/library', ta: 'என் சேமிப்புகள்', en: 'My Library' },
              { href: '/sources', ta: 'மூலங்கள்', en: 'Sources' },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="nav-link"
                aria-current={isNavActive(location, n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <span lang={locale}>{itemText(n)}</span>
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
                  <span lang={locale}>{itemText(t)}</span>
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
            <p className="footer-note" lang={locale}>
              {text(
                'ஆளுகை/மூலம்-குறிக்கப்பட்ட உள்ளடக்கம். பொருந்துமிடத்து சரிபார்ப்பு மற்றும் முழுமை நிலை ஒவ்வொரு பதிவிலும் காட்டப்படுகிறது.',
                'Governed, source-linked content. Verification and completeness states are shown wherever they apply.',
              )}
            </p>
          </div>
          <nav aria-label={text('நம்பகத்தன்மை', 'Trust and information')}>
            {TRUST.map((t) => (
              <Link key={t.href} href={t.href} className="footer-link">
                <span lang={locale}>{itemText(t)}</span>
              </Link>
            ))}
          </nav>
        </div>
        <p className="footer-legal" lang={locale}>
          {text(
            '© Om Saravana Bhava · இத்தளம் கோயில் நன்கொடைகளைப் பெறுவதில்லை',
            '© Om Saravana Bhava · This site does not receive temple donations',
          )}
        </p>
      </footer>
    </>
  );
}
