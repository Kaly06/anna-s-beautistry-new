-- Anna's Beautistry: shared one-chair booking calendar + 30% partial-payment holds.
-- Business rules:
--   * Studio timezone: Africa/Accra (UTC all year)
--   * Open Tuesday-Saturday, 09:00-19:00
--   * Appointment starts every 30 minutes
--   * A submitted booking holds its full service duration for 30 minutes
--   * Partial payment is 30%; payment details are sent by WhatsApp

create extension if not exists pgcrypto;

create table if not exists public.bookable_services (
  slug text primary key,
  room_id text not null check (room_id in ('wigs', 'lashes', 'piercing', 'makeup')),
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  starting_price_ghs numeric(10, 2) not null check (starting_price_ghs >= 0),
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  service_slug text not null references public.bookable_services(slug) on update cascade,
  service_name text not null,
  room_id text not null check (room_id in ('wigs', 'lashes', 'piercing', 'makeup')),
  selected_option text,
  customer_name text not null check (char_length(trim(customer_name)) > 1),
  customer_phone text not null check (char_length(trim(customer_phone)) > 6),
  notes text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  duration_minutes integer not null check (duration_minutes > 0),
  total_starting_price_ghs numeric(10, 2) not null check (total_starting_price_ghs >= 0),
  deposit_due_ghs numeric(10, 2) not null check (deposit_due_ghs >= 0),
  balance_due_ghs numeric(10, 2) not null check (balance_due_ghs >= 0),
  status text not null default 'pending_partial_payment' check (
    status in (
      'pending_partial_payment',
      'partial_payment_submitted',
      'confirmed',
      'cancelled',
      'expired',
      'completed'
    )
  ),
  payment_method text not null default 'whatsapp_details',
  payment_reference text,
  hold_expires_at timestamptz,
  piercing_consent jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_starts_at_idx on public.bookings (starts_at);
create index if not exists bookings_range_idx on public.bookings (starts_at, ends_at);
create index if not exists bookings_status_hold_idx on public.bookings (status, hold_expires_at);

create or replace function public.set_booking_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_booking_updated_at();

drop trigger if exists bookable_services_set_updated_at on public.bookable_services;
create trigger bookable_services_set_updated_at
before update on public.bookable_services
for each row execute function public.set_booking_updated_at();

alter table public.bookable_services enable row level security;
alter table public.bookings enable row level security;

revoke all on table public.bookable_services from anon, authenticated;
grant select on table public.bookable_services to anon, authenticated;
drop policy if exists "Public can view active bookable services" on public.bookable_services;
create policy "Public can view active bookable services"
on public.bookable_services
for select
to anon, authenticated
using (active = true);

-- Customer bookings contain names, phone numbers and piercing health answers.
-- The browser never reads or writes this table directly; it only calls the
-- narrow SECURITY DEFINER functions below.
revoke all on table public.bookings from anon, authenticated;

insert into public.bookable_services (
  slug,
  room_id,
  name,
  duration_minutes,
  starting_price_ghs,
  options,
  active
) values
  (
    'wig-installation', 'wigs', 'Wig Installation', 120, 90,
    '[{"name":"Closure Installation","minPrice":90,"maxPrice":140},{"name":"Frontal Installation","minPrice":160,"maxPrice":200},{"name":"Frontal Pony","minPrice":160,"maxPrice":250},{"name":"Traditional Pony","minPrice":140,"maxPrice":200},{"name":"Sew-In","minPrice":180,"maxPrice":220}]'::jsonb,
    true
  ),
  (
    'wig-construction-making', 'wigs', 'Wig Construction / Making', 180, 120,
    '[{"name":"Closure Unit Construction","minPrice":120,"maxPrice":150},{"name":"Frontal Unit Construction","minPrice":160,"maxPrice":200},{"name":"Pixie Unit Construction","minPrice":180},{"name":"Ready-Made Frontal Wig to Glueless","minPrice":150},{"name":"Customized Glueless Unit","minPrice":180}]'::jsonb,
    true
  ),
  (
    'wig-reconstruction-remaking', 'wigs', 'Wig Reconstruction / Remaking', 150, 150,
    '[{"name":"Closure Reconstruction","minPrice":160},{"name":"Frontal Reconstruction","minPrice":180},{"name":"Pixie Reconstruction","minPrice":150}]'::jsonb,
    true
  ),
  (
    'wig-revamping', 'wigs', 'Wig Revamping', 90, 60,
    '[{"name":"Without Treatment","minPrice":60,"maxPrice":90},{"name":"With Treatment","minPrice":90,"maxPrice":150},{"name":"Bleaching Knots + Revamping","minPrice":120}]'::jsonb,
    true
  ),
  (
    'wig-styling-custom-services', 'wigs', 'Wig Styling & Custom Services', 60, 50,
    '[{"name":"Straightening","minPrice":50,"maxPrice":80},{"name":"Curling","minPrice":60,"maxPrice":100},{"name":"Pixie Styling","minPrice":100},{"name":"Coloring","priceNote":"Varies"},{"name":"Ventilation","priceNote":"Varies"},{"name":"Changing Closure / Frontal Lace","priceNote":"Same as Reconstruction"}]'::jsonb,
    true
  ),
  ('classic-lash-extensions', 'lashes', 'Classic Lash Extensions', 90, 50, '[]'::jsonb, true),
  ('hybrid-lash-extensions', 'lashes', 'Hybrid Lash Extensions', 105, 65, '[]'::jsonb, true),
  ('volume-lash-extensions', 'lashes', 'Volume Lash Extensions', 120, 80, '[]'::jsonb, true),
  ('mega-volume-lashes', 'lashes', 'Mega Volume Lashes', 135, 95, '[]'::jsonb, true),
  ('lash-refill-maintenance', 'lashes', 'Lash Refill & Maintenance', 60, 40, '[]'::jsonb, true),
  ('earlobe-piercing', 'piercing', 'Earlobe Piercing', 20, 30, '[]'::jsonb, true),
  ('cartilage-piercing-helix-tragus', 'piercing', 'Cartilage Piercing (Helix/Tragus)', 30, 40, '[]'::jsonb, true),
  ('nostril-piercing', 'piercing', 'Nostril Piercing', 30, 35, '[]'::jsonb, true),
  ('lip-medusa-piercing', 'piercing', 'Lip / Medusa Piercing', 30, 45, '[]'::jsonb, true),
  ('navel-piercing', 'piercing', 'Navel Piercing', 45, 50, '[]'::jsonb, true),
  ('soft-glam-makeup', 'makeup', 'Soft Glam Makeup', 90, 80, '[]'::jsonb, true),
  ('full-glam-makeup', 'makeup', 'Full Glam Makeup', 120, 120, '[]'::jsonb, true),
  ('bridal-makeup', 'makeup', 'Bridal Makeup', 150, 180, '[]'::jsonb, true),
  ('bridal-makeup-trial', 'makeup', 'Bridal Makeup Trial', 60, 60, '[]'::jsonb, true)
on conflict (slug) do update set
  room_id = excluded.room_id,
  name = excluded.name,
  duration_minutes = excluded.duration_minutes,
  starting_price_ghs = excluded.starting_price_ghs,
  options = excluded.options,
  active = excluded.active,
  updated_at = now();

create or replace function public.get_busy_slots(
  p_range_start timestamptz,
  p_range_end timestamptz
)
returns table (
  starts_at timestamptz,
  ends_at timestamptz
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
  select b.starts_at, b.ends_at
  from public.bookings b
  where tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_range_start, p_range_end, '[)')
    and (
      b.status in ('partial_payment_submitted', 'confirmed')
      or (b.status = 'pending_partial_payment' and b.hold_expires_at > now())
    )
  order by b.starts_at;
end;
$$;

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

  if extract(dow from v_local_start)::integer not between 2 and 6 then
    raise exception 'CLOSED_DAY: appointments are available Tuesday to Saturday.' using errcode = '22023';
  end if;

  if v_local_start::time < time '09:00'
     or v_local_end::date <> v_local_start::date
     or v_local_end::time > time '19:00' then
    raise exception 'OUTSIDE_OPENING_HOURS: this service must finish by 7:00 PM.' using errcode = '22023';
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
  returning
    id,
    booking_reference,
    service_slug,
    service_name,
    room_id,
    selected_option,
    starts_at,
    ends_at,
    duration_minutes,
    total_starting_price_ghs,
    deposit_due_ghs,
    balance_due_ghs,
    status,
    hold_expires_at;
end;
$$;

create or replace function public.submit_partial_payment_reference(
  p_booking_id uuid,
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
  if char_length(v_reference) < 4 then
    raise exception 'PAYMENT_REFERENCE_REQUIRED: enter the payment transaction/reference number.' using errcode = '22023';
  end if;

  select *
  into v_booking
  from public.bookings b
  where b.id = p_booking_id
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

create or replace function public.get_booking_payment_status(
  p_booking_id uuid
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
  where b.id = p_booking_id;
end;
$$;

revoke all on function public.get_busy_slots(timestamptz, timestamptz) from public;
revoke all on function public.create_booking_hold(text, text, text, text, text, timestamptz, jsonb) from public;
revoke all on function public.submit_partial_payment_reference(uuid, text) from public;
revoke all on function public.get_booking_payment_status(uuid) from public;

grant execute on function public.get_busy_slots(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.create_booking_hold(text, text, text, text, text, timestamptz, jsonb) to anon, authenticated;
grant execute on function public.submit_partial_payment_reference(uuid, text) to anon, authenticated;
grant execute on function public.get_booking_payment_status(uuid) to anon, authenticated;

notify pgrst, 'reload schema';
