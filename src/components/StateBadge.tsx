import { describeState } from '@/content';

/**
 * Renders a governed record's real verification state. This component is the
 * only sanctioned way to display state, so a record can never be shown as
 * verified when the registry says otherwise.
 *
 * `dimension` names WHICH thing the badge describes ("ஆயத்தொலைவு", "படம்",
 * "ஆதாரம்") whenever a bare badge could otherwise be misread as describing
 * the whole record (R2-CODE-005 / R2-CODE-015). Pages that already carry an
 * adjacent <dt> label (SongDetail, Prayers) can omit it.
 */
export default function StateBadge({
  state,
  dimension,
}: {
  state: string;
  dimension?: string;
}) {
  const { label, tone } = describeState(state);
  return (
    <span className={`state state-${tone}`}>
      <span className="state-dot" aria-hidden="true" />
      <span lang="ta">
        {dimension ? <span className="state-dimension">{dimension}: </span> : null}
        {label}
      </span>
    </span>
  );
}
