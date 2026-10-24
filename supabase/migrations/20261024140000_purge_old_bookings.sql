-- Anna's Beautistry: keep the twelve-month promise the privacy page makes.
--
-- /privacy tells clients their booking details are deleted twelve months after
-- the appointment. That promise needs a machine behind it, not a memory.
--
-- pg_cron runs this monthly at 03:15 on the first. The function is SECURITY
-- DEFINER and revoked from every client role, so nothing in the browser can
-- call it.

create or replace function public.purge_old_bookings()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.bookings
   where ends_at < now() - interval '12 months';

  get diagnostics removed = row_count;
  return removed;
end;
$$;

comment on function public.purge_old_bookings() is
  'Deletes bookings whose appointment ended more than twelve months ago. Scheduled monthly by pg_cron; also safe to run by hand.';

revoke all on function public.purge_old_bookings() from public;
revoke all on function public.purge_old_bookings() from anon, authenticated;

create extension if not exists pg_cron;

select cron.unschedule('purge-old-bookings')
 where exists (select 1 from cron.job where jobname = 'purge-old-bookings');

select cron.schedule(
  'purge-old-bookings',
  '15 3 1 * *',
  $$select public.purge_old_bookings();$$
);
