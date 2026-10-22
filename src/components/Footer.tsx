import { Link } from 'react-router-dom';
import {
  ArrowUp,
  Ghost,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
} from 'lucide-react';
import { HOUSE, OPENING_HOURS } from '../data/house';
import Logo from './ui/Logo';
import Reveal from './ui/Reveal';

const QUICK_LINKS = [
  { label: 'All services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About me', href: '/#about' },
  { label: 'Wigs options sheet', href: '/services/wigs/options' },
  { label: 'Book a service', href: '/book' },
];

const SOCIALS = [
  {
    label: 'Instagram',
    handle: '@_annas_beautistry_',
    href: 'https://instagram.com/_annas_beautistry_',
    Icon: Instagram,
  },
  {
    label: 'TikTok',
    handle: '@annas_beautistry',
    href: 'https://tiktok.com/@annas_beautistry',
    Icon: Music2,
  },
  {
    label: 'Snapchat',
    handle: '@lolita_anna18',
    href: 'https://www.snapchat.com/add/lolita_anna18',
    Icon: Ghost,
  },
];

const CONTACTS = [
  { label: HOUSE.phone, href: HOUSE.phoneHref, Icon: Phone, external: false },
  { label: HOUSE.email, href: `mailto:${HOUSE.email}`, Icon: Mail, external: false },
  {
    label: `${HOUSE.phone} (WhatsApp)`,
    href: HOUSE.whatsappHref,
    Icon: MessageCircle,
    external: true,
  },
];

export default function Footer() {
  const todayIndex = new Date().getDay();

  return (
    <footer className="overflow-hidden bg-ink-950 pt-20 sm:pt-28">
      <div className="container-luxe">
        <div
          id="contact"
          className="grid scroll-mt-28 gap-12 border-b border-ivory-100/10 pb-16 md:grid-cols-2 lg:grid-cols-12"
        >
          <div className="lg:col-span-3">
            <Reveal>
              <Link to="/" className="group flex items-center" aria-label="Anna's Beautistry home">
                <Logo size="footer" />
              </Link>
              <p className="mt-6 max-w-xs font-sans text-[12px] font-light leading-[1.95] text-ivory-300/60">
                Custom wigs, lashes, makeup and piercings, made by hand and booked by
                appointment.
              </p>
              <ul className="mt-8 space-y-4">
                {CONTACTS.map(({ label, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="group flex items-center gap-3 font-sans text-[12.5px] font-light text-ivory-200/80 transition-colors duration-300 hover:text-gold-200"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-gold-300/70 transition-colors duration-300 group-hover:text-gold-200"
                        strokeWidth={1.4}
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal delay={0.08}>
              <h3 className="font-display text-[26px] font-medium text-ivory-50">
                Opening hours
              </h3>
              <ul className="mt-6 space-y-1">
                {OPENING_HOURS.map(({ day, dayIndex, time }) => {
                  const isToday = dayIndex === todayIndex;
                  return (
                    <li
                      key={day}
                      className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2 font-sans text-[12.5px] font-light ${
                        isToday
                          ? 'border border-gold-300/35 bg-ivory-100/[0.04] text-ivory-50'
                          : 'text-ivory-300/65'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {isToday ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                        ) : null}
                        {day}
                      </span>
                      <span className={isToday ? 'text-ivory-100' : 'text-ivory-300/80'}>
                        {time}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-2 lg:col-span-6">
            <Reveal delay={0.14}>
              <h3 className="font-display text-[26px] font-medium text-ivory-50">Socials</h3>
              <p className="mt-3 font-sans text-[12px] font-light leading-relaxed text-ivory-300/60">
                Follow along for new sets, transformations and studio days.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
                {SOCIALS.map(({ label, handle, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-start gap-3 rounded-2xl border border-ivory-100/10 bg-ivory-100/[0.03] p-3.5 transition-colors duration-500 hover:border-gold-300/50 hover:bg-ivory-100/[0.05] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-600 text-gold-200 transition-colors duration-500 group-hover:text-gold-100 sm:h-11 sm:w-11">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="block font-sans text-[13px] font-semibold text-ivory-50">
                        {label}
                      </span>
                      <span className="mt-0.5 block font-sans text-[11px] font-light text-ivory-300/60 sm:text-[12px]">
                        {handle}
                      </span>
                    </span>
                  </a>
                ))}
                <a
                  href={HOUSE.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-ivory-100/10 bg-ivory-100/[0.03] p-3.5 transition-colors duration-500 hover:border-gold-300/50 hover:bg-ivory-100/[0.05] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-600 text-gold-200 transition-colors duration-500 group-hover:text-gold-100 sm:h-11 sm:w-11">
                    <MapPin className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block font-sans text-[13px] font-semibold text-ivory-50">
                      Location
                    </span>
                    <span className="mt-0.5 block font-sans text-[11px] font-light leading-relaxed text-ivory-300/60 sm:text-[12px]">
                      {HOUSE.address.join(', ')}
                    </span>
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-10"
        >
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-sans text-[9px] uppercase tracking-[0.24em] transition-colors duration-300 hover:text-gold-200 ${
                link.href === '/book' ? 'text-gold-300/90' : 'text-ivory-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative pt-10">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center font-display text-[clamp(1.9rem,6.8vw,6.25rem)] font-light leading-[0.85] tracking-[0.05em] text-ivory-50/[0.055]"
          >
            ANNA&apos;S BEAUTISTRY
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory-100/10 py-7 sm:flex-row">
          <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-ivory-500">
            © {new Date().getFullYear()} Anna&apos;s Beautistry. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-ivory-500">
              {HOUSE.city} · Ghana
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 text-ivory-300 transition-colors duration-500 hover:border-gold-300/60 hover:text-gold-200"
            >
              <ArrowUp
                className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5"
                strokeWidth={1.3}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
