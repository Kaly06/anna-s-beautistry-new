/**
 * Infinite ticker. Two identical halves translating -50% give a seamless loop;
 * the second copy is hidden from assistive tech.
 */
export default function Marquee({ phrases }: { phrases: string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-ivory-100/10 bg-ink-900 py-5">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-12 pr-12"
          >
            {phrases.map((phrase) => (
              <div key={phrase} className="flex items-center gap-12">
                <span className="whitespace-nowrap font-display text-xl italic text-ivory-200/85 sm:text-2xl">
                  {phrase}
                </span>
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400/70" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
    </div>
  );
}
