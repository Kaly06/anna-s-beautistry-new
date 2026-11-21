-- Anna's Beautistry: security hardening pass.
--
-- 1. Studio-only policies: bookings and studio_closures previously allowed
--    *any* authenticated user (policies used `using (true)`). Sign-ups are
--    disabled today, but if they are ever enabled, any signed-in account
--    could read every booking or rewrite the studio calendar. These policies
--    now require the studio account's email.
--
-- 2. Booking IDOR: get_booking_payment_status and
--    submit_partial_payment_reference previously accepted only a booking UUID.
--    They now also require the human booking reference (AB-XXXXXXXX), so a
--    guessed or leaked UUID alone is not enough to read or mutate a booking.
--
-- 3. Length limits: bound the free-text fields so a scripted client cannot
--    stuff megabytes into a single booking row.

-- ---------------------------------------------------------------------------
-- 1. Studio-only RLS policies
-- ---------------------------------------------------------------------------

drop policy if exists "signed in studio can read bookings" on public.bookings;
create policy "signed in studio can read bookings"
  on public.bookings
  for select
  to authenticated
  using (coalesce(auth.jwt() ->> 'email', '') = 'annasbeautistry@gmail.com');

drop policy if exists "Studio can add closures" on public.studio_closures;
create policy "Studio can add closures"
  on public.studio_closures
  for insert
  to authenticated
  with check (coalesce(auth.jwt() ->> 'email', '') = 'annasbeautistry@gmail.com');

drop policy if exists "Studio can update closures" on public.studio_closures;
create policy "Studio can update closures"
  on public.studio_closures
  for update
  to authenticated
  using (coalesce(auth.jwt() ->> 'email', '') = 'annasbeautistry@gmail.com')
  with check (coalesce(auth.jwt() ->> 'email', '') = 'annasbeautistry@gmail.com');

drop policy if exists "Studio can remove closures" on public.studio_closures;
create policy "Studio can remove closures"
  on public.studio_closures
  for delete
  to authenticated
  using (coalesce(auth.jwt() ->> 'email', '') = 'annasbeautistry@gmail.com');

-- ---------------------------------------------------------------------------
-- 2. Booking functions now require UUID + reference
-- ---------------------------------------------------------------------------

drop function if exists public.submit_partial_payment_reference(uuid, text);
drop function if exists public.get_booking_payment_status(uuid);

create function public.submit_partial_payment_reference(
  p_booking_id uuid,
  p_booking_reference text,
  p_payment_reference text
)
returns table (
  booking_id uuid,
  booking_reference text,
  status text,
  payment_reference text,
  hold_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reference text := trim(coalesce(p_payment_reference, ''));
  v_booking public.bookings%rowtype;
begin
  if char_length(v_reference) < 4 or char_length(v_reference) > 120 then
    raise exception 'PAYMENT_REFERENCE_REQUIRED: enter the payment transaction/reference number.' using errcode = '22023';
  end if;

  select *
  into v_booking
  from public.bookings b
  where b.id = p_booking_id
    and b.booking_reference = upper(trim(coalesce(p_booking_reference, '')))
  for update;

  if not found then
    raise exception 'BOOKING_NOT_FOUND: this booking could not be found.' using errcode = '22023';
  end if;

  if v_booking.status = 'partial_payment_submitted' then
    return query
    select v_booking.id, v_booking.booking_reference, v_booking.status,
           v_booking.payment_reference, v_booking.hold_expires_at;
    return;
  end if;

  if v_booking.status = 'confirmed' then
    return query
    select v_booking.id, v_booking.booking_reference, v_booking.status,
           v_booking.payment_reference, v_booking.hold_expires_at;
    return;
  end if;

  if v_booking.status <> 'pending_partial_payment' then
    raise exception 'INVALID_BOOKING_STATUS: this booking can no longer accept a payment reference.' using errcode = '22023';
  end if;

  if v_booking.hold_expires_at is null or v_booking.hold_expires_at <= now() then
    raise exception 'HOLD_EXPIRED: this 30-minute hold has expired. Choose a new time.' using errcode = '22023';
  end if;

  return query
  update public.bookings b
  set
    status = 'partial_payment_submitted',
    payment_reference = v_reference
  where b.id = p_booking_id
  returning b.id, b.booking_reference, b.status, b.payment_reference, b.hold_expires_at;
end;
$$;

create function public.get_booking_payment_status(
  p_booking_id uuid,
  p_booking_reference text
)
returns table (
  booking_id uuid,
  booking_reference text,
  service_slug text,
  service_name text,
  room_id text,
  selected_option text,
  starts_at timestamptz,
  ends_at timestamptz,
  duration_minutes integer,
  total_starting_price_ghs numeric,
  deposit_due_ghs numeric,
  balance_due_ghs numeric,
  status text,
  payment_reference text,
  hold_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    b.id,
    b.booking_reference,
    b.service_slug,
    b.service_name,
    b.room_id,
    b.selected_option,
    b.starts_at,
    b.ends_at,
    b.duration_minutes,
    b.total_starting_price_ghs,
    b.deposit_due_ghs,
    b.balance_due_ghs,
    case
      when b.status = 'pending_partial_payment'
       and (b.hold_expires_at is null or b.hold_expires_at <= now())
      then 'expired'
      else b.status
    end,
    b.payment_reference,
    b.hold_expires_at
  from public.bookings b
  where b.id = p_booking_id
    and b.booking_reference = upper(trim(coalesce(p_booking_reference, '')));
end;
$$;

revoke all on function public.submit_partial_payment_reference(uuid, text, text) from public;
revoke all on function public.get_booking_payment_status(uuid, text) from public;

grant execute on function public.submit_partial_payment_reference(uuid, text, text) to anon, authenticated;
grant execute on function public.get_booking_payment_status(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Length limits on free-text fields
-- ---------------------------------------------------------------------------

alter table public.bookings
  drop constraint if exists bookings_customer_name_len,
  drop constraint if exists bookings_customer_phone_len,
  drop constraint if exists bookings_notes_len,
  drop constraint if exists bookings_payment_reference_len,
  drop constraint if exists bookings_selected_option_len;

alter table public.bookings
  add constraint bookings_customer_name_len check (char_length(customer_name) <= 120),
  add constraint bookings_customer_phone_len check (char_length(customer_phone) <= 40),
  add constraint bookings_notes_len check (char_length(notes) <= 2000),
  add constraint bookings_payment_reference_len check (payment_reference is null or char_length(payment_reference) <= 120),
  add constraint bookings_selected_option_len check (selected_option is null or char_length(selected_option) <= 120);

alter table public.studio_closures
  drop constraint if exists studio_closures_reason_len;

alter table public.studio_closures
  add constraint studio_closures_reason_len check (char_length(reason) <= 60);

notify pgrst, 'reload schema';
