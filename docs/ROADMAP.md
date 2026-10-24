# Anna's Beautistry — the roadmap

Everything between "a beautiful site that exists" and "a business that gets found
and gets booked." Written so it can be worked through top to bottom.

**Who** — `Me` = I do it. `You` = needs your login or your decision. `Both` = I walk you through it.
**Size** — `S` = under an hour · `M` = a few hours · `L` = a day or more.

---

## Right now — 24 October, after the merge

The site work is **merged into `main`** (PR #4), and this roadmap is rebased on top of it. The booking flow,
`/admin`, the real gallery, Anna's mobile number with a working WhatsApp link, the new hours and the real logo
are all in the code now. **Nothing is deployed yet** — that is the next big step.

> **The gap that matters most.** A booking is saved to the database and **nobody is told**. Anna gets no
> WhatsApp message and no email; `/admin` shows her blocked times, not her bookings. Today the only way to see
> a booking is to open Supabase. This is the first thing I want to build.

### Waiting on you

- [ ] `You` `S` **Anna sets her own admin password.** Supabase → Authentication → Users →
  `annasbeautistry@gmail.com` → **Reset password**. She chooses it; I can trigger the reset but must not pick
  it. Then she signs in at `/admin`. Needs the `site_url` off `localhost` first, or the link opens a dead page.
- [ ] `You` `S` **The domain.** Buy `annasbeautistry.com` in your own name (~$11/yr at Porkbun), or launch on
  the free `*.vercel.app` address first. Everything about SEO gets easier once this is decided.
- [ ] `Both` `S` **Re-authorise Vercel** — the current token can read the account but not see a single project.
  Nothing can be deployed until this is fixed.
- [ ] `You` `S` **Real social handles**, or say "remove them". The footer still points Instagram, Facebook and
  Twitter at their own homepages — dead ends.
- [ ] `You` `M` **Verify the prices and the testimonials.** Every figure in `menu.ts` is illustrative, and
  invented quotes on a small business site are a real risk.
- [ ] `You` `M` **Google Business Profile** — claim and verify it in Anna's name. This is what puts the studio
  in the map box; the website alone cannot.

### Waiting on me

- [ ] **Tell Anna.** WhatsApp handoff after saving, plus email as backup.
- [ ] **Deploy it properly** — `vercel.json`, real 404, `robots.txt`, sitemap.
- [ ] **The SEO pass** — share preview, structured data, canonical URLs.
- [ ] **Tidy the database** — revoke public execute on two trigger functions, add an ownership token to the
  payment endpoint, set the auth `site_url`.

### Merged — how the two branches were reconciled

The site branch merged first (PR #4), then this roadmap branch was rebased on top. **No conflicts.** The rule
that got us here is worth keeping: merge the big work first, rebase the paperwork onto it.

---

## Phase 0 — Decisions and accounts (no code)

- [x] `You` `S` **Anna's mobile number.** **Settled** — `+233 54 218 4583`, now in `src/data/house.ts` with a
  working `wa.me` link. The old landline is gone from the site.
- [x] `You` `S` **A real email address.** **Settled** — the site now prints `annasbeautistry@gmail.com`
  instead of an address that may not exist. A custom `hello@` inbox is a nice-to-have, not a blocker.
- [x] `You` `S` **The Google Maps pin.** **Settled** — Anna's own Maps share link for Nunoo's Heights Hostel
  is wired into `HOUSE.mapsHref`.
- [ ] `You` `S` Confirm the **domain**: buy `annasbeautistry.com` in your own name (~$11/yr), or launch on the free `*.vercel.app` address first.
- [ ] `Both` `S` **Re-authorise Vercel** — the current token can read the account but not a single project (both `projects` and `deployments` return Access denied).
- [x] `Both` `M` **Create the Supabase project** in *Kaly06's Org* — region `eu-west-1`.
  **Done 24 Oct** — `annas-beautistry`, ref `ueoowlqruzbjtgcxvxzp`, healthy, Postgres 17.
- [ ] `You` `S` Decide whether the **free Vercel plan** is acceptable until revenue covers ~$20/mo (it is, for a small studio site — see "The honest risks").
- [x] `Both` `S` **Whether to take payments.** **Decided in code** — a 30% deposit is expected by WhatsApp
  Mobile Money, the customer enters their payment reference, the balance is paid in the studio. No card
  details ever touch the site. If that is not what you want, say so now: it is written into the schema, the
  copy and the admin flow.

---

## Who owns what

It is **Anna's business**, so the things that carry her reputation go in her name. The rest can be held by
whoever builds it, and handed over.

| Thing | Name on it | Why |
| --- | --- | --- |
| Domain | **Anna** | Her name, her card. Never a developer's account. |
| Email inbox | **Anna** | Today it is her Gmail; a `hello@` address is optional polish. |
| Google Business Profile | **Anna** | Verification needs her; reviews attach for good. |
| WhatsApp number | **Anna's mobile** | Already exists, already checked hourly. |
| Vercel / GitHub / Supabase | Either | Add Anna as a member at handover. |
| Notion | **Nobody yet** | Optional. Do not create an account just to hold bookings. |

Handover is a real step, not an afterthought: transfer the domain, add her as project owner, move the recovery
email to hers.

---

## Phase 1 — Make it real (get it live, correctly)

The site has still never been hosted. Everything below is what breaks the first time it is.

- [ ] `Me` `M` **`vercel.json` with SPA rewrites.** Without it, `/services/wigs` and `/book` work when clicked
  and **404 on refresh** or when shared. This is the single most common way a site like this embarrasses
  itself. (Confirmed missing today.)
- [ ] `Me` `S` Connect the repo to Vercel, framework preset *Vite*, output `dist`, install `npm ci`.
- [ ] `Me` `S` **Preview deploys per pull request** — every change gets its own URL to look at before it goes live.
- [x] `Me` `S` **Environment variables.** **Handled** — `src/lib/supabase.ts` carries the public project URL and
  publishable key as fallbacks, so a missing env var cannot break the live site. `VITE_*` overrides still work.
  Worth setting them in Vercel anyway, so the values live in one place.
- [ ] `Me` `S` **A real 404 status** — the pretty `NotFound` page must return HTTP 404, not 200, or Google
  indexes your error page.
- [ ] `Me` `S` `robots.txt` — it does not exist at all yet. It must allow the site and point at the sitemap.
- [ ] `Me` `S` **Cache headers** for `/images/*` and hashed assets — faster repeat visits, free.
- [ ] `Me` `S` Check the site over a slow 3G connection and a mid-range Android, not just a laptop.
- [ ] `Me` `M` **Fix the placeholder social links.** The footer points Instagram, Facebook and Twitter at
  `instagram.com`, `facebook.com`, `twitter.com` — dead ends for anyone who taps them.
- [ ] `You` `S` Give me the **real social handles**, or say "remove them" (two real links beat three fake ones).

---

## Phase 2 — Make it save bookings

> **Status, 24 October.** This is largely **built and merged**, not pending. The form writes through
> `create_booking_hold` to Supabase, holds the slot for 30 minutes, refuses past dates, closed days, overlaps
> and Anna's Busy blocks, and maps every database error to a sentence a customer can act on. What is missing
> is the last mile: **telling Anna.** Treat the items below as a verification checklist with one real hole.

**Database**
- [x] `Me` `M` **Tables.** **Done 24 Oct** — three migrations: `bookable_services` (20 rows seeded),
  `bookings` (22 columns), `studio_closures`. Plus `create_booking_hold`, `get_busy_slots`,
  `get_booking_payment_status`, `submit_partial_payment_reference`.
- [x] `Me` `S` **Row-Level Security.** **Done 24 Oct.** RLS on all three tables. `bookings` deliberately has
  *no* policies — the public key is visible in every browser, so a raw insert policy would let anyone script
  fake bookings at invented prices. Bookings go through the `SECURITY DEFINER` function instead, which
  re-checks service, price, hours, overlaps and closures server-side.
- [x] `Me` `S` **`service_role` stays out of the bundle.** **Confirmed** — only the publishable key is used.
- [x] `Me` `S` **Currency is explicit.** **Done** — every money column is named `_ghs` (`starting_price_ghs`,
  `total_starting_price_ghs`, `deposit_due_ghs`). GH₵ is in the names, so it cannot drift into AED by accident.

**The form**
- [x] `Me` `M` **Wired to Supabase**, with real error states — "that time was just taken", "the hold expired",
  "we could not reach the calendar", each with a WhatsApp escape hatch.
- [x] `Me` `S` **Fallback:** if the calendar cannot be reached, the form points the customer at WhatsApp rather
  than pretending it worked.
- [x] `Me` `S` **No invented success.** The confirmation only appears after the row actually writes.
- [x] `Me` `S` **Validation:** past dates, opening hours, service duration, Ghana phone format, 18+ piercing
  consent, 120-character cap on notes — checked again inside the database, not just the browser.
- [x] `Me` `M` **Timezone honesty:** `Africa/Accra` throughout, with the studio's own opening hours table.
- [x] `Me` `S` Stores the **service slug and chosen option**, not a display name.

**After the booking — the real gap**
**Decided — where a booking goes:** Anna's **WhatsApp first**, **email as backup**. No dashboard for her to
remember to open.
- [ ] `Me` `M` **WhatsApp handoff — the most important task left.** After saving, the confirmation should end
  with a one-tap "send this booking to Anna" link, prefilled with reference, service, time and price. Today the
  only WhatsApp link on the page is in the error state: a successful booking tells **nobody**.
- [ ] `Me` `M` **Email backup** to `annasbeautistry@gmail.com` (Supabase edge function + Resend free tier), so a
  booking still reaches her if WhatsApp is down or a phone is lost.
- [ ] `Me` `S` **A list of bookings she can read** — the honest cheap version is a Supabase view she can open, or
  Notion (Phase 5). `/admin` currently shows only blocked times.
- [ ] `Me` `S` **Spam protection** without a captcha (honeypot field + a rate limit on the hold function).
  The database checks are good; nothing stops a bot looping the form yet.

---

## Phase 3 — Be found (SEO, in the order that actually pays)

- [ ] `You` `M` **Google Business Profile** — claim, verify, add hours, photos, and the booking link. This is what puts you in the map box; the website alone cannot.
- [x] `Me` `M` **Per-page titles.** **Done** — every route sets its own via `usePageTitle`, e.g.
  "Book a service — Anna's Beautistry". Google no longer sees the homepage title on every service page.
- [ ] `Me` `S` **Per-page descriptions.** Titles are done; the `<meta name="description">` is still one
  homepage sentence for every URL. This is the line Google shows under the link.
- [ ] `Me` `S` **Per-page social tags** — for the same reason, plus the share preview below.
- [ ] `Me` `M` **Fix the WhatsApp preview.** `og:image` is `/images/hero.webp` — a relative path in a format WhatsApp handles poorly, so a shared link likely shows a bare, photo-less card. Needs a 1200×630 JPEG at an absolute URL.
- [ ] `Me` `S` `sitemap.xml` + `robots.txt` pointing at it.
- [ ] `Me` `S` **`LocalBusiness` structured data** — address, hours, phone, price range — for the info box in search results.
- [ ] `Me` `S` `apple-touch-icon` and a small `manifest.webmanifest`, so it saves to a phone home screen looking deliberate.
- [ ] `Me` `S` Canonical URLs, and make sure the bare domain and `www` don't both serve the site.
- [ ] `You` `L` **Ask ten happy clients for a Google review.** Nothing I can code moves local ranking as much. Slow, free, decisive.
- [ ] `You` `S` Get the business listed on the places Ghanaians actually search: Instagram bio link, Google Maps, any local directory.

---

## Phase 4 — Make the content true

- [x] `You` `L` **Real studio photography.** **Largely done** — 21 gallery images and the service photography are
  in the repo now. Worth a pass to confirm every one is a real piece of work, and to shoot anything still
  standing in.
- [x] `You` `S` **The real logo.** **Done** — Anna's mark and the full lockup are in `public/images` and wired
  through `HOUSE.logoSrc` / `logoFullSrc` as processed gold-on-transparent WebP.
- [ ] `You` `M` **Verify every price and duration** in `menu.ts` (20 treatments) and `wigOptions.ts` (8 decision groups). Illustrative figures shipping to real customers is worse than no figures.
- [ ] `You` `M` **Verify the testimonials** in `services.ts` are from real clients, with permission. Invented quotes on a small business site are a real risk.
- [x] `You` `S` Check the **hours**, address and founding year. **Settled in code** — Mon–Fri 9am–7pm,
  Sat 10am–4pm, Sun closed, in both the footer and the booking calendar. Confirm with Anna that those really
  are her hours, because customers will hold her to them.
- [ ] `Me` `S` **Privacy note** — bookings are personal data. Ghana's Data Protection Act (Act 843) expects you to say what you collect and why. One honest page, linked from the form.
- [ ] `Me` `S` A **cancellation / deposit policy** page if you take money later. Agreeing this after a dispute is much harder.

---

## Phase 5 — Run it without me

- [ ] `Both` `M` **Optional — Notion cockpit.** `Studio Bookings` (mirrored from Supabase, one-way) and monthly
  totals posted into Finance HQ. **Not needed for launch:** bookings already land in Anna's WhatsApp and
  email, and a dashboard she has to remember to open is a step backwards. Build it only if she asks for
  "one list of all my bookings".
- [ ] `Both` `S` **Linear:** project "Anna's Beautistry", the Phase 1–3 items as issues, GitHub integration on, PR preview URLs attached to their issue.
- [ ] `Me` `S` **Analytics** — something privacy-friendly and free (Vercel Analytics or Plausible). You need to know whether *anyone* is visiting before you spend on anything else.
- [ ] `Me` `S` **Backups:** a monthly CSV export of `bookings` to your own drive. Free databases do not owe you a backup.
- [ ] `Me` `S` **Uptime check** on the site and a wake-up ping for Supabase, so the week-long nap never reaches a real customer.
- [ ] `You` `S` Know the two alarms: Supabase paused (click Restore), and domain renewal (do not let it lapse).

---

## Phase 6 — Later, once it earns

Not now. Listed so the design doesn't foreclose them.

- [ ] **Deposits / payments** — Paystack handles cards and Mobile Money in Ghana. Only after bookings justify the fee and the refund policy exists.
- [ ] **Multiple staff / chairs** — calendar per stylist; a real scheduling model, not just a list of requests.
- [ ] **Retail** — selling wigs or aftercare online needs stock, shipping and tax. A different business, not a different page.
- [ ] **Blog / looks journal** — the cheapest long-term SEO, if someone will actually write it.
- [ ] **Bilingual** — English/Fante, if the audience wants it.

---

## The honest risks

- **Vercel's free plan** is meant for personal projects. Realistic outcome for a small studio site: an email suggesting you upgrade. Not: deletion, or a surprise bill. **Your code lives on GitHub**, so moving hosts is an afternoon, not a rescue.
- **Supabase free pauses after ~a week of no use**, and a booking submitted while asleep is lost. Phase 2's `wa.me` fallback and Phase 5's wake-up ping both exist for exactly this.
- **The domain is the one that bites.** Let it lapse and someone else can buy your name. Keep it paid, in your name.
- **Nothing here needs a card to start.** If any screen demands one, stop and ask me.

---

## The shortest path to a customer actually booking

If everything else waits, do these six. Two are already done.

1. ~~Supabase project, `bookings` table, RLS.~~ **Done.**
2. ~~The form writes the row.~~ **Done.**
3. **Tell Anna** when it happens — WhatsApp handoff, email behind it. Without this, bookings exist only in a
   database nobody opens.
4. **Deploy it properly** — `vercel.json` rewrites, and a real 404 instead of a soft one.
5. **Google Business Profile** claimed and verified in Anna's name.
6. **Share preview fixed** — an absolute 1200×630 JPEG, so a WhatsApp link shows a photo, not a bare card.

That is a working, findable, honest site — and everything else on this page is polish.
