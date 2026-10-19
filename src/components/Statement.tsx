import { useRef } from 'react';
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';

const TEXT =
  'Nothing we do should be noticed. Only you should be — in the photograph, and in daylight.';

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <m.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </m.span>
  );
}

/** A manifesto line that lights up word-by-word as it crosses the viewport. */
export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });

  const words = TEXT.split(' ');

  return (
    <section className="border-t border-ivory-100/[0.06] bg-ink-950 py-24 sm:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-4xl text-center">
          <p
            ref={ref}
            className="font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-light leading-[1.25] tracking-[-0.01em] text-ivory-100"
          >
            {words.map((word, index) => (
              <Word
                key={`${word}-${index}`}
                progress={scrollYProgress}
                range={[index / words.length, (index + 1) / words.length]}
              >
                {word}
              </Word>
            ))}
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold-400/50" />
            <span className="eyebrow">Anna&apos;s Beautistry</span>
            <span className="h-px w-8 bg-gold-400/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
