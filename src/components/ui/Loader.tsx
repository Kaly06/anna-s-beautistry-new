import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { EASE } from '../../lib/animations';
import { HOUSE } from '../../data/house';
import Monogram from './Monogram';

const WORDMARK = HOUSE.wordmark.split('');

/** Opening curtain: wordmark reveal, gold rule and a percentage counter. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let timeout = 0;
    const start = performance.now();
    const DURATION = 1500;

    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / DURATION) * 100);
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
      <div className="flex items-center justify-between">
        <span className="eyebrow">Wigs · piercing · lashes · makeup</span>
        <span className="font-sans text-[10px] tracking-widest2 text-ivory-400">
          Est. {HOUSE.founded}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <m.div
          initial={{ opacity: 0, scale: 0.7, rotate: -60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
          className="mb-8 h-12 w-12 text-gold-300 sm:h-14 sm:w-14"
        >
          <Monogram className="h-full w-full" />
        </m.div>
        <div className="overflow-hidden">
          <div className="flex">
            {WORDMARK.map((letter, i) => (
              <m.span
                key={`${letter}-${i}`}
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
        <m.div
          className="mt-7 h-px w-[min(70vw,520px)] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.45, ease: EASE, delay: 0.15 }}
        />
      </div>

      <div className="flex items-end justify-between">
        <span className="max-w-[180px] font-sans text-[9px] uppercase leading-relaxed tracking-[0.25em] text-ivory-400">
          {HOUSE.city}, Ghana
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-light tabular-nums text-gold-200 sm:text-4xl">
            {String(progress).padStart(3, '0')}
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] text-ivory-400">%</span>
        </div>
      </div>
    </m.div>
  );
}
