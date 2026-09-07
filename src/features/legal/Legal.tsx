import { completeness } from '@/content';
import { useLocale } from '@/lib/locale';

interface Bilingual {
  ta: string;
  en: string;
}

interface Section {
  h: Bilingual;
  body: Bilingual[];
}

function Doc({ title, intro, sections }: { title: Bilingual; intro: Bilingual; sections: Section[] }) {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text(title.ta, title.en)}</h1>
        <p lang={locale}>{text(intro.ta, intro.en)}</p>
      </header>
      {sections.map((s) => (
        <section key={s.h.ta}>
          <h2 lang={locale}>{text(s.h.ta, s.h.en)}</h2>
          <ul className="prose-list" lang={locale}>
            {s.body.map((b) => (
              <li key={b.ta}>{text(b.ta, b.en)}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}

export function About() {
  return (
    <Doc
      title={{ ta: 'இத்தளம் பற்றி', en: 'About This Site' }}
      intro={{
        ta: 'ஓம் சரவணபவ — முருகன் தொடர்பான பக்தி அறிவை மூல ஆதாரத்துடன் தொகுக்கும் தளம்.',
        en: 'Om Saravana Bhava — a site that compiles Murugan-related devotional knowledge together with its source evidence.',
      }}
      sections={[
        {
          h: { ta: 'நோக்கம்', en: 'Purpose' },
          body: [
            {
              ta: 'முருகன் தொடர்பான கோயில், நூல், திருப்புகழ் பதிவுகளை மூலத்துடன் சேர்த்து வழங்குதல்.',
              en: 'To present Murugan-related temple, work, and Thiruppugazh records together with their sources.',
            },
            {
              ta: 'தமிழ் முதன்மை மொழி; ஆங்கிலம் துணை மொழி.',
              en: 'Tamil is the primary language; English is a secondary UI language.',
            },
            {
              ta: 'சரிபார்க்கப்படாத தகவலை வெளியிடாமல் இருத்தல்.',
              en: 'To avoid publishing unverified information.',
            },
          ],
        },
        {
          h: { ta: 'இத்தளம் செய்யாதவை', en: 'What This Site Does Not Do' },
          body: [
            {
              ta: 'கோயில் நன்கொடைகளைப் பெறுவதில்லை, கையாள்வதில்லை.',
              en: 'It does not receive or handle temple donations.',
            },
            {
              ta: 'பலன் அல்லது தீர்வு குறித்த வாக்குறுதிகளை அளிப்பதில்லை.',
              en: 'It does not make promises about outcomes or results.',
            },
            {
              ta: 'மூலம் இல்லாத வரலாறு, கல்வெட்டு, திருவிழா நாள், நேரம் ஆகியவற்றை உருவாக்குவதில்லை.',
              en: 'It does not invent history, inscriptions, festival dates, or timings that have no source.',
            },
          ],
        },
      ]}
    />
  );
}

export function Privacy() {
  return (
    <Doc
      title={{ ta: 'தனியுரிமை', en: 'Privacy' }}
      intro={{
        ta: 'இத்தளம் கணக்கு உருவாக்கம் இல்லாமல் இயங்குகிறது.',
        en: 'This site operates without requiring account creation.',
      }}
      sections={[
        {
          h: { ta: 'சேகரிக்கப்படுவது', en: 'What Is Collected' },
          body: [
            {
              ta: 'இத்தளம் தனிப்பட்ட கணக்குகளை உருவாக்குவதில்லை.',
              en: 'This site does not create personal accounts.',
            },
            {
              ta: 'ஜப எண்ணிக்கை போன்ற தரவு உங்கள் உலாவியில் மட்டுமே சேமிக்கப்படுகிறது.',
              en: 'Data such as the japa count is stored only in your browser.',
            },
            {
              ta: 'இந்தத் தரவு சேவையகத்திற்கு அனுப்பப்படுவதில்லை.',
              en: 'This data is never sent to a server.',
            },
          ],
        },
        {
          h: { ta: 'நீக்குதல்', en: 'Deletion' },
          body: [
            {
              ta: 'உலாவித் தரவை அழிப்பதன் மூலம் உள்ளூர் தரவை முழுமையாக நீக்கலாம்.',
              en: 'You can fully remove local data by clearing your browser data.',
            },
          ],
        },
      ]}
    />
  );
}

export function Terms() {
  return (
    <Doc
      title={{ ta: 'பயன்பாட்டு விதிகள்', en: 'Terms of Use' }}
      intro={{
        ta: 'இத்தளத்தைப் பயன்படுத்துவதன் மூலம் கீழ்க்கண்டவற்றை ஏற்கிறீர்கள்.',
        en: 'By using this site, you agree to the following.',
      }}
      sections={[
        {
          h: { ta: 'உள்ளடக்கம்', en: 'Content' },
          body: [
            {
              ta: 'உள்ளடக்கம் தகவல் நோக்கத்திற்காக மட்டுமே.',
              en: 'Content is for informational purposes only.',
            },
            {
              ta: 'பொது வெளியீடு, பதிப்பாளர் மற்றும் உரிமையாளர்-வழங்கிய பொருள் உள்ளிட்ட வெவ்வேறு உரிமை நிலைகள் பதிவுகளில் உள்ளன; ஒவ்வொரு பதிவின் உண்மையான உரிமை/வெளியீட்டு நிலையும் அதனுள் காட்டப்படும் — விவரங்களுக்கு "மூலங்களும் முறையும்" பக்கத்தைப் பார்க்கவும்.',
              en: 'Records carry a range of rights states, including public-domain, publisher-provided, and rights-holder-provided material; each record\'s real rights/publication state is shown within it — see the "Sources and Method" page for details.',
            },
            {
              ta: 'பொது அடையாளம்/மூலம்-இணைப்பு நிலையும், முழுமையான சரிபார்ப்பு நிலையும், வெளியீட்டு உரிமை நிலையும் — இவை மூன்றும் தனித்தனி நிலைகள்; ஒன்று மற்றொன்றைக் குறிக்காது.',
              en: 'General identity/source-linkage state, full verification state, and publication rights state are three separate states; one is never taken to imply another.',
            },
            {
              ta: 'உரிமை உறுதிசெய்யப்படாத உரைகள் மறுவெளியிடப்படுவதில்லை.',
              en: 'Texts whose rights have not been confirmed are not republished.',
            },
          ],
        },
      ]}
    />
  );
}

export function Disclaimer() {
  return (
    <Doc
      title={{ ta: 'பொறுப்புத் துறப்பு', en: 'Disclaimer' }}
      intro={{
        ta: 'இத்தளத்தின் எல்லைகளைத் தெளிவாக அறிந்து கொள்ளவும்.',
        en: "Please be clearly aware of this site's limits.",
      }}
      sections={[
        {
          h: { ta: 'எல்லைகள்', en: 'Limits' },
          body: [
            { ta: 'இத்தளம் மத அதிகாரம் அல்ல.', en: 'This site is not a religious authority.' },
            {
              ta: 'கோயில் நேரம், திருவிழா நாள் ஆகியவற்றை உத்தியோகபூர்வ மூலத்திடம் உறுதிசெய்யவும்.',
              en: 'Please confirm temple timings and festival dates with the official source.',
            },
            {
              ta: 'மருத்துவ, சட்ட அல்லது நிதி ஆலோசனை இங்கு வழங்கப்படவில்லை.',
              en: 'Medical, legal, or financial advice is not provided here.',
            },
            {
              ta: 'பலன் குறித்த எந்த உத்தரவாதமும் அளிக்கப்படவில்லை.',
              en: 'No guarantee is made about outcomes.',
            },
          ],
        },
      ]}
    />
  );
}

export function Accessibility() {
  return (
    <Doc
      title={{ ta: 'அணுகல் தன்மை', en: 'Accessibility' }}
      intro={{
        ta: 'அனைவரும் பயன்படுத்தும் வகையில் இத்தளம் வடிவமைக்கப்பட்டுள்ளது. கீழேயுள்ள வாக்கியங்கள் வடிவமைப்பு நோக்கத்தையும் நடப்பு சான்றையும் காட்டுகின்றன — முழுமையான இணக்கக் கூற்றல்ல.',
        en: "This site is designed for everyone to use. The statements below describe the design intent and current evidence — they are not a claim of full compliance.",
      }}
      sections={[
        {
          h: { ta: 'வடிவமைப்பு நோக்கம்', en: 'Design Intent' },
          body: [
            {
              ta: 'விசைப்பலகை மட்டும் கொண்டு முழுமையாக இயக்கும் வகையில் வடிவமைக்கப்பட்டுள்ளது.',
              en: 'Designed to be fully operable using the keyboard alone.',
            },
            {
              ta: 'கவனக் குறியீடு (focus) தெளிவாகக் காட்டப்படும் வகையில் வடிவமைக்கப்பட்டுள்ளது.',
              en: 'Designed so that keyboard focus is always clearly visible.',
            },
            {
              ta: 'இயக்கம் குறைப்பு (prefers-reduced-motion) அமைப்பை மதிக்கும் வகையில் உருவாக்கப்பட்டுள்ளது.',
              en: 'Built to respect the prefers-reduced-motion setting.',
            },
            {
              ta: 'முதன்மைத் தொடு இலக்குகள் சுமார் 44×44 CSS px அளவை இலக்காகக் கொண்டுள்ளன (WCAG 2.2 AA-இன் குறைந்தபட்ச இலக்கு அளவு 24×24 px; 44×44 இது தளத்தின் கூடுதல் விருப்பத் தரம்).',
              en: "Primary touch targets aim for roughly 44×44 CSS px (WCAG 2.2 AA's minimum target size is 24×24 px; 44×44 is this site's additional, stricter standard).",
            },
          ],
        },
        {
          h: { ta: 'நடப்பு சான்று நிலை', en: 'Current Evidence State' },
          body: [
            {
              ta: 'இந்த வடிவமைப்பு நோக்கங்கள் தானியங்கு (axe) மற்றும் கைமுறை உலாவி/விசைப்பலகைச் சோதனை மூலம் சரிபார்க்கப்படுகின்றன.',
              en: 'These design goals are verified through automated (axe) and manual browser/keyboard testing.',
            },
            {
              ta: 'இங்கு கூறப்படும் நிலை, சான்று கிடைத்த சரியான கட்டமைப்புக்கு (build) மட்டுமே பொருந்தும்; முழுமையான WCAG இணக்கக் கூற்றாகக் கருதப்படக்கூடாது.',
              en: 'The state stated here applies only to the exact build for which evidence exists; it should not be taken as a full WCAG compliance claim.',
            },
            {
              ta: 'சிக்கல் இருந்தால் தொடர்பு/திருத்தப் பக்கம் வழியாகத் தெரிவிக்கவும்.',
              en: 'If you encounter an issue, please report it via the Contact/Corrections page.',
            },
          ],
        },
      ]}
    />
  );
}

const CORRECTIONS_URL =
  'https://github.com/ssakthivel02/omsaravanabhava-hitech/issues/new?labels=content-correction';

export function Contact() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('தொடர்பு மற்றும் திருத்தங்கள்', 'Contact and Corrections')}</h1>
        <p lang={locale}>
          {text(
            'பிழை, தவறான மூலம் அல்லது விடுபட்ட ஆதாரம் கண்டால் தெரிவிக்கவும்.',
            'If you find an error, an incorrect source, or a missing citation, please let us know.',
          )}
        </p>
      </header>
      <section>
        <h2 lang={locale}>{text('தற்போதைய திருத்த வழி', 'Current Correction Channel')}</h2>
        <p lang={locale}>
          {text(
            'தற்போது இத்தளத்திற்கு நேரடி மின்னஞ்சல்/படிவம் இல்லை. திருத்தங்களை திட்டத்தின் பொது GitHub பதிவேட்டில் (issue) தெரிவிக்கலாம் — இதுவே இப்போது கண்காணிக்கப்படும் ஒரே வழி.',
            "This site does not yet have a direct email address or form. Corrections can be reported on the project's public GitHub issue tracker — that is currently the only channel being monitored.",
          )}
        </p>
        <p>
          <a href={CORRECTIONS_URL} rel="noopener noreferrer" target="_blank">
            <span lang={locale}>{text('திருத்தத்திற்கான GitHub issue திற', 'Open a GitHub issue for a correction')}</span>
          </a>
        </p>
        <h2 lang={locale}>{text('தெரிவிக்கும் முறை', 'How to Report')}</h2>
        <ul className="prose-list" lang={locale}>
          <li>{text('எந்தப் பதிவு (URL அல்லது பெயர்) என்பதைக் குறிப்பிடவும்.', 'State which record (URL or name) it concerns.')}</li>
          <li>{text('சரியான தகவலை ஆதாரத்துடன் தரவும்.', 'Provide the correct information along with a source.')}</li>
          <li>{text('ஆதாரம் இல்லாத திருத்தங்கள் ஏற்கப்படுவதில்லை.', 'Corrections without a source are not accepted.')}</li>
        </ul>
        <p className="note" lang={locale}>
          {text(
            'அர்ப்பணிக்கப்பட்ட மின்னஞ்சல்/படிவ வழி இன்னும் அமைக்கப்படவில்லை; அமைந்தவுடன் இப்பக்கம் புதுப்பிக்கப்படும்.',
            'A dedicated email or form channel has not been set up yet; this page will be updated once it is.',
          )}
        </p>
        {/* Release/technical timestamp: shown as-is regardless of UI language. */}
        <p className="note">
          Content snapshot: {completeness.generatedAt}
        </p>
      </section>
    </article>
  );
}
