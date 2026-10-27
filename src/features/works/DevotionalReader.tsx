import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { devotionalWorks } from '@/content';
import { approvedDevotionalTexts, canRenderDevotionalText } from '@/content/approved-devotional-texts';
import { useLocale } from '@/lib/locale';

/** First-party Tamil reader. No outbound reading links or third-party embeds. */
export default function DevotionalReader() {
  const { id } = useParams<{ id: string }>();
  const [fontSize, setFontSize] = useState(22);
  const { uiLocale, text } = useLocale();
  const work = devotionalWorks.find((item) => item.id === id);
  const record = approvedDevotionalTexts.find((item) => item.workId === id);
  const approved = work && canRenderDevotionalText(work, record) ? record : null;

  return (
    <article className="page devotional-reader-page">
      <header className="page-head">
        <Link href="/works">{text('நூல் பட்டியலுக்குத் திரும்பு', 'Back to devotional works')}</Link>
        <h1 lang="ta">{work?.titleTa ?? text('நூல் காணப்படவில்லை', 'Work not found')}</h1>
        {work?.titleEn && <p lang="en">{work.titleEn}</p>}
      </header>
      {!work ? (
        <p role="status">{text('இந்த நூல் எங்கள் பட்டியலில் இல்லை.', 'This work is not in the catalogue.')}</p>
      ) : approved ? (
        <section aria-label={text('தமிழ் மூல உரை', 'Original Tamil text')}>
          <div className="reader-controls" role="group" aria-label={text('எழுத்தின் அளவு', 'Reading text size')}>
            <button type="button" onClick={() => setFontSize((size) => Math.max(18, size - 2))} disabled={fontSize <= 18} aria-label={text('எழுத்தைக் குறைக்க', 'Decrease text size')}>A−</button>
            <output aria-live="polite">{fontSize}px</output>
            <button type="button" onClick={() => setFontSize((size) => Math.min(34, size + 2))} disabled={fontSize >= 34} aria-label={text('எழுத்தைப் பெருக்க', 'Increase text size')}>A+</button>
          </div>
          <div className="canonical" lang="ta" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.9, fontSize: `${fontSize}px`, maxWidth: '72ch', marginInline: 'auto' }}>
            {approved.canonicalTamil}
          </div>
          <footer className="provenance">
            <h2>{text('உரை ஆதாரங்கள்', 'Text provenance')}</h2>
            <p>{approved.attribution}</p>
            <p>{approved.editionId} · {approved.sourceId}</p>
          </footer>
        </section>
      ) : (
        <section aria-label={text('வெளியீட்டு நிலை', 'Publication status')}>
          <p role="status" lang={uiLocale}>
            {text(
              'இந்த நூலின் முழு தமிழ் உரை இன்னும் உரைச் சரிபார்ப்பு மற்றும் பதிப்பு உரிமை அனுமதியைப் பெறவில்லை. சரிபார்க்கப்படாத பாடல்கள் இங்கு வெளியிடப்படமாட்டாது.',
              'This edition is not yet cleared for complete on-site Tamil publication. Only text verified for accuracy and reproduction rights will appear here.',
            )}
          </p>
          <p lang={uiLocale}>{text('தற்போதைய நிலை: மூல உரை வெளியிடப்படவில்லை.', 'Current status: canonical text withheld.')}</p>
        </section>
      )}
    </article>
  );
}
