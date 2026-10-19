import type { ReactNode } from 'react';

interface EyebrowProps {
  index?: string;
  children: ReactNode;
  className?: string;
  /** 'light' = for dark backgrounds (default), 'dark' = for ivory backgrounds. */
  tone?: 'light' | 'dark';
}

/** Section kicker: an index number, a gold rule, then tracked-out label. */
export default function Eyebrow({ index, children, className = '', tone = 'light' }: EyebrowProps) {
  const isDark = tone === 'dark';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {index ? (
        <span
          className={`font-sans text-[10px] font-medium tracking-widest2 ${
            isDark ? 'text-gold-700/80' : 'text-gold-400/80'
          }`}
        >
          {index}
        </span>
      ) : null}
      <span className={`h-px w-9 ${isDark ? 'bg-gold-700/40' : 'bg-gold-400/40'}`} />
      <span className={isDark ? 'eyebrow-dark' : 'eyebrow'}>{children}</span>
    </div>
  );
}
