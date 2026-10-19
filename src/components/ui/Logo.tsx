import { HOUSE } from '../../data/house';
import Monogram from './Monogram';

interface LogoProps {
  /**
   * nav    — header: full stacked name on desktop, compact stacked on mobile
   * footer — slightly larger lockup for the footer
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
 * Full name always: "ANNA'S" (Cormorant, tracked) over "BEAUTISTRY"
 * (Montserrat, wide-tracked, gold) beside the house mark.
 * Never render "ANNA'S" alone.
 *
 * When the new logo file is uploaded, set `HOUSE.logoSrc` in
 * `src/data/house.ts` (e.g. '/images/logo.svg') and it will be used
 * everywhere this component appears — header, footer and mobile menu.
 */
export default function Logo({ size = 'nav', iconOnly = false, className = '' }: LogoProps) {
  const [lineOne, lineTwo] = HOUSE.wordmarkLines;

  if (HOUSE.logoSrc) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src={HOUSE.logoSrc}
          alt="Anna's Beautistry"
          className={
            iconOnly
              ? 'h-7 w-7 object-contain sm:h-8 sm:w-8'
              : size === 'footer'
                ? 'h-12 w-auto max-w-[220px] object-contain'
                : 'h-9 w-auto max-w-[180px] object-contain sm:h-10 sm:max-w-[200px]'
          }
        />
      </span>
    );
  }

  const iconSize =
    size === 'footer' ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-7 w-7 sm:h-8 sm:w-8';
  const lineOneSize =
    size === 'footer'
      ? 'text-base sm:text-lg tracking-[0.26em]'
      : 'text-[13px] sm:text-base tracking-[0.26em] sm:tracking-[0.28em]';
  const lineTwoSize =
    size === 'footer'
      ? 'text-[8px] sm:text-[9px] tracking-[0.52em]'
      : 'text-[7px] sm:text-[8px] tracking-[0.52em]';

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Placeholder house mark — replaced by the uploaded logo via HOUSE.logoSrc */}
      <Monogram
        className={`${iconSize} shrink-0 text-gold-300 transition-transform duration-700 ease-luxe group-hover:rotate-180`}
      />
      {!iconOnly ? (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-ivory-50 ${lineOneSize}`}>{lineOne}</span>
          <span
            className={`mt-1 font-sans font-medium uppercase text-gold-300/85 ${lineTwoSize}`}
          >
            {lineTwo}
          </span>
        </span>
      ) : null}
      <span className="sr-only">Anna&apos;s Beautistry</span>
    </span>
  );
}
