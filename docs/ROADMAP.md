# Anna's Beautistry — the roadmap

Everything between "a beautiful site that exists" and "a business that gets found
and gets booked." Written so it can be worked through top to bottom.

**Who** — `Me` = I do it. `You` = needs your login or your decision. `Both` = I walk you through it.
**Size** — `S` = under an hour · `M` = a few hours · `L` = a day or more.

---

## Right now — what's waiting on you

From the other working chat, which built the booking backend, `/admin`, `/gallery` and the new hours/footer.
**That work is on a different branch and is not merged.** This branch contains none of it — I checked.

- [ ] `You` `L` **CRITICAL — the booking database has gone.** The Supabase project is no longer there.
  Either reconnect the account that owns it, or create a fresh project and send me its **Project URL +
  publishable key** (Settings → API). I will re-run both migrations and reconnect the site myself.
- [ ] `You` `S` **Anna's admin login** — once the backend is back: Supabase → Authentication → Users → Add user,
  her email and a password *she* chooses. Then she can sign in at `/admin` and block her busy times.
  I cannot set her password for her, and I should not.
- [ ] `You` `S` **Google Maps pin** for the exact studio spot — I will point the Location card at it precisely.
- [ ] `You` `L` **Real gallery photos** — `/gallery` still shows ten placeholders.
- [ ] `Me` `S` **Open the pull request into `main`** when you say so. Everything so far, this roadmap included,
  sits unmerged until then.

### The two-branch problem — read before merging

Two unmerged branches exist now: this one (roadmap only) and the one holding the site work. Merging both
can conflict, and a conflict in `main` is much worse than a delay. Simplest order: **merge the site work
first**, then I rebase this roadmap onto it. Tell me which you want; do not merge them blind.

---

## Phase 0 — Decisions and accounts (no code)

- [ ] `You` `S` Confirm the **domain**: buy `annasbeautistry.com` in your own name (~$12/yr), or launch on the free `*.vercel.app` address first.
- [ ] `You` `S` Confirm **`hello@annasbeautistry.gh` actually receives mail** — the site prints it in the footer and nav. If not, use a real inbox (Gmail is fine) or remove it.
- [ ] `You` `S` **Get Anna's mobile number.** Bookings route to her WhatsApp, and the number on the site
  (`+233 33 213 0455`) is a Cape Coast **landline** — landlines cannot receive WhatsApp. Needs a
  `+233 2x/5x` mobile, with WhatsApp actually on it.
- [ ] `You` `S` Decide which of the two numbers goes on the site: a clickable WhatsApp link, or the landline
  for calls. Both is fine; a `wa.me` link pointing at a landline is not.
- [ ] `Both` `S` **Re-authorise Vercel** — the current token can read the account but not a single project (both `projects` and `deployments` return Access denied).
- [ ] `Both` `M` **Create the Supabase project** in *Kaly06's Org* — region `eu-west-1` (lowest latency to Cape Coast; there is no Africa region on the free tier).
- [ ] `You` `S` Decide whether the **free Vercel plan** is acceptable until revenue covers ~$20/mo (it is, for a small studio site — see "The honest risks").
- [ ] `You` `S` Decide **whether to take payments**: nothing at booking (today's promise), or a refundable deposit later. Nothing in Phase 2 depends on it.

---

## Who owns what

It is **Anna's business**, so the things that carry her reputation go in her name. The rest can be held by
whoever builds it, and handed over.

| Thing | Name on it | Why |
| --- | --- | --- |
| Domain | **Anna** | Her name, her card. Never a developer's account. |
| `hello@annasbeautistry.com` | **Anna** | Clients are writing to *her*. |
| Google Business Profile | **Anna** | Verification needs her; reviews attach for good. |
| WhatsApp number | **Anna's mobile** | Already exists, already checked hourly. |
| Vercel / GitHub / Supabase | Either | Add Anna as a member at handover. |
| Notion | **Nobody yet** | Optional. Do not create an account just to hold bookings. |

Handover is a real step, not an afterthought: transfer the domain, add her as project owner, move the recovery
email to hers.

---

## Phase 1 — Make it real (get it live, correctly)

Right now the site has never been hosted. Everything below is what breaks the first time it is.

- [ ] `Me` `M` **`vercel.json` with SPA rewrites.** Without it, `/services/wigs` works when clicked and **404s on refresh** or when shared. This is the single most common way a site like this embarrasses itself.
- [ ] `Me` `S` Connect the repo to Vercel, framework preset *Vite*, output `dist`, install `npm ci`.
- [ ] `Me` `S` **Preview deploys per pull request** — every change gets its own URL to look at before it goes live.
- [ ] `Me` `S` Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, on Production **and** Preview.
- [ ] `Me` `S` **A real 404 status** — the pretty `NotFound` page must return HTTP 404, not 200, or Google indexes your error page.
- [ ] `Me` `S` Confirm **`robots.txt` doesn't block the whole site** by accident (it currently doesn't exist at all).
- [ ] `Me` `S` **Cache headers** for `/images/*` and hashed assets — faster repeat visits, free.
- [ ] `Me` `S` Check the site over a slow 3G connection and a mid-range Android, not just a laptop.
- [ ] `Me` `M` **Fix the placeholder social links.** The footer points Instagram, Facebook and Twitter at `instagram.com`, `facebook.com`, `twitter.com` — dead ends for anyone who taps them.
- [ ] `You` `S` Give me the **real social handles**, or say "remove them" (two real links beat three fake ones).

---

## Phase 2 — Make it save bookings (the actual missing piece)

> **Status note.** On *this* branch `Booking.tsx` still calls `setSent(true)` and discards the details.
> The other branch has a real backend, `/admin` and migrations — but its Supabase project has gone, so
> that work cannot run either until the project is restored. Treat the items below as the checklist for
> verifying that branch once it is live again, not as unbuilt work.

**Database**
- [ ] `Me` `M` Tables: `bookings`, `treatments` (19 rows seeded from `menu.ts`), `treatment_rooms`, `wig_option_groups`, `wig_options` (from `wigOptions.ts`).
- [ ] `Me` `S` **Row-Level Security**: the public may `insert` a booking and read active treatments — nothing else. No deletes, no reads of other people's bookings, ever.
- [ ] `Me` `S` Keep `service_role` out of the browser bundle. Only the anon key ships.
- [ ] `Me` `S` `amount_minor` + `currency` stored as *two* columns. The studio prices in **GH₵**; your Notion Finance HQ is in **AED**. Never mix them silently.

**The form**
- [ ] `Me` `M` Wire the form to Supabase, with a **real error state** ("we didn't get that — call us on …") instead of a fake success.
- [ ] `Me` `S` **Fallback:** if env vars are missing or the database is down, the form falls back to a `wa.me` link carrying the details prefilled. A booking never silently dies.
- [ ] `Me` `S` No invented success. The "we'll reply within 24 hours" copy only shows after the row actually writes.
- [ ] `Me` `S` **Validate properly:** reject past dates, sanity-check the Ghana phone format, cap `notes` length.
- [ ] `Me` `S` **Spam protection** without a captcha (honeypot field + rate limit). Captchas cost bookings.
- [ ] `Me` `M` **Timezone honesty:** store `Africa/Accra` deliberately, don't trust the browser's clock.
- [ ] `Me` `S` Store the **service slug and room**, not a display name — so a reworded treatment doesn't orphan old bookings.

**After the booking**
**Decided — where a booking goes:** Anna's **WhatsApp first**, **email as backup**. No dashboard for her to
remember to open.
- [ ] `Me` `M` **WhatsApp handoff:** after saving, offer a one-tap "message us now" link with the booking summary prefilled. The copy already promises WhatsApp — the site currently has **no WhatsApp link anywhere**, which is the biggest contradiction in it.
- [ ] `Me` `M` **Email backup** to `hello@annasbeautistry.com` (Supabase edge function + Resend free tier), so a
booking still reaches her if WhatsApp is down, the site is idle, or a phone is lost.
- [ ] `Me` `S` **The bookings page you read** — via Notion (Phase 4), not a custom admin panel. Cheaper, and you already know the tool.

---

## Phase 3 — Be found (SEO, in the order that actually pays)

- [ ] `You` `M` **Google Business Profile** — claim, verify, add hours, photos, and the booking link. This is what puts you in the map box; the website alone cannot.
- [ ] `Me` `M` **Per-page titles and descriptions.** No page sets its own today (`grep document.title` → nothing), so Google sees the homepage title for *every* treatment page.
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

- [ ] `You` `L` **Real studio photography.** `public/images` are placeholders — the README says so. Hero and the four room cards first; the 19 service images can follow.
- [ ] `You` `S` **The real logo.** `HOUSE.logoSrc` is `null`; the site falls back to the typographic lockup. Drop a transparent SVG/PNG in and set the path.
- [ ] `You` `M` **Verify every price and duration** in `menu.ts` (19 treatments) and `wigOptions.ts` (8 decision groups). Illustrative figures shipping to real customers is worse than no figures.
- [ ] `You` `M` **Verify the testimonials** in `services.ts` are from real clients, with permission. Invented quotes on a small business site are a real risk.
- [ ] `You` `S` Check the **hours** (`Tue–Sat · 9am–7pm`), address, and founding year (2016).
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

If everything else waits, do these six:

1. `vercel.json` rewrites → the site survives a refresh.
2. Supabase project + `bookings` table + RLS.
3. Form writes the row; `wa.me` fallback behind it.
4. Real social links, or none.
5. Google Business Profile claimed.
6. Share preview fixed.

That is a working, findable, honest site — and everything else on this page is polish.
