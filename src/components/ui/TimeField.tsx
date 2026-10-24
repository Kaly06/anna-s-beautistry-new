import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Clock } from 'lucide-react';

/**
 * A time picker that belongs to this site.
 *
 * The browser's own <input type="time"> opens a system widget — on Windows a
 * grey spinner list, on Android a clock dial — which looks like it was pasted
 * in from another decade. It cannot be styled, only tolerated.
 *
 * So this is a button and a panel: half-hour steps across a studio day, in the
 * house colours, keyboard-friendly, and closing on Escape or an outside click.
 * The value it reports is still plain 24-hour "HH:MM", so nothing downstream
 * has to change.
 */

const START_MINUTES = 6 * 60; // 06:00
const END_MINUTES = 21 * 60; // 21:00
const STEP = 30;

const OPTIONS: string[] = [];
for (let minutes = START_MINUTES; minutes <= END_MINUTES; minutes += STEP) {
  const hours = Math.floor(minutes / 60);
  OPTIONS.push(`${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
}

/** "14:30" → "2:30 PM". Falls back to the raw value if it is not a time. */
function formatTimeLabel(value: string): string {
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const suffix = hours < 12 ? 'AM' : 'PM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

interface TimeFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimeField({ id, label, value, onChange }: TimeFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // An off-grid value (a 09:15 closure made before this picker existed) still
  // has to be visible and selectable, so it joins the list rather than being
  // silently rounded to the nearest half hour.
  const options = OPTIONS.includes(value) || !value ? OPTIONS : [...OPTIONS, value].sort();

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

  // Opening lands the eye (and the keyboard) on the current value.
  useEffect(() => {
    if (!open) return;
    const active = panel.current?.querySelector<HTMLElement>('[data-selected="true"]');
    active?.scrollIntoView({ block: 'center' });
    active?.focus();
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <button
        id={fieldId}
        ref={trigger}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`mt-3 flex w-full items-center justify-between gap-3 border-b pb-3 text-left font-display text-xl font-light transition-colors duration-500 ${
          open ? 'border-gold-300/70 text-ivory-50' : 'border-ivory-100/20 text-ivory-50'
        }`}
      >
        <span className="flex items-center gap-3">
          <Clock className="h-4 w-4 shrink-0 text-gold-300/70" strokeWidth={1.4} />
          {formatTimeLabel(value)}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ivory-500 transition-transform duration-300 ${
            open ? 'rotate-180 text-gold-200' : ''
          }`}
          strokeWidth={1.4}
        />
      </button>

      {open ? (
        <div
          ref={panel}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto border border-gold-300/25 bg-ink-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                data-selected={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-sans text-[12px] tracking-wide transition-colors duration-200 ${
                  selected
                    ? 'bg-gold-400/10 text-gold-100'
                    : 'text-ivory-300 hover:bg-gold-400/[0.06] hover:text-gold-100'
                }`}
              >
                {formatTimeLabel(option)}
                {selected ? <Check className="h-3.5 w-3.5" strokeWidth={1.6} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
