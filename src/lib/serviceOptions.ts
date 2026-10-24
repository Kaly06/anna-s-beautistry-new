import type { MenuItem, MenuItemOption } from '../types';
import { formatPriceRange } from '../data/house';

/**
 * Small shared helpers for service options (price labels and the booking
 * deep-link). Kept out of the ServiceOptions component file so that module
 * only exports its component (react-refresh hygiene).
 */

export function optionPriceLabel(option: MenuItemOption): string {
  if (option.priceNote) return option.priceNote;
  if (typeof option.minPrice === 'number') {
    return formatPriceRange(option.minPrice, option.maxPrice);
  }
  return 'Varies';
}

export function bookingSearch(item: MenuItem, option?: MenuItemOption): string {
  const params = new URLSearchParams({ service: item.service, item: item.slug });
  if (option) params.set('option', option.name);
  params.set(
    'treatment',
    option ? `${item.name} — ${option.name} (${optionPriceLabel(option)})` : item.name,
  );
  return `?${params.toString()}`;
}
