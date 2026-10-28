import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { signatures } from '../data/services';
import { formatPrice } from '../data/house';
import { EASE } from '../lib/animations';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

export default function Signatures() {
  return (
    <section
      id="signature"
      className="relative scroll-mt-24 overflow-hidden bg-ink-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-gold-600/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[480px] w-[480px] rounded-full bg-royal-600/[0.15] blur-[130px]" />

      <div className="container-luxe relative">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <Eyebrow index="02">Signature treatments</Eyebrow>
            </Reveal>
            <h2 className="mt-7">
              <SplitText text="The four we" className="display-2 block text-ivory-50" />
              <SplitText
                text="are known for."
                delay={0.15}
                className="display-2 block italic text-ivory-300/90"
              />
            </h2>
          </div>

          <Reveal delay={0.2} className="shrink-0">
            <Link to="/book" className="link-underline">
              Book a service
              <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-14 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6">
          {signatures.map((signature, index) => (
            <m.article
              key={signature.id}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 1.15, ease: EASE, delay: (index % 4) * 0.09 }}
              className="group"
            >
              <Link
                to={signature.href}
                className="block"
                aria-label={`${signature.name} — ${signature.detail}`}
              >
                <div className="relative overflow-hidden bg-ink-800">
                  <div className="aspect-square">
                    <img
                      src={signature.image}
                      alt={signature.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.07]"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  {signature.tag ? (
                    <span className="absolute left-2.5 top-2.5 border border-ivory-50/20 bg-ink-950/45 px-2 py-1 font-sans text-[6.5px] font-medium uppercase tracking-[0.22em] text-ivory-100 backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[8px] sm:tracking-[0.28em]">
                      {signature.tag}
                    </span>
                  ) : null}

                  <span className="absolute right-4 top-4 hidden h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-ivory-50/30 bg-ink-950/30 text-ivory-50 opacity-0 backdrop-blur-md transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 min-[500px]:flex">
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
                  <div>
                    <p className="font-sans text-[7.5px] uppercase tracking-[0.24em] text-gold-300/70 sm:text-[9px] sm:tracking-[0.3em]">
                      {signature.service}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg leading-tight text-ivory-50 sm:mt-2 sm:text-2xl">
                      {signature.name}
                    </h3>
                    <p className="mt-1 font-sans text-[9px] tracking-wide text-ivory-400 sm:mt-1.5 sm:text-[10px] sm:tracking-wider">
                      {signature.detail} · {signature.duration}
                    </p>
                    <p className="mt-3 font-display text-base text-gold-200 sm:mt-4 sm:text-lg">
                      {signature.priceFrom ? (
                        <span className="mr-1.5 font-sans text-[7px] uppercase tracking-[0.2em] text-ivory-500 sm:mr-2 sm:text-[8px] sm:tracking-[0.24em]">
                          From
                        </span>
                      ) : null}
                      {formatPrice(signature.price)}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 hidden h-4 w-4 shrink-0 text-ivory-400 transition-all duration-500 ease-luxe group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-200 min-[500px]:block"
                    strokeWidth={1.3}
                  />
                </div>
              </Link>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
