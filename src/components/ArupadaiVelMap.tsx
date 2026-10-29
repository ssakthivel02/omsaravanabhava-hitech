import { arupadaiVeedu } from '@/content';

export const ARUPADAI_STOP_COLORS = [
  'var(--gold)',
  'var(--gold-soft)',
  'var(--saffron)',
  'var(--copper)',
  'var(--vel)',
  'var(--vel-bright)',
] as const;

/**
 * A visual map of the six traditional Arupadai Veedu pilgrimage stops.
 * The 01..06 ordinals are meaningful data, not decoration. Keep this motif
 * attached to Arupadai Veedu context so visitors do not mistake the numbers
 * for an unrelated doctrinal classification.
 */
export default function ArupadaiVelMap({ className = '' }: { className?: string }) {
  return (
    <div className={`arupadai-vel-map ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 200 640" preserveAspectRatio="xMidYMin meet">
        <defs>
          <linearGradient id="arupadai-shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--vel-bright)" stopOpacity="0.95" />
            <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.72" />
            <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient id="arupadai-glow">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity="0.72" />
            <stop offset="55%" stopColor="var(--gold)" stopOpacity="0.24" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="arupadai-ambient">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="154" r="265" fill="url(#arupadai-ambient)" />
        <circle cx="100" cy="86" r="108" fill="url(#arupadai-glow)" />
        <path
          d="M100 12 C122 44 128 66 128 80 C128 100 116 112 100 118 C84 112 72 100 72 80 C72 66 78 44 100 12 Z"
          fill="none"
          stroke="var(--vel-bright)"
          strokeWidth="2"
        />
        <line x1="100" y1="24" x2="100" y2="616" stroke="url(#arupadai-shaft)" strokeWidth="2.5" />
        <line x1="84" y1="124" x2="116" y2="124" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round" />

        {arupadaiVeedu.map((temple, index) => (
          <g key={temple.id}>
            <circle cx="100" cy={168 + index * 84} r="10" fill={ARUPADAI_STOP_COLORS[index]} opacity="0.16" />
            <circle
              cx="100"
              cy={168 + index * 84}
              r="5"
              fill="var(--sanctum)"
              stroke={ARUPADAI_STOP_COLORS[index]}
              strokeWidth="2"
            />
            <text
              x="118"
              y={168 + index * 84 + 4}
              fontSize="13"
              fill="var(--gold-soft)"
              opacity="0.9"
            >
              {String(temple.pilgrimageOrder).padStart(2, '0')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
