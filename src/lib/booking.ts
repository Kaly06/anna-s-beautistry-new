import type { MenuItem, MenuItemOption } from '../types';
import type { PiercingConsent } from './piercingConsent';
import { supabase } from './supabase';

export const PARTIAL_PAYMENT_RATE = 0.3;
export const BOOKING_HOLD_MINUTES = 30;
export const SLOT_STEP_MINUTES = 30;

export interface BusySlot {
  startsAt: string;
  endsAt: string;
  /** 'booking' for a client booking/hold, 'closure' for a period Anna blocked off herself. */
  kind?: 'booking' | 'closure';
  /** For closures: the label she chose, e.g. 'Busy' or 'Closed'. */
  reason?: string | null;
}

/**
 * Opening hours per weekday (Date.getDay).
 *
 * Monday and Tuesday are closed. Saturday and Sunday are shorter days.
 * On any open day she can still block a period from
 * the admin page; that is a closure, not a change to the week.
 */
export function openingHoursForDate(dateISO: string): { open: number; close: number } | null {
  if (!dateISO) return null;
  const day = new Date(`${dateISO}T00:00:00.000Z`).getUTCDay();
  if (Number.isNaN(day)) return null;
  if (day === 1 || day === 2) return null; // Monday, Tuesday — closed
  if (day === 6 || day === 0) return { open: 10 * 60, close: 16 * 60 }; // Saturday, Sunday
  return { open: 9 * 60, close: 19 * 60 }; // Wednesday, Thursday, Friday
}

export type BookingStatus =
  | 'pending_partial_payment'
  | 'partial_payment_submitted'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'completed';

export interface BookingHold {
  bookingId: string;
  bookingReference: string;
  serviceSlug: string;
  serviceName: string;
  roomId: string;
  selectedOption: string | null;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  totalStartingPriceGhs: number;
  depositDueGhs: number;
  balanceDueGhs: number;
  status: BookingStatus;
  paymentReference?: string | null;
  holdExpiresAt: string | null;
}

interface RpcBusySlot {
  starts_at: string;
  ends_at: string;
  kind?: 'booking' | 'closure' | null;
  reason?: string | null;
}

interface RpcBookingHold {
  booking_id: string;
  booking_reference: string;
  service_slug: string;
  service_name: string;
  room_id: string;
  selected_option: string | null;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  total_starting_price_ghs: number | string;
  deposit_due_ghs: number | string;
  balance_due_ghs: number | string;
  status: BookingStatus;
  payment_reference?: string | null;
  hold_expires_at: string | null;
}

interface RpcPaymentReferenceResult {
  booking_id: string;
  booking_reference: string;
  status: BookingStatus;
  payment_reference: string | null;
  hold_expires_at: string | null;
}

export interface StartSlot {
  value: string;
  label: string;
  endLabel: string;
  available: boolean;
  reason?: 'past' | 'booked' | 'busy';
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function normalizeBooking(row: RpcBookingHold): BookingHold {
  return {
    bookingId: row.booking_id,
    bookingReference: row.booking_reference,
    serviceSlug: row.service_slug,
    serviceName: row.service_name,
    roomId: row.room_id,
    selectedOption: row.selected_option,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    durationMinutes: Number(row.duration_minutes),
    totalStartingPriceGhs: Number(row.total_starting_price_ghs),
    depositDueGhs: Number(row.deposit_due_ghs),
    balanceDueGhs: Number(row.balance_due_ghs),
    status: row.status,
    paymentReference: row.payment_reference ?? null,
    holdExpiresAt: row.hold_expires_at,
  };
}

/** Ghana stays on UTC all year, so UTC ISO strings are Ghana wall-clock time. */
export function todayInGhanaISO(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isClosedDate(dateISO: string): boolean {
  return openingHoursForDate(dateISO) === null && Boolean(dateISO);
}

export function formatMinutesLabel(totalMinutes: number): string {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${pad2(minute)} ${suffix}`;
}

export function formatGhanaDate(dateISO: string): string {
  if (!dateISO) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateISO}T12:00:00.000Z`));
}

export function formatAppointmentWindow(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(start);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date} · ${time.format(start)}–${time.format(end)} (Ghana time)`;
}

export function formatHoldExpiry(holdExpiresAt: string | null): string {
  if (!holdExpiresAt) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(holdExpiresAt));
}

export function makeGhanaStartISO(dateISO: string, timeValue: string): string {
  return `${dateISO}T${timeValue}:00.000Z`;
}

export function generateStartSlots(
  dateISO: string,
  durationMinutes: number,
  busySlots: BusySlot[],
  now = new Date(),
): StartSlot[] {
  const hours = openingHoursForDate(dateISO);
  if (!dateISO || durationMinutes <= 0 || !hours) return [];

  const dayStartMs = Date.parse(`${dateISO}T00:00:00.000Z`);
  if (!Number.isFinite(dayStartMs)) return [];

  const busyRanges = busySlots
    .map((slot) => ({
      start: Date.parse(slot.startsAt),
      end: Date.parse(slot.endsAt),
      kind: slot.kind ?? 'booking',
    }))
    .filter((range) => Number.isFinite(range.start) && Number.isFinite(range.end));

  const slots: StartSlot[] = [];
  for (
    let startMinutes = hours.open;
    startMinutes + durationMinutes <= hours.close;
    startMinutes += SLOT_STEP_MINUTES
  ) {
    const startMs = dayStartMs + startMinutes * 60_000;
    const endMs = startMs + durationMinutes * 60_000;
    const isPast = startMs <= now.getTime();
    const overlapsBooking = busyRanges.some(
      (range) => range.kind === 'booking' && startMs < range.end && range.start < endMs,
    );
    const overlapsClosure = busyRanges.some(
      (range) => range.kind === 'closure' && startMs < range.end && range.start < endMs,
    );
    const overlaps = overlapsBooking || overlapsClosure;
    slots.push({
      value: `${pad2(Math.floor(startMinutes / 60))}:${pad2(startMinutes % 60)}`,
      label: formatMinutesLabel(startMinutes),
      endLabel: formatMinutesLabel(startMinutes + durationMinutes),
      available: !isPast && !overlaps,
      reason: isPast ? 'past' : overlapsClosure ? 'busy' : overlapsBooking ? 'booked' : undefined,
    });
  }
  return slots;
}

export function getStartingPrice(item: MenuItem, option?: MenuItemOption | null): number {
  return typeof option?.minPrice === 'number' ? option.minPrice : item.price;
}

export function calculatePartialPayment(totalStartingPrice: number): {
  depositDue: number;
  balanceDue: number;
} {
  const depositDue = Math.round(totalStartingPrice * PARTIAL_PAYMENT_RATE * 100) / 100;
  const balanceDue = Math.round((totalStartingPrice - depositDue) * 100) / 100;
  return { depositDue, balanceDue };
}

export async function fetchBusySlots(dateISO: string): Promise<BusySlot[]> {
  const rangeStart = `${dateISO}T00:00:00.000Z`;
  const rangeEnd = `${addDaysISO(dateISO, 1)}T00:00:00.000Z`;
  const { data, error } = await supabase.rpc('get_busy_slots', {
    p_range_start: rangeStart,
    p_range_end: rangeEnd,
  });
  if (error) throw new Error(error.message);

  const slots: BusySlot[] = ((data ?? []) as RpcBusySlot[]).map((slot) => ({
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
    kind: slot.kind === 'closure' ? 'closure' : 'booking',
    reason: slot.reason ?? null,
  }));

  // Anna's own blocked-off periods live in studio_closures. The newer
  // get_busy_slots already unions them in; reading the table directly keeps
  // closures working even before that database update is applied. If the
  // table does not exist yet, booking simply falls back to bookings only.
  try {
    const { data: closures, error: closureError } = await supabase
      .from('studio_closures')
      .select('starts_at, ends_at, reason')
      .lt('starts_at', rangeEnd)
      .gt('ends_at', rangeStart);
    if (!closureError && closures) {
      for (const closure of closures as { starts_at: string; ends_at: string; reason: string | null }[]) {
        slots.push({
          startsAt: closure.starts_at,
          endsAt: closure.ends_at,
          kind: 'closure',
          reason: closure.reason ?? 'Busy',
        });
      }
    }
  } catch {
    // Table not created yet — ignore and use bookings only.
  }

  const seen = new Set<string>();
  return slots.filter((slot) => {
    const key = `${slot.kind}|${slot.startsAt}|${slot.endsAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface CreateBookingHoldInput {
  serviceSlug: string;
  selectedOption: string | null;
  customerName: string;
  customerPhone: string;
  notes: string;
  startsAt: string;
  piercingConsent: PiercingConsent | null;
}

export async function createBookingHold(input: CreateBookingHoldInput): Promise<BookingHold> {
  const { data, error } = await supabase.rpc('create_booking_hold', {
    p_service_slug: input.serviceSlug,
    p_selected_option: input.selectedOption,
    p_customer_name: input.customerName,
    p_customer_phone: input.customerPhone,
    p_notes: input.notes,
    p_starts_at: input.startsAt,
    p_piercing_consent: input.piercingConsent,
  });
  if (error) throw new Error(error.message);
  const row = (data as RpcBookingHold[] | null)?.[0];
  if (!row) throw new Error('The booking could not be created. Please try again.');
  return normalizeBooking(row);
}

export async function fetchBookingPaymentStatus(bookingId: string): Promise<BookingHold | null> {
  const { data, error } = await supabase.rpc('get_booking_payment_status', {
    p_booking_id: bookingId,
  });
  if (error) throw new Error(error.message);
  const row = (data as RpcBookingHold[] | null)?.[0];
  return row ? normalizeBooking(row) : null;
}

export async function submitPartialPaymentReference(
  bookingId: string,
  paymentReference: string,
): Promise<RpcPaymentReferenceResult> {
  const { data, error } = await supabase.rpc('submit_partial_payment_reference', {
    p_booking_id: bookingId,
    p_payment_reference: paymentReference,
  });
  if (error) throw new Error(error.message);
  const row = (data as RpcPaymentReferenceResult[] | null)?.[0];
  if (!row) throw new Error('The payment reference could not be saved. Please try again.');
  return row;
}
