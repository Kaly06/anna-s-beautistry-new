import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { HOUSE } from '../data/house';
import type { BookingHold } from '../lib/booking';
import {
  buildBookingWhatsAppMessage,
  buildWhatsAppBookingUrl,
  type BookingCustomer,
} from '../lib/notify';

interface BookingWhatsAppCardProps {
  booking: BookingHold;
  customer: BookingCustomer;
  notes?: string;
  /** The payment reference has been entered, so "on hold" becomes "reserved". */
  paymentSubmitted?: boolean;
  /** The 30-minute hold ran out: never claim a time is still held. */
  expired?: boolean;
}

/**
 * The handoff. Until the customer presses send in WhatsApp, Anna's phone stays
 * silent — which is why this sits above the payment box rather than below it.
 */
export default function BookingWhatsAppCard({
  booking,
  customer,
  notes = '',
  paymentSubmitted = false,
  expired = false,
}: BookingWhatsAppCardProps) {
  const message = buildBookingWhatsAppMessage(booking, customer, notes);
  const href = buildWhatsAppBookingUrl(message);

  return (
    <div className="mt-5 border border-gold-300/45 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(212,175,55,0.16),rgba(23,4,41,0.35))] px-5 py-5">
      <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-100">
        <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
        One tap left — tell Anna
      </p>

      <p className="mt-3 font-sans text-[11px] font-light leading-relaxed text-ivory-200/85">
        {expired
          ? 'This hold has expired, so the time may have been released. Send the message anyway — Anna can move you to another slot on WhatsApp.'
          : paymentSubmitted
            ? 'Your reference is saved. Send the message below so Anna has your booking and can confirm the payment on WhatsApp.'
            : 'Your time is saved and held. Anna is only expecting you once this message reaches her.'}{' '}
        It opens WhatsApp with everything already written — just press send.
      </p>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="btn-gold group mt-4 inline-flex items-center gap-3"
      >
        Send this booking on WhatsApp
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.4}
        />
      </a>

      <details className="group mt-4">
        <summary className="cursor-pointer font-sans text-[10px] uppercase tracking-[0.18em] text-ivory-400 transition-colors hover:text-gold-200">
          See the message first
        </summary>
        <pre className="mt-3 whitespace-pre-wrap break-words border border-ivory-100/10 bg-ink-950/50 px-4 py-3 font-sans text-[11px] font-light leading-relaxed text-ivory-300/85">
          {message}
        </pre>
      </details>

      <p className="mt-3 font-sans text-[10px] font-light leading-relaxed text-ivory-400/80">
        No WhatsApp? Call or message the studio on{' '}
        <a
          href={HOUSE.phoneHref}
          className="text-gold-200 underline decoration-gold-300/40 underline-offset-4"
        >
          {HOUSE.phone}
        </a>{' '}
        and quote reference {booking.bookingReference}.
      </p>
    </div>
  );
}
