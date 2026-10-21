import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '../data/services';
import { EASE } from '../lib/animations';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = testimonials[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % testimonials.length),
      7000
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const go = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-ink-900 py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-luxe">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow index="04">In their words</Eyebrow>
            </Reveal>
            <h2 className="mt-7">
              <SplitText text="What people" className="display-3 block text-ivory-50" />
              <SplitText
                text="actually say."
                delay={0.1}
                className="display-3 block italic text-gold-200"
              />
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="relative min-h-[16rem] border-t border-ivory-100/10 pt-10 sm:min-h-[14rem]">
              <AnimatePresence mode="wait">
                <m.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="max-w-3xl"
                >
                  <div className="flex gap-1" aria-label="Five out of five">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-gold-300 text-gold-300" strokeWidth={0} />
                    ))}
                  </div>

                  <p className="mt-6 font-display text-[clamp(1.4rem,2.6vw,2.15rem)] font-light leading-[1.35] text-ivory-100">
                    “{active.quote}”
                  </p>

                  <footer className="mt-8">
                    <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold-200">
                      {active.name}
                    </p>
                    <p className="mt-1.5 font-sans text-[11px] font-light tracking-wide text-ivory-400">
                      {active.role}
                    </p>
                  </footer>
                </m.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ivory-100/10 pt-6">
              <div className="flex items-center gap-2">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Testimonial ${i + 1}: ${item.name}`}
                    aria-current={i === index}
                    className="group py-2"
                  >
                    <span
                      className={`block h-px transition-all duration-500 ease-luxe ${
                        i === index
                          ? 'w-10 bg-gold-300'
                          : 'w-5 bg-ivory-100/25 group-hover:bg-ivory-100/50'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="mr-2 font-sans text-[10px] tracking-[0.2em] text-ivory-400">
                  {String(index + 1).padStart(2, '0')} / 0{testimonials.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-200 transition-colors duration-300 hover:border-gold-300/60 hover:text-gold-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-200 transition-colors duration-300 hover:border-gold-300/60 hover:text-gold-200"
                >
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
