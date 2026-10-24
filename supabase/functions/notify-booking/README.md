# `notify-booking` — the email backup

A booking is saved to Supabase, and the customer is shown a one-tap WhatsApp message to Anna. That message is
the main path. This function is the safety net for when it never gets sent.

**It is optional.** Until the secrets below are set, the function answers `503`, the website ignores it, and
nothing the customer sees changes. So this can wait without blocking a launch.

---

## What it does

1. The booking form creates a hold.
2. It calls this function with the booking details.
3. The function emails the studio inbox with reference, service, time, price, client and notes.

## Before you start: wait for the domain

Resend's free plan only delivers to **the address the account was created with**, until a domain is verified.
So do this step *after* the domain and its inbox exist — sign up with `hello@annasbeautistry.com`, not with the
Gmail. Signing up early means redoing the account later.

If a launch cannot wait, sign up with `annasbeautistry@gmail.com` for now and treat it as temporary: adding the
verified domain later and changing `STUDIO_EMAIL` / `STUDIO_FROM` is a few minutes, not a rebuild.

## Setting it up (once, free)

1. **Create a free Resend account at <https://resend.com>** — sign up using the studio's real inbox
   (`hello@annasbeautistry.com` once it exists; `annasbeautistry@gmail.com` only as a stopgap).
2. Copy the **API key** (starts with `re_`).
3. In a terminal, at the repo root:

   ```bash
   supabase login
   supabase link --project-ref ueoowlqruzbjtgcxvxzp
   supabase secrets set RESEND_API_KEY=re_your_key_here
   supabase secrets set STUDIO_EMAIL=annasbeautistry@gmail.com
   supabase functions deploy notify-booking
   ```

4. Make a test booking on the site. The email should arrive within a few seconds.

No card is required for Resend's free tier (100 emails a day, comfortably more than this studio needs).

## When the domain exists

`onboarding@resend.dev` works, but the email will look like it came from Resend. Once a domain is bought,
verify it in Resend and set the sender:

```bash
supabase secrets set "STUDIO_FROM=Anna's Beautistry <bookings@annasbeautistry.com>"
supabase functions deploy notify-booking
```

## Changing the recipient

`STUDIO_EMAIL` is the only place the address lives. Update the secret, redeploy, done.
