import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import Eyebrow from './ui/Eyebrow';
import Magnetic from './ui/Magnetic';
import SplitText from './ui/SplitText';

export default function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1.03]);

  return (
    <section
      id="lookbook"
      ref={ref}
      className="relative flex min-h-[88svh] scroll-mt-24 items-center overflow-hidden bg-ink-950"
    >
      <m.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src="/images/svc-glam.webp"
          alt="A soft glam face from the Coastal Edit at Anna's Beautistry"
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-75"
        />
      </m.div>

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-5 border border-ivory-50/10 sm:inset-8" />

      <div className="container-luxe relative py-28">
        <div className="max-w-2xl">
          <Eyebrow>{HOUSE.season}</Eyebrow>

          <h2 className="mt-8">
            <SplitText
              text="The face you"
              className="display-1 block text-[clamp(2.9rem,7vw,6rem)] text-ivory-50"
            />
            <SplitText
              text="already have."
              delay={0.15}
              className="display-1 block text-[clamp(2.9rem,7vw,6rem)] italic text-ivory-200/70"
            />
          </h2>

          <m.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="mt-8 max-w-md font-sans text-[13px] font-light leading-[1.95] text-ivory-200/70"
          >
            Twenty-four faces photographed in the studio across one humid season — bridal,
            traditional, editorial and the everyday five-product face. Nothing here was
            retouched, because the point is that it does not need to be.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="mt-10"
          >
            <Magnetic>
              <a href="#book" className="btn-ghost group">
                Book a sitting
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.4}
                />
              </a>
            </Magnetic>
          </m.div>
        </div>

        <div className="mt-20 flex items-center gap-4 border-t border-ivory-100/15 pt-5 sm:mt-28">
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory-400">
            Photographed at Studio No. 12
          </span>
          <span className="h-px flex-1 bg-ivory-100/10" />
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-300/80">
            24 faces
          </span>
        </div>
      </div>
    </section>
  );
}
