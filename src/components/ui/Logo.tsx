import { HOUSE } from '../../data/house';
import Monogram from './Monogram';

interface LogoProps {
  /**
   * nav    — header lockup
   * footer — the complete uploaded lockup (name + tagline in the artwork)
   * menu   — mobile menu header
   */
  size?: 'nav' | 'footer' | 'menu';
  /** Hide the text and show only the mark (e.g. very tight spaces). */
  iconOnly?: boolean;
  className?: string;
}

/**
 * The Anna's Beautistry logo — the single source of truth for the brand lockup.
 *
 * Header/menu: her uploaded mark (the face + AB script, gold on
 * transparent) beside the full name set in type — "ANNA'S" (Cormorant)
 * over "BEAUTISTRY" (Montserrat, gold) — so the name stays there and
 * stays crisp at small sizes. Footer: the complete uploaded lockup,
 * tagline included, where there is room for it.
 * Never render "ANNA'S" alone.
 */
export default function Logo({ size = 'nav', iconOnly = false, className = '' }: LogoProps) {
  const [lineOne, lineTwo] = HOUSE.wordmarkLines;

  if (size === 'footer' && HOUSE.logoFullSrc) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src={HOUSE.logoFullSrc}
          alt="Anna's Beautistry — Enhancing beauty, building confidence"
          draggable={false}
          className="h-24 w-auto object-contain transition-all duration-700 ease-luxe group-hover:drop-shadow-[0_0_18px_rgba(212,175,55,0.35)] sm:h-28"
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 sm:gap-3.5 ${className}`}>
      {HOUSE.logoSrc ? (
        <img
          src={HOUSE.logoSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="h-11 w-auto shrink-0 object-contain transition-all duration-700 ease-luxe group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_14px_rgba(212,175,55,0.45)] sm:h-[52px]"
        />
      ) : (
        <Monogram className="h-9 w-9 shrink-0 text-gold-300" />
      )}
      {!iconOnly ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base tracking-[0.26em] text-ivory-50 sm:text-lg sm:tracking-[0.28em]">
            {lineOne}
          </span>
          <span className="mt-1.5 font-sans text-[8px] font-medium uppercase tracking-[0.52em] text-gold-300/85 sm:text-[9px]">
            {lineTwo}
          </span>
        </span>
      ) : null}
      <span className="sr-only">Anna&apos;s Beautistry</span>
    </span>
  );
}
