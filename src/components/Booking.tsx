import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Clock3,
  Loader2 as LoaderCircle,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  TimerReset,
  Wallet,
} from 'lucide-react';
import {
  BOOKING_HOLD_MINUTES,
  calculatePartialPayment,
  createBookingHold,
  fetchBookingPaymentStatus,
  fetchBusySlots,
  formatAppointmentWindow,
  formatGhanaDate,
  formatHoldExpiry,
  generateStartSlots,
  getStartingPrice,
  isClosedDate,
  makeGhanaStartISO,
  submitPartialPaymentReference,
  todayInGhanaISO,
  type BookingHold,
  type BusySlot,
} from '../lib/booking';
import { EASE } from '../lib/animations';
import { HOUSE, formatDuration, formatPrice } from '../data/house';
import { menu } from '../data/menu';
import type { MenuItemOption, ServiceId } from '../types';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import PiercingConsentForm, {
  createEmptyPiercingConsent,
  inferPiercingPlacement,
  isPiercingAgeBlocked,
  type PiercingConsent,
} from './PiercingConsentForm';
import ServiceOptions, { optionPriceLabel } from './ServiceOptions';

const PENDING_BOOKING_KEY = 'annas-beautistry-pending-booking';

const ROOM_LABELS: Record<ServiceId, string> = {
  wigs: 'Wigs',
  lashes: 'Lashes',
  piercing: 'Piercings',
  makeup: 'Makeup',
};

interface PendingBooking {
  booking: BookingHold;
  customerName: string;
  customerPhone: string;
}

function friendlierBookingError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();

  if (lower.includes('already booked') || lower.includes('overlap')) {
    return 'That time was just taken. Please choose another available start time.';
  }
  if (lower.includes('busy') || lower.includes('studio_busy')) {
    return 'Anna is busy or the studio is closed at that time. Please choose another start time.';
  }
  if (lower.includes('closed')) {
    return 'The studio is closed on Sundays. Please choose Monday to Saturday.';
  }
  if (lower.includes('outside') || lower.includes('opening') || lower.includes('closing')) {
    return 'That service would run outside studio hours. Please choose an earlier start time.';
  }
  if (lower.includes('past') || lower.includes('future')) {
    return 'That appointment time has already passed. Please choose a future start time.';
  }
  if (lower.includes('hold has expired') || lower.includes('expired')) {
    return 'The 30-minute hold has expired. Please choose a time and create a new booking.';
  }
  if (lower.includes('18') || lower.includes('consent')) {
    return 'Please complete the 18+ piercing consent details before booking.';
  }
  if (lower.includes('option')) {
    return 'Please choose the exact option for this Wigs service.';
  }
  if (lower.includes('phone')) {
    return 'Please enter a valid WhatsApp number so the studio can send the payment details.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'We could not reach the live booking calendar. Check your connection and try again.';
  }
  return message || 'Something went wrong. Please try again.';
}

function readPendingBooking(): PendingBooking | null {
  try {
    const raw = window.localStorage.getItem(PENDING_BOOKING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingBooking;
    return parsed?.booking?.bookingId ? parsed : null;
  } catch {
    return null;
  }
}

function savePendingBooking(value: PendingBooking | null) {
  try {
    if (value) {
      window.localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(PENDING_BOOKING_KEY);
    }
  } catch {
    // Booking still works if the browser blocks local storage.
  }
}

function formatHoldCountdown(milliseconds: number): string {
  if (milliseconds <= 0) return 'Expired';
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<ServiceId>('wigs');
  const [selectedSlug, setSelectedSlug] = useState(menu[0]?.slug ?? '');
  const [selectedOptionName, setSelectedOptionName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => todayInGhanaISO());
  const [selectedStart, setSelectedStart] = useState('');
  const [notes, setNotes] = useState('');
  const [piercingConsent, setPiercingConsent] = useState<PiercingConsent>(() =>
    createEmptyPiercingConsent(),
  );
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [slotTick, setSlotTick] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [optionError, setOptionError] = useState(false);
  const [timeAttempted, setTimeAttempted] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingHold | null>(null);
  const [pendingCustomer, setPendingCustomer] = useState({ name: '', phone: '' });
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentNotice, setPaymentNotice] = useState('');
  const [checkingPending, setCheckingPending] = useState(true);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const firstParamLoad = useRef(true);

  const selectedItem = useMemo(
    () => menu.find((item) => item.slug === selectedSlug) ?? menu[0],
    [selectedSlug],
  );
  const selectedOption: MenuItemOption | null = useMemo(
    () =>
      selectedItem?.options?.find((option) => option.name === selectedOptionName) ?? null,
    [selectedItem, selectedOptionName],
  );

  const itemsInRoom = useMemo(
    () => menu.filter((item) => item.service === selectedRoom),
    [selectedRoom],
  );

  const isPiercing = selectedItem?.service === 'piercing';
  const piercingBlocked = isPiercing && isPiercingAgeBlocked(piercingConsent);
  const durationMinutes = selectedItem?.duration ?? 0;
  const startingPrice = selectedItem
    ? getStartingPrice(selectedItem, selectedOption)
    : 0;
  const { depositDue, balanceDue } = calculatePartialPayment(startingPrice);
  const closedDay = isClosedDate(bookingDate);
  const slots = useMemo(
    () => generateStartSlots(bookingDate, durationMinutes, busySlots, new Date(nowMs)),
    [bookingDate, busySlots, durationMinutes, nowMs],
  );
  const selectedSlot = slots.find((slot) => slot.value === selectedStart);
  const availableSlotCount = slots.filter((slot) => slot.available).length;
  const dayClosures = busySlots.filter((slot) => slot.kind === 'closure');

  useEffect(() => {
    const itemParam = searchParams.get('item');
    const roomParam = searchParams.get('service') as ServiceId | null;
    const treatmentParam = searchParams.get('treatment');
    const optionParam = searchParams.get('option');

    let item = itemParam ? menu.find((entry) => entry.slug === itemParam) : undefined;
    if (!item && treatmentParam) {
      item = menu.find(
        (entry) =>
          treatmentParam === entry.name || treatmentParam.startsWith(`${entry.name} —`),
      );
    }
    if (!item && roomParam) {
      item = menu.find((entry) => entry.service === roomParam);
    }
    if (!item) return;

    setSelectedRoom(item.service);
    setSelectedSlug(item.slug);

    let optionName = '';
    if (optionParam && item.options?.some((option) => option.name === optionParam)) {
      optionName = optionParam;
    } else if (treatmentParam && item.options?.length) {
      optionName =
        item.options.find((option) => treatmentParam.includes(option.name))?.name ?? '';
    }
    setSelectedOptionName(optionName);
    setOptionError(false);

    if (item.service === 'piercing') {
      const placement = inferPiercingPlacement(treatmentParam ?? item.name);
      setPiercingConsent((current) => ({ ...current, placement }));
    }

    if (firstParamLoad.current) {
      firstParamLoad.current = false;
      if (treatmentParam && !optionName) {
        setNotes((current) => current || `Requested: ${treatmentParam}`);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function restorePendingBooking() {
      const stored = readPendingBooking();
      if (!stored) {
        setCheckingPending(false);
        return;
      }

      try {
        const latest = await fetchBookingPaymentStatus(stored.booking.bookingId);
        if (cancelled) return;
        if (!latest || latest.status === 'cancelled' || latest.status === 'completed') {
          savePendingBooking(null);
          setPendingBooking(null);
        } else {
          const next = {
            booking: latest,
            customerName: stored.customerName,
            customerPhone: stored.customerPhone,
          };
          setPendingBooking(latest);
          setPendingCustomer({ name: stored.customerName, phone: stored.customerPhone });
          savePendingBooking(next);
          if (latest.status === 'expired') {
            setSubmitError(
              'Your previous 30-minute hold expired, so the time was released. Please choose a new time.',
            );
            setPendingBooking(null);
            savePendingBooking(null);
          }
        }
      } catch {
        if (!cancelled) {
          setPendingBooking(stored.booking);
          setPendingCustomer({
            name: stored.customerName,
            phone: stored.customerPhone,
          });
        }
      } finally {
        if (!cancelled) setCheckingPending(false);
      }
    }

    void restorePendingBooking();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!bookingDate || closedDay) {
      setBusySlots([]);
      setSelectedStart('');
      setSlotError('');
      setSlotsLoading(false);
      return;
    }

    let cancelled = false;
    setSlotsLoading(true);
    setSlotError('');

    fetchBusySlots(bookingDate)
      .then((nextBusySlots) => {
        if (!cancelled) setBusySlots(nextBusySlots);
      })
      .catch((error) => {
        if (!cancelled) setSlotError(friendlierBookingError(error));
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookingDate, closedDay, slotTick]);

  useEffect(() => {
    if (!selectedStart) return;
    const current = slots.find((slot) => slot.value === selectedStart);
    if (!current || !current.available) setSelectedStart('');
  }, [selectedStart, slots]);

  useEffect(() => {
    if (
      pendingBooking?.status !== 'pending_partial_payment' ||
      !pendingBooking.holdExpiresAt
    ) {
      return;
    }
    if (Date.parse(pendingBooking.holdExpiresAt) > nowMs) return;

    setPendingBooking(null);
    setPendingCustomer({ name: '', phone: '' });
    savePendingBooking(null);
    setPaymentError('');
    setPaymentNotice('');
    setSubmitError(
      'The 30-minute hold expired before the partial payment was arranged. That time has been released—please choose a new time.',
    );
    setSlotTick((value) => value + 1);
  }, [nowMs, pendingBooking]);

  const handleRoomChange = (room: ServiceId) => {
    const firstItem = menu.find((item) => item.service === room);
    setSelectedRoom(room);
    if (firstItem) setSelectedSlug(firstItem.slug);
    setSelectedOptionName('');
    setSelectedStart('');
    setOptionError(false);
    setSubmitError('');
    if (room === 'piercing' && firstItem) {
      setPiercingConsent((current) => ({
        ...current,
        placement: inferPiercingPlacement(firstItem.name),
      }));
    }
  };

  const handleServiceChange = (slug: string) => {
    const item = menu.find((entry) => entry.slug === slug);
    if (!item) return;
    setSelectedSlug(slug);
    setSelectedRoom(item.service);
    setSelectedOptionName('');
    setSelectedStart('');
    setOptionError(false);
    setSubmitError('');
    if (item.service === 'piercing') {
      setPiercingConsent((current) => ({
        ...current,
        placement: inferPiercingPlacement(item.name),
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    setTimeAttempted(true);

    if (!selectedItem) {
      setSubmitError('Please choose a service.');
      return;
    }
    if (selectedItem.options?.length && !selectedOption) {
      setOptionError(true);
      setSubmitError('Choose the exact Wigs option before booking.');
      document
        .querySelector<HTMLElement>('[aria-label^="Options for"] button')
        ?.focus();
      return;
    }
    if (closedDay) {
      setSubmitError('The studio is closed on Sundays. Please choose Monday to Saturday.');
      return;
    }
    if (!selectedStart) {
      setSubmitError('Please choose an available start time.');
      return;
    }
    if (piercingBlocked) {
      setSubmitError('You must be 18 or older to book a piercing. This booking cannot continue.');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBookingHold({
        serviceSlug: selectedItem.slug,
        selectedOption: selectedOption?.name ?? null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim(),
        startsAt: makeGhanaStartISO(bookingDate, selectedStart),
        piercingConsent: isPiercing ? piercingConsent : null,
      });

      const pending = {
        booking,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
      };
      setPendingBooking(booking);
      setPendingCustomer({
        name: pending.customerName,
        phone: pending.customerPhone,
      });
      savePendingBooking(pending);
      setPaymentReference('');
      setPaymentNotice('');
      setPaymentError('');
      setSlotTick((value) => value + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(friendlierBookingError(error));
      setSlotTick((value) => value + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentReferenceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingBooking) return;
    setPaymentError('');
    setPaymentNotice('');
    setPaymentSubmitting(true);

    try {
      const result = await submitPartialPaymentReference(
        pendingBooking.bookingId,
        paymentReference.trim(),
      );
      const updated: BookingHold = {
        ...pendingBooking,
        status: result.status,
        paymentReference: result.payment_reference,
        holdExpiresAt: result.hold_expires_at,
      };
      setPendingBooking(updated);
      savePendingBooking({
        booking: updated,
        customerName: pendingCustomer.name,
        customerPhone: pendingCustomer.phone,
      });
      setPaymentNotice(
        'Thank you. Your reference has been recorded. The studio will confirm it on WhatsApp; your appointment time remains reserved while they check.',
      );
      setSlotTick((value) => value + 1);
    } catch (error) {
      setPaymentError(friendlierBookingError(error));
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const resetForAnotherBooking = () => {
    setPendingBooking(null);
    setPendingCustomer({ name: '', phone: '' });
    savePendingBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setSelectedStart('');
    setSelectedOptionName('');
    setPiercingConsent(createEmptyPiercingConsent());
    setSubmitError('');
    setPaymentError('');
    setPaymentNotice('');
    setSlotTick((value) => value + 1);
  };

  const holdMsLeft = pendingBooking?.holdExpiresAt
    ? Date.parse(pendingBooking.holdExpiresAt) - nowMs
    : 0;
  const showHoldCountdown =
    pendingBooking?.status === 'pending_partial_payment' && holdMsLeft > 0;

  return (
    <section className="relative overflow-hidden bg-ink-950 pb-24 pt-32 sm:pb-28 sm:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-royal-600/[0.16] blur-[130px]" />

      <div className="container-luxe relative">
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-400 transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.4} />
            House
          </Link>
          <span className="h-px w-5 bg-ivory-100/20" />
          <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-200">
            Book
          </span>
        </nav>

        <div
          className={`grid gap-12 border border-ivory-100/10 bg-ink-900/70 px-6 py-14 sm:px-10 lg:gap-20 lg:px-16 lg:py-16 ${
            isPiercing && !pendingBooking
              ? 'lg:grid-cols-[0.82fr_1.18fr]'
              : 'lg:grid-cols-2'
          }`}
        >
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow>Book a service</Eyebrow>
            </Reveal>
            <h1 className="mt-6">
              <SplitText text="Book your service," className="display-3 block text-ivory-50" />
              <SplitText
                text="pay part to secure it."
                delay={0.1}
                className="display-3 block italic text-gold-200"
              />
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-sm font-sans text-[12px] font-light leading-[1.9] text-ivory-300/60">
                Choose the exact service, date and start time. Booking holds the full
                service duration on the shared studio calendar, so nobody else can take
                an overlapping time.
              </p>
              <ul className="mt-8 space-y-2.5 font-sans text-[11px] font-light tracking-wide text-ivory-400">
                <li>{HOUSE.address[0]}, {HOUSE.address[1]}</li>
                <li>{HOUSE.hours}</li>
                <li>
                  <a href={HOUSE.phoneHref} className="transition-colors hover:text-gold-200">
                    {HOUSE.phone}
                  </a>
                </li>
              </ul>

              <div className="mt-10 border border-gold-300/25 bg-gold-400/[0.07] px-5 py-5">
                <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                  <Wallet className="h-4 w-4" strokeWidth={1.4} />
                  How booking works
                </p>
                <ol className="mt-4 space-y-3 font-sans text-[11px] font-light leading-relaxed text-ivory-300/80">
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-300/40 text-[9px] text-gold-200">1</span>
                    <span>Submit the form to hold your chosen service time for {BOOKING_HOLD_MINUTES} minutes.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-300/40 text-[9px] text-gold-200">2</span>
                    <span>The studio sends MoMo or transfer details to your WhatsApp number.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-300/40 text-[9px] text-gold-200">3</span>
                    <span>Pay the 30% partial payment, enter your payment reference, and pay the balance at your appointment.</span>
                  </li>
                </ol>
              </div>

              {selectedItem && !pendingBooking ? (
                <div className="mt-5 border border-ivory-100/10 bg-ink-800/55 px-5 py-4">
                  <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                    Your selection
                  </p>
                  <p className="mt-2 font-display text-xl leading-snug text-ivory-50">
                    {selectedItem.name}
                    {selectedOption ? ` — ${selectedOption.name}` : ''}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-4 font-sans text-[11px] font-light text-ivory-300/75">
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Duration</dt>
                      <dd className="mt-1 text-ivory-100">{formatDuration(durationMinutes)}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Starting price</dt>
                      <dd className="mt-1 text-ivory-100">{formatPrice(startingPrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">30% to secure</dt>
                      <dd className="mt-1 text-gold-200">{formatPrice(depositDue)}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Balance in studio</dt>
                      <dd className="mt-1 text-ivory-100">{formatPrice(balanceDue)}</dd>
                    </div>
                  </dl>
                  {selectedSlot ? (
                    <p className="mt-4 border-t border-ivory-100/10 pt-3 font-sans text-[11px] font-light leading-relaxed text-ivory-300/75">
                      {formatGhanaDate(bookingDate)} · {selectedSlot.label}–{selectedSlot.endLabel}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {isPiercing ? (
                <div className="mt-5 border border-gold-300/25 bg-gold-400/[0.07] px-5 py-4">
                  <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                    Piercing bookings
                  </p>
                  <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-ivory-300/75">
                    Piercing bookings are 18+ only. The consent and health form is required
                    before the booking can continue, and we may verify age and suitability in
                    studio.
                  </p>
                </div>
              ) : null}
            </Reveal>
          </div>

          <div className="flex flex-col justify-center">
            {checkingPending ? (
              <div className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.22em] text-ivory-400">
                <LoaderCircle className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.4} />
                Checking your booking…
              </div>
            ) : pendingBooking ? (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/50 text-gold-200">
                    {showHoldCountdown ? (
                      <TimerReset className="h-4 w-4" strokeWidth={1.4} />
                    ) : (
                      <ShieldCheck className="h-4 w-4" strokeWidth={1.4} />
                    )}
                  </span>
                  <div>
                    <p className="font-display text-2xl text-ivory-50">
                      {HOUSE.greeting}, {pendingCustomer.name || 'there'}. Your time is{' '}
                      {pendingBooking.status === 'pending_partial_payment'
                        ? 'on hold.'
                        : 'reserved.'}
                    </p>
                    <p className="mt-2 max-w-lg font-sans text-[11px] font-light leading-relaxed tracking-wide text-ivory-400">
                      Booking reference{' '}
                      <span className="font-medium text-gold-200">
                        {pendingBooking.bookingReference}
                      </span>
                      . No one else can book an overlapping appointment while this booking
                      is active.
                    </p>
                  </div>
                </div>

                <div className="mt-8 border border-ivory-100/10 bg-ink-800/60 px-5 py-5">
                  <p className="font-display text-xl text-ivory-50">
                    {pendingBooking.serviceName}
                    {pendingBooking.selectedOption
                      ? ` — ${pendingBooking.selectedOption}`
                      : ''}
                  </p>
                  <p className="mt-2 flex items-start gap-2 font-sans text-[11px] font-light leading-relaxed text-ivory-300/80">
                    <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-gold-200" strokeWidth={1.4} />
                    {formatAppointmentWindow(pendingBooking.startsAt, pendingBooking.endsAt)}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 font-sans text-[11px] font-light text-ivory-300/75 sm:grid-cols-4">
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Duration</dt>
                      <dd className="mt-1 text-ivory-100">
                        {formatDuration(pendingBooking.durationMinutes)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Starting total</dt>
                      <dd className="mt-1 text-ivory-100">
                        {formatPrice(pendingBooking.totalStartingPriceGhs)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">30% due now</dt>
                      <dd className="mt-1 text-gold-200">
                        {formatPrice(pendingBooking.depositDueGhs)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-ivory-500">Balance</dt>
                      <dd className="mt-1 text-ivory-100">
                        {formatPrice(pendingBooking.balanceDueGhs)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {pendingBooking.status === 'pending_partial_payment' ? (
                  <div className="mt-5 border border-gold-300/30 bg-gold-400/[0.08] px-5 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                        <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
                        Next: WhatsApp payment details
                      </p>
                      {showHoldCountdown ? (
                        <p className="font-sans text-[11px] font-medium tracking-[0.14em] text-gold-100">
                          Hold ends in {formatHoldCountdown(holdMsLeft)}
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-3 font-sans text-[11px] font-light leading-relaxed text-ivory-300/80">
                      The studio will send the MoMo or transfer details to{' '}
                      <span className="text-ivory-100">{pendingCustomer.phone || 'your WhatsApp number'}</span>.
                      Your slot is held until{' '}
                      <span className="text-ivory-100">
                        {formatHoldExpiry(pendingBooking.holdExpiresAt)}
                      </span>{' '}
                      (Ghana time). After paying, enter the MoMo or transfer reference below.
                    </p>

                    <form onSubmit={handlePaymentReferenceSubmit} className="mt-5">
                      <label htmlFor="payment-reference" className="field-label">
                        Payment reference
                      </label>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <input
                          id="payment-reference"
                          required
                          minLength={3}
                          maxLength={120}
                          value={paymentReference}
                          onChange={(event) => setPaymentReference(event.target.value)}
                          placeholder="MoMo or transfer reference"
                          className="field flex-1"
                        />
                        <button
                          type="submit"
                          disabled={paymentSubmitting}
                          className="btn-gold group disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {paymentSubmitting ? 'Saving…' : 'I have paid'}
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                            strokeWidth={1.4}
                          />
                        </button>
                      </div>
                      {paymentError ? (
                        <p role="alert" className="mt-3 font-sans text-[11px] leading-relaxed text-rose-200">
                          {paymentError}
                        </p>
                      ) : null}
                    </form>
                  </div>
                ) : (
                  <div className="mt-5 border border-gold-300/30 bg-gold-400/[0.08] px-5 py-5">
                    <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                      <Check className="h-4 w-4" strokeWidth={1.4} />
                      {pendingBooking.status === 'confirmed'
                        ? 'Partial payment confirmed'
                        : 'Payment reference received'}
                    </p>
                    <p className="mt-3 font-sans text-[11px] font-light leading-relaxed text-ivory-300/80">
                      {paymentNotice ||
                        (pendingBooking.status === 'confirmed'
                          ? 'Your partial payment has been confirmed and your appointment time is secured. Please bring the balance to your appointment.'
                          : 'Your payment reference is recorded and your appointment time remains reserved while the studio confirms it on WhatsApp. The balance is due at your appointment.')}
                    </p>
                    {pendingBooking.paymentReference ? (
                      <p className="mt-3 font-sans text-[11px] font-light text-ivory-300/70">
                        Reference:{' '}
                        <span className="text-ivory-100">{pendingBooking.paymentReference}</span>
                      </p>
                    ) : null}
                  </div>
                )}

                <button
                  type="button"
                  onClick={resetForAnotherBooking}
                  className="link-underline mt-7"
                >
                  Book another service
                  <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
                </button>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate={false}>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="booking-name" className="field-label">
                      Your name
                    </label>
                    <input
                      id="booking-name"
                      required
                      autoComplete="name"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Ama Owusu"
                      className="field mt-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="field-label">
                      WhatsApp number
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="+233 …"
                      className="field mt-3"
                    />
                    <p className="mt-2 font-sans text-[10px] font-light leading-relaxed text-ivory-500">
                      Payment details will be sent to this number.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="booking-room" className="field-label">
                      Category
                    </label>
                    <select
                      id="booking-room"
                      value={selectedRoom}
                      onChange={(event) => handleRoomChange(event.target.value as ServiceId)}
                      className="field mt-3 cursor-pointer"
                    >
                      {(Object.keys(ROOM_LABELS) as ServiceId[]).map((room) => (
                        <option key={room} value={room} className="bg-ink-900">
                          {ROOM_LABELS[room]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-service" className="field-label">
                      Exact service
                    </label>
                    <select
                      id="booking-service"
                      value={selectedSlug}
                      onChange={(event) => handleServiceChange(event.target.value)}
                      className="field mt-3 cursor-pointer"
                    >
                      {itemsInRoom.map((item) => (
                        <option key={item.slug} value={item.slug} className="bg-ink-900">
                          {item.name} · {formatDuration(item.duration)} · from {formatPrice(item.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedItem?.options?.length ? (
                  <div className="mt-8">
                    <ServiceOptions
                      item={selectedItem}
                      selectedOption={selectedOptionName}
                      onSelectOption={(option) => {
                        setSelectedOptionName(option.name);
                        setOptionError(false);
                        setSubmitError('');
                      }}
                      idPrefix="booking-option"
                      invalid={optionError}
                      errorId="booking-option-error"
                    />
                    {optionError ? (
                      <p
                        id="booking-option-error"
                        role="alert"
                        className="mt-3 font-sans text-[11px] leading-relaxed text-rose-200"
                      >
                        Please choose one option before booking.
                      </p>
                    ) : selectedOption ? (
                      <p className="mt-3 font-sans text-[11px] font-light text-ivory-400">
                        Selected: {selectedOption.name} · {optionPriceLabel(selectedOption)}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-10 border border-ivory-100/10 bg-ink-800/45 px-5 py-5">
                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div className="min-w-[220px] flex-1">
                      <label htmlFor="booking-date" className="field-label">
                        Appointment date
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        required
                        min={todayInGhanaISO()}
                        value={bookingDate}
                        onChange={(event) => {
                          setBookingDate(event.target.value);
                          setSelectedStart('');
                          setSubmitError('');
                        }}
                        className="field mt-3"
                      />
                    </div>
                    <p className="max-w-sm font-sans text-[11px] font-light leading-relaxed text-ivory-400">
                      Open Monday–Friday, 9:00 AM–7:00 PM and Saturday, 10:00 AM–4:00 PM
                      Ghana time (closed Sundays). Starts are every 30 minutes, and a
                      booking blocks its whole service duration.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                      <Clock3 className="h-4 w-4" strokeWidth={1.4} />
                      Choose a start time
                    </p>
                    <button
                      type="button"
                      onClick={() => setSlotTick((value) => value + 1)}
                      className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-400 transition-colors hover:text-gold-200"
                    >
                      <RefreshCcw className="h-3 w-3" strokeWidth={1.4} />
                      Refresh times
                    </button>
                  </div>

                  {closedDay ? (
                    <p className="mt-4 border border-rose-300/20 bg-rose-400/[0.06] px-4 py-3 font-sans text-[11px] font-light leading-relaxed text-rose-100">
                      The studio is closed on Sundays. Please choose Monday to Saturday.
                    </p>
                  ) : slotsLoading ? (
                    <p className="mt-4 flex items-center gap-3 font-sans text-[11px] font-light text-ivory-400">
                      <LoaderCircle className="h-4 w-4 animate-spin text-gold-200" strokeWidth={1.4} />
                      Checking the live studio calendar…
                    </p>
                  ) : slotError ? (
                    <div className="mt-4 border border-rose-300/20 bg-rose-400/[0.06] px-4 py-3">
                      <p role="alert" className="font-sans text-[11px] font-light leading-relaxed text-rose-100">
                        {slotError}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSlotTick((value) => value + 1)}
                        className="link-underline mt-3"
                      >
                        Try again
                      </button>
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="mt-4 font-sans text-[11px] font-light leading-relaxed text-ivory-400">
                      There is not enough open time left on this date for a{' '}
                      {formatDuration(durationMinutes)} service. Please choose another date.
                    </p>
                  ) : (
                    <>
                      {dayClosures.length > 0 ? (
                        <div className="mt-4 border border-gold-300/25 bg-gold-400/[0.07] px-4 py-3">
                          {dayClosures.map((closure) => (
                            <p
                              key={`${closure.startsAt}-${closure.endsAt}`}
                              className="font-sans text-[11px] font-light leading-relaxed text-gold-100"
                            >
                              Anna is {closure.reason?.trim() || 'Busy'} —{' '}
                              {formatAppointmentWindow(closure.startsAt, closure.endsAt)}.
                              Those times are blocked below.
                            </p>
                          ))}
                        </div>
                      ) : null}
                      <div
                        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
                        role="radiogroup"
                        aria-label={`Available start times for ${formatGhanaDate(bookingDate)}`}
                      >
                        {slots.map((slot) => {
                          const selected = selectedStart === slot.value;
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedStart(slot.value);
                                setSubmitError('');
                              }}
                              className={`border px-3 py-3 text-left transition-all duration-300 ease-luxe ${
                                selected
                                  ? 'border-gold-300/80 bg-gold-400/[0.14] shadow-[0_0_24px_rgba(212,175,55,0.10)]'
                                  : slot.available
                                    ? 'border-ivory-100/10 bg-ink-900/70 hover:border-gold-300/40 hover:bg-ink-800'
                                    : 'cursor-not-allowed border-ivory-100/[0.06] bg-ink-950/60 opacity-45'
                              }`}
                            >
                              <span className={`block font-sans text-[12px] font-medium tracking-wide ${selected ? 'text-ivory-50' : 'text-ivory-100'}`}>
                                {slot.label}
                              </span>
                              <span className="mt-1 block font-sans text-[9px] uppercase tracking-[0.16em] text-ivory-500">
                                {slot.available
                                  ? `Ends ${slot.endLabel}`
                                  : slot.reason === 'past'
                                    ? 'Passed'
                                    : slot.reason === 'busy'
                                      ? 'Busy'
                                      : 'Booked'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-4 font-sans text-[11px] font-light leading-relaxed text-ivory-400" aria-live="polite">
                        {selectedSlot
                          ? `Selected: ${formatGhanaDate(bookingDate)}, ${selectedSlot.label}–${selectedSlot.endLabel}. Submitting will hold this ${formatDuration(durationMinutes)} slot for ${BOOKING_HOLD_MINUTES} minutes.`
                          : availableSlotCount > 0
                            ? `${availableSlotCount} start time${availableSlotCount === 1 ? '' : 's'} available for this ${formatDuration(durationMinutes)} service.`
                            : 'All start times that can fit this service are booked or have passed. Please choose another date.'}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-8">
                  <label htmlFor="booking-notes" className="field-label">
                    Anything we should know
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Sensitive scalp, a wedding at noon, the hoop you want matched…"
                    className="field mt-3 resize-none"
                  />
                </div>

                {isPiercing ? (
                  <PiercingConsentForm value={piercingConsent} onChange={setPiercingConsent} />
                ) : null}

                {submitError ? (
                  <p
                    role="alert"
                    className="mt-8 border border-rose-300/25 bg-rose-400/[0.07] px-4 py-3 font-sans text-[11px] font-light leading-relaxed text-rose-100"
                  >
                    {submitError}
                  </p>
                ) : timeAttempted && !selectedStart && !closedDay ? (
                  <p role="alert" className="mt-8 font-sans text-[11px] leading-relaxed text-rose-200">
                    Please choose an available start time.
                  </p>
                ) : null}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                  <p className="max-w-xs font-sans text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ivory-500">
                    {piercingBlocked
                      ? 'You must be 18 or older to book a piercing. This booking cannot continue.'
                      : `Submitting holds the time for ${BOOKING_HOLD_MINUTES} minutes. 30% is due by WhatsApp payment; the balance is due in studio.`}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting || piercingBlocked || slotsLoading}
                    className="btn-gold group disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? 'Holding your time…'
                      : piercingBlocked
                        ? '18+ only for piercings'
                        : isPiercing
                          ? 'Book & hold time'
                          : 'Book & hold time'}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                      strokeWidth={1.4}
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
