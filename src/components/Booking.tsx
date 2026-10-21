import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import { services } from '../data/services';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';
import PiercingConsentForm, {
  createEmptyPiercingConsent,
  inferPiercingPlacement,
  isPiercingAgeBlocked,
  type PiercingConsent,
} from './PiercingConsentForm';

const EMPTY = { name: '', phone: '', service: services[0].id, date: '', notes: '' };

export default function Booking() {
  const [form, setForm] = useState(EMPTY);
  const [piercingConsent, setPiercingConsent] = useState<PiercingConsent>(() =>
    createEmptyPiercingConsent(),
  );
  const [sent, setSent] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestedService = searchParams.get('service');
    const treatment = searchParams.get('treatment');
    if (!requestedService && !treatment) return;

    setForm((current) => ({
      ...current,
      service: services.some((service) => service.id === requestedService)
        ? (requestedService as typeof current.service)
        : current.service,
      notes: treatment ? `Requested: ${treatment}` : current.notes,
    }));

    const placement = inferPiercingPlacement(treatment);
    if (placement) {
      setPiercingConsent((current) => ({ ...current, placement }));
    }
    setSent(false);
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.service === 'piercing' && isPiercingAgeBlocked(piercingConsent)) return;
    if (!form.name.trim() || !form.phone.trim()) return;
    setSent(true);
  };

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const isPiercing = form.service === 'piercing';
  const piercingBlocked = isPiercing && isPiercingAgeBlocked(piercingConsent);

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
            isPiercing ? 'lg:grid-cols-[0.82fr_1.18fr]' : 'lg:grid-cols-2'
          }`}
        >
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow>Book a sitting</Eyebrow>
            </Reveal>
            <h1 className="mt-6">
              <SplitText text="Take the chair," className="display-3 block text-ivory-50" />
              <SplitText
                text="we will hold it."
                delay={0.1}
                className="display-3 block italic text-gold-200"
              />
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-sm font-sans text-[12px] font-light leading-[1.9] text-ivory-300/60">
                Send the details and we reply on WhatsApp within twenty-four hours with two
                times that suit. A card holds the slot — it comes off your bill, not on top
                of it.
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
              {isPiercing ? (
                <div className="mt-10 border border-gold-300/25 bg-gold-400/[0.07] px-5 py-4">
                  <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-200">
                    Piercing bookings
                  </p>
                  <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-ivory-300/75">
                    Piercing bookings are 18+ only. The consent and health form below is required
                    before we can confirm your piercing, and we may verify age and suitability in
                    studio.
                  </p>
                </div>
              ) : null}
            </Reveal>
          </div>

          <div className="flex flex-col justify-center">
            {sent ? (
              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="flex items-start gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/50 text-gold-200">
                  <Check className="h-4 w-4" strokeWidth={1.4} />
                </span>
                <div>
                  <p className="font-display text-2xl text-ivory-50">
                    {HOUSE.greeting}. Your request is in.
                  </p>
                  <p className="mt-2 max-w-sm font-sans text-[11px] font-light leading-relaxed tracking-wide text-ivory-400">
                    {isPiercing
                      ? `Your piercing consent is included. We will review your health answers and message ${
                          form.phone || 'you'
                        } within twenty-four hours to confirm suitability and the time.`
                      : `We will message ${form.phone || 'you'} within twenty-four hours to confirm the time. To amend it, reply to that message or call the studio.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(EMPTY);
                      setPiercingConsent(createEmptyPiercingConsent());
                      setSent(false);
                    }}
                    className="link-underline mt-6"
                  >
                    Book another sitting
                    <ArrowRight className="h-3 w-3" strokeWidth={1.4} />
                  </button>
                </div>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="booking-name" className="field-label">
                      Your name
                    </label>
                    <input
                      id="booking-name"
                      required
                      value={form.name}
                      onChange={(event) => set('name')(event.target.value)}
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
                      value={form.phone}
                      onChange={(event) => set('phone')(event.target.value)}
                      placeholder="+233 …"
                      className="field mt-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-service" className="field-label">
                      Service
                    </label>
                    <select
                      id="booking-service"
                      value={form.service}
                      onChange={(event) => set('service')(event.target.value)}
                      className="field mt-3 cursor-pointer"
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.id} className="bg-ink-900">
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-date" className="field-label">
                      Preferred date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      value={form.date}
                      onChange={(event) => set('date')(event.target.value)}
                      className="field mt-3"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="booking-notes" className="field-label">
                    Anything we should know
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(event) => set('notes')(event.target.value)}
                    placeholder="Sensitive scalp, a wedding at noon, the hoop you want matched…"
                    className="field mt-3 resize-none"
                  />
                </div>

                {isPiercing ? (
                  <PiercingConsentForm value={piercingConsent} onChange={setPiercingConsent} />
                ) : null}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                  <p className="max-w-xs font-sans text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ivory-500">
                    {piercingBlocked
                      ? 'You must be 18 or older to book a piercing. This booking cannot continue.'
                      : 'No payment taken here. We confirm by message before anything is charged.'}
                  </p>
                  <button
                    type="submit"
                    disabled={piercingBlocked}
                    className="btn-gold group disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {piercingBlocked
                      ? '18+ only for piercings'
                      : isPiercing
                        ? 'Submit booking & consent'
                        : 'Request a sitting'}
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
