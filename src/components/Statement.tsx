import { m, type Variants } from 'framer-motion';
import { EASE } from '../lib/animations';

const TEXT =
  'Nothing we do should be noticed. Only you should be — in the photograph, and in daylight.';

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
    transition: { duration: 0.9, ease: EASE, delay: 1.55 },
  },
};

/**
 * A manifesto line that plays once, word by word, when it enters view.
 * The timing is intentionally independent of scroll position.
 */
export default function Statement() {
  return (
    <section className="border-t border-ivory-100/[0.06] bg-ink-950 py-24 sm:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <m.p
            variants={words}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.55 }}
            aria-label={TEXT}
            className="font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-light leading-[1.25] tracking-[-0.01em] text-ivory-100"
          >
            {TEXT.split(' ').map((text, index) => (
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
        </div>
      </div>
    </section>
  );
}
