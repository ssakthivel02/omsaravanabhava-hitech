import { useParams, Link } from 'wouter';
import { songById } from '@/content';
import StateBadge from '@/components/StateBadge';
import { useEntityMeta } from '@/lib/routeMeta';

export default function SongDetail() {
  const params = useParams<{ id: string }>();
  const song = params.id ? songById(params.id) : undefined;
  const title = song ? (song.titleTa ?? song.openingWords) : null;
  useEntityMeta(
    `/thiruppugazh/${params.id ?? ''}`,
    title,
    title ? `${title} — திருப்புகழ் பதிவு, மூல பதிப்பு மற்றும் நிலையுடன்.` : null,
  );

  if (!song) {
    return (
      <article className="page">
        <h1 lang="ta">பாடல் காணப்படவில்லை</h1>
        <Link href="/thiruppugazh" lang="ta">
          திருப்புகழ் பட்டியல்
        </Link>
      </article>
    );
  }

  return (
    <article className="page">
      <header className="page-head">
        <h1 lang="ta">{song.titleTa ?? song.openingWords}</h1>
        <p className="latin-name">{song.edition}</p>
      </header>

      {/* Canonical layer. Rendered only when the registry actually holds the
          verse body — never reconstructed, never paraphrased. */}
      {song.canonicalText ? (
        <div className="canonical" lang="ta">
          {song.canonicalText}
        </div>
      ) : (
        <p className="empty" lang="ta">
          இப்பதிவின் மூலப் பதிப்பு அடையாளம் காணப்பட்டுள்ளது; ஆனால் மூலத் தமிழ்
          உரை இன்னும் ஏற்றப்படவில்லை. சரிபார்க்கப்படாத உரையை இத்தளம் நிரப்பாது.
        </p>
      )}

      <section className="layers" aria-labelledby="layers-h">
        <h2 id="layers-h" lang="ta">
          அடுக்குகள்
        </h2>
        <dl className="fields">
          <div className="field">
            <dt lang="ta">மூல உரை</dt>
            <dd>
              <StateBadge state={song.canonicalTextStatus} />
            </dd>
          </div>
          <div className="field">
            <dt lang="ta">பொருள்</dt>
            <dd>
              <StateBadge state={song.meaningState} />
            </dd>
          </div>
          <div className="field">
            <dt lang="ta">ஒலிபெயர்ப்பு</dt>
            <dd>
              <StateBadge state={song.transliterationState} />
            </dd>
          </div>
          <div className="field">
            <dt lang="ta">ஒலி</dt>
            <dd>
              <StateBadge state={song.audioState} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="provenance">
        <h2 lang="ta">மூலம்</h2>
        <dl className="fields">
          <div className="field">
            <dt lang="ta">பதிப்பு</dt>
            <dd>{song.edition ?? '—'}</dd>
          </div>
          <div className="field">
            <dt lang="ta">ஆசிரியர்</dt>
            <dd lang="ta">அருணகிரிநாதர்</dd>
          </div>
          <div className="field">
            <dt lang="ta">உரிமை நிலை</dt>
            <dd>{song.rightsStatus ?? '—'}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
