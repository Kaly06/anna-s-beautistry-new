import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import { HOUSE } from '../data/house';
import { usePageMeta } from '../lib/usePageTitle';

/**
 * The privacy note. Deliberately short and in plain language: Ghana's Data
 * Protection Act (Act 843) expects a business collecting personal data to say
 * what it collects, why, who sees it and how to get it removed. Four honest
 * paragraphs do that better than a wall of borrowed legal text.
 *
 * If the site ever gains analytics, advertising pixels or a real email inbox,
 * this page must change in the same commit.
 */
export default function PrivacyPage() {
  usePageMeta({
    title: 'Privacy',
    description:
      "What Anna's Beautistry collects when you book, why, who can see it, and how to have it deleted.",
    path: '/privacy',
  });

  return (
    <section className="bg-ink-950 pb-28 pt-32 sm:pt-40">
      <div className="container-luxe">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.28em] text-ivory-400 transition-colors hover:text-gold-200"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.4} />
          Back to the studio
        </Link>

        <Reveal>
          <div className="mt-10">
            <Eyebrow>The fine print, in plain words</Eyebrow>
            <h1 className="mt-7 display-2 max-w-3xl text-ivory-50">
              What we know about you, <span className="italic text-gold-200">and why.</span>
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
              Anna&apos;s Beautistry is one person and one chair. This page says exactly what
              happens to the details you type into the booking form — no more, no less.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-7">
            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                What we collect
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                Only what a booking needs: your name, your WhatsApp number, the treatment you
                chose, the date and time, and anything you write in the notes box. If you book a
                piercing, you also confirm your age.
              </p>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                That is the whole list. There is no account to create, no password on the booking
                form, and no card details are ever collected by this site — payment happens
                directly between you and the studio by Mobile Money or transfer.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                Why we keep it
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                To hold your time, to send you the payment details on WhatsApp, and to know who is
                coming to the studio. Nothing else. Your details are never used for advertising,
                never sold, and never shared with another business.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                Who can see it
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                Anna, and nobody else. Bookings are stored in a database provided by Supabase,
                hosted in the European Union, and the database is configured so that only a
                signed-in studio account can read them. The person who built this site also holds
                the keys to that account and can technically access bookings — that is stated here
                plainly rather than hidden.
              </p>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                The WhatsApp message you send after booking is a message from your own phone to the
                studio. It is your message, sent through WhatsApp, and WhatsApp&apos;s own privacy
                terms apply to it.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                How long we keep it
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                Up to twelve months after your appointment, so the studio has a record of what was
                done and what was paid. After twelve months it is deleted automatically — no one
                has to remember. Ask sooner and it goes sooner.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                Your rights
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                Under Ghana&apos;s Data Protection Act (Act 843) you can ask what is held about
                you, ask for a correction, or ask for it to be deleted. One message to the studio
                is enough — no form, no fee. It will be done, and you will be told when it is.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                Biscuits, trackers, and everything else
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                This site sets no advertising cookies, runs no analytics and no tracking pixels,
                and does not profile you. Your browser is only asked to remember two things
                locally, on your own device: which treatments you were looking at, and a booking
                you started. Clearing your browser data removes both, and nothing is sent anywhere
                by doing so.
              </p>
            </div>

            <div className="border-t border-ivory-100/10 pt-10">
              <h2 className="font-display text-[1.35rem] font-light text-ivory-100">
                Questions, or want it removed?
              </h2>
              <p className="mt-4 font-sans text-[13px] font-light leading-[1.95] text-ivory-300/75">
                Message the studio and say what you would like. A person reads it, not a system.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                <li>
                  <a
                    href={HOUSE.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-gold-200 hover:text-gold-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.4} />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={HOUSE.phoneHref}
                    className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-gold-200 hover:text-gold-100"
                  >
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.4} />
                    {HOUSE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${HOUSE.email}`}
                    className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-gold-200 hover:text-gold-100"
                  >
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.4} />
                    {HOUSE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-gold-300/25 bg-gold-300/[0.04] px-6 py-7">
              <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold-200">
                The short version
              </p>
              <ul className="mt-6 space-y-4 font-sans text-[12px] font-light leading-relaxed text-ivory-300/80">
                <li>Your name, number, treatment, time and notes. Nothing more.</li>
                <li>No card details, ever.</li>
                <li>Only Anna can read it.</li>
                <li>No ads, no analytics, no tracking.</li>
                <li>Deleted automatically twelve months after your appointment.</li>
                <li>Ask any time and it goes sooner.</li>
              </ul>
            </div>
            <p className="mt-6 font-sans text-[11px] font-light leading-relaxed text-ivory-500">
              Last updated 24 October 2026.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
