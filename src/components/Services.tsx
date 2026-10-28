import { ArrowRight } from 'lucide-react';
import { services } from '../data/services';
import ServiceCard from './ServiceCard';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

// Equal heights with staggered offsets keep the grid editorial without leaving holes.
const CARD = 'aspect-[4/5] md:aspect-auto md:h-[34rem] lg:h-[38rem]';
const LAYOUT = [
  `md:col-span-7 ${CARD}`,
  `md:col-span-5 md:mt-24 ${CARD}`,
  `md:col-span-5 ${CARD}`,
  `md:col-span-7 md:mt-20 ${CARD}`,
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-ink-950 py-24 sm:py-32">
      <div className="container-luxe">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="01">The services</Eyebrow>
            </Reveal>
            <h2 className="mt-7 max-w-2xl">
              <SplitText text="Four rooms," className="display-2 block text-ivory-50" />
              <SplitText
                text="one mirror."
                delay={0.15}
                className="display-2 block italic text-ivory-300/90"
              />
            </h2>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <p className="font-sans text-[13px] font-light leading-[1.95] text-ivory-300/65">
                Lace laid by hand, piercings placed with a needle and measured twice, lashes
                mapped to the shape of your eye, and makeup chosen for daylight. Each room
                begins with a consultation and ends with aftercare you can actually follow.
              </p>
              <a href="#signature" className="link-underline mt-8">
                See signature treatments
                <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
              </a>
            </Reveal>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-7 md:grid-cols-12 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              className={LAYOUT[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
