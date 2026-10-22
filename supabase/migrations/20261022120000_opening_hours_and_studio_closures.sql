-- Anna's Beautistry: new opening hours + Anna's own busy/closed periods.
-- Business rules:
--   * Studio timezone: Africa/Accra (UTC all year)
--   * Open Monday-Friday 09:00-19:00, Saturday 10:00-16:00, Sunday closed
--   * Anna can block any period in public.studio_closures (via the /admin
--     page, signed in). Blocked periods behave exactly like bookings:
--     nothing may overlap them, and clients see those starts as "Busy".

create table if not exists public.studio_closures (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  reason text not null default 'Busy' check (char_length(trim(reason)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists studio_closures_range_idx
  on public.studio_closures (starts_at, ends_at);

alter table public.studio_closures enable row level security;

-- Anyone may read blocked periods (the booking page shows them as Busy);
-- only a signed-in studio account may create, edit or remove them.
revoke all on table public.studio_closures from anon, authenticated;
grant select on table public.studio_closures to anon, authenticated;
grant insert, update, delete on table public.studio_closures to authenticated;

drop policy if exists "Public can view studio closures" on public.studio_closures;
create policy "Public can view studio closures"
on public.studio_closures
for select
to anon, authenticated
using (true);

drop policy if exists "Studio can add closures" on public.studio_closures;
create policy "Studio can add closures"
on public.studio_closures
for insert
to authenticated
with check (true);

drop policy if exists "Studio can update closures" on public.studio_closures;
create policy "Studio can update closures"
on public.studio_closures
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Studio can remove closures" on public.studio_closures;
create policy "Studio can remove closures"
on public.studio_closures
for delete
to authenticated
using (true);

-- Availability now unions client bookings with Anna's blocked periods and
-- says which is which, so the booking page can label them Booked vs Busy.
drop function if exists public.get_busy_slots(timestamptz, timestamptz);

create function public.get_busy_slots(
  p_range_start timestamptz,
  p_range_end timestamptz
)
returns table (
  starts_at timestamptz,
  ends_at timestamptz,
  kind text,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_range_start is null or p_range_end is null or p_range_end <= p_range_start then
    raise exception 'INVALID_RANGE: choose a valid date range.' using errcode = '22023';
  end if;

  if p_range_end - p_range_start > interval '31 days' then
    raise exception 'INVALID_RANGE: availability can only be checked 31 days at a time.' using errcode = '22023';
  end if;

  return query
  select b.starts_at, b.ends_at, 'booking'::text, null::text
  from public.bookings b
  where tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_range_start, p_range_end, '[)')
    and (
      b.status in ('partial_payment_submitted', 'confirmed')
      or (b.status = 'pending_partial_payment' and b.hold_expires_at > now())
    )
  union all
  select c.starts_at, c.ends_at, 'closure'::text, c.reason
  from public.studio_closures c
  where tstzrange(c.starts_at, c.ends_at, '[)') && tstzrange(p_range_start, p_range_end, '[)')
  order by 1;
end;
$$;

revoke all on function public.get_busy_slots(timestamptz, timestamptz) from public;
grant execute on function public.get_busy_slots(timestamptz, timestamptz) to anon, authenticated;

-- Booking creation with the new hours and busy-period enforcement.
create or replace function public.create_booking_hold(
  p_service_slug text,
  p_selected_option text,
  p_customer_name text,
  p_customer_phone text,
  p_notes text,
  p_starts_at timestamptz,
  p_piercing_consent jsonb default null
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
  hold_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service public.bookable_services%rowtype;
  v_option jsonb;
  v_selected_option text := nullif(trim(coalesce(p_selected_option, '')), '');
  v_customer_name text := trim(coalesce(p_customer_name, ''));
  v_customer_phone text := trim(coalesce(p_customer_phone, ''));
  v_total numeric(10, 2);
  v_deposit numeric(10, 2);
  v_balance numeric(10, 2);
  v_ends_at timestamptz;
  v_local_start timestamp;
  v_local_end timestamp;
  v_dow integer;
  v_open_time time;
  v_close_time time;
  v_created public.bookings%rowtype;
  v_booking_id uuid := gen_random_uuid();
  v_booking_reference text := 'AB-' || upper(substr(replace(v_booking_id::text, '-', ''), 1, 8));
  v_hold_expires_at timestamptz := now() + interval '30 minutes';
begin
  -- One chair: serialize booking creation so two simultaneous requests cannot
  -- both pass the overlap check.
  perform pg_advisory_xact_lock(hashtext('anna_beautistry_single_chair'));

  if char_length(v_customer_name) < 2 then
    raise exception 'INVALID_NAME: enter your full name.' using errcode = '22023';
  end if;

  if char_length(regexp_replace(v_customer_phone, '[^0-9+]', '', 'g')) < 7 then
    raise exception 'INVALID_PHONE: enter a valid WhatsApp number.' using errcode = '22023';
  end if;

  select *
  into v_service
  from public.bookable_services s
  where s.slug = p_service_slug
    and s.active = true;

  if not found then
    raise exception 'SERVICE_NOT_FOUND: choose a valid service.' using errcode = '22023';
  end if;

  if jsonb_array_length(v_service.options) > 0 then
    if v_selected_option is null then
      raise exception 'OPTION_REQUIRED: choose an option for this service.' using errcode = '22023';
    end if;

    select elem
    into v_option
    from jsonb_array_elements(v_service.options) elem
    where elem->>'name' = v_selected_option
    limit 1;

    if v_option is null then
      raise exception 'OPTION_NOT_FOUND: choose a valid option for this service.' using errcode = '22023';
    end if;

    v_total := coalesce((v_option->>'minPrice')::numeric, v_service.starting_price_ghs);
  else
    if v_selected_option is not null then
      raise exception 'OPTION_NOT_ALLOWED: this service does not have options.' using errcode = '22023';
    end if;
    v_total := v_service.starting_price_ghs;
  end if;

  if p_starts_at is null then
    raise exception 'START_REQUIRED: choose a date and start time.' using errcode = '22023';
  end if;

  v_ends_at := p_starts_at + make_interval(mins => v_service.duration_minutes);
  v_local_start := p_starts_at at time zone 'Africa/Accra';
  v_local_end := v_ends_at at time zone 'Africa/Accra';

  if p_starts_at <= now() then
    raise exception 'START_IN_PAST: choose a future date and time.' using errcode = '22023';
  end if;

  if extract(second from v_local_start) <> 0
     or extract(minute from v_local_start)::integer not in (0, 30) then
    raise exception 'START_NOT_ON_30_MINUTE_GRID: start times are available every 30 minutes.' using errcode = '22023';
  end if;

  v_dow := extract(dow from v_local_start)::integer;

  if v_dow = 0 then
    raise exception 'CLOSED_DAY: the studio is closed on Sundays. Appointments are available Monday to Saturday.' using errcode = '22023';
  elsif v_dow = 6 then
    v_open_time := time '10:00';
    v_close_time := time '16:00';
  else
    v_open_time := time '09:00';
    v_close_time := time '19:00';
  end if;

  if v_local_start::time < v_open_time
     or v_local_end::date <> v_local_start::date
     or v_local_end::time > v_close_time then
    raise exception 'OUTSIDE_OPENING_HOURS: this service must fit inside opening hours (Monday-Friday 9:00 AM-7:00 PM, Saturday 10:00 AM-4:00 PM).' using errcode = '22023';
  end if;

  if v_service.room_id = 'piercing' then
    if p_piercing_consent is null or jsonb_typeof(p_piercing_consent) <> 'object' then
      raise exception 'PIERCING_CONSENT_REQUIRED: complete the piercing consent form.' using errcode = '22023';
    end if;

    if coalesce(p_piercing_consent->>'age', '') !~ '^[0-9]+([.][0-9]+)?$'
       or (p_piercing_consent->>'age')::numeric < 18
       or coalesce(p_piercing_consent->>'isAdult', '') <> 'yes' then
      raise exception 'PIERCING_18_PLUS_ONLY: piercing bookings are for clients aged 18 or older.' using errcode = '22023';
    end if;

    if coalesce(trim(p_piercing_consent->>'placement'), '') = ''
       or coalesce(trim(p_piercing_consent->>'signature'), '') = ''
       or coalesce(trim(p_piercing_consent->>'consentDate'), '') = ''
       or coalesce(p_piercing_consent->>'hadBefore', '') not in ('yes', 'no')
       or coalesce(p_piercing_consent->>'allergies', '') not in ('yes', 'no')
       or coalesce(p_piercing_consent->>'keloids', '') not in ('yes', 'no')
       or coalesce(p_piercing_consent->>'photoConsent', '') not in ('yes', 'no')
       or (p_piercing_consent->'understandsRisks') is distinct from 'true'::jsonb
       or (p_piercing_consent->'willFollowAftercare') is distinct from 'true'::jsonb
       or (p_piercing_consent->'understandsHealing') is distinct from 'true'::jsonb
       or (p_piercing_consent->'consentsToProcedure') is distinct from 'true'::jsonb
       or (p_piercing_consent->'agreesToLiabilityWaiver') is distinct from 'true'::jsonb
       or (p_piercing_consent->'jewelryAgreement') is distinct from 'true'::jsonb
       or (
         p_piercing_consent->>'allergies' = 'yes'
         and coalesce(trim(p_piercing_consent->>'medicalConditions'), '') = ''
       ) then
      raise exception 'PIERCING_CONSENT_INCOMPLETE: complete every required piercing consent answer.' using errcode = '22023';
    end if;
  end if;

  if exists (
    select 1
    from public.studio_closures c
    where tstzrange(c.starts_at, c.ends_at, '[)') && tstzrange(p_starts_at, v_ends_at, '[)')
  ) then
    raise exception 'STUDIO_BUSY: Anna is busy or the studio is closed at that time. Choose another start time.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.bookings b
    where tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_starts_at, v_ends_at, '[)')
      and (
        b.status in ('partial_payment_submitted', 'confirmed')
        or (b.status = 'pending_partial_payment' and b.hold_expires_at > now())
      )
  ) then
    raise exception 'SLOT_TAKEN: that time overlaps an existing booking. Choose another start time.' using errcode = '23505';
  end if;

  v_deposit := round(v_total * 0.30, 2);
  v_balance := v_total - v_deposit;

  insert into public.bookings (
    id,
    booking_reference,
    service_slug,
    service_name,
    room_id,
    selected_option,
    customer_name,
    customer_phone,
    notes,
    starts_at,
    ends_at,
    duration_minutes,
    total_starting_price_ghs,
    deposit_due_ghs,
    balance_due_ghs,
    status,
    payment_method,
    hold_expires_at,
    piercing_consent
  ) values (
    v_booking_id,
    v_booking_reference,
    v_service.slug,
    v_service.name,
    v_service.room_id,
    v_selected_option,
    v_customer_name,
    v_customer_phone,
    coalesce(trim(p_notes), ''),
    p_starts_at,
    v_ends_at,
    v_service.duration_minutes,
    v_total,
    v_deposit,
    v_balance,
    'pending_partial_payment',
    'whatsapp_details',
    v_hold_expires_at,
    case when v_service.room_id = 'piercing' then p_piercing_consent else null end
  )
  returning * into v_created;

  return query
  select
    v_created.id,
    v_created.booking_reference,
    v_created.service_slug,
    v_created.service_name,
    v_created.room_id,
    v_created.selected_option,
    v_created.starts_at,
    v_created.ends_at,
    v_created.duration_minutes,
    v_created.total_starting_price_ghs,
    v_created.deposit_due_ghs,
    v_created.balance_due_ghs,
    v_created.status,
    v_created.hold_expires_at;
end;
$$;

revoke all on function public.create_booking_hold(text, text, text, text, text, timestamptz, jsonb) from public;
grant execute on function public.create_booking_hold(text, text, text, text, text, timestamptz, jsonb) to anon, authenticated;

notify pgrst, 'reload schema';
