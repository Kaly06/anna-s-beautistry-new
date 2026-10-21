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
    title: 'I listen first',
    body: 'Every appointment starts with a consultation. I take time to understand what you want, look at your hair, skin or piercing placement, and I will be honest when an idea needs adjusting.',
  },
  {
    n: '02',
    title: 'Clean & careful',
    body: 'Hygiene is part of my craft. I use single-use needles opened in front of you, clean between clients, sterilise my tools properly and prepare carefully before your service begins.',
  },
  {
    n: '03',
    title: 'Your time is yours',
    body: 'I work with one client at a time and do not double-book. When you reserve a service with me, that appointment time is fully yours from start to finish.',
  },
  {
    n: '04',
    title: "I'm here after",
    body: 'You leave with clear aftercare and a way to reach me. For me, a service is not finished at the door — it is finished when you feel confident caring for and maintaining the result.',
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
    <section id="about" className="scroll-mt-24 bg-ivory-100 py-24 text-ink-950 sm:py-32">
      <div className="container-luxe">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            {/*
              The in-view trigger lives on this un-clipped wrapper: browsers fold an
              element's own clip-path into its IntersectionObserver rect, so a
              fully-clipped element observes as "not intersecting" and a whileInView
              on the clipped element itself would never fire.
            */}
            <m.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
            >
              <div className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-gold-700/40" />

              <m.div
                className="relative aspect-[4/5] overflow-hidden bg-ivory-200"
                variants={{
                  hidden: { clipPath: 'inset(0 0 100% 0)' },
                  visible: {
                    clipPath: 'inset(0 0 0% 0)',
                    transition: { duration: 1.5, ease: EASE },
                  },
                }}
              >
                <m.img
                  src="/images/studio.webp"
                  alt="Inside the Anna's Beautistry studio in Cape Coast"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  variants={{
                    hidden: { scale: 1.15 },
                    visible: { scale: 1, transition: { duration: 1.8, ease: EASE } },
                  }}
                />
                <div className="absolute inset-0 bg-ink-950/10" />
              </m.div>

              <div className="absolute -bottom-6 -right-3 hidden border border-ink-950/15 bg-ivory-100 px-6 py-5 sm:block lg:-right-8">
                <p className="font-display text-2xl">My studio</p>
                <p className="eyebrow-dark mt-1.5">{HOUSE.city}, Ghana</p>
              </div>
            </m.div>
          </div>

          <div className="lg:col-span-6 lg:pl-4 xl:pl-10">
            <Reveal>
              <Eyebrow index="03" tone="dark">
                About me
              </Eyebrow>
            </Reveal>

            <h2 className="mt-7">
              <SplitText text="I'm Anna." className="display-2 block text-ink-950" />
              <SplitText
                text="Beauty is personal."
                delay={0.15}
                className="display-2 block italic text-ink-950/60"
              />
            </h2>

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ink-950/65">
                I&apos;m Anna, the beauty artist behind Anna&apos;s Beautistry. Since{' '}
                {HOUSE.founded}, I&apos;ve been helping clients in {HOUSE.city} look and feel
                confident through Wigs, lashes, piercings and makeup — always one client at a
                time, never rushed and never double-booked.
              </p>
              <p className="mt-5 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ink-950/65">
                For me, beauty is not about copying a trend. It is about listening first,
                understanding what suits you and creating a finish that still feels like you.
                Most of my clients find me through someone they trust, and I never take that
                lightly.
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
                  Book a service
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
