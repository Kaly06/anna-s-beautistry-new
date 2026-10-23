import { useEffect } from 'react';

const HOME_TITLE =
  "Anna's Beautistry — Wig artistry, piercing, lashes & makeup, Cape Coast";

/**
 * Give each route its own browser-tab name tag (e.g. "Book a service —
 * Anna's Beautistry") instead of every page sharing the home title.
 * Passing nothing restores the home title.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — Anna's Beautistry` : HOME_TITLE;
  }, [title]);
}
