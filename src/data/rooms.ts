import type { ServiceId } from '../types';

export interface RoomMeta {
  id: ServiceId;
  name: string;
  numeral: string;
  headline: string;
  intro: string;
  note: string;
  /** Which line-drawing sits in the page hero. */
  signatureVariant: number;
}

/** Everything a service page needs above the menu itself. */
export const rooms: Record<ServiceId, RoomMeta> = {
  wigs: {
    id: 'wigs',
    name: 'Wigs',
    numeral: '01',
    headline: 'Made, remade, melted.',
    intro:
      'Installation, construction, reconstruction, revamping and custom styling — the full life of a unit, handled in one chair.',
    note: 'Lace unit — study drawing',
    signatureVariant: 0,
  },
  lashes: {
    id: 'lashes',
    name: 'Lashes',
    numeral: '02',
    headline: 'Weight, mapped to your eye.',
    intro:
      'Classic, hybrid, volume and mega volume sets in Korean silk, plus refill and maintenance in a density your natural lash can actually carry.',
    note: 'Volume fan — study drawing',
    signatureVariant: 2,
  },
  piercing: {
    id: 'piercing',
    name: 'Piercings',
    numeral: '03',
    headline: 'Marked twice. Pierced once.',
    intro:
      'Needle-only earlobe, cartilage, Nostril, lip / Medusa, tongue and navel piercings in implant-grade titanium. No guns, ever.',
    note: 'Piercing placement — study drawing',
    signatureVariant: 1,
  },
  makeup: {
    id: 'makeup',
    name: 'Makeup',
    numeral: '04',
    headline: 'Skin, only better lit.',
    intro:
      'Soft glam, full glam, bridal makeup and a dedicated bridal trial — built for the light you will actually be standing in.',
    note: 'Soft glam palette — study drawing',
    signatureVariant: 0,
  },
};

export const roomsMeta = Object.values(rooms);
