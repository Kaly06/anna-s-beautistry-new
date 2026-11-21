-- Anna's Beautistry: the studio read policy on bookings was created without
-- the matching table grant, so even the signed-in studio account got
-- "permission denied" when opening the admin bookings list.
--
-- Grant SELECT to authenticated; the RLS policy
-- "signed in studio can read bookings" still restricts rows to the studio
-- email, so no other signed-in (or anonymous) user can read anything.

grant select on table public.bookings to authenticated;

notify pgrst, 'reload schema';
