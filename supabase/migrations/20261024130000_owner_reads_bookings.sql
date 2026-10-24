-- Anna needs to read her own bookings.
--
-- `bookings` deliberately has no INSERT policy: the publishable key lives in
-- every browser, so a raw insert would let anyone script fake bookings at
-- invented prices and hours. Writes still go only through create_booking_hold().
--
-- Reading is a different question. Sign-ups are disabled on this project, so
-- the only account that can exist is the studio's own. This grants that account
-- SELECT and nothing else — no inserts, no updates, no deletes.

create policy "signed in studio can read bookings"
  on public.bookings
  for select
  to authenticated
  using (true);
