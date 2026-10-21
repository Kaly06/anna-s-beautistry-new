import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { MenuItem } from '../types';
import { formatDuration, formatPrice } from '../data/house';
import { specimen } from '../lib/specimens';
import { EASE } from '../lib/animations';
import Specimen from './ui/Specimen';
import { bookingSearch, optionPriceLabel } from './ServiceOptions';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  selectedOption?: string;
}

export default function MenuCard({ item, index, selectedOption }: MenuCardProps) {
  const selected = item.options?.find((option) => option.name === selectedOption);
  const serviceHref = `/services/${item.service}/${item.slug}`;
  const hasOptions = Boolean(item.options?.length);

  return (
    <m.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ duration: 1.0, ease: EASE, delay: (index % 3) * 0.07 }}
      className="group"
    >
      <Link
        to={serviceHref}
        className="block w-full text-left"
        aria-label={`${hasOptions ? 'Choose an option for' : 'View'} ${item.name}, ${
          item.priceFrom ? 'from ' : ''
        }${formatPrice(item.price)}`}
      >
        <div className="relative overflow-hidden border border-ivory-100/[0.08] bg-[radial-gradient(120%_100%_at_50%_0%,#341b4e_0%,#200b35_52%,#170429_100%)] transition-colors duration-700 ease-luxe group-hover:border-gold-300/35">
          <div className="pointer-events-none absolute inset-4 border border-ivory-100/[0.06] transition-colors duration-700 group-hover:border-gold-300/20" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.06] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

          <span className="absolute left-5 top-5 z-10 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
            {String(index + 1).padStart(2, '0')}
          </span>

          {item.tag ? (
            <span className="absolute right-5 top-5 z-10 border border-gold-300/30 bg-ink-950/60 px-2.5 py-1 font-sans text-[8px] uppercase tracking-[0.24em] text-gold-200">
              {item.tag}
            </span>
          ) : null}

          <div className="aspect-[4/5]">
            {item.image ? (
              <img
                src={item.image}
                alt={`${item.name} — ${item.tagline}`}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.06] ${
                  item.focus === 'attention' ? 'object-[50%_38%]' : 'object-center'
                }`}
              />
            ) : (
              <div className="relative h-full w-full p-9">
                <Specimen
                  prims={specimen(item.service, item.variant)}
                  id={`card-${item.slug}`}
                  strokeWidth={1.1}
                  className="h-full w-full transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.05]"
                />
                <span className="absolute inset-x-0 bottom-4 text-center font-sans text-[8px] uppercase tracking-[0.28em] text-ivory-500">
                  Study drawing
                </span>
              </div>
            )}
          </div>

          {item.image ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/85 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between px-5 pb-5 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-200">
              {hasOptions ? 'Choose an option' : 'View service'}
            </span>
            <span className="h-px w-8 bg-gold-300/60" />
          </div>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <h3 className="font-display text-2xl font-light leading-tight text-ivory-50">
            <Link
              to={serviceHref}
              className="transition-colors duration-300 hover:text-gold-100"
            >
              {item.name}
            </Link>
          </h3>
          <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.2em] text-gold-300/70">
            {formatDuration(item.duration)}
          </p>
          <p className="mt-1.5 font-sans text-[10.5px] font-light leading-relaxed tracking-wide text-ivory-400">
            {item.tagline}
          </p>
        </div>
        <span className="shrink-0 text-right">
          <span className="block font-sans text-[8px] uppercase tracking-[0.24em] text-ivory-500">
            {selected ? 'Selected' : item.priceFrom ? 'From' : 'Price'}
          </span>
          <span className="block font-display text-lg leading-tight text-gold-200">
            {selected ? optionPriceLabel(selected) : formatPrice(item.price)}
          </span>
        </span>
      </div>

      {hasOptions ? (
        <div className="mt-5 border-t border-ivory-100/10 pt-4">
          {selected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-sans text-[10px] font-light tracking-wide text-ivory-400">
                <span className="uppercase tracking-[0.2em] text-gold-300/80">Selected · </span>
                {selected.name}
              </p>
              <Link
                to={{ pathname: '/book', search: bookingSearch(item, selected) }}
                className="group/book inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200 transition-colors hover:text-gold-100"
              >
                Book selected
                <ArrowRight
                  className="h-3 w-3 transition-transform duration-500 ease-luxe group-hover/book:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          ) : (
            <p className="flex items-center justify-between gap-4 font-sans text-[9px] uppercase tracking-[0.22em] text-ivory-500">
              <span>{item.options!.length} options</span>
              <span className="text-gold-300/80">Click the image to choose</span>
            </p>
          )}
        </div>
      ) : null}
    </m.article>
  );
}
