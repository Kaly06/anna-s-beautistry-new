import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { EASE } from '../lib/animations';

export interface BookingSelectOption {
  value: string;
  label: string;
  /** Optional right-hand/under-line detail, e.g. "2 hr · from GH₵ 90". */
  meta?: string;
}

interface BookingSelectProps {
  id?: string;
  value: string;
  options: BookingSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * The booking dropdown — a house-styled replacement for the native <select>,
 * whose option list the browser draws in OS colours (light-blue highlight)
 * no matter what classes you put on it. Mirrors BookingCalendar: underline
 * field trigger, solid deep-purple panel, gold hover, gold check on the
 * chosen row. Fully keyboard-operable (arrows, Home/End, Enter, Escape).
 */
export default function BookingSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Choose one',
  ariaLabel,
}: BookingSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = options.find((option) => option.value === value);

  // Close on outside click or Escape (same pattern as BookingCalendar).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // When the panel opens, rest keyboard focus on the chosen row.
  useEffect(() => {
    if (!open) return;
    const index = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    const raf = requestAnimationFrame(() => {
      optionRefs.current[index]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
    rootRef.current
      ?.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]')
      ?.focus({ preventScroll: true });
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    const current = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown') nextIndex = Math.min(options.length - 1, current + 1);
    if (event.key === 'ArrowUp') nextIndex = Math.max(0, current - 1);
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus({ preventScroll: true });
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className="field mt-3 flex cursor-pointer items-center justify-between gap-4 text-left"
      >
        <span className="min-w-0">
          <span className={`block leading-snug ${selected ? '' : 'text-ivory-500/50'}`}>
            {selected ? selected.label : placeholder}
          </span>
          {selected?.meta ? (
            <span className="mt-1 block font-sans text-[10px] font-light uppercase tracking-[0.18em] text-gold-300/70">
              {selected.meta}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-all duration-500 ease-luxe ${
            open ? 'rotate-180 text-gold-200' : 'text-gold-300/70'
          }`}
          strokeWidth={1.4}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            onKeyDown={onListKeyDown}
            className="absolute left-0 right-0 top-full z-40 mt-3 max-h-[19rem] origin-top overflow-y-auto border border-gold-300/20 bg-ink-900 py-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => pick(option.value)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors duration-300 focus:outline-none ${
                    isSelected
                      ? 'bg-gold-400/15 text-gold-100'
                      : 'text-ivory-100 hover:bg-gold-400/10 hover:text-gold-100 focus:bg-gold-400/10 focus:text-gold-100'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-light leading-snug">
                      {option.label}
                    </span>
                    {option.meta ? (
                      <span
                        className={`mt-0.5 block font-sans text-[9.5px] font-light uppercase tracking-[0.18em] ${
                          isSelected ? 'text-gold-200/90' : 'text-ivory-400'
                        }`}
                      >
                        {option.meta}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Check className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
                  ) : null}
                </button>
              );
            })}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
