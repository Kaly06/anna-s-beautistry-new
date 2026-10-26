import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatGhanaDate } from '../lib/booking';
import { EASE } from '../lib/animations';

interface BookingCalendarProps {
  id?: string;
  /** Selected date as YYYY-MM-DD (Ghana wall-clock), or '' when unset. */
  value: string;
  /** Earliest selectable date as YYYY-MM-DD. */
  min: string;
  onChange: (dateISO: string) => void;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function parseISO(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

function dayOfWeek(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month, day)).getUTCDay();
}

function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month, 1)));
}

/**
 * The booking date picker — a house-styled calendar instead of the browser's
 * native date input, which cannot be themed. Mondays and Wednesdays (closed —
 * Anna teaches) and
 * past days are disabled; today is ringed; the chosen day fills gold.
 */
export default function BookingCalendar({ id, value, min, onChange }: BookingCalendarProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const minParts = useMemo(() => parseISO(min) ?? parseISO(value), [min, value]);
  const selectedParts = useMemo(() => parseISO(value), [value]);

  const [viewYear, setViewYear] = useState(() => (selectedParts ?? minParts)?.year ?? 2026);
  const [viewMonth, setViewMonth] = useState(() => (selectedParts ?? minParts)?.month ?? 0);

  // When the calendar opens, start from the selected month (or this month).
  useEffect(() => {
    if (!open) return;
    const base = selectedParts ?? minParts;
    if (base) {
      setViewYear(base.year);
      setViewMonth(base.month);
    }
  }, [open, selectedParts, minParts]);

  // Close on outside click or Escape.
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
  }, [open ]);

  const cells = useMemo(() => {
    const firstDow = dayOfWeek(viewYear, viewMonth, 1); // 0 = Sunday
    const lead = (firstDow + 6) % 7; // Monday-first offset
    const start = new Date(Date.UTC(viewYear, viewMonth, 1 - lead));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth();
      const day = d.getUTCDate();
      const iso = toISO(year, month, day);
      const dow = d.getUTCDay();
      const isClosedDay = dow === 1 || dow === 3; // Monday, Wednesday
      return {
        iso,
        day,
        inMonth: month === viewMonth,
        isClosedDay,
        isPast: iso < min,
        isToday: iso === min,
        isSelected: iso === value,
      };
    });
  }, [viewYear, viewMonth, min, value]);

  const canGoPrev = useMemo(() => {
    if (!minParts) return true;
    return viewYear * 12 + viewMonth > minParts.year * 12 + minParts.month;
  }, [viewYear, viewMonth, minParts]);

  function shiftMonth(delta: number) {
    const next = viewMonth + delta;
    setViewYear(viewYear + Math.floor(next / 12));
    setViewMonth(((next % 12) + 12) % 12);
  }

  function pick(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="field mt-3 flex items-center justify-between gap-4 text-left"
      >
        <span className={value ? '' : 'text-ivory-500/50'}>
          {value ? formatGhanaDate(value) : 'Choose a date'}
        </span>
        <CalendarDays
          className={`h-5 w-5 shrink-0 transition-colors duration-300 ${open ? 'text-gold-200' : 'text-gold-300/70'}`}
          strokeWidth={1.4}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            role="dialog"
            aria-label="Choose appointment date"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute left-0 top-full z-40 mt-3 w-[19.5rem] max-w-[86vw] origin-top-left border border-gold-300/20 bg-ink-900 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-ivory-50">{monthLabel(viewYear, viewMonth)}</p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={!canGoPrev}
                  onClick={() => shiftMonth(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory-100/15 text-ivory-200 transition-colors duration-300 hover:border-gold-300/60 hover:text-gold-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ivory-100/15 disabled:hover:text-ivory-200"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => shiftMonth(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory-100/15 text-ivory-200 transition-colors duration-300 hover:border-gold-300/60 hover:text-gold-200"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="flex h-7 items-center justify-center font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-gold-300/60"
                >
                  {day}
                </span>
              ))}
              {cells.map((cell) => {
                const disabled = cell.isPast || cell.isClosedDay;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    disabled={disabled}
                    aria-label={`${formatGhanaDate(cell.iso)}${cell.isClosedDay ? ' — studio closed' : ''}`}
                    aria-pressed={cell.isSelected}
                    title={cell.isClosedDay ? 'Closed on Mondays and Wednesdays' : undefined}
                    onClick={() => pick(cell.iso)}
                    className={`flex h-9 items-center justify-center rounded-full font-sans text-[12px] transition-colors duration-300 ${
                      cell.isSelected
                        ? 'bg-gold-400 font-semibold text-ink-950'
                        : disabled
                          ? 'cursor-not-allowed text-ivory-500/35'
                          : cell.inMonth
                            ? 'text-ivory-100 hover:bg-gold-400/15 hover:text-gold-100'
                            : 'text-ivory-500/50 hover:bg-gold-400/10 hover:text-gold-100'
                    } ${cell.isToday && !cell.isSelected ? 'ring-1 ring-inset ring-gold-300/70' : ''} ${
                      cell.isClosedDay && !cell.isSelected ? 'line-through decoration-rose-300/40' : ''
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-ivory-100/10 pt-3.5">
              <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-ivory-500">
                Closed Mon & Wed · Sat/Sun 10–4
              </p>
              <button
                type="button"
                onClick={() => pick(min)}
                className="font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-gold-200 transition-colors hover:text-gold-100"
              >
                Today
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
