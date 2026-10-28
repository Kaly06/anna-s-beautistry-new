import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { HOUSE } from '../data/house';
import { EASE } from '../lib/animations';
import {
  GALLERY_FILTERS,
  galleryItems,
  type GalleryItem,
} from '../data/gallery';
import { usePageMeta } from '../lib/usePageTitle';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';

type Filter = (typeof GALLERY_FILTERS)[number];

const PLACEHOLDER_TONES = [
  'radial-gradient(120% 90% at 20% 0%, rgba(212,175,55,0.14), transparent 55%), linear-gradient(160deg, #241038 0%, #140926 58%, #0d0218 100%)',
  'radial-gradient(120% 90% at 85% 10%, rgba(120,72,200,0.22), transparent 55%), linear-gradient(200deg, #1d0a33 0%, #140926 55%, #0d0218 100%)',
  'radial-gradient(110% 90% at 50% 100%, rgba(212,175,55,0.10), transparent 55%), linear-gradient(150deg, #200c38 0%, #140326 60%, #0d0218 100%)',
];

type GalleryPhotoItem = GalleryItem & { src: string };

function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen?: () => void;
}) {
  if (item.src) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`View the full photo: ${item.caption}`}
        className="group relative block w-full overflow-hidden border border-ivory-100/10 bg-ink-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
      >
        <img
          src={item.src}
          alt={`${item.caption} — ${item.category} at Anna's Beautistry`}
          loading="lazy"
          className="h-auto w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-ivory-100/20 bg-ink-950/70 text-ivory-100 opacity-80 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:opacity-0"
        >
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-ink-950/85 via-ink-950/35 to-transparent px-2.5 pb-2 pt-6 sm:px-4 sm:pb-3.5 sm:pt-10">
          <span className="block font-sans text-[7px] uppercase tracking-[0.18em] text-gold-200 sm:text-[9px] sm:tracking-[0.24em]">
            {item.category}
          </span>
          <span className="mt-0.5 block font-display text-[13px] leading-snug text-ivory-50 sm:mt-1 sm:text-lg">
            {item.caption}
          </span>
        </span>
      </button>
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
      <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5 sm:px-5 sm:pb-5">
        <p className="font-sans text-[7px] uppercase tracking-[0.18em] text-gold-200 sm:text-[9px] sm:tracking-[0.24em]">
          {item.category}
        </p>
        <p className="mt-1 font-sans text-[8px] font-light uppercase tracking-[0.14em] text-ivory-300/50 sm:mt-1.5 sm:text-[10px] sm:tracking-[0.16em]">
          Client photo coming soon
        </p>
      </div>
    </div>
  );
}

interface GalleryLightboxProps {
  item: GalleryPhotoItem | null;
  index: number;
  total: number;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}

function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (item && !wasOpenRef.current) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
    wasOpenRef.current = Boolean(item);
  }, [item]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;

    const deltaX = (event.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(deltaX) >= 48) {
      onNavigate(deltaX < 0 ? 1 : -1);
    }
  };

  return (
    <AnimatePresence>
      {item ? (
        <m.div
          key="gallery-lightbox"
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.caption} — full photo view`}
        >
          <button
            type="button"
            aria-label="Close full photo view"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-zoom-out bg-ink-950"
          />

          <m.div
            initial={{ opacity: 0, y: 22, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.995 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-none relative z-10 flex h-full flex-col"
          >
            <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 pb-2 pt-4 sm:px-6 sm:pt-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-sans text-[8px] uppercase tracking-[0.26em] text-gold-300 sm:text-[9px]">
                  {item.category}
                </span>
                <span className="h-px w-6 shrink-0 bg-ivory-100/20" />
                <span className="font-sans text-[8px] uppercase tracking-[0.26em] text-ivory-400 sm:text-[9px]">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close full photo view"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ivory-100/20 bg-ink-900/70 text-ivory-200 backdrop-blur-sm transition-colors hover:border-gold-300/60 hover:text-gold-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/90"
              >
                <X className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>

            <div
              className="pointer-events-auto relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 py-2 sm:px-20"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate(-1)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-100/20 bg-ink-950/75 text-ivory-200 backdrop-blur-sm transition-colors hover:border-gold-300/60 hover:text-gold-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/90 sm:left-5"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.3} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(1)}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-100/20 bg-ink-950/75 text-ivory-200 backdrop-blur-sm transition-colors hover:border-gold-300/60 hover:text-gold-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/90 sm:right-5"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.3} />
                  </button>
                </>
              ) : null}

              <m.img
                key={item.id}
                src={item.src}
                alt={`${item.caption} — ${item.category} at Anna's Beautistry`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="max-h-full max-w-full border border-ivory-100/10 bg-ink-900 object-contain shadow-2xl shadow-black/50"
                draggable={false}
              />
            </div>

            <div className="pointer-events-auto px-5 pb-5 pt-2 text-center sm:pb-7" aria-live="polite">
              <p className="font-sans text-[8px] uppercase tracking-[0.28em] text-gold-300 sm:text-[9px]">
                {item.category}
              </p>
              <p className="mt-1.5 font-display text-2xl leading-tight text-ivory-50 sm:text-3xl">
                {item.caption}
              </p>
              <p className="mt-2 font-sans text-[8px] uppercase tracking-[0.22em] text-ivory-500 sm:hidden">
                Swipe for more photos
              </p>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function GalleryPage() {
  usePageMeta({
    title: 'Gallery',
    description:
      "Real work from the chair — lace installations, piercings, lash sets and makeup, photographed at Anna's Beautistry in Cape Coast.",
    path: '/gallery',
  });
  const [filter, setFilter] = useState<Filter>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () =>
      filter === 'All'
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [filter],
  );

  const photoItems = useMemo(
    () =>
      visibleItems.filter(
        (item): item is GalleryPhotoItem => Boolean(item.src),
      ),
    [visibleItems],
  );

  const selectedItem =
    lightboxIndex === null ? null : photoItems[lightboxIndex] ?? null;

  const selectFilter = (option: Filter) => {
    setFilter(option);
    setLightboxIndex(null);
  };

  const navigateLightbox = useCallback(
    (direction: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null || photoItems.length === 0) return current;
        return (current + direction + photoItems.length) % photoItems.length;
      });
    },
    [photoItems.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') navigateLightbox(1);
      if (event.key === 'ArrowLeft') navigateLightbox(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, navigateLightbox]);

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
                This wall is for my clients — real installs, fresh lash sets
                and healed piercings, photographed here in{' '}
                {HOUSE.city} and shared with permission. New ones will be added as
                the chair keeps turning.
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
                    onClick={() => selectFilter(option)}
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
              className="mt-10 columns-3 gap-2 sm:gap-4 lg:columns-4 xl:columns-5"
            >
              {visibleItems.map((item, index) => {
                const photoIndex = item.src
                  ? photoItems.findIndex((photo) => photo.id === item.id)
                  : -1;

                return (
                  <Reveal
                    key={item.id}
                    delay={0.06 * (index % 3)}
                    className="mb-2 break-inside-avoid sm:mb-4"
                  >
                    <GalleryTile
                      item={item}
                      index={index}
                      onOpen={
                        photoIndex >= 0
                          ? () => setLightboxIndex(photoIndex)
                          : undefined
                      }
                    />
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="mt-10 border border-ivory-100/10 bg-ink-900/60 px-6 py-10 text-center font-sans text-[12px] font-light leading-relaxed text-ivory-300/70">
              No frames here yet — the first {filter.toLowerCase()} photos are on their way.
            </p>
          )}

          <Reveal delay={0.15}>
            <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ivory-100/10 pt-10">
              <p className="max-w-md font-sans text-[12px] font-light leading-[1.9] text-ivory-300/60">
                Every photo on this wall is a real client, shared with their
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

      <GalleryLightbox
        item={selectedItem}
        index={lightboxIndex ?? 0}
        total={photoItems.length}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
      />
    </main>
  );
}
