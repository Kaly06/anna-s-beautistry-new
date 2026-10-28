-- Anna's Beautistry: Monday and Tuesday are now closed.
--
-- Wednesday stays open, so the week is Wednesday, Thursday and Friday
-- (9:00 AM-7:00 PM) plus Saturday and Sunday (10:00 AM-4:00 PM). Sunday is open
-- by default; she blocks the odd Sunday from /admin when she needs it.
--
-- This replaces create_booking_hold with the same body apart from the opening
-- check. Pricing, the 30-minute grid, the hold window and the piercing consent
-- rules are untouched.

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

  -- Monday (1) and Tuesday (2) are closed; Wednesday stays open.
  if v_dow in (1, 2) then
    raise exception 'CLOSED_DAY: the studio is closed on Mondays and Tuesdays. Appointments are available Wednesday, Thursday, Friday, Saturday and Sunday.' using errcode = '22023';
  elsif v_dow in (0, 6) then
    v_open_time := time '10:00';
    v_close_time := time '16:00';
  else
    v_open_time := time '09:00';
    v_close_time := time '19:00';
  end if;

  if v_local_start::time < v_open_time
     or v_local_end::date <> v_local_start::date
     or v_local_end::time > v_close_time then
    raise exception 'OUTSIDE_OPENING_HOURS: this service must fit inside opening hours (Wednesday, Thursday and Friday 9:00 AM-7:00 PM; Saturday and Sunday 10:00 AM-4:00 PM).' using errcode = '22023';
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
