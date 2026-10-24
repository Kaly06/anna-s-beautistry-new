import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { menu } from '../data/menu';
import { rooms, roomsMeta } from '../data/rooms';
import { formatPrice, HOUSE } from '../data/house';
import { specimen } from '../lib/specimens';
import { EASE } from '../lib/animations';
import { FEATURES } from '../lib/features';
import { usePageTitle } from '../lib/usePageTitle';
import type { MenuItem, MenuItemOption, ServiceId } from '../types';
import Specimen from '../components/ui/Specimen';
import MenuCard from '../components/MenuCard';
import MenuModal from '../components/MenuModal';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import Magnetic from '../components/ui/Magnetic';
import NotFound from './NotFound';

type Sort = 'curated' | 'price-asc' | 'price-desc' | 'quickest';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'curated', label: 'Curated' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'quickest', label: 'Quickest' },
];

const isServiceId = (value: string | undefined): value is ServiceId =>
  value === 'wigs' || value === 'piercing' || value === 'lashes' || value === 'makeup';

export default function ServicePage() {
  const { serviceId, slug } = useParams<{ serviceId: string; slug?: string }>();
  const navigate = useNavigate();
  const valid = isServiceId(serviceId);

  const meta = valid ? rooms[serviceId] : null;
  usePageTitle(meta ? meta.name : 'Services');
  const items = useMemo(
    () => (valid ? menu.filter((item) => item.service === serviceId) : []),
    [valid, serviceId]
  );

  const [sort, setSort] = useState<Sort>('curated');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedOptions({});
  }, [serviceId]);

  const selectOption = (item: MenuItem, option: MenuItemOption) => {
    setSelectedOptions((current) => ({ ...current, [item.slug]: option.name }));
  };

  const sorted = useMemo(() => {
    const copy = [...items];
    switch (sort) {
      case 'price-asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'quickest':
        return copy.sort((a, b) => a.duration - b.duration);
      default:
        return copy;
    }
  }, [items, sort]);

  // A slug in the URL opens that service directly, so menu links are shareable.
  useEffect(() => {
    setSort('curated');
    if (!slug) {
      setActiveIndex(null);
      return;
    }
    const found = items.findIndex((item) => item.slug === slug);
    setActiveIndex(found === -1 ? null : found);
  }, [serviceId, slug, items]);

  const closeItem = () => {
    setActiveIndex(null);
    if (slug) navigate(`/services/${serviceId}`, { replace: true });
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeItem();
      if (event.key === 'ArrowRight') {
        setActiveIndex((i) => (i === null ? null : (i + 1) % sorted.length));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((i) => (i === null ? null : (i - 1 + sorted.length) % sorted.length));
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, sorted.length]);

  if (!meta) return <NotFound />;

  const active: MenuItem | null = activeIndex === null ? null : sorted[activeIndex] ?? null;
  const others = roomsMeta.filter((room) => room.id !== meta.id);

  const cheapest = Math.min(...items.map((item) => item.price));

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-ivory-100/[0.07] bg-ink-950 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-gold-500/[0.07] blur-[130px]" />

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
            <Link
              to="/services"
              className="font-sans text-[9px] uppercase tracking-[0.26em] text-gold-300/80 transition-colors hover:text-gold-200"
            >
              Services
            </Link>
            <span className="h-px w-5 bg-ivory-100/20" />
            <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-200">
              {meta.name}
            </span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow index={meta.numeral}>{meta.name}</Eyebrow>

              <h1 className="mt-7 font-display text-[clamp(3rem,7.4vw,6.5rem)] font-light leading-[0.92] tracking-[-0.025em] text-ivory-50">
                {meta.headline}
              </h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                className="mt-8 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ivory-300/70"
              >
                {meta.intro}
              </m.p>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4"
              >
                <div>
                  <p className="font-display text-4xl font-light text-gold-200">{items.length}</p>
                  <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                    Services
                  </p>
                </div>
                <div className="h-10 w-px bg-ivory-100/15" />
                <div>
                  <p className="font-display text-4xl font-light text-gold-200">
                    {formatPrice(cheapest)}
                  </p>
                  <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                    From
                  </p>
                </div>
                <div className="h-10 w-px bg-ivory-100/15" />
                <div>
                  <p className="font-display text-4xl font-light text-gold-200">{meta.numeral}</p>
                  <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                    Of four rooms
                  </p>
                </div>
              </m.div>
            </div>

            <div className="lg:col-span-5">
              <m.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
                className="relative mx-auto aspect-square w-full max-w-[420px]"
              >
                <div className="absolute inset-0 rounded-full border border-ivory-100/[0.07]" />
                <div className="absolute inset-8 rounded-full border border-ivory-100/[0.05]" />
                <div className="absolute inset-0 animate-float">
                  <Specimen
                    prims={specimen(meta.id, meta.signatureVariant)}
                    id={`hero-${meta.id}`}
                    glow
                    strokeWidth={0.95}
                    className="h-full w-full"
                  />
                </div>
                <p className="absolute inset-x-0 -bottom-4 text-center font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                  {meta.note}
                </p>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- options */}
      {meta.id === 'wigs' && FEATURES.wigOptionsSheet ? (
        <section className="border-b border-ivory-100/[0.07] bg-ink-900">
          <div className="container-luxe flex flex-col items-start justify-between gap-6 py-9 sm:flex-row sm:items-center">
            <div>
              <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/80">
                The options sheet
              </p>
              <p className="mt-2 max-w-xl font-display text-xl font-light leading-snug text-ivory-100">
                Lace, frontpiece, cap, density, length, texture, colour — priced line by line,
                before anything is ordered.
              </p>
            </div>
            <Link to="/services/wigs/options" className="btn-ghost group shrink-0">
              Build a unit
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.4}
              />
            </Link>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------------- index */}
      <section className="bg-ink-950 pb-24 pt-10 sm:pb-32">
        <div className="container-luxe">
          <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-ivory-100/[0.08] bg-ink-950/[0.92] px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-y-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-400">
                {sorted.length} services · {meta.name}
              </p>

              <div className="flex items-center gap-1" role="group" aria-label="Sort services">
                {SORTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSort(option.id)}
                    aria-pressed={sort === option.id}
                    className={`px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                      sort === option.id ? 'text-gold-200' : 'text-ivory-500 hover:text-ivory-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
            {sorted.map((item, index) => (
              <MenuCard
                key={item.slug}
                item={item}
                index={index}
                selectedOption={selectedOptions[item.slug]}
              />
            ))}
          </div>

          <Reveal>
            <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-center">
              <p className="max-w-md font-sans text-[11px] font-light leading-relaxed text-ivory-400">
                Prices include the consultation, the service and written aftercare. A card
                holds the appointment and comes off your bill.
              </p>
              <Magnetic strength={0.2}>
                <Link to="/book" className="btn-ghost group">
                  Book {meta.name}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.4}
                  />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- the rest */}
      <section className="border-t border-ivory-100/[0.06] bg-ink-950 py-20 sm:py-24">
        <div className="container-luxe">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Also in the house</Eyebrow>
              <h2 className="mt-6">
                <span className="display-3 block text-ivory-50">The other rooms</span>
              </h2>
            </div>
            <p className="max-w-sm font-sans text-[12px] font-light leading-[1.95] text-ivory-400">
              {HOUSE.hours} · {HOUSE.address[0]}, {HOUSE.city}.
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-3">
            {others.map((room, index) => (
              <m.div
                key={room.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.9, ease: EASE, delay: index * 0.07 }}
              >
                <Link
                  to={`/services/${room.id}`}
                  className="group flex h-full flex-col justify-between bg-ink-950 p-7 transition-colors duration-700 hover:bg-ink-900"
                >
                  <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-400/80">
                    {room.numeral}
                  </span>
                  <span>
                    <span className="mt-8 block font-display text-3xl font-light text-ivory-50 transition-colors duration-500 group-hover:text-gold-100">
                      {room.name}
                    </span>
                    <span className="mt-3 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-400 transition-colors group-hover:text-gold-200">
                      The menu
                      <span className="h-px w-6 bg-gold-300/50 transition-all duration-500 ease-luxe group-hover:w-10" />
                    </span>
                  </span>
                </Link>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      <MenuModal
        item={active}
        selectedOption={active ? selectedOptions[active.slug] : undefined}
        onSelectOption={(option) => {
          if (active) selectOption(active, option);
        }}
        onClose={closeItem}
        onNavigate={(direction) =>
          setActiveIndex((i) => (i === null ? null : (i + direction + sorted.length) % sorted.length))
        }
        indexLabel={`${String((activeIndex ?? 0) + 1).padStart(2, '0')} / ${String(
          sorted.length
        ).padStart(2, '0')}`}
      />

      {/* Booking has its own page, so this opens at the top of the form. */}
      <section className="bg-ink-900 py-16">
        <div className="container-luxe flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-display text-2xl font-light text-ivory-100">
            Ready when you are.
          </p>
          <Link to="/book" className="btn-gold group">
            Book a service
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
              strokeWidth={1.4}
            />
          </Link>
        </div>
      </section>
    </>
  );
}
