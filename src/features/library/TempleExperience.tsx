import { useMemo } from 'react';
import { useParams } from 'wouter';
import TempleDetail from '@/features/temples/TempleDetail';
import SaveControl from '@/components/SaveControl';
import ReadAloud from '@/components/ReadAloud';
import { templeById } from '@/content/temples';
import { useRecentItem } from '@/lib/useRecent';

export default function TempleExperience() {
  const params = useParams<{ id: string }>();
  const temple = params.id ? templeById(params.id) : undefined;
  const libraryItem = temple
    ? {
        type: 'temple' as const,
        id: temple.id,
        titleTa: temple.nameTa,
        titleEn: temple.nameEn,
      }
    : null;
  useRecentItem(libraryItem);

  const readableText = useMemo(() => {
    if (!temple) return '';
    return [
      temple.nameTa,
      temple.deity,
      temple.muruganForm,
      temple.sthalaPurana,
      temple.history,
      temple.architecture,
      temple.visitorInformation,
    ]
      .filter((value): value is string => Boolean(value))
      .join('. ');
  }, [temple]);

  return (
    <>
      {temple && (
        <aside className="detail-tools page" aria-label="தனிப்பட்ட உள்ளூர் கருவிகள்">
          <div>
            <b lang="ta">இந்தப் பதிவிற்கான கருவிகள்</b>
            <small lang="ta">சேமிப்பு இந்த உலாவியில் மட்டுமே. வாசிப்பு உலாவி குரல் வசதி மட்டுமே.</small>
          </div>
          <SaveControl item={libraryItem!} />
          <ReadAloud text={readableText} />
        </aside>
      )}
      <TempleDetail />
    </>
  );
}
