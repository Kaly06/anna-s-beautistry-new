import type { Prim } from '../../lib/specimens';

export interface SpecimenProps {
  prims: Prim[];
  className?: string;
  /** Unique per instance — SVG gradient ids must not collide when many render at once. */
  id: string;
  glow?: boolean;
  strokeWidth?: number;
}

/**
 * Renders a menu specimen as a stroked SVG.
 * Geometry comes from `src/lib/specimens.ts` so every service shares one
 * drawing language.
 */
export default function Specimen({
  prims,
  className = '',
  id,
  glow = false,
  strokeWidth = 1.15,
}: SpecimenProps) {
  const gradId = `gold-${id}`;
  const glowId = `glow-${id}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e7ac" />
          <stop offset="0.42" stopColor="#d4af37" />
          <stop offset="1" stopColor="#98751f" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        fill="none"
        filter={glow ? `url(#${glowId})` : undefined}
      >
        {prims.map((p, i) => {
          switch (p.t) {
            case 'path':
              return (
                <path key={i} d={p.d} strokeOpacity={p.o ?? 1} strokeWidth={p.w ?? undefined} fill="none" />
              );
            case 'circle':
              return (
                <circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  strokeOpacity={p.o ?? 1}
                  strokeWidth={p.w ?? undefined}
                  fill="none"
                />
              );
            case 'ellipse':
              return (
                <ellipse
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  rx={p.rx}
                  ry={p.ry}
                  transform={p.rot ? `rotate(${p.rot} ${p.cx} ${p.cy})` : undefined}
                  strokeOpacity={p.o ?? 1}
                  strokeWidth={p.w ?? undefined}
                  fill="none"
                />
              );
            case 'line':
              return (
                <line
                  key={i}
                  x1={p.x1}
                  y1={p.y1}
                  x2={p.x2}
                  y2={p.y2}
                  strokeOpacity={p.o ?? 1}
                  strokeWidth={p.w ?? undefined}
                />
              );
            default:
              return null;
          }
        })}
      </g>
    </svg>
  );
}
