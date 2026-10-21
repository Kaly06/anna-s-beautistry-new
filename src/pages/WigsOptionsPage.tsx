import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import type { WigOptionGroup } from '../types';
import { WIG_BASE, WIG_FAQ, WIG_GROUPS, WIG_REFUSALS, WIG_STEPS } from '../data/wigOptions';
import { formatPrice, HOUSE } from '../data/house';
import { rooms } from '../data/rooms';
import { specimen } from '../lib/specimens';
import { EASE } from '../lib/animations';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import SplitText from '../components/ui/SplitText';
import Specimen from '../components/ui/Specimen';
import Magnetic from '../components/ui/Magnetic';

type Selection = Record<string, string[]>;

/** Every group starts on the house recommendation. */
const INITIAL: Selection = Object.fromEntries(
  WIG_GROUPS.map((group) => [
    group.id,
    group.options.filter((option) => option.recommended).map((option) => option.id),
  ])
);

const room = rooms.wigs;

export default function WigsOptionsPage() {
  const [selection, setSelection] = useState<Selection>(INITIAL);
  const [copied, setCopied] = useState(false);

  const toggle = (group: WigOptionGroup, optionId: string) => {
    setSelection((current) => {
      const chosen = current[group.id] ?? [];
      if (group.multi) {
        return {
          ...current,
          [group.id]: chosen.includes(optionId)
            ? chosen.filter((id) => id !== optionId)
            : [...chosen, optionId],
        };
      }
      return { ...current, [group.id]: [optionId] };
    });
  };

  const build = useMemo(
    () =>
      WIG_GROUPS.map((group) => ({
        group,
        chosen: group.options.filter((option) => (selection[group.id] ?? []).includes(option.id)),
      })),
    [selection]
  );

  const total = useMemo(
    () =>
      WIG_BASE.price +
      build.reduce(
        (sum, row) => sum + row.chosen.reduce((lineSum, option) => lineSum + option.add, 0),
        0
      ),
    [build]
  );

  /** The sheet as plain text — for the clipboard, an email, or WhatsApp. */
  const sheetText = useMemo(() => {
    const lines = build
      .filter((row) => row.chosen.length > 0)
      .map(
        (row) =>
          `${row.group.name} — ${row.chosen.map((option) => `${option.name} (${option.spec})`).join(', ')}`
      );
    return [`Wig build — ${formatPrice(total)}`, '', ...lines, '', WIG_BASE.note].join('\n');
  }, [build, total]);

  const mailto = `mailto:${HOUSE.email}?subject=${encodeURIComponent(
    `Wig build — ${formatPrice(total)}`
  )}&body=${encodeURIComponent(`${sheetText}\n\nName:\nPhone:\nPreferred week:\n`)}`;

  const copySheet = async () => {
    try {
      await navigator.clipboard.writeText(sheetText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-ivory-100/[0.07] bg-ink-950 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-gold-500/[0.07] blur-[130px]" />

        <div className="container-luxe relative">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-3">
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
              className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-400 transition-colors hover:text-gold-200"
            >
              Services
            </Link>
            <span className="h-px w-5 bg-ivory-100/20" />
            <Link
              to="/services/wigs"
              className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-400 transition-colors hover:text-gold-200"
            >
              {room.name}
            </Link>
            <span className="h-px w-5 bg-ivory-100/20" />
            <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-200">
              Options
            </span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow index={room.numeral}>{room.name} · Options</Eyebrow>

              <h1 className="mt-7 font-display text-[clamp(2.9rem,7vw,6.25rem)] font-light leading-[0.92] tracking-[-0.025em] text-ivory-50">
                <SplitText text="The options" className="block" />
                <SplitText text="sheet." delay={0.12} className="block italic text-gold-200" />
              </h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
                className="mt-8 max-w-xl font-sans text-[13px] font-light leading-[1.95] text-ivory-300/70"
              >
                A lace unit is not one product. It is eight decisions taken in order — the
                install, the lace, the frontpiece, the cap, the density, the length, the
                texture, the colour — and then whatever the hairline still needs. Build it
                here, and the estimate moves with you.
              </m.p>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4"
              >
                {[
                  { value: String(WIG_GROUPS.length), label: 'Lines to choose' },
                  { value: formatPrice(WIG_BASE.price), label: 'Install, from' },
                  { value: '2–4 hrs', label: 'In the chair' },
                ].map((stat, index) => (
                  <div key={stat.label} className="flex items-center gap-x-10">
                    {index > 0 ? <div className="h-10 w-px bg-ivory-100/15" /> : null}
                    <div>
                      <p className="font-display text-4xl font-light text-gold-200">{stat.value}</p>
                      <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </m.div>
            </div>

            <div className="lg:col-span-5">
              <m.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
                className="relative mx-auto aspect-square w-full max-w-[400px]"
              >
                <div className="absolute inset-0 rounded-full border border-ivory-100/[0.07]" />
                <div className="absolute inset-8 rounded-full border border-ivory-100/[0.05]" />
                <div className="absolute inset-0 animate-float">
                  <Specimen
                    prims={specimen('wigs', 1)}
                    id="wigs-options-hero"
                    glow
                    strokeWidth={0.95}
                    className="h-full w-full"
                  />
                </div>
                <p className="absolute inset-x-0 -bottom-4 text-center font-sans text-[9px] uppercase tracking-[0.26em] text-ivory-500">
                  Lace cap — study drawing
                </p>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- builder */}
      <section id="build" className="scroll-mt-24 bg-ink-950 py-16 sm:py-20">
        <div className="container-luxe">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* -------------------------------------------------- summary */}
            <aside className="lg:order-2 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="border border-gold-300/25 bg-[radial-gradient(130%_110%_at_50%_0%,#341b4e_0%,#200b35_55%,#170429_100%)] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/80">
                      Your build
                    </p>
                    <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-500">
                      {build.reduce((count, row) => count + row.chosen.length, 0)} chosen
                    </span>
                  </div>

                  <p className="mt-6 font-display text-[clamp(2.6rem,4vw,3.4rem)] font-light leading-none text-gold-200">
                    {formatPrice(total)}
                  </p>
                  <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.24em] text-ivory-500">
                    Estimate · install, hair &amp; finishing
                  </p>

                  <dl className="mt-7 space-y-2.5 border-t border-ivory-100/15 pt-6">
                    {build.map((row) => (
                      <div key={row.group.id} className="flex items-baseline justify-between gap-4">
                        <dt className="font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-500">
                          {row.group.name}
                        </dt>
                        <dd className="text-right font-sans text-[11px] font-light leading-snug text-ivory-200">
                          {row.chosen.length > 0
                            ? row.chosen.map((option) => option.spec).join(' · ')
                            : '—'}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex items-center justify-between border-t border-ivory-100/15 pt-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-ivory-500">
                      Base install
                    </span>
                    <span className="font-sans text-[11px] text-ivory-300">
                      {formatPrice(WIG_BASE.price)}
                    </span>
                  </div>

                  <div className="mt-7 space-y-3">
                    <Link to="/book" className="btn-gold w-full !px-5 !py-3.5">
                      Book this build
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                    </Link>
                    <a href={mailto} className="btn-ghost w-full !px-5 !py-3.5">
                      Email the sheet
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.4} />
                    </a>
                    <button
                      type="button"
                      onClick={copySheet}
                      className="flex w-full items-center justify-center gap-2 py-1 font-sans text-[9px] uppercase tracking-[0.22em] text-ivory-400 transition-colors hover:text-gold-200"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" strokeWidth={1.6} />
                          Copied to clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" strokeWidth={1.4} />
                          Copy the sheet
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-5 font-sans text-[10px] font-light leading-relaxed text-ivory-400/80">
                    {WIG_BASE.note} The final quote is confirmed in the chair, after we have
                    seen your hairline and the unit.
                  </p>
                </div>
              </div>
            </aside>

            {/* --------------------------------------------------- choices */}
            <div className="space-y-14 lg:order-1 lg:col-span-8">
              {WIG_GROUPS.map((group, groupIndex) => (
                <Reveal key={group.id} delay={0.02}>
                  <div
                    id={group.id}
                    role="group"
                    aria-labelledby={`${group.id}-question`}
                    className="scroll-mt-28"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-sm italic text-gold-200/80">
                        {String(groupIndex + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h2
                          id={`${group.id}-question`}
                          className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-light leading-tight text-ivory-50"
                        >
                          {group.question}
                        </h2>
                        <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.28em] text-gold-300/70">
                          {group.name}
                          {group.multi ? ' · choose any' : ' · choose one'}
                        </p>
                      </div>
                    </div>
                    {group.intro ? (
                      <p className="mt-4 max-w-xl font-sans text-[11.5px] font-light leading-[1.85] text-ivory-400">
                        {group.intro}
                      </p>
                    ) : null}

                    <div
                      className={`mt-6 grid gap-3 ${
                        group.options.length > 6 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
                      }`}
                    >
                      {group.options.map((option) => {
                        const active = (selection[group.id] ?? []).includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggle(group, option.id)}
                            aria-pressed={active}
                            className={`group relative flex flex-col border p-4 text-left transition-colors duration-500 ease-luxe ${
                              active
                                ? 'border-gold-300/60 bg-gold-300/[0.07]'
                                : 'border-ivory-100/[0.12] bg-ink-900/30 hover:border-ivory-100/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="flex items-center gap-2">
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                    active
                                      ? 'border-gold-300 bg-gold-300 text-ink-950'
                                      : 'border-ivory-100/30'
                                  }`}
                                >
                                  {active ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                                </span>
                                <span className="font-sans text-[8.5px] uppercase tracking-[0.24em] text-ivory-500">
                                  {option.spec}
                                </span>
                              </span>
                              <span
                                className={`shrink-0 font-sans text-[9px] uppercase tracking-[0.12em] ${
                                  option.add === 0 ? 'text-ivory-500' : 'text-gold-200'
                                }`}
                              >
                                {option.add === 0 ? 'Included' : `+${formatPrice(option.add)}`}
                              </span>
                            </div>

                            <span className="mt-3 font-display text-xl font-light leading-snug text-ivory-50">
                              {option.name}
                            </span>

                            <span className="mt-2 font-sans text-[10.5px] font-light leading-[1.75] text-ivory-400">
                              {option.detail}
                            </span>

                            {option.note ? (
                              <span className="mt-2.5 font-sans text-[10px] font-light italic leading-relaxed text-ivory-500">
                                {option.note}
                              </span>
                            ) : null}

                            {option.meta ? (
                              <span className="mt-3 inline-flex w-fit border border-ivory-100/15 px-2 py-0.5 font-sans text-[8px] uppercase tracking-[0.2em] text-gold-300/70">
                                {option.meta}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}

              <div className="flex flex-col items-start justify-between gap-5 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-center">
                <p className="max-w-md font-sans text-[11px] font-light leading-relaxed text-ivory-400">
                  Undecided on any line? Leave it on the house recommendation and we will take
                  it through in the consultation.
                </p>
                <button
                  type="button"
                  onClick={() => setSelection(INITIAL)}
                  className="link-underline shrink-0"
                >
                  Reset to the house build
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- steps */}
      <section className="border-t border-ivory-100/[0.07] bg-ink-900 py-20 sm:py-24">
        <div className="container-luxe">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow>How the sheet is read</Eyebrow>
              <h2 className="mt-6 max-w-xl">
                <SplitText
                  text="Four steps, in this order."
                  className="display-3 block text-ivory-50"
                />
              </h2>
            </div>
            <p className="max-w-sm font-sans text-[12px] font-light leading-[1.9] text-ivory-300/60">
              Nothing is ordered until you have seen the swatch, the sample and the number.
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-ivory-100/10 bg-ivory-100/10 sm:grid-cols-2 lg:grid-cols-4">
            {WIG_STEPS.map((step, index) => (
              <m.div
                key={step.numeral}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.9, ease: EASE, delay: index * 0.07 }}
                className="flex flex-col bg-ink-950 p-7"
              >
                <span className="font-display text-sm italic text-gold-200/80">{step.numeral}</span>
                <h3 className="mt-6 font-display text-2xl font-light text-ivory-50">
                  {step.title}
                </h3>
                <p className="mt-3 font-sans text-[11px] font-light leading-[1.8] text-ivory-400">
                  {step.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- refusals */}
      <section className="bg-ink-950 py-20 sm:py-24">
        <div className="container-luxe">
          <div className="grid gap-10 border-y border-ivory-100/10 py-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>The small print</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-light leading-[1.05] text-ivory-50">
                What we will not do,
                <span className="block italic text-gold-200">whatever the sheet says.</span>
              </h2>
            </div>
            <ul className="lg:col-span-8 lg:col-start-5">
              {WIG_REFUSALS.map((line, index) => (
                <li
                  key={line}
                  className="flex items-start gap-5 border-b border-ivory-100/10 py-5 first:border-t first:border-ivory-100/10"
                >
                  <span className="font-display text-sm italic text-gold-200/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-sans text-[12.5px] font-light leading-[1.9] text-ivory-300/75">
                    {line}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="border-t border-ivory-100/[0.07] bg-ink-950 pb-20 pt-20 sm:pb-24 sm:pt-24">
        <div className="container-luxe">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Asked in the chair</Eyebrow>
              <h2 className="mt-6 display-3 text-ivory-50">Questions, answered.</h2>
              <p className="mt-5 max-w-xs font-sans text-[11.5px] font-light leading-[1.9] text-ivory-400">
                Anything not here, ask before you book — we would rather talk you out of a
                unit than fit the wrong one.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {WIG_FAQ.map((entry) => (
                <details
                  key={entry.q}
                  className="group border-b border-ivory-100/10 py-5 first:border-t first:border-ivory-100/10"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-xl font-light text-ivory-100 transition-colors group-hover:text-gold-100">
                      {entry.q}
                    </span>
                    <span className="font-sans text-lg leading-none text-gold-300/70 transition-transform duration-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-xl font-sans text-[11.5px] font-light leading-[1.9] text-ivory-400">
                    {entry.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="border-t border-ivory-100/10 bg-ink-900 py-16">
        <div className="container-luxe flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl font-light text-ivory-100">
              Bring the sheet to the chair.
            </p>
            <p className="mt-2 font-sans text-[10.5px] font-light tracking-wide text-ivory-400">
              {HOUSE.hours} · {HOUSE.address[0]}, {HOUSE.city}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic strength={0.16}>
              <Link to="/services/wigs" className="btn-ghost group">
                The wigs menu
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.4}
                />
              </Link>
            </Magnetic>
            <Magnetic strength={0.16}>
              <Link to="/book" className="btn-gold group">
                Book a service
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-1"
                  strokeWidth={1.4}
                />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
