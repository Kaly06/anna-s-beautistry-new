import { useEffect, useState } from 'react';
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { EASE } from '../lib/animations';
import { HOUSE } from '../data/house';
import { services } from '../data/services';
import Magnetic from './ui/Magnetic';
import Logo from './ui/Logo';

const LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/#studio' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <m.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: reduce ? 0 : 2.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe ${
          scrolled
            ? 'border-b border-ivory-100/[0.07] bg-ink-950/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`container-luxe flex items-center justify-between transition-all duration-500 ease-luxe ${
            scrolled ? 'h-16' : 'h-20 md:h-24'
          }`}
        >
          <Link to="/" className="group flex items-center" aria-label="Anna's Beautistry — home">
            <Logo size="nav" />
          </Link>

          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="group relative py-2 font-sans text-[10px] font-medium uppercase tracking-widest2 text-ivory-200/85 transition-colors duration-300 hover:text-gold-200"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gold-300/70 transition-transform duration-500 ease-luxe group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Magnetic strength={0.2}>
              <Link to="/book" className="btn-ghost !px-6 !py-3">
                Book a service
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-ivory-100 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="font-sans text-[10px] uppercase tracking-widest2">Menu</span>
            <Menu className="h-5 w-5" strokeWidth={1.2} />
          </button>
        </nav>
      </m.header>

      <AnimatePresence>
        {open ? (
          <m.div
            key="mobile-menu"
            className="fixed inset-0 z-[80] flex flex-col bg-ink-950 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="container-luxe flex h-20 items-center justify-between">
              <Logo size="menu" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-ivory-100"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" strokeWidth={1.2} />
              </button>
            </div>

            <nav aria-label="Mobile" className="container-luxe flex flex-1 flex-col justify-center">
              <ul className="space-y-2">
                {LINKS.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.28 + i * 0.08 }}
                    className="overflow-hidden border-b border-ivory-100/10"
                  >
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-display text-4xl font-light text-ivory-50">
                        {link.label}
                      </span>
                      <span className="font-sans text-[10px] tracking-widest2 text-gold-400/70">
                        0{i + 1}
                      </span>
                    </Link>
                  </m.li>
                ))}
              </ul>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-10"
              >
                <p className="eyebrow mb-3">The menu</p>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      onClick={() => setOpen(false)}
                      className="border border-ivory-100/15 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.2em] text-ivory-200 transition-colors hover:border-gold-300/50 hover:text-gold-200"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/services/wigs/options"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-gold-200 transition-colors hover:text-gold-100"
                >
                  Wigs options sheet
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.4} />
                </Link>
              </m.div>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-10 space-y-3"
              >
                <p className="eyebrow">Enquiries</p>
                <a href={`mailto:${HOUSE.email}`} className="block font-display text-2xl text-ivory-100">
                  {HOUSE.email}
                </a>
                <p className="font-sans text-xs tracking-wider text-ivory-400">{HOUSE.cities}</p>
              </m.div>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
