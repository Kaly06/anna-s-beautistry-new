import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import Counter from './ui/Counter';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

const STEPS = [
  {
    n: '01',
    title: 'Consultation',
    body: 'Ten minutes before anything touches you: your hairline, your ear, your skin, your calendar. We will tell you when an idea will not work.',
  },
  {
    n: '02',
    title: 'Prep & hygiene',
    body: 'Single-use needles, opened in front of you. Surfaces wiped between clients, tools through the autoclave overnight, hands washed twice.',
  },
  {
    n: '03',
    title: 'The work',
    body: 'We do not double-book. The chair is yours for the length of the appointment and nobody is waiting behind you.',
  },
  {
    n: '04',
    title: 'Aftercare',
    body: 'You leave with written aftercare and a number to message. A service is not finished at the door — it is finished when it has healed.',
  },
];

const STATS = [
  { value: 10, suffix: '', label: 'Years at the chair' },
  { value: 2400, suffix: '+', label: 'Faces' },
  { value: 19, suffix: '', label: 'Services on the menu' },
  { value: 1, suffix: '', label: 'Client at a time' },
];

export default function Studio() {
  return (
    <section id="studio" className="scroll-mt-24 bg-ivory-100 py-24 text-ink-950 sm:py-32">
      <div className="container-luxe">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-gold-700/40" />

              <m.div
                className="relative aspect-[4/5] overflow-hidden bg-ivory-200"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.5, ease: EASE }}
              >
                <m.img
                  src="/images/studio.webp"
                  alt="The studio at Anna's Beautistry in Cape Coast"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.8, ease: EASE }}
                />
                <div className="absolute inset-0 bg-ink-950/10" />
              </m.div>

              <div className="absolute -bottom-6 -right-3 hidden border border-ink-950/15 bg-ivory-100 px-6 py-5 sm:block lg:-right-8">
                <p className="font-display text-2xl">Studio No. 12</p>
                <p className="eyebrow-dark mt-1.5">{HOUSE.city}, Ghana</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-4 xl:pl-10">
            <Reveal>
              <Eyebrow index="03" tone="dark">
                The studio
              </Eyebrow>
            </Reveal>

            <h2 className="mt-7">
              <SplitText text="One chair." className="display-2 block text-ink-950" />
              <SplitText
                text="No queue."
                delay={0.15}
                className="display-2 block italic text-ink-950/60"
              />
            </h2>

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ink-950/65">
                Since {HOUSE.founded} the house has worked the slow way: a consultation before
                every service, one client in the building at a time, and materials we will name
                to your face. No double bookings, no needle guns, no adhesive on your edges
                because it is faster.
              </p>
              <p className="mt-5 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ink-950/65">
                Most of our work comes from someone asking a friend where they had it done.
                That is the only advertising we have ever paid for.
              </p>
            </Reveal>

            <div className="mt-12 space-y-0 border-t border-ink-950/15">
              {STEPS.map((step, index) => (
                <Reveal key={step.n} delay={0.1 * index}>
                  <div className="group grid grid-cols-[auto_1fr] gap-6 border-b border-ink-950/15 py-6">
                    <span className="font-display text-lg italic text-gold-700">{step.n}</span>
                    <div>
                      <h3 className="font-display text-2xl leading-none transition-colors duration-300 group-hover:text-gold-700">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md font-sans text-[12px] font-light leading-relaxed text-ink-950/55">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <Link to="/book" className="group mt-10 inline-flex items-center gap-3">
                <span className="font-sans text-[10px] font-medium uppercase tracking-widest2 text-ink-950">
                  Book a sitting
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/25 text-ink-950 transition-all duration-500 ease-luxe group-hover:border-gold-700 group-hover:bg-gold-700 group-hover:text-ivory-50">
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink-950/15 pt-12 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div>
                <p className="font-display text-5xl font-light leading-none text-ink-950 sm:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.28em] text-ink-950/45">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
