import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HOUSE } from '../data/house';
import {
  GALLERY_FILTERS,
  galleryItems,
  type GalleryItem,
} from '../data/gallery';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';

type Filter = (typeof GALLERY_FILTERS)[number];

const PLACEHOLDER_TONES = [
  'radial-gradient(120% 90% at 20% 0%, rgba(212,175,55,0.14), transparent 55%), linear-gradient(160deg, #241038 0%, #170429 58%, #0d0218 100%)',
  'radial-gradient(120% 90% at 85% 10%, rgba(120,72,200,0.22), transparent 55%), linear-gradient(200deg, #1d0a33 0%, #170429 55%, #0d0218 100%)',
  'radial-gradient(110% 90% at 50% 100%, rgba(212,175,55,0.10), transparent 55%), linear-gradient(150deg, #200c38 0%, #140326 60%, #0d0218 100%)',
];

function GalleryTile({ item, index }: { item: GalleryItem; index: number }) {
  if (item.src) {
    return (
      <figure className="group relative overflow-hidden border border-ivory-100/10 bg-ink-900">
        <img
          src={item.src}
          alt={`${item.caption} — ${item.category} at Anna's Beautistry`}
          loading="lazy"
          className="h-auto w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 via-ink-950/35 to-transparent px-4 pb-3.5 pt-10">
          <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-gold-200">
            {item.category}
          </p>
          <p className="mt-1 font-display text-lg leading-snug text-ivory-50">{item.caption}</p>
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className="relative overflow-hidden border border-ivory-100/10"
      style={{ aspectRatio: item.aspect, background: PLACEHOLDER_TONES[index % PLACEHOLDER_TONES.length] }}
      role="img"
      aria-label={`${item.category} — client photo coming soon`}
    >
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="pointer-events-none absolute inset-3 border border-gold-300/15" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 top-1 select-none font-display text-[6.5rem] italic leading-none text-ivory-50/[0.06]"
      >
        {item.category.charAt(0)}
      </span>
      <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
        <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-gold-200">
          {item.category}
        </p>
        <p className="mt-1.5 font-sans text-[10px] font-light uppercase tracking-[0.18em] text-ivory-300/50">
          Client photo coming soon
        </p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>('All');

  const visibleItems = useMemo(
    () =>
      filter === 'All'
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [filter],
  );

  return (
    <main>
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
              Gallery
            </span>
          </nav>

          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>The gallery</Eyebrow>
            </Reveal>
            <h1 className="mt-7">
              <SplitText text="My work," className="display-2 block text-ivory-50" />
              <SplitText
                text="in pictures."
                delay={0.15}
                className="display-2 block italic text-gold-200"
              />
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ivory-300/65">
                This wall is reserved for my clients — real installs, fresh lash sets,
                healed piercings and faces I have painted, photographed here in{' '}
                {HOUSE.city} and shared with permission. The first photos are being
                prepared now, and new ones will be added as the chair keeps turning.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <div
              className="mt-12 flex flex-wrap items-center gap-2.5"
              role="group"
              aria-label="Filter gallery by service"
            >
              {GALLERY_FILTERS.map((option) => {
                const active = filter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    aria-pressed={active}
                    className={`border px-4 py-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.24em] transition-all duration-300 ease-luxe ${
                      active
                        ? 'border-gold-300/70 bg-gold-400/[0.12] text-gold-100'
                        : 'border-ivory-100/15 text-ivory-300/70 hover:border-gold-300/40 hover:text-ivory-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
              <span className="ml-auto hidden font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-500 sm:block">
                {visibleItems.length} frame{visibleItems.length === 1 ? '' : 's'}
              </span>
            </div>
          </Reveal>

          {visibleItems.length > 0 ? (
            <div
              key={filter}
              className="mt-10 columns-2 gap-4 sm:gap-5 lg:columns-3"
            >
              {visibleItems.map((item, index) => (
                <Reveal
                  key={item.id}
                  delay={0.06 * (index % 3)}
                  className="mb-4 break-inside-avoid sm:mb-5"
                >
                  <GalleryTile item={item} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 border border-ivory-100/10 bg-ink-900/60 px-6 py-10 text-center font-sans text-[12px] font-light leading-relaxed text-ivory-300/70">
              No frames here yet — the first {filter.toLowerCase()} photos are on their way.
            </p>
          )}

          <Reveal delay={0.15}>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ivory-100/10 pt-10">
              <p className="max-w-md font-sans text-[12px] font-light leading-[1.9] text-ivory-300/60">
                Every photo on this wall will be a real client, shared with their
                permission. When you sit in the chair, yours could be next — only if
                you say yes.
              </p>
              <Link to="/book" className="btn-gold group">
                Book a service
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                  strokeWidth={1.4}
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
