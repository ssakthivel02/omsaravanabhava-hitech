import { Link } from 'wouter';
import { devotionalWorks, kumarastavam } from '@/content';
import vinayakaShodashaRaw from '@/content/vinayaka-shodasha-nama.json';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import { useLocale } from '@/lib/locale';

interface VinayakaInvocation {
  order: number;
  name: string;
  tamil: string;
  transliteration: string;
}

interface VinayakaShodashaNama {
  id: string;
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  invocationCount: number;
  publicationState: string;
  verificationState: string;
  source: {
    title: string;
    publisher: string;
    url: string;
    retrievedAt: string;
    note: string;
  };
  invocations: VinayakaInvocation[];
}

const vinayakaShodasha = vinayakaShodashaRaw as VinayakaShodashaNama;

/**
 * Mantras, prayers and Namavali.
 *
 * Every work remains governed by its own source and publication state. Legacy
 * devotional-work records stay metadata-only while rights are unresolved; a
 * text is rendered only when an identified source has passed the publication
 * gate for that specific record.
 */
export default function Prayers() {
  const { locale, text } = useLocale();
  return (
    <article className="page">
      <header className="page-head">
        <h1 lang={locale}>{text('மந்திரம், துதி, நாமாவளி', 'Mantras, Prayers, Namavali')}</h1>
        <p lang={locale}>
          {text(
            'ஒவ்வொரு உரையும் தனித்தனி மூலச் சரிபார்ப்பு மற்றும் வெளியீட்டு நிலையின் அடிப்படையில் மட்டுமே வெளியிடப்படுகிறது. உரிமை அல்லது மூலம் உறுதிசெய்யப்படாத உரைகளை இத்தளம் மறுவெளியிடாது.',
            'Each text is published only according to its own source-verification and publication state. This site does not republish texts whose source or reuse status has not been cleared.',
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

        <div className="kumarastavam" aria-labelledby="vinayaka-shodasha-h">
          <header className="kumarastavam-head">
            <div>
              <h3 id="vinayaka-shodasha-h" lang={locale}>
                {text(vinayakaShodasha.titleTa, vinayakaShodasha.titleEn)}
              </h3>
              <p lang={locale}>
                {text(vinayakaShodasha.descriptionTa, vinayakaShodasha.descriptionEn)}
              </p>
            </div>
            <SaveControl
              item={{
                type: 'prayer',
                id: vinayakaShodasha.id,
                titleTa: vinayakaShodasha.titleTa,
                titleEn: vinayakaShodasha.titleEn,
              }}
            />
          </header>

          <p className="state-row">
            <StateBadge
              state={vinayakaShodasha.verificationState}
              dimension={text('மூலச் சரிபார்ப்பு', 'Source verification')}
            />
          </p>

          <ol className="temple-list">
            {vinayakaShodasha.invocations.map((invocation) => (
              <li key={invocation.order}>
                <div className="temple-row">
                  <div>
                    <b lang="ta">{invocation.tamil}</b>
                    {locale === 'en' && (
                      <small className="latin-name" lang="sa-Latn">{invocation.transliteration}</small>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="note" lang={locale}>
            {text('சரிபார்க்கப்பட்ட மூலம்:', 'Verified source:')}{' '}
            <a href={vinayakaShodasha.source.url} target="_blank" rel="noreferrer">
              {vinayakaShodasha.source.publisher}
            </a>{' '}
            · {vinayakaShodasha.source.retrievedAt}
          </p>
        </div>

        <p className="note" lang={locale}>
          {text(
            'மற்ற நாமாவளித் தொகுப்புகள் தனித்தனி மூலச் சரிபார்ப்பு முடியும் வரை ஆய்வு நிலையில் தொடர்கின்றன. விரிவான குறிப்புகள்',
            'Other Namavali collections remain in research state until their own source verification is complete. Detailed notes are on the',
          )}{' '}
          <Link href="/content-completeness" lang={locale}>{text('உள்ளடக்க நிலை', 'Content status')}</Link>{' '}
          {text('பக்கத்தில் உள்ளன.', 'page.')}
        </p>
      </section>
    </article>
  );
}
