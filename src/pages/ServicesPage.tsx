import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { menu } from '../data/menu';
import { roomsMeta } from '../data/rooms';
import { services, signatures } from '../data/services';
import { WIG_BASE, WIG_GROUPS } from '../data/wigOptions';
import { formatDuration, formatPrice, HOUSE } from '../data/house';
import { EASE } from '../lib/animations';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';
import Magnetic from '../components/ui/Magnetic';

/**
 * The services index — the page the nav has always pointed past.
 * Every number on it is derived from the menu itself, so a price change in
 * `src/data/menu.ts` moves the page with it.
 */
const rows = roomsMeta.map((room) => {
  const items = menu.filter((item) => item.service === room.id);
  const prices = items.map((item) => item.price);
  const durations = items.map((item) => item.duration);

  return {
    room,
    count: items.length,
    from: Math.min(...prices),
    to: Math.max(...prices),
    quickest: Math.min(...durations),
    longest: Math.max(...durations),
    image: services.find((service) => service.id === room.id)?.image ?? '',
    signature: signatures.find((signature) => signature.id.startsWith(`${room.id}-`)),
  };
});

const totalTreatments = menu.length;
const cheapest = Math.min(...menu.map((item) => item.price));
const quickest = Math.min(...menu.map((item) => item.duration));

export default function ServicesPage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-ivory-100/[0.07] bg-ink-950 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-royal-500/[0.18] blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold-500/[0.08] blur-[130px]" />

        <div className="container-luxe relative">
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-400 transition-colors hover:text-gold-200"
            >
              <ArrowLeft className="h-3 w-3" strokeWidth={1.4} />
              House
            </Link>
            <span className="h-px w-5 bg-ivory-100/20" />
            <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-200">
              Services
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="01">The menu</Eyebrow>
              <h1 className="mt-7 font-display text-[clamp(3rem,7.4vw,6.5rem)] font-light leading-[0.92] tracking-[-0.025em] text-ivory-50">
                <SplitText text="Four rooms," className="block" />
                <SplitText text="one mirror." delay={0.12} className="block italic text-gold-200" />
              </h1>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                className="max-w-md font-sans text-[13px] font-light leading-[1.95] text-ivory-300/70"
              >
                Lace, needles, lashes and skin — priced openly, in cedis, with the aftercare
                written down. Every room begins with a consultation and ends with a number you
                knew before you sat down.
              </m.p>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-ivory-100/10 pt-8"
          >
            {[
              { value: String(totalTreatments), label: 'Treatments on the menu' },
              { value: formatPrice(cheapest), label: 'Lowest starting price' },
              { value: formatDuration(quickest), label: 'Shortest service' },
              { value: 'Tue – Sat', label: 'Studio days' },
            ].map((stat) => (
              <div key={stat.label} className="min-w-[7rem]">
                <p className="font-display text-4xl font-light text-gold-200">{stat.value}</p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ----------------------------------------------------------- rooms */}
      <section className="bg-ink-950 pb-24 pt-4 sm:pb-32">
        <div className="container-luxe">
          {rows.map(
            ({ room, count, from, to, quickest: fast, longest, image, signature }, index) => (
              <Reveal
                key={room.id}
                delay={0.04}
                className={index === 0 ? '' : 'border-t border-ivory-100/10'}
              >
                <article className="py-12 sm:py-16">
                  <div
                    className={`flex flex-col gap-9 lg:items-center lg:gap-14 ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    }`}
                  >
                    <Link
                      to={`/services/${room.id}`}
                      aria-label={`See the ${room.name} menu`}
                      className="group relative block w-full shrink-0 overflow-hidden border border-ivory-100/10 lg:w-[44%]"
                    >
                      <div className="aspect-[4/3] sm:aspect-[4/5] lg:aspect-[5/6]">
                        <img
                          src={image}
                          alt={`${room.name} at Anna's Beautistry`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.05]"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent" />
                      <span className="absolute left-5 top-5 font-display text-sm italic text-gold-200">
                        {room.numeral}
                      </span>
                      <span className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                        <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-100">
                          {count} treatments
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-50/25 text-ivory-50 transition-colors duration-500 group-hover:border-gold-200/70 group-hover:text-gold-200">
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.3} />
                        </span>
                      </span>
                    </Link>

                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-[10px] font-medium tracking-widest2 text-gold-400/80">
                          {room.numeral}
                        </span>
                        <span className="h-px w-9 bg-gold-400/40" />
                        <span className="eyebrow">{room.name}</span>
                      </div>

                      <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ivory-50">
                        {room.headline}
                      </h2>

                      <p className="mt-5 max-w-lg font-sans text-[12.5px] font-light leading-[1.95] text-ivory-300/70">
                        {room.intro}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-ivory-100/10 py-4">
                        <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-400">
                          {count} treatments
                        </p>
                        <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-400">
                          {formatPrice(from)} – {formatPrice(to)}
                        </p>
                        <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-400">
                          {formatDuration(fast)} – {formatDuration(longest)}
                        </p>
                      </div>

                      {signature ? (
                        <Link
                          to={signature.href}
                          className="group mt-6 flex max-w-md items-baseline justify-between gap-4"
                        >
                          <span>
                            <span className="block font-sans text-[8.5px] uppercase tracking-[0.26em] text-gold-300/70">
                              Signature
                            </span>
                            <span className="mt-1.5 block font-display text-xl font-light text-ivory-100 transition-colors duration-300 group-hover:text-gold-100">
                              {signature.name}
                            </span>
                          </span>
                          <span className="shrink-0 font-display text-base text-gold-200">
                            {signature.priceFrom ? (
                              <span className="mr-2 font-sans text-[8px] uppercase tracking-[0.24em] text-ivory-500">
                                From
                              </span>
                            ) : null}
                            {formatPrice(signature.price)}
                          </span>
                        </Link>
                      ) : null}

                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Magnetic strength={0.14}>
                          <Link to={`/services/${room.id}`} className="btn-ghost group">
                            See the menu
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                              strokeWidth={1.4}
                            />
                          </Link>
                        </Magnetic>

                        {room.id === 'wigs' ? (
                          <Link to="/services/wigs/options" className="link-underline">
                            The options sheet
                            <ArrowUpRight className="h-3 w-3" strokeWidth={1.4} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* --------------------------------------------------------- options */}
      <section className="relative overflow-hidden border-y border-gold-300/20 bg-ink-900 py-20 sm:py-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-royal-500/20 blur-[120px]" />
        <div className="container-luxe relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Wigs</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.02] text-ivory-50">
                Building a unit?
                <span className="block italic text-gold-200">Start on paper.</span>
              </h2>
              <p className="mt-5 max-w-md font-sans text-[12.5px] font-light leading-[1.95] text-ivory-300/70">
                Eight decisions sit between a bundle of hair and a hairline nobody can find:
                install, lace, frontpiece, cap, density, length, texture, colour — and the
                finishing after that. The options sheet prices every one of them.
              </p>
              <Magnetic strength={0.16}>
                <Link to="/services/wigs/options" className="btn-gold group mt-8">
                  Open the options sheet
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                    strokeWidth={1.4}
                  />
                </Link>
              </Magnetic>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <ul className="grid grid-cols-2 gap-px border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-3">
                {WIG_GROUPS.map((group, index) => (
                  <li key={group.id} className="bg-ink-950/70 p-4">
                    <span className="font-display text-xs italic text-gold-200/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-2 block font-sans text-[10px] uppercase tracking-[0.18em] text-ivory-200">
                      {group.name}
                    </span>
                    <span className="mt-1 block font-sans text-[9px] leading-snug text-ivory-500">
                      {group.options.length} options
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-sans text-[10px] font-light leading-relaxed text-ivory-500">
                From {formatPrice(WIG_BASE.price)} for a glueless closure install · hair priced by the inch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="bg-ink-950 py-16">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl font-light text-ivory-100">
              Not sure which room to book?
            </p>
            <p className="mt-2 font-sans text-[10.5px] font-light tracking-wide text-ivory-400">
              {HOUSE.phone} · {HOUSE.hours}
            </p>
          </div>
          <Magnetic strength={0.16}>
            <Link to="/book" className="btn-gold group">
              Book a service
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                strokeWidth={1.4}
              />
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
