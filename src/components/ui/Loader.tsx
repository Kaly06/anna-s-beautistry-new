import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { EASE } from '../../lib/animations';
import { HOUSE } from '../../data/house';
import Monogram from './Monogram';

const [WORDMARK_LINE_ONE, WORDMARK_LINE_TWO] = HOUSE.wordmarkLines;
const WORDMARK = WORDMARK_LINE_ONE.split('');

/**
 * Opening curtain, in five beats:
 *  1. Her face grows in and the name spells itself out (~1.5s).
 *  2. The full lockup RESTS — name fully formed and still from ~1.5s to
 *     2.0s while the counter climbs (3.9s count).
 *  3. At 2.0s the name, the rule and the top notes fade away first.
 *  4. At 2.9s the bottom strip (city + % counter) fades, just as the logo
 *     begins to swell to 4x — leaving only the big logo.
 *  5. The curtain lifts (~4.4s); the logo grows a little more and dissolves.
 *
 * The mark runs on the 3.9s master clock (matching COUNT_MS); the fades are
 * simple delay-cued two-value animations on that same clock so their cues
 * are exact: name out 2.0s -> 2.8s, bottom strip out 2.9s -> 3.6s, swell
 * 2.8s -> 4.0s.
 */
const COUNT_MS = 3900;

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / COUNT_MS) * 100);
      setProgress(Math.round(p));
      if (p < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        timeout = window.setTimeout(onDone, 480);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <m.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-950 px-6 py-8 sm:px-10"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1.05, ease: EASE }}
    >
      {/* Top notes stay for the whole rest, then leave with the name. */}
      <m.div
        className="flex items-center justify-between"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.0, duration: 0.8, ease: EASE }}
      >
        <span className="eyebrow">Wigs · piercing · lashes · makeup</span>
        <span className="font-sans text-[10px] tracking-widest2 text-ivory-400">
          Est. {HOUSE.founded}
        </span>
      </m.div>

      <div className="flex flex-col items-center">
        {/* The mark: enters to life-size (~1.1s), rests beside the name for
            a beat, then — once the name has gone — swells to 4x into the centre
            of the screen. As the curtain lifts it grows more and dissolves. */}
        <m.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: [0.85, 1, 1, 4], y: [10, 0, 0, 80] }}
          exit={{
            scale: 4.6,
            y: 110,
            opacity: 0,
            transition: {
              duration: 1.05,
              ease: EASE,
              opacity: { duration: 0.7, delay: 0.3, ease: 'easeIn' },
            },
          }}
          transition={{
            opacity: { duration: 1.0, ease: EASE, delay: 0.1 },
            scale: { duration: 3.9, ease: EASE, delay: 0.1, times: [0, 0.26, 0.7, 1] },
            y: { duration: 3.9, ease: EASE, delay: 0.1, times: [0, 0.26, 0.7, 1] },
          }}
          className="mb-8"
        >
          {HOUSE.logoSrc ? (
            <img
              src={HOUSE.logoSrc}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="h-24 w-auto object-contain drop-shadow-[0_0_24px_rgba(212,175,55,0.35)] sm:h-28"
            />
          ) : (
            <span className="block h-12 w-12 text-gold-300 sm:h-14 sm:w-14">
              <Monogram className="h-full w-full" />
            </span>
          )}
        </m.div>

        {/* The name stays, fully formed, for a short beat — then it is the
            first to go, sinking and dissolving before anything else. */}
        <m.div
          data-loader="wordmark"
          className="flex flex-col items-center"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: 72 }}
          transition={{ delay: 2.0, duration: 0.8, ease: EASE }}
        >
          <div className="overflow-hidden">
            <div className="flex justify-center" aria-label="Anna's Beautistry">
              {WORDMARK.map((letter, i) => (
                <m.span
                  key={`${letter}-${i}`}
                  aria-hidden="true"
                  className="font-display text-[11vw] font-light leading-none tracking-[0.12em] text-ivory-50 sm:text-[7.5vw]"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 + i * 0.045 }}
                >
                  {letter}
                </m.span>
              ))}
            </div>
          </div>
          <m.p
            aria-hidden="true"
            className="mt-4 text-center font-sans text-[10px] font-medium uppercase tracking-[0.62em] text-gold-300/90 sm:text-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          >
            {WORDMARK_LINE_TWO}
          </m.p>
          <m.div
            className="mt-7 h-px w-[min(70vw,520px)] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.45, ease: EASE, delay: 0.15 }}
          />
        </m.div>
      </div>

      {/* The city and the counter are the last to go: they fade only after
          the name has gone, just as the logo begins to grow big. */}
      <m.div
        className="flex items-end justify-between"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.9, duration: 0.7, ease: EASE }}
      >
        <span className="max-w-[180px] font-sans text-[9px] uppercase leading-relaxed tracking-[0.25em] text-ivory-400">
          {HOUSE.city}, Ghana
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-light tabular-nums text-gold-200 sm:text-4xl">
            {String(progress).padStart(3, '0')}
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] text-ivory-400">%</span>
        </div>
      </m.div>
    </m.div>
  );
}
