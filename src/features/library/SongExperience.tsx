import { useParams } from 'wouter';
import SongDetail from '@/features/thiruppugazh/SongDetail';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { songById } from '@/content';
import { useRecentItem } from '@/lib/useRecent';

export default function SongExperience() {
  const params = useParams<{ id: string }>();
  const song = params.id ? songById(params.id) : undefined;
  const libraryItem = song
    ? {
        type: 'thiruppugazh' as const,
        id: song.id,
        titleTa: song.titleTa ?? song.openingWords,
        titleEn: null,
      }
    : null;
  useRecentItem(libraryItem);

  return (
    <>
      {song && (
        <aside className="detail-tools page" aria-label="தனிப்பட்ட உள்ளூர் கருவிகள்">
          <div>
            <b lang="ta">இந்தப் பதிவிற்கான கருவிகள்</b>
            <small lang="ta">சேமிப்பு இந்த உலாவியில் மட்டுமே. மூலத் தமிழ் உரை கிடைத்தால் மட்டுமே உலாவி வாசிப்பு தோன்றும்.</small>
          </div>
          <SaveControl item={libraryItem!} />
          {song.canonicalText && <ReadAloud text={song.canonicalText} />}
        </aside>
      )}
      <SongDetail />
    </>
  );
}
