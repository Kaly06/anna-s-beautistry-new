import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Phone, RefreshCcw } from 'lucide-react';
import { formatPrice } from '../data/house';
import { formatAppointmentWindow } from '../lib/booking';
import { supabase } from '../lib/supabase';

interface StudioBooking {
  id: string;
  booking_reference: string;
  service_name: string;
  selected_option: string | null;
  customer_name: string;
  customer_phone: string;
  notes: string;
  starts_at: string;
  ends_at: string;
  status: string;
  total_starting_price_ghs: number | string;
  deposit_due_ghs: number | string;
  balance_due_ghs: number | string;
  payment_reference: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending_partial_payment: 'Holding — no payment yet',
  partial_payment_submitted: 'Reference sent — check it',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  expired: 'Hold expired',
  completed: 'Done',
};

/** Green for money in, gold for waiting on a human, grey for nothing to do. */
function statusTone(status: string): string {
  if (status === 'confirmed' || status === 'completed') return 'border-emerald-300/40 text-emerald-200';
  if (status === 'pending_partial_payment' || status === 'partial_payment_submitted')
    return 'border-gold-300/50 text-gold-100';
  return 'border-ivory-100/20 text-ivory-400';
}

function asNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function friendlyListError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  if (lower.includes('permission') || lower.includes('row-level security') || lower.includes('policy')) {
    return 'This account is signed in but is not allowed to read bookings yet. The database update that grants that permission still needs applying.';
  }
  if (lower.includes('relation') || lower.includes('schema cache')) {
    return 'The bookings table is not readable yet. A database update may still need applying.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Could not reach the database. Check your connection and tap refresh.';
  }
  return message || 'Something went wrong loading the bookings.';
}

/**
 * Anna's list. Deliberately plain: when, who, what, how much is still owed.
 * Sorted by what is happening next, because that is the question she actually
 * has when she opens this on a phone between clients.
 */
export default function AdminBookings() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('bookings')
      .select(
        'id, booking_reference, service_name, selected_option, customer_name, customer_phone, notes, starts_at, ends_at, status, total_starting_price_ghs, deposit_due_ghs, balance_due_ghs, payment_reference',
      )
      .order('starts_at', { ascending: true })
      .limit(200);

    if (queryError) {
      setError(friendlyListError(queryError));
      setBookings([]);
    } else {
      setBookings((data ?? []) as StudioBooking[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { upcoming, past, unpaid } = useMemo(() => {
    const now = Date.now();
    const live = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'expired');
    return {
      upcoming: live.filter((b) => Date.parse(b.ends_at) >= now),
      past: live
        .filter((b) => Date.parse(b.ends_at) < now)
        .sort((a, b) => Date.parse(b.starts_at) - Date.parse(a.starts_at))
        .slice(0, 10),
      unpaid: live.filter(
        (b) =>
          Date.parse(b.ends_at) >= now &&
          b.status !== 'confirmed' &&
          b.status !== 'completed',
      ).length,
    };
  }, [bookings]);

  return (
    <div className="mt-8 border border-ivory-100/10 bg-ink-900/60 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-200">Bookings</p>
          <p className="mt-2 font-sans text-[12px] font-light text-ivory-300/75">
            {loading
              ? 'Loading…'
              : `${upcoming.length} coming up${unpaid > 0 ? ` · ${unpaid} still to confirm` : ''}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 border border-ivory-100/15 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-400 transition-colors hover:border-gold-300/40 hover:text-gold-200"
        >
          <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.4} />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="mt-6 flex items-center gap-3 font-sans text-[12px] font-light text-ivory-400">
          <Loader2 className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.5} />
          Loading bookings…
        </p>
      ) : error ? (
        <p role="alert" className="mt-6 font-sans text-[11.5px] leading-relaxed text-rose-200">
          {error}
        </p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 font-sans text-[12px] font-light leading-relaxed text-ivory-400">
          No bookings yet. When someone books on the site, they appear here — and they
          also message you on WhatsApp.
        </p>
      ) : (
        <>
          {upcoming.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {upcoming.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </ul>
          ) : (
            <p className="mt-6 font-sans text-[12px] font-light leading-relaxed text-ivory-400">
              Nothing coming up. Past bookings are below.
            </p>
          )}

          {past.length > 0 ? (
            <>
              <p className="mt-10 font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-500">
                Recently finished
              </p>
              <ul className="mt-4 space-y-3 opacity-70">
                {past.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: StudioBooking }) {
  const total = asNumber(booking.total_starting_price_ghs);
  const balance = asNumber(booking.balance_due_ghs);
  const deposit = asNumber(booking.deposit_due_ghs);
  const isSettled = booking.status === 'confirmed' || booking.status === 'completed';

  return (
    <li className="border border-ivory-100/10 bg-ink-950/60 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-sans text-[12px] font-medium text-ivory-100">
            {booking.customer_name}
          </p>
          <p className="mt-1 font-sans text-[11px] font-light leading-relaxed text-ivory-400">
            {formatAppointmentWindow(booking.starts_at, booking.ends_at)}
          </p>
        </div>
        <span
          className={`shrink-0 border px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.16em] ${statusTone(booking.status)}`}
        >
          {STATUS_LABEL[booking.status] ?? booking.status}
        </span>
      </div>

      <p className="mt-3 font-sans text-[11.5px] font-light text-ivory-200">
        {booking.service_name}
        {booking.selected_option ? ` — ${booking.selected_option}` : ''}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[11px] font-light text-ivory-400">
        <a
          href={`tel:${booking.customer_phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-1.5 text-gold-200 hover:text-gold-100"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.4} />
          {booking.customer_phone}
        </a>
        <span>
          Total {formatPrice(total)} · deposit {formatPrice(deposit)} ·{' '}
          <span className={isSettled ? 'text-ivory-300' : 'text-gold-200'}>
            balance {formatPrice(balance)}
          </span>
        </span>
        <span className="text-ivory-500">{booking.booking_reference}</span>
      </div>

      {booking.payment_reference ? (
        <p className="mt-2 font-sans text-[11px] font-light text-ivory-300/70">
          Payment reference: <span className="text-ivory-100">{booking.payment_reference}</span>
        </p>
      ) : null}

      {booking.notes.trim() ? (
        <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-ivory-400">
          Note: {booking.notes}
        </p>
      ) : null}
    </li>
  );
}
