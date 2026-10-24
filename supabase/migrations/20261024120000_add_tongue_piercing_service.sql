-- Add Tongue Piercing to the bookable service catalogue.
-- Price and duration mirror the front-end menu: GH₵45, 30 minutes.

insert into public.bookable_services (
  slug,
  room_id,
  name,
  duration_minutes,
  starting_price_ghs,
  options,
  active
) values (
  'tongue-piercing',
  'piercing',
  'Tongue Piercing',
  30,
  45,
  '[]'::jsonb,
  true
)
on conflict (slug) do update set
  room_id = excluded.room_id,
  name = excluded.name,
  duration_minutes = excluded.duration_minutes,
  starting_price_ghs = excluded.starting_price_ghs,
  options = excluded.options,
  active = excluded.active,
  updated_at = now();
