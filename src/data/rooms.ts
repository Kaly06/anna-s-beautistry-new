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
  /** Search title for this room's page (brand is appended by usePageMeta). */
  seoTitle: string;
  /** Search description for this room's page. */
  seoDescription: string;
  /** Local search keywords for this room's page. */
  keywords: string;
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
    seoTitle: 'Wig Installation & Custom Wig Making in Cape Coast',
    seoDescription:
      'Book wig installation, frontal and closure installs, custom wig construction, reconstruction, revamping and styling in Ayesu, Cape Coast. Prices and durations listed.',
    keywords:
      "wig installation Cape Coast, frontal wig install Cape Coast, closure wig install Cape Coast, custom wig maker Cape Coast, wig construction Cape Coast, wig revamping Cape Coast, wig reconstruction Cape Coast, glueless wig Cape Coast, Anna's Beautistry",
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
    seoTitle: 'Lash Extensions in Cape Coast — Classic, Hybrid, Volume & Mega Volume',
    seoDescription:
      'Book classic, hybrid, volume and mega volume lash extensions in Cape Coast. Korean silk sets, refills and maintenance mapped to your natural lashes.',
    keywords:
      "lash extensions Cape Coast, classic lash extensions Cape Coast, hybrid lash extensions, volume lashes Cape Coast, mega volume lashes Cape Coast, lash refill Cape Coast, Korean silk lashes Ghana, Anna's Beautistry",
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
    seoTitle: 'Piercing Studio in Cape Coast — Needle-Only & Implant-Grade Titanium',
    seoDescription:
      'Needle-only earlobe, cartilage, Nostril, lip/Medusa, tongue and navel piercings in Cape Coast. No piercing guns. 19+ only, with consent and aftercare.',
    keywords:
      "piercing studio Cape Coast, earlobe piercing Cape Coast, cartilage piercing Cape Coast, Nostril piercing Cape Coast, tongue piercing Cape Coast, navel piercing Cape Coast, needle only piercing Ghana, implant grade titanium piercing, Anna's Beautistry",
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
    seoTitle: 'Makeup Artist in Cape Coast — Soft Glam, Full Glam & Bridal Makeup',
    seoDescription:
      'Book soft glam, full glam, bridal makeup and bridal trials in Cape Coast. Skin-first makeup built to last through heat, photos and long days.',
    keywords:
      "makeup artist Cape Coast, soft glam makeup Cape Coast, full glam makeup Ghana, bridal makeup Cape Coast, bridal makeup trial Cape Coast, skin first makeup, Anna's Beautistry",
  },
};

export const roomsMeta = Object.values(rooms);
