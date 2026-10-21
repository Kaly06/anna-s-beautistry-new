import { Link } from 'react-router-dom';
import { ArrowUp, Facebook, Instagram, Twitter } from 'lucide-react';
import { HOUSE } from '../data/house';
import { services } from '../data/services';
import Logo from './ui/Logo';
import Reveal from './ui/Reveal';

const HOUSE_LINKS = [
  { label: 'About me', href: '/#about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Signature treatments', href: '/#signature' },
  { label: 'Book a service', href: '/book' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-ink-950 pt-20 sm:pt-28">
      <div className="container-luxe">
        <div className="grid gap-12 border-b border-ivory-100/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Link to="/" className="group flex items-center" aria-label="Anna's Beautistry home">
                <Logo size="footer" />
              </Link>
              <p className="mt-6 max-w-xs font-sans text-[12px] font-light leading-[1.95] text-ivory-300/60">
                A beauty house in {HOUSE.city}: lace laid by hand, needle-only piercings in
                implant-grade titanium, silk lash sets and skin-first makeup — one client in
                the chair at a time, since {HOUSE.founded}.
              </p>
              <div className="mt-8 flex gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Anna's Beautistry on ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/15 text-ivory-300 transition-colors duration-500 hover:border-gold-300/60 hover:text-gold-200"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.3} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={0.08}>
              <h3 className="eyebrow">The menu</h3>
              <ul className="mt-6 space-y-3.5">
                <li>
                  <Link
                    to="/services"
                    className="font-sans text-[12px] font-light text-ivory-300/70 transition-colors duration-300 hover:text-gold-200"
                  >
                    All services
                  </Link>
                </li>
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/services/${service.id}`}
                      className="font-sans text-[12px] font-light text-ivory-300/70 transition-colors duration-300 hover:text-gold-200"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/services/wigs/options"
                    className="font-sans text-[12px] font-light text-gold-300/80 transition-colors duration-300 hover:text-gold-200"
                  >
                    Wigs options sheet
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={0.12}>
              <h3 className="eyebrow">The house</h3>
              <ul className="mt-6 space-y-3.5">
                {HOUSE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-sans text-[12px] font-light text-ivory-300/70 transition-colors duration-300 hover:text-gold-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div id="contact" className="scroll-mt-28 lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.16}>
              <h3 className="eyebrow">Enquiries</h3>
              <ul className="mt-6 space-y-3.5 font-sans text-[12px] font-light text-ivory-300/70">
                {HOUSE.address.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li>
                  <a href={HOUSE.phoneHref} className="transition-colors hover:text-gold-200">
                    {HOUSE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${HOUSE.email}`}
                    className="transition-colors hover:text-gold-200"
                  >
                    {HOUSE.email}
                  </a>
                </li>
              </ul>
              <p className="mt-6 font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-500">
                {HOUSE.hours}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="relative pt-12">
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
