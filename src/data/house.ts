export const HOUSE = {
  name: "Anna's Beautistry",
  /** The wordmark the opening curtain spells out — always the full name. */
  wordmark: "ANNA'S BEAUTISTRY",
  /** Full name split for the stacked logo lockup: ANNA'S over BEAUTISTRY. */
  wordmarkLines: ["ANNA'S", 'BEAUTISTRY'] as const,
  /**
   * Uploaded logo file (drop the new logo at this path to use it).
   * Preferred: transparent SVG, otherwise transparent PNG (gold/ivory on
   * transparent — her colours are purple and gold, and the site
   * background is deep royal plum #170429).
   * Set to the uploaded path once the file arrives; until then the
   * Logo component renders the typographic lockup with the house mark.
   */
  logoSrc: null as string | null,
  city: 'Cape Coast',
  region: 'Central Region, Ghana',
  founded: 2016,
  address: ['12 Second Commercial Street', 'Cape Coast, Central Region'],
  phone: '+233 33 213 0455',
  phoneHref: 'tel:+233332130455',
  email: 'hello@annasbeautistry.gh',
  hours: 'Tue – Sat · 9am – 7pm GMT',
  cities: 'Cape Coast · Elmina · Takoradi',
  greeting: 'Akwaaba',
  est: 'Est. 2016',
  season: 'The Coastal Edit · 2026',
  clients: '2,400+ faces',
  line: 'A beauty house in Cape Coast — lace, needles, lashes and skin, since 2016.',
} as const;

export const CURRENCY = 'GH₵';

/** Cedi formatting, with the symbol Ghanaians actually read. */
export function formatPrice(value: number): string {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY} ${formatted}`;
}

/** GH₵ 90 – 140, without repeating the currency symbol. */
export function formatPriceRange(min: number, max?: number): string {
  if (!max || max === min) return formatPrice(min);
  return `${CURRENCY} ${min.toLocaleString('en-US')} – ${max.toLocaleString('en-US')}`;
}

/** 90 → "1 hr 30", 45 → "45 min". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest}`;
}
