import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A date picker that belongs to this site.
 *
 * The native <input type="date"> pop-up is drawn by the browser, not the page:
 * on Chrome it opens a white calendar no matter how dark the site is.
 * `color-scheme: dark` is meant to fix that, and on some builds it simply does
 * not — which is exactly what happened here. So the calendar is ours now.
 *
 * Values in and out are plain "YYYY-MM-DD" strings, the same shape the native
 * input produced, so the form logic around it is untouched.
 */

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function parseISO(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateLabel(value: string): string {
  const date = parseISO(value);
  if (!date) return value || 'Choose a date';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  return `${weekday} ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

/** Monday-first grid, padded with nulls so the first weekday lands in its column. */
function buildGrid(year: number, month: number): Array<number | null> {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  return cells;
}

interface DateFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable day, "YYYY-MM-DD". */
  min?: string;
  /** Latest selectable day, "YYYY-MM-DD". */
  max?: string;
}

export default function DateField({ id, label, value, onChange, min, max }: DateFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);

  const selected = parseISO(value);
  const [viewYear, setViewYear] = useState(() => (selected ?? new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (selected ?? new Date()).getMonth());

  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event: MouseEvent | TouchEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('touchstart', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('touchstart', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const openPanel = () => {
    const anchor = parseISO(value) ?? new Date();
    setViewYear(anchor.getFullYear());
    setViewMonth(anchor.getMonth());
    setOpen(true);
  };

  const stepMonth = (direction: 1 | -1) => {
    const next = new Date(viewYear, viewMonth + direction, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const todayISO = toISO(new Date());
  const cells = buildGrid(viewYear, viewMonth);

  return (
    <div ref={wrapper} className="relative">
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <button
        id={fieldId}
        ref={trigger}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`mt-3 flex w-full items-center justify-between gap-3 border-b pb-3 text-left font-display text-xl font-light transition-colors duration-500 ${
          open ? 'border-gold-300/70 text-ivory-50' : 'border-ivory-100/20 text-ivory-50'
        }`}
      >
        <span className={value ? '' : 'text-ivory-500/60'}>{formatDateLabel(value)}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-gold-300/70" strokeWidth={1.4} />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 z-40 mt-2 w-[19rem] border border-gold-300/25 bg-ink-900 p-4 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.95)]"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              aria-label="Previous month"
              className="p-1 text-ivory-400 transition-colors hover:text-gold-200"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold-200">
              {MONTHS[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              aria-label="Next month"
              className="p-1 text-ivory-400 transition-colors hover:text-gold-200"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="pb-1 text-center font-sans text-[8px] uppercase tracking-[0.14em] text-ivory-500"
              >
                {day}
              </span>
            ))}

            {cells.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />;
              const iso = toISO(new Date(viewYear, viewMonth, day));
              const disabled = Boolean((min && iso < min) || (max && iso > max));
              const isSelected = iso === value;
              const isToday = iso === todayISO;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                    trigger.current?.focus();
                  }}
                  className={`h-8 w-full font-sans text-[11px] tabular-nums transition-colors duration-200 disabled:cursor-not-allowed disabled:text-ivory-500/30 ${
                    isSelected
                      ? 'bg-gold-400 text-ink-950'
                      : isToday
                        ? 'border border-gold-300/40 text-gold-100 hover:bg-gold-400/10'
                        : 'text-ivory-300 hover:bg-gold-400/10 hover:text-gold-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-ivory-100/10 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-500 transition-colors hover:text-gold-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                if (todayISO >= (min ?? '') && todayISO <= (max ?? '9999-12-31')) {
                  onChange(todayISO);
                  setOpen(false);
                  trigger.current?.focus();
                }
              }}
              className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold-200 transition-colors hover:text-gold-100"
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
