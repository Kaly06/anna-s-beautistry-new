import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import Magnetic from './ui/Magnetic';
import SplitText from './ui/SplitText';

export default function Hero({ introDone }: { introDone: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { duration: 1.1, ease: EASE, delay },
  });

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950"
    >
      <m.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <img
          src="/images/hero.webp"
          alt=""
          className="h-full w-full object-cover object-[62%_center]"
        />
      </m.div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/35 to-ink-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/20 to-transparent" />
      <div className="vignette absolute inset-0" />
      {/* Royal-purple radiance behind the headline — her colour, felt as light. */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-royal-500/35 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-royal-400/20 blur-[120px]" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.055]" />

      <div className="container-luxe relative flex flex-1 flex-col justify-end pb-10 pt-36 sm:pb-14 md:pt-40">
        <m.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-4xl">
          <m.div {...fade(0.05)} className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold-300/60" />
            <span className="eyebrow">
              Cape Coast beauty house — lace, needles, lashes &amp; skin, since {HOUSE.founded}
            </span>
          </m.div>

          <h1 className="mt-7">
            <span className="block">
              <SplitText
                text="Beauty,"
                active={introDone}
                delay={0.12}
                className="display-1 block text-ivory-50"
              />
            </span>
            <span className="mt-1 block">
              <SplitText
                text="authored."
                active={introDone}
                delay={0.26}
                wordClassName="gold-text"
                className="display-1 block italic"
              />
            </span>
          </h1>

          <m.p
            {...fade(0.5)}
            className="mt-7 max-w-md font-sans text-[13px] font-light leading-[1.9] text-ivory-200/75 sm:text-sm"
          >
            Hand-laid lace, needle-only piercings, weightless lash sets and skin that still
            looks like skin. One client, one chair, one mirror. {HOUSE.greeting} — you are
            welcome in the house.
          </m.p>

          <m.div {...fade(0.66)} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#services" className="btn-gold group">
                Explore the services
                <ArrowDownRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1 group-hover:translate-y-1"
                  strokeWidth={1.5}
                />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#studio" className="group inline-flex items-center gap-3 px-2 py-4">
                <span className="font-sans text-[10px] font-medium uppercase tracking-widest2 text-ivory-200 transition-colors duration-300 group-hover:text-gold-200">
                  Inside the studio
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-100/25 text-ivory-200 transition-colors duration-500 group-hover:border-gold-300/70 group-hover:text-gold-200">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </span>
              </a>
            </Magnetic>
          </m.div>
        </m.div>

        <m.div
          {...fade(0.85)}
          className="mt-14 flex items-end justify-between gap-6 border-t border-ivory-100/15 pt-6 sm:mt-20"
        >
          <a href="#services" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-px overflow-hidden bg-ivory-100/15">
              <span className="absolute inset-0 animate-scroll-cue bg-gold-300" />
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory-300/70 transition-colors group-hover:text-gold-200">
              Scroll to discover
            </span>
          </a>

          <div className="hidden items-end gap-10 sm:flex">
            <div className="text-right">
              <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory-400">Season</p>
              <p className="mt-1 font-display text-lg text-ivory-100">{HOUSE.season}</p>
            </div>
            <div className="h-8 w-px bg-ivory-100/15" />
            <div className="text-right">
              <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory-400">
                Faces
              </p>
              <p className="mt-1 font-display text-lg text-ivory-100">{HOUSE.clients}</p>
            </div>
          </div>
        </m.div>
      </div>

      <div className="pointer-events-none absolute right-6 top-1/3 hidden xl:block">
        <p className="writing-vertical font-sans text-[9px] uppercase tracking-[0.5em] text-ivory-300/45">
          {HOUSE.cities}
        </p>
      </div>
    </section>
  );
}
