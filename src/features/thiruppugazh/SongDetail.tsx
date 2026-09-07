import { useParams, Link } from 'wouter';
import { songById } from '@/content';
import StateBadge from '@/components/StateBadge';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { useEntityMeta } from '@/lib/routeMeta';
import { useRecentItem } from '@/lib/useRecent';
import { useLocale } from '@/lib/locale';

export default function SongDetail() {
  const params = useParams<{ id: string }>();
  const song = params.id ? songById(params.id) : undefined;
  const title = song ? (song.titleTa ?? song.openingWords) : null;
  const { locale, text } = useLocale();
  useEntityMeta(`/thiruppugazh/${params.id ?? ''}`, {
    titleTa: title,
    titleEn: title,
    descriptionTa: title
      ? `${title} — திருப்புகழ் பதிவு, மூல பதிப்பு மற்றும் நிலையுடன்.`
      : null,
    descriptionEn: title
      ? `${title} — a Thiruppugazh record, with source edition and state.`
      : null,
  });
  useRecentItem(
    song
      ? { type: 'thiruppugazh', id: song.id, titleTa: song.titleTa ?? song.openingWords }
      : null,
  );

  if (!song) {
    return (
      <article className="page">
        <h1 lang={locale}>{text('பாடல் காணப்படவில்லை', 'Song not found')}</h1>
        <Link href="/thiruppugazh" lang={locale}>
          {text('திருப்புகழ் பட்டியல்', 'Thiruppugazh list')}
        </Link>
      </article>
    );
  }

  return (
    <article className="page">
      <header className="page-head">
        {/* Canonical song title: always Tamil, regardless of UI language. */}
        <h1 lang="ta">{song.titleTa ?? song.openingWords}</h1>
        <p className="latin-name" lang="en">{song.edition}</p>
        <SaveControl
          item={{ type: 'thiruppugazh', id: song.id, titleTa: song.titleTa ?? song.openingWords }}
        />
      </header>

      {/* Canonical layer. Rendered only when the registry actually holds the
          verse body — never reconstructed, never paraphrased. Browser TTS is
          only offered for that governed canonical body, never for a guessed
          reconstruction or for the placeholder message. */}
      {song.canonicalText ? (
        <>
          <div className="canonical" lang="ta">{song.canonicalText}</div>
          <ReadAloud text={song.canonicalText} labelTa="மூல உரையை வாசிக்க" labelEn="Read source text aloud" />
        </>
      ) : (
        <p className="empty" lang={locale}>
          {text(
            'இப்பதிவின் மூலப் பதிப்பு அடையாளம் காணப்பட்டுள்ளது; ஆனால் மூலத் தமிழ் உரை இன்னும் ஏற்றப்படவில்லை. சரிபார்க்கப்படாத உரையை இத்தளம் நிரப்பாது.',
            "This record's source edition has been identified, but the canonical Tamil text has not yet been imported. This site will not fill the gap with unverified text.",
          )}
        </p>
      )}

      <section className="layers" aria-labelledby="layers-h">
        <h2 id="layers-h" lang={locale}>{text('அடுக்குகள்', 'Layers')}</h2>
        <p className="note" lang={locale}>
          {text(
            'மூல உரை, பொருள், ஒலிபெயர்ப்பு, ஒலி — ஒவ்வொன்றும் தனித்தனி வெளியீட்டு நிலை; ஒன்று கிடைத்துவிட்டால் மற்றொன்றும் கிடைத்துவிட்டதாகக் கருதப்படாது.',
            'Source text, meaning, transliteration, audio — each has its own separate publication state; one being available never means another is too.',
          )}
        </p>
        <p className="state-row">
          <StateBadge state={song.canonicalTextStatus} dimension={text('மூல உரை', 'Source text')} />
          <StateBadge state={song.meaningState} dimension={text('பொருள்', 'Meaning')} />
          <StateBadge state={song.transliterationState} dimension={text('ஒலிபெயர்ப்பு', 'Transliteration')} />
          <StateBadge state={song.audioState} dimension={text('ஒலி', 'Audio')} />
        </p>
      </section>

      <section className="provenance">
        <h2 lang={locale}>{text('மூலம்', 'Source')}</h2>
        <dl className="fields">
          <div className="field">
            <dt lang={locale}>{text('பதிப்பு', 'Edition')}</dt>
            <dd lang={song.edition ? 'en' : undefined}>{song.edition ?? '—'}</dd>
          </div>
          <div className="field">
            <dt lang={locale}>{text('ஆசிரியர்', 'Author')}</dt>
            {/* Author's name is canonical/source content: always Tamil. */}
            <dd lang="ta">அருணகிரிநாதர்</dd>
          </div>
          <div className="field">
            <dt lang={locale}>{text('உரிமை நிலை', 'Rights status')}</dt>
            <dd>{song.rightsStatus ? <StateBadge state={song.rightsStatus} /> : '—'}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
