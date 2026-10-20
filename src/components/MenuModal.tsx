import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import type { MenuItem, MenuItemOption } from '../types';
import { formatDuration, formatPrice, HOUSE } from '../data/house';
import { rooms } from '../data/rooms';
import { specimen } from '../lib/specimens';
import { EASE } from '../lib/animations';
import Specimen from './ui/Specimen';
import ServiceOptions, { bookingSearch, optionPriceLabel } from './ServiceOptions';

interface MenuModalProps {
  item: MenuItem | null;
  selectedOption?: string;
  onSelectOption?: (option: MenuItemOption) => void;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
  indexLabel: string;
}

export default function MenuModal({
  item,
  selectedOption,
  onSelectOption,
  onClose,
  onNavigate,
  indexLabel,
}: MenuModalProps) {
  const selected = item?.options?.find((option) => option.name === selectedOption);

  return (
    <AnimatePresence>
      {item ? (
        <m.div
          key="menu-modal"
          className="fixed inset-0 z-[85] flex items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} — details`}
        >
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink-950/90 backdrop-blur-md"
          />

          <m.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-y-auto border border-ivory-100/10 bg-ink-900 sm:max-h-[88vh]"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ivory-100/10 bg-ink-900/95 px-5 py-4 backdrop-blur-md sm:px-8">
              <div className="flex items-center gap-3">
                <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/80">
                  {rooms[item.service].name}
                </span>
                <span className="h-px w-6 bg-ivory-100/20" />
                <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-400">
                  {indexLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  aria-label="Previous service"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-300 transition-colors hover:border-gold-300/60 hover:text-gold-200"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.3} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  aria-label="Next service"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-300 transition-colors hover:border-gold-300/60 hover:text-gold-200"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.3} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-1 flex h-9 w-9 items-center justify-center text-ivory-300 transition-colors hover:text-gold-200"
                >
                  <X className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>
            </div>

            <div className="grid flex-1 gap-0 md:grid-cols-2">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#341b4e_0%,#200b35_55%,#170429_100%)]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-full p-12">
                    <Specimen
                      prims={specimen(item.service, item.variant)}
                      id={`modal-${item.slug}`}
                      glow
                      strokeWidth={0.95}
                      className="h-full w-full"
                    />
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-5 text-center font-sans text-[8px] uppercase tracking-[0.28em] text-ivory-500">
                  {item.image ? item.tagline : 'Study drawing'}
                </span>
              </div>

              <div className="flex flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
                <div>
                  {item.tag ? (
                    <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/80">
                      {item.tag}
                    </p>
                  ) : null}
                  <h2 className="mt-3 font-display text-[clamp(2rem,3.6vw,3rem)] font-light leading-[1.05] text-ivory-50">
                    {item.name}
                  </h2>
                  <p className="mt-4 font-sans text-[12.5px] font-light leading-[1.95] text-ivory-300/70">
                    {item.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-y border-ivory-100/10 py-6">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                      {selected ? 'Selected option' : item.priceFrom ? 'From' : 'Price'}
                    </p>
                    <p className="mt-2 font-display text-3xl text-gold-200">
                      {selected ? optionPriceLabel(selected) : formatPrice(item.price)}
                    </p>
                    {selected ? (
                      <p className="mt-1 font-sans text-[10px] font-light tracking-wide text-ivory-400">
                        {selected.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                      <Clock className="h-3 w-3" strokeWidth={1.4} />
                      In the chair
                    </p>
                    <p className="mt-2 font-display text-3xl text-ivory-100">
                      {formatDuration(item.duration)}
                    </p>
                  </div>
                </div>

                {item.options?.length ? (
                  <ServiceOptions
                    item={item}
                    selectedOption={selectedOption}
                    onSelectOption={onSelectOption}
                    idPrefix={`${item.slug}-modal-option`}
                  />
                ) : null}

                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                    {item.options?.length ? 'Good to know' : 'Aftercare'}
                  </p>
                  <p className="mt-3 font-sans text-[12.5px] font-light leading-[1.95] text-ivory-300/70">
                    {item.note}
                  </p>
                </div>

                <Link
                  to={{ pathname: '/', search: bookingSearch(item, selected), hash: '#book' }}
                  onClick={onClose}
                  className="btn-gold group mt-auto self-start"
                >
                  {selected ? 'Book selected option' : 'Book this service'}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                    strokeWidth={1.4}
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-ivory-100/10 px-5 py-4 sm:px-8">
              <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-500">
                {HOUSE.hours}
              </p>
              <a
                href={HOUSE.phoneHref}
                className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-300 transition-colors hover:text-gold-200"
              >
                {HOUSE.phone}
              </a>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
