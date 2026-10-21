import { Check } from 'lucide-react';
import type { MenuItem, MenuItemOption } from '../types';
import { formatPriceRange } from '../data/house';

interface ServiceOptionsProps {
  item: MenuItem;
  selectedOption?: string;
  onSelectOption?: (option: MenuItemOption) => void;
  idPrefix: string;
  invalid?: boolean;
  errorId?: string;
}

export function optionPriceLabel(option: MenuItemOption): string {
  if (option.priceNote) return option.priceNote;
  if (typeof option.minPrice === 'number') {
    return formatPriceRange(option.minPrice, option.maxPrice);
  }
  return 'Varies';
}

export function bookingSearch(item: MenuItem, option?: MenuItemOption): string {
  const params = new URLSearchParams({ service: item.service });
  if (option) params.set('treatment', `${item.name} — ${option.name} (${optionPriceLabel(option)})`);
  return `?${params.toString()}`;
}

export default function ServiceOptions({
  item,
  selectedOption,
  onSelectOption,
  idPrefix,
  invalid = false,
  errorId,
}: ServiceOptionsProps) {
  if (!item.options?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p
          className={`font-sans text-[9px] uppercase tracking-[0.26em] ${
            invalid ? 'text-rose-200' : 'text-gold-300/80'
          }`}
        >
          Choose an option
        </p>
        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-500">
          {item.options.length} choices
        </p>
      </div>

      <ul
        className={`mt-3 space-y-2 transition-shadow duration-300 ${
          invalid ? 'shadow-[0_0_0_1px_rgba(253,164,175,0.55),0_0_28px_rgba(244,63,94,0.12)]' : ''
        }`}
        role="radiogroup"
        aria-label={`Options for ${item.name}`}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        aria-required="true"
      >
        {item.options.map((option) => {
          const selected = selectedOption === option.name;
          return (
            <li key={option.name}>
              <button
                id={`${idPrefix}-${option.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectOption?.(option)}
                className={`flex w-full items-center gap-3 border px-3.5 py-3 text-left transition-all duration-300 ease-luxe sm:px-4 ${
                  selected
                    ? 'border-gold-300/70 bg-gold-400/[0.12] shadow-[0_0_24px_rgba(212,175,55,0.08)]'
                    : 'border-ivory-100/10 bg-ink-800/55 hover:border-gold-300/35 hover:bg-ink-800'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    selected
                      ? 'border-gold-300 bg-gold-400 text-ink-950'
                      : 'border-ivory-100/25 text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3" strokeWidth={2} />
                </span>
                <span
                  className={`min-w-0 flex-1 font-sans text-[11.5px] font-light leading-snug tracking-wide transition-colors duration-300 ${
                    selected ? 'text-ivory-50' : 'text-ivory-200'
                  }`}
                >
                  {option.name}
                </span>
                <span className="shrink-0 text-right font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-gold-200">
                  {optionPriceLabel(option)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
