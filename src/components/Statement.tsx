import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  m,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE_QUOTES } from '../data/quotes';

const QUOTE_INTERVAL_MS = 6500;

const words: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.085,
    },
  },
};

const word: Variants = {
  hidden: { opacity: 0.16, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
};

const signature: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.5 },
  },
};

function shuffled(indices: number[]): number[] {
  const arr = [...indices];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The house quotes, shuffling.
 *
 * One line at a time, revealed word by word on a timer — never tied to
 * scroll position. The section always opens on the house manifesto,
 * then wanders the rest of the wall in a fresh order on every visit.
 */
export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInView(sectionRef, { once: true, amount: 0.35 });
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();

  const [order, setOrder] = useState<number[]>(() => [
    0,
    ...shuffled(HOUSE_QUOTES.map((_, index) => index).slice(1)),
  ]);
  const [position, setPosition] = useState(0);
  const [cycle, setCycle] = useState(0);

  const quoteIndex = order[position] ?? 0;
  const quote = HOUSE_QUOTES[quoteIndex];

  const advance = useCallback(() => {
    if (position + 1 < order.length) {
      setPosition(position + 1);
      return;
    }
    const next = shuffled(HOUSE_QUOTES.map((_, index) => index));
    if (next[0] === quoteIndex && next.length > 1) {
      [next[0], next[1]] = [next[1], next[0]];
    }
    setOrder(next);
    setPosition(0);
    setCycle((count) => count + 1);
  }, [order, position, quoteIndex]);

  const back = useCallback(() => {
    setPosition((current) => (current - 1 + order.length) % order.length);
  }, [order.length]);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const id = window.setInterval(advance, QUOTE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [advance, inView, reduceMotion]);

  const controlButton =
    'flex h-9 w-9 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-300 transition-colors duration-300 hover:border-gold-300/60 hover:text-gold-200';

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="House quotes"
      className="border-t border-ivory-100/[0.06] bg-ink-950 py-24 sm:py-32"
    >
      <div className="container-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative flex min-h-[12rem] items-center justify-center sm:min-h-[13rem] lg:min-h-[13.5rem]">
            <AnimatePresence mode="wait">
              <m.p
                key={`${cycle}-${position}`}
                variants={words}
                initial="hidden"
                animate={seen ? 'visible' : 'hidden'}
                exit={{
                  opacity: 0,
                  y: -12,
                  filter: 'blur(4px)',
                  transition: { duration: 0.45, ease: EASE },
                }}
                aria-label={quote}
                className="font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-light leading-[1.25] tracking-[-0.01em] text-ivory-100"
              >
                {quote.split(' ').map((text, index) => (
                  <m.span
                    key={`${text}-${index}`}
                    variants={word}
                    aria-hidden="true"
                    className="mr-[0.24em] inline-block will-change-[opacity,transform,filter]"
                  >
                    {text}
                  </m.span>
                ))}
              </m.p>
            </AnimatePresence>
          </div>

          <m.div
            variants={signature}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.55 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <span className="h-px w-8 bg-gold-400/50" />
            <span className="eyebrow">Anna&apos;s Beautistry</span>
            <span className="h-px w-8 bg-gold-400/50" />
          </m.div>

          <div className="mt-9 flex items-center justify-center gap-5">
            <button type="button" onClick={back} aria-label="Previous quote" className={controlButton}>
              <ChevronLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <span className="font-sans text-[10px] tabular-nums tracking-[0.3em] text-ivory-400">
              {pad(position + 1)} / {pad(HOUSE_QUOTES.length)}
            </span>
            {inView && !reduceMotion ? (
              <span
                aria-hidden="true"
                className="relative hidden h-px w-20 overflow-hidden bg-ivory-100/15 sm:block"
              >
                <m.span
                  key={`${cycle}-${position}`}
                  className="absolute inset-y-0 left-0 w-full origin-left bg-gold-300/80"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: QUOTE_INTERVAL_MS / 1000, ease: 'linear' }}
                />
              </span>
            ) : null}
            <button type="button" onClick={advance} aria-label="Next quote" className={controlButton}>
              <ChevronRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
