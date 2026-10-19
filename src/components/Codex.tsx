import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import Mark from './ui/Mark';
import { CODEX, MARKS, type MarkName } from '../data/marks';
import { EASE } from '../lib/animations';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

/** The studios each material belongs to, so the codex links into the menu. */
const ROOMS: Record<MarkName, string> = {
  lace: '/services/wigs',
  titanium: '/services/piercing',
  silk: '/services/lashes',
  pigment: '/services/makeup',
  halo: '/services/wigs',
};

/**
 * The materials codex: the four things the house will work with, what they are,
 * and why cheaper versions of each were rejected.
 */
export default function Codex() {
  const [active, setActive] = useState<MarkName>('lace');
  const mark = MARKS[active];

  return (
    <section
      id="materials"
      className="relative scroll-mt-24 overflow-hidden border-t border-ivory-100/[0.06] bg-ink-950 py-24 sm:py-32"
    >
      {/* Oversized house mark, turning very slowly behind the content. */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 text-gold-300/[0.05] sm:-right-10 sm:h-[560px] sm:w-[560px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, ease: 'linear', repeat: Infinity }}
      >
        <Mark name="halo" strokeWidth={0.5} className="h-full w-full" />
      </m.div>
      <div className="pointer-events-none absolute left-1/3 top-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-gold-600/[0.08] blur-[130px]" />

      <div className="container-luxe relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="04">The materials</Eyebrow>
            </Reveal>
            <h2 className="mt-7">
              <SplitText text="Four things" className="display-2 block text-ivory-50" />
              <SplitText
                text="we will not swap."
                delay={0.12}
                className="display-2 block italic text-gold-200/90"
              />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md font-sans text-[13px] font-light leading-[2] text-ivory-300/65">
                A service is only as good as the material it is made of. We buy the version
                that costs more, charge for it honestly, and tell you what it is — because
                the cheap version of each of these is what causes the problems people come
                to us to fix.
              </p>
              <p className="mt-5 max-w-md font-sans text-[13px] font-light leading-[2] text-ivory-300/65">
                Ask to see the packet, the grade stamp or the certificate. It is in the
                drawer and you are welcome to it.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-10 border-t border-ivory-100/10 pt-6">
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-500">
                  Used in
                </p>
                <p className="mt-3 max-w-xs font-display text-2xl font-light leading-snug text-ivory-100">
                  {mark.label}
                  <span className="text-gold-200">
                    {' '}
                    — {CODEX.find((entry) => entry.name === active)?.for}.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-4">
              {CODEX.map((entry, index) => {
                const item = MARKS[entry.name];
                const isActive = active === entry.name;
                return (
                  <m.button
                    key={entry.name}
                    type="button"
                    onMouseEnter={() => setActive(entry.name)}
                    onFocus={() => setActive(entry.name)}
                    onClick={() => setActive(entry.name)}
                    aria-pressed={isActive}
                    aria-label={`${item.label} — ${item.note}`}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: index * 0.06 }}
                    className={`group relative flex aspect-[3/4] flex-col items-center justify-between p-3.5 transition-colors duration-700 sm:p-4 ${
                      isActive ? 'bg-gold-300/[0.07]' : 'bg-ink-950 hover:bg-ink-900'
                    }`}
                  >
                    <span
                      className={`font-sans text-[8.5px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                        isActive ? 'text-gold-200' : 'text-ivory-500'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="relative flex flex-1 items-center justify-center">
                      <span
                        className={`absolute inset-0 rounded-full bg-gold-400/10 blur-2xl transition-opacity duration-700 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <Mark
                        name={entry.name}
                        strokeWidth={isActive ? 1.5 : 1}
                        className={`relative h-14 w-14 transition-all duration-700 ease-luxe sm:h-12 sm:w-12 lg:h-14 lg:w-14 ${
                          isActive
                            ? 'scale-110 text-gold-200'
                            : 'text-ivory-300/45 group-hover:text-gold-300/80'
                        }`}
                      />
                    </span>

                    <span className="text-center">
                      <span
                        className={`block font-display text-[13px] leading-tight transition-colors duration-500 ${
                          isActive ? 'text-gold-100' : 'text-ivory-200'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-1 block font-sans text-[7.5px] uppercase leading-relaxed tracking-[0.16em] text-ivory-500">
                        {entry.for}
                      </span>
                    </span>

                    <span
                      className={`absolute inset-x-4 bottom-0 h-px origin-left bg-gold-300/60 transition-transform duration-700 ease-luxe ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </m.button>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm font-sans text-[11px] font-light leading-relaxed text-ivory-400">
                  {mark.note}
                </p>
                <Link
                  to={ROOMS[active]}
                  className="group inline-flex shrink-0 items-center gap-3 font-sans text-[9px] uppercase tracking-[0.26em] text-gold-200 transition-colors hover:text-gold-100"
                >
                  See the menu
                  <span className="h-px w-8 bg-gold-300/60 transition-all duration-500 group-hover:w-12" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
