import type { MenuItem, MenuItemOption } from '../types';
import type { PiercingConsent } from '../components/PiercingConsentForm';
import { supabase } from './supabase';

export const PARTIAL_PAYMENT_RATE = 0.3;
export const BOOKING_HOLD_MINUTES = 30;
export const SLOT_STEP_MINUTES = 30;

const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 19 * 60;

export interface BusySlot {
  startsAt: string;
  endsAt: string;
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
  reason?: 'past' | 'booked';
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
  if (!dateISO) return false;
  const day = new Date(`${dateISO}T00:00:00.000Z`).getUTCDay();
  return day === 0 || day === 1; // Sunday or Monday
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
  if (!dateISO || durationMinutes <= 0 || isClosedDate(dateISO)) return [];

  const dayStartMs = Date.parse(`${dateISO}T00:00:00.000Z`);
  if (!Number.isFinite(dayStartMs)) return [];

  const busyRanges = busySlots
    .map((slot) => ({ start: Date.parse(slot.startsAt), end: Date.parse(slot.endsAt) }))
    .filter((range) => Number.isFinite(range.start) && Number.isFinite(range.end));

  const slots: StartSlot[] = [];
  for (
    let startMinutes = OPEN_MINUTES;
    startMinutes + durationMinutes <= CLOSE_MINUTES;
    startMinutes += SLOT_STEP_MINUTES
  ) {
    const startMs = dayStartMs + startMinutes * 60_000;
    const endMs = startMs + durationMinutes * 60_000;
    const isPast = startMs <= now.getTime();
    const overlaps = busyRanges.some((range) => startMs < range.end && range.start < endMs);
    slots.push({
      value: `${pad2(Math.floor(startMinutes / 60))}:${pad2(startMinutes % 60)}`,
      label: formatMinutesLabel(startMinutes),
      endLabel: formatMinutesLabel(startMinutes + durationMinutes),
      available: !isPast && !overlaps,
      reason: isPast ? 'past' : overlaps ? 'booked' : undefined,
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
  const { data, error } = await supabase.rpc('get_busy_slots', {
    p_range_start: `${dateISO}T00:00:00.000Z`,
    p_range_end: `${addDaysISO(dateISO, 1)}T00:00:00.000Z`,
  });
  if (error) throw new Error(error.message);
  return ((data ?? []) as RpcBusySlot[]).map((slot) => ({
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
  }));
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
