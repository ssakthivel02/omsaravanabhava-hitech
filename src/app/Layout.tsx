import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import VelMark from '@/components/VelMark';
import ConnectionStatus from '@/components/ConnectionStatus';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLocale, type UiLocale } from '@/lib/locale';
import { useRouteMetadata } from '@/lib/routeMeta';

type ShellItem = { href: string } & Record<UiLocale, string>;

const NAV: ShellItem[] = [
  { href: '/arupadai-veedu', ta: 'அறுபடை வீடு', en: 'Six Abodes', te: 'ఆరు పవిత్ర క్షేత్రాలు', ml: 'ആറ് പുണ്യസ്ഥാനങ്ങൾ', kn: 'ಆರು ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು', hi: 'छह पवित्र धाम' },
  { href: '/temples', ta: 'கோயில்கள்', en: 'Temples', te: 'దేవాలయాలు', ml: 'ക്ഷേത്രങ്ങൾ', kn: 'ದೇವಾಲಯಗಳು', hi: 'मंदिर' },
  { href: '/knowledge', ta: 'அறிவுக் களம்', en: 'Knowledge', te: 'జ్ఞాన కేంద్రం', ml: 'ജ്ഞാനകേന്ദ്രം', kn: 'ಜ್ಞಾನ ಕೇಂದ್ರ', hi: 'ज्ञान' },
  { href: '/thiruppugazh', ta: 'திருப்புகழ்', en: 'Thiruppugazh', te: 'తిరుప్పుగళ్', ml: 'തിരുപ്പുകഴ്', kn: 'ತಿರುಪ್ಪುಗಳ್', hi: 'तिरुप्पुग़ल' },
  { href: '/practice', ta: 'வழிபாடு', en: 'Practice', te: 'ఆరాధన', ml: 'ആരാധന', kn: 'ಆರಾಧನೆ', hi: 'साधना' },
  { href: '/search', ta: 'தேடல்', en: 'Search', te: 'శోధన', ml: 'തിരയുക', kn: 'ಹುಡುಕು', hi: 'खोज' },
];

const MORE: [ShellItem, ShellItem] = [
  { href: '/works', ta: 'நூல்கள்', en: 'Sacred works', te: 'పవిత్ర గ్రంథాలు', ml: 'പവിത്ര ഗ്രന്ഥങ്ങൾ', kn: 'ಪವಿತ್ರ ಗ್ರಂಥಗಳು', hi: 'पवित्र ग्रंथ' },
  { href: '/prayers', ta: 'மந்திரம்', en: 'Prayers', te: 'ప్రార్థనలు', ml: 'പ്രാർത്ഥനകൾ', kn: 'ಪ್ರಾರ್ಥನೆಗಳು', hi: 'प्रार्थनाएँ' },
];

const LIBRARY: ShellItem = { href: '/library', ta: 'என் சேமிப்புகள்', en: 'My Library', te: 'నా గ్రంథాలయం', ml: 'എന്റെ ലൈബ്രറി', kn: 'ನನ್ನ ಗ್ರಂಥಾಲಯ', hi: 'मेरी लाइब्रेरी' };
const SOURCES: ShellItem = { href: '/sources', ta: 'மூலங்கள்', en: 'Sources', te: 'మూలాలు', ml: 'ഉറവിടങ്ങൾ', kn: 'ಮೂಲಗಳು', hi: 'स्रोत' };

const TRUST: ShellItem[] = [
  LIBRARY,
  SOURCES,
  { href: '/content-completeness', ta: 'உள்ளடக்க நிலை', en: 'Content status', te: 'కంటెంట్ స్థితి', ml: 'ഉള്ളടക്ക നില', kn: 'ವಿಷಯ ಸ್ಥಿತಿ', hi: 'सामग्री स्थिति' },
  MORE[0],
  { href: '/about', ta: 'இத்தளம் பற்றி', en: 'About', te: 'గురించి', ml: 'കുറിച്ച്', kn: 'ಬಗ್ಗೆ', hi: 'परिचय' },
  { href: '/privacy', ta: 'தனியுரிமை', en: 'Privacy', te: 'గోప్యత', ml: 'സ്വകാര്യത', kn: 'ಗೌಪ್ಯತೆ', hi: 'गोपनीयता' },
  { href: '/terms', ta: 'விதிகள்', en: 'Terms', te: 'నిబంధనలు', ml: 'നിബന്ധനകൾ', kn: 'ನಿಯಮಗಳು', hi: 'शर्तें' },
  { href: '/disclaimer', ta: 'பொறுப்புத் துறப்பு', en: 'Disclaimer', te: 'నిరాకరణ', ml: 'നിരാകരണം', kn: 'ಹಕ್ಕುತ್ಯಾಗ', hi: 'अस्वीकरण' },
  { href: '/accessibility', ta: 'அணுகல் தன்மை', en: 'Accessibility', te: 'ప్రాప్యత', ml: 'പ്രവേശന സൗകര്യം', kn: 'ಪ್ರವೇಶಸೌಲಭ್ಯ', hi: 'सुगम्यता' },
  { href: '/contact', ta: 'தொடர்பு', en: 'Contact', te: 'సంప్రదింపు', ml: 'ബന്ധപ്പെടുക', kn: 'ಸಂಪರ್ಕ', hi: 'संपर्क' },
];

function isNavActive(location: string, href: string) {
  return location === href || location.startsWith(`${href}/`);
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { uiLocale: locale, text } = useLocale();
  useRouteMetadata(location);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  const itemText = (item: ShellItem) => item[locale];
  const shellText = (ta: string, en: string, te: string, ml: string, kn: string, hi: string) =>
    text(ta, en, { te, ml, kn, hi });

  return (
    <>
      <a className="skip-link" href="#main">
        {shellText('முதன்மை உள்ளடக்கத்திற்குச் செல்', 'Skip to main content', 'ప్రధాన విషయానికి వెళ్లండి', 'പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക', 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ', 'मुख्य सामग्री पर जाएँ')}
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <Link
            href="/"
            className="brand"
            aria-label={shellText('ஓம் சரவணபவ — முகப்பு', 'Om Saravana Bhava — Home', 'ఓం శరవణభవ — హోమ్', 'ഓം ശരവണഭവ — ഹോം', 'ಓಂ ಶರವಣಭವ — ಮುಖಪುಟ', 'ॐ सरवणभव — मुखपृष्ठ')}
          >
            <VelMark size={30} />
            <span className="brand-text">
              <b lang="ta">ஓம் சரவணபவ</b>
              <small>{shellText('முருகன் பக்தி அறிவுக் களம்', 'Murugan devotional knowledge', 'మురుగన్ భక్తి జ్ఞాన వేదిక', 'മുരുകൻ ഭക്തി വിജ്ഞാന വേദി', 'ಮುರುಗನ್ ಭಕ್ತಿ ಜ್ಞಾನ ವೇದಿಕೆ', 'मुरुगन भक्ति ज्ञान मंच')}</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label={shellText('முதன்மை வழிசெலுத்தல்', 'Primary navigation', 'ప్రధాన నావిగేషన్', 'പ്രധാന നാവിഗേഷൻ', 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್', 'मुख्य नेविगेशन')}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link" aria-current={isNavActive(location, n.href) ? 'page' : undefined}>
                <span lang={locale}>{itemText(n)}</span>
              </Link>
            ))}
            <Link href="/library" className="nav-link nav-link-library" aria-current={isNavActive(location, '/library') ? 'page' : undefined}>
              <span lang={locale}>{itemText(LIBRARY)}</span>
            </Link>
            <Link href="/sources" className="nav-link nav-link-trust" aria-current={isNavActive(location, '/sources') ? 'page' : undefined}>
              <span lang={locale}>{itemText(SOURCES)}</span>
            </Link>
          </nav>

          <LanguageSwitch />

          <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
            <svg className="menu-toggle-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              {open ? (
                <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5.5 H17 M3 10 H17 M3 14.5 H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            <span className="menu-toggle-label" lang={locale}>
              {open
                ? shellText('மூடு', 'Close', 'మూసివేయి', 'അടയ്ക്കുക', 'ಮುಚ್ಚಿ', 'बंद करें')
                : shellText('பட்டி', 'Menu', 'మెను', 'മെനു', 'ಮೆನು', 'मेनू')}
            </span>
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="mobile-nav" aria-label={shellText('முதன்மை வழிசெலுத்தல்', 'Primary navigation', 'ప్రధాన నావిగేషన్', 'പ്രധാന നാവിഗേഷൻ', 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್', 'मुख्य नेविगेशन')}>
            {[...NAV, ...MORE, LIBRARY, SOURCES].map((n) => (
              <Link key={n.href} href={n.href} className="nav-link" aria-current={isNavActive(location, n.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                <span lang={locale}>{itemText(n)}</span>
              </Link>
            ))}
            <div className="mobile-nav-trust">
              {TRUST.filter((t) => !['/sources', '/works', '/library'].includes(t.href)).map((t) => (
                <Link key={t.href} href={t.href} className="mobile-nav-trust-link" onClick={() => setOpen(false)}>
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
              {shellText(
                'ஆளுகை/மூலம்-குறிக்கப்பட்ட உள்ளடக்கம். பொருந்துமிடத்து சரிபார்ப்பு மற்றும் முழுமை நிலை ஒவ்வொரு பதிவிலும் காட்டப்படுகிறது.',
                'Governed, source-linked content. Verification and completeness states are shown wherever they apply.',
                'మూలాధారాలతో నిర్వహించబడే కంటెంట్. అవసరమైన చోట ధృవీకరణ మరియు సంపూర్ణత స్థితి చూపబడుతుంది.',
                'ഉറവിടബന്ധിതവും നിയന്ത്രിതവുമായ ഉള്ളടക്കം. ആവശ്യമായിടത്ത് പരിശോധനയും പൂർണ്ണത നിലയും കാണിക്കുന്നു.',
                'ಮೂಲಾಧಾರಿತ ನಿಯಂತ್ರಿತ ವಿಷಯ. ಅನ್ವಯಿಸುವಲ್ಲಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಪೂರ್ಣತೆ ಸ್ಥಿತಿಯನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ.',
                'स्रोत-आधारित नियंत्रित सामग्री। जहाँ लागू हो, सत्यापन और पूर्णता की स्थिति दिखाई जाती है।',
              )}
            </p>
          </div>
          <nav aria-label={shellText('நம்பகத்தன்மை', 'Trust and information', 'నమ్మకం మరియు సమాచారం', 'വിശ്വാസവും വിവരവും', 'ನಂಬಿಕೆ ಮತ್ತು ಮಾಹಿತಿ', 'विश्वास और जानकारी')}>
            {TRUST.map((t) => (
              <Link key={t.href} href={t.href} className="footer-link"><span lang={locale}>{itemText(t)}</span></Link>
            ))}
          </nav>
        </div>
        <p className="footer-legal" lang={locale}>
          {shellText(
            '© Om Saravana Bhava · இத்தளம் கோயில் நன்கொடைகளைப் பெறுவதில்லை',
            '© Om Saravana Bhava · This site does not receive temple donations',
            '© Om Saravana Bhava · ఈ సైట్ దేవాలయ విరాళాలను స్వీకరించదు',
            '© Om Saravana Bhava · ഈ സൈറ്റ് ക്ഷേത്ര സംഭാവനകൾ സ്വീകരിക്കുന്നില്ല',
            '© Om Saravana Bhava · ಈ ತಾಣ ದೇವಾಲಯದ ದೇಣಿಗೆಗಳನ್ನು ಸ್ವೀಕರಿಸುವುದಿಲ್ಲ',
            '© Om Saravana Bhava · यह साइट मंदिर दान स्वीकार नहीं करती',
          )}
        </p>
      </footer>
    </>
  );
}
