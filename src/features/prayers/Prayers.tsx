import { Link } from 'wouter';
import { devotionalWorks, kumarastavam } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import { useLocale } from '@/lib/locale';

/**
 * Mantras, prayers and Namavali.
 *
 * Every record in the governed registry is PUBLIC_METADATA_ONLY with an
 * unresolved rights state. This page therefore publishes the work, its author,
 * its source edition and its real rights state — and no verse text at all.
 * That is a deliberate rights decision, not an unfinished page.
 */
export default function Prayers() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('மந்திரம், துதி, நாமாவளி', 'Mantras, Prayers, Namavali')}</h1>
        <p lang={locale}>
          {text(
            'இப்பகுதியில் உள்ள நூல்களின் விவரங்களும் மூலங்களும் மட்டுமே வெளியிடப்படுகின்றன. உரிமை உறுதிசெய்யப்படாத உரைகளை இத்தளம் மறுவெளியிடாது.',
            'Only the details and sources of the works in this section are published. This site does not republish texts whose rights have not been confirmed.',
          )}
        </p>
      </header>

      <section aria-labelledby="works-h">
        <h2 id="works-h" lang={locale}>{text('பக்தி நூல்கள்', 'Devotional Works')}</h2>
        <ul className="temple-list">
          {devotionalWorks.map((w) => {
            const showEnglishFirst = locale === 'en' && Boolean(w.titleEn);
            return (
              <li key={w.id}>
                <div className="temple-row">
                  {showEnglishFirst ? (
                    <>
                      <b lang="en">{w.titleEn}</b>
                      {w.titleTa && <small lang="ta">{w.titleTa}</small>}
                    </>
                  ) : (
                    <>
                      <b lang={w.titleTa ? 'ta' : 'en'}>{w.titleTa ?? w.titleEn}</b>
                      <small>{w.titleEn}</small>
                    </>
                  )}
                  <StateBadge state={w.rightsState} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {kumarastavam.map((k) => (
        <section key={k.id} className="kumarastavam" aria-labelledby={`k-${k.id}`}>
          <header className="kumarastavam-head">
            <div>
              {/* Canonical title: always Tamil. */}
              <h2 id={`k-${k.id}`} lang="ta">{k.titleTa}</h2>
              <p className="latin-name" lang="ta-Latn">{k.transliteration}</p>
            </div>
            <SaveControl item={{ type: 'prayer', id: k.id, titleTa: k.titleTa, titleEn: k.transliteration }} />
          </header>

          <p className="note" lang={locale}>
            {text('மூல உரை, பொருள், ஒலி — ஒவ்வொன்றும் தனித்தனி வெளியீட்டு நிலை.', 'Source text, meaning, audio — each has its own separate publication state.')}{' '}
            {text(
              `${k.invocationsInSource ?? 0} துதிகளில் ${k.invocationsPublished} மட்டுமே இங்கு வெளியிடப்பட்டுள்ளன.`,
              `Only ${k.invocationsPublished} of ${k.invocationsInSource ?? 0} invocations are published here.`,
            )}
          </p>
          <p className="state-row">
            <StateBadge state={k.canonicalTextStatus} dimension={text('மூல உரை', 'Source text')} />
            {k.meaningStatus && <StateBadge state={k.meaningStatus} dimension={text('பொருள்', 'Meaning')} />}
            {k.audioStatus && <StateBadge state={k.audioStatus} dimension={text('ஒலி', 'Audio')} />}
          </p>

          <dl className="fields">
            <div className="field">
              <dt lang={locale}>{text('ஆசிரியர்', 'Author')}</dt>
              {/* Author is a canonical/source fact: always Tamil. */}
              <dd lang="ta">{k.author ?? '—'}</dd>
            </div>
            <div className="field">
              <dt lang={locale}>{text('பதிப்பு', 'Edition')}</dt>
              <dd>{k.edition ?? '—'}</dd>
            </div>
          </dl>

          <p className="empty" lang={locale}>
            {text(
              'இந்த நூலின் மூல தமிழ் உரை உரிமை நிலை உறுதிசெய்யப்படாததால் மறுவெளியிடப்படவில்லை. விவரமும் மூலமும் மட்டுமே இங்கு வெளியிடப்படுகின்றன — உரிமை உறுதி செய்யப்பட்டதும் இந்தப் பதிவு புதுப்பிக்கப்படும்.',
              "This work's canonical Tamil text is not republished because its rights have not been confirmed. Only its details and source are published here — this record will be updated once rights are confirmed.",
            )}
          </p>
        </section>
      ))}

      <section aria-labelledby="nam-h">
        <h2 id="nam-h" lang={locale}>{text('நாமாவளி', 'Namavali')}</h2>
        <p className="empty" lang={locale}>
          {text(
            'தற்போது வெளியிடத்தக்க நாமாவளித் தொகுப்பு எதுவும் இல்லை. படங்கள், சுவரொட்டிகள் அல்லது சரிபார்க்கப்படாத இணையப் பட்டியல்களிலிருந்து திருநாமங்களை இத்தளம் வெளியிடாது. ஆய்வு நிலையின் விரிவான குறிப்புகள்',
            'There is currently no publishable Namavali set. This site does not publish holy names taken from images, posters, or unverified web lists. Detailed research-state notes are on the',
          )}{' '}
          <Link href="/content-completeness" lang={locale}>{text('உள்ளடக்க நிலை', 'Content status')}</Link>{' '}
          {text('பக்கத்தில் உள்ளன.', 'page.')}
        </p>
      </section>
    </article>
  );
}
