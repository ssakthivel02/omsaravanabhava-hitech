/**
 * The Vel — Murugan's spear. Drawn as geometry rather than shipped as a raster
 * so it stays crisp, themeable and weightless. Decorative by default: the
 * accessible name lives on the surrounding link or heading.
 */
export default function VelMark({
  size = 32,
  title,
}: {
  size?: number;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {/* leaf-shaped blade */}
      <path
        d="M32 3 C43 17 46 27 46 33 C46 42 40 48 32 50 C24 48 18 42 18 33 C18 27 21 17 32 3 Z"
        fill="none"
        stroke="var(--vel)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* central spine */}
      <line x1="32" y1="9" x2="32" y2="50" stroke="var(--gold)" strokeWidth="1.6" />
      {/* cross guard */}
      <line x1="22" y1="52" x2="42" y2="52" stroke="var(--copper)" strokeWidth="2.6" strokeLinecap="round" />
      {/* shaft */}
      <line x1="32" y1="52" x2="32" y2="62" stroke="var(--copper)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
