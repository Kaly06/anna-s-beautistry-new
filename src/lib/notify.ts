import { HOUSE, formatPrice } from '../data/house';
import { formatAppointmentWindow } from './booking';
import type { BookingHold } from './booking';
import { supabase } from './supabase';

/**
 * Everything in this file exists for one reason: a booking is only real once
 * Anna knows about it. The site can save a row to Supabase all day, but she
 * does not sit in the Supabase dashboard — she sits in WhatsApp.
 *
 * Two paths, in order of importance:
 *   1. The customer taps a prefilled WhatsApp message to the studio. Free,
 *      instant, and on the app she already checks. They press send themselves.
 *   2. A quiet email to the studio inbox, as the safety net for anyone who
 *      never presses send. Best-effort: if the edge function is not deployed
 *      yet, nothing breaks and the customer is not blocked.
 */

export interface BookingCustomer {
  name: string;
  phone: string;
}

/**
 * The message the customer sends to Anna. Written in the customer's voice,
 * because they are the one tapping send. Short enough to read on a phone.
 */
export function buildBookingWhatsAppMessage(
  booking: BookingHold,
  customer: BookingCustomer,
  notes = '',
): string {
  const lines = [
    'Hello Anna, I have just booked on the website.',
    '',
    `Reference: ${booking.bookingReference}`,
    `Service: ${booking.serviceName}${
      booking.selectedOption ? ` — ${booking.selectedOption}` : ''
    }`,
    `When: ${formatAppointmentWindow(booking.startsAt, booking.endsAt)}`,
    `Total: ${formatPrice(booking.totalStartingPriceGhs)} · 30% to secure: ${formatPrice(
      booking.depositDueGhs,
    )}`,
    `Name: ${customer.name || 'Not given'}`,
    `WhatsApp: ${customer.phone || 'Not given'}`,
  ];
  if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
  lines.push('', 'Please send me the MoMo or transfer details.');
  return lines.join('\n');
}

/** A wa.me link with the message prefilled. */
export function buildWhatsAppBookingUrl(message: string): string {
  const base = HOUSE.whatsappHref.split('?')[0];
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Best-effort email to the studio. Returns false rather than throwing: the
 * customer must never see an error because our backup channel is offline.
 */
export async function emailBookingToStudio(
  booking: BookingHold,
  customer: BookingCustomer,
  notes = '',
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('notify-booking', {
      body: {
        bookingId: booking.bookingId,
        reference: booking.bookingReference,
        service: booking.serviceName,
        option: booking.selectedOption,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
        totalGhs: booking.totalStartingPriceGhs,
        depositGhs: booking.depositDueGhs,
        customerName: customer.name,
        customerPhone: customer.phone,
        notes,
      },
    });
    return !error;
  } catch {
    return false;
  }
}
