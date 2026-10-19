import { useState, type FormEvent } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import { services } from '../data/services';
import Eyebrow from './ui/Eyebrow';
import Reveal from './ui/Reveal';
import SplitText from './ui/SplitText';

const EMPTY = { name: '', phone: '', service: services[0].id, date: '', notes: '' };

export default function Booking() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSent(true);
  };

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <section id="book" className="relative scroll-mt-24 overflow-hidden bg-ink-900 py-24 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/[0.06] blur-[120px]" />

      <div className="container-luxe relative">
        <div className="grid gap-12 border border-ivory-100/10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-16">
          <div>
            <Reveal>
              <Eyebrow index="05">Book a sitting</Eyebrow>
            </Reveal>
            <h2 className="mt-6">
              <SplitText text="Take the chair," className="display-3 block text-ivory-50" />
              <SplitText
                text="we will hold it."
                delay={0.1}
                className="display-3 block italic text-gold-200"
              />
            </h2>
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
                    We will message {form.phone || 'you'} within twenty-four hours to confirm
                    the time. To amend it, reply to that message or call the studio.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(EMPTY);
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

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                  <p className="max-w-xs font-sans text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ivory-500">
                    No payment taken here. We confirm by message before anything is charged.
                  </p>
                  <button type="submit" className="btn-gold group">
                    Request a sitting
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
