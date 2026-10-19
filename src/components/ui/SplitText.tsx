import { m } from 'framer-motion';
import { EASE } from '../../lib/animations';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Delay before the first word animates, in seconds. */
  delay?: number;
  /** Per-word stagger, in seconds. */
  stagger?: number;
  /** undefined = trigger on scroll; boolean = controlled by a parent. */
  active?: boolean;
  /** Extra classes applied to each animated word. */
  wordClassName?: string;
}

/**
 * Reveals a headline word-by-word, each word masked by an overflow-hidden sleeve.
 * The full string is exposed to assistive tech via sr-only text.
 */
export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.055,
  active,
  wordClassName = '',
}: SplitTextProps) {
  const container = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const word = {
    hidden: { y: '115%' },
    visible: { y: '0%', transition: { duration: 1.15, ease: EASE } },
  };

  const triggerProps =
    active === undefined
      ? { whileInView: 'visible' as const, viewport: { once: true, margin: '-12%' } }
      : { animate: (active ? 'visible' : 'hidden') as 'visible' | 'hidden' };

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <m.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        variants={container}
        {...triggerProps}
      >
        {text.split(' ').map((wordText, i) => (
          <span
            key={`${wordText}-${i}`}
            className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
          >
            <m.span className={`inline-block ${wordClassName}`} variants={word}>
              {wordText}
              {i < text.split(' ').length - 1 ? '\u00A0' : ''}
            </m.span>
          </span>
        ))}
      </m.span>
    </span>
  );
}
