import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { MenuItem, MenuItemOption } from '../types';
import { formatDuration, formatPrice } from '../data/house';
import { specimen } from '../lib/specimens';
import { EASE } from '../lib/animations';
import Specimen from './ui/Specimen';
import ServiceOptions, { bookingSearch, optionPriceLabel } from './ServiceOptions';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  selectedOption?: string;
  onSelectOption?: (option: MenuItemOption) => void;
}

export default function MenuCard({
  item,
  index,
  selectedOption,
  onSelectOption,
}: MenuCardProps) {
  const [optionsOpen, setOptionsOpen] = useState(Boolean(item.options?.length));
  const selected = item.options?.find((option) => option.name === selectedOption);
  const optionsId = `${item.slug}-options`;
  const serviceHref = `/services/${item.service}/${item.slug}`;

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
        data-cursor="view"
        data-cursor-label="View"
        className="block w-full text-left"
        aria-label={`View ${item.name}, ${item.priceFrom ? 'from ' : ''}${formatPrice(item.price)}`}
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
              View service
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

      {item.options?.length ? (
        <div className="mt-5 border-t border-ivory-100/10 pt-4">
          <button
            type="button"
            aria-expanded={optionsOpen}
            aria-controls={optionsId}
            onClick={() => setOptionsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 font-sans text-[9px] uppercase tracking-[0.26em] text-gold-200 transition-colors duration-300 hover:text-gold-100"
          >
            <span>{optionsOpen ? 'Hide options' : `Show ${item.options.length} options`}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-500 ease-luxe ${
                optionsOpen ? 'rotate-180' : ''
              }`}
              strokeWidth={1.4}
            />
          </button>

          <AnimatePresence initial={false}>
            {optionsOpen ? (
              <m.div
                id={optionsId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <ServiceOptions
                    item={item}
                    selectedOption={selectedOption}
                    onSelectOption={onSelectOption}
                    idPrefix={`${item.slug}-card-option`}
                  />
                </div>
              </m.div>
            ) : null}
          </AnimatePresence>

          {selected ? (
            <div className="mt-4 border border-gold-300/25 bg-gold-400/[0.06] px-4 py-3">
              <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-ivory-500">
                Selected option
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="font-sans text-[11px] font-light tracking-wide text-ivory-100">
                  {selected.name}
                  <span className="text-ivory-500"> · {optionPriceLabel(selected)}</span>
                </p>
                <Link
                  to={{ pathname: '/', search: bookingSearch(item, selected), hash: '#book' }}
                  className="group/book inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200 transition-colors hover:text-gold-100"
                >
                  Book selected
                  <ArrowRight
                    className="h-3 w-3 transition-transform duration-500 ease-luxe group-hover/book:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-600">
              Select an option above
            </p>
          )}
        </div>
      ) : null}
    </m.article>
  );
}
