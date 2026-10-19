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
    name: 'Lace & Wigs',
    numeral: '01',
    headline: 'Lace you cannot find.',
    intro:
      'Frontals bleached, tinted and plucked by hand, then melted to your own hairline. We will not glue your edges down to save twenty minutes.',
    note: '13×6 frontal — study drawing',
    signatureVariant: 0,
  },
  piercing: {
    id: 'piercing',
    name: 'Piercing',
    numeral: '02',
    headline: 'Marked twice. Pierced once.',
    intro:
      'Needle-only, single-use, implant-grade titanium, placed after you have looked at the marks in the mirror and moved them. No guns, ever.',
    note: 'Curated stack — study drawing',
    signatureVariant: 1,
  },
  lashes: {
    id: 'lashes',
    name: 'Lashes',
    numeral: '03',
    headline: 'Weight, mapped to your eye.',
    intro:
      'Korean silk placed one extension at a time, in a density your natural lash can actually carry. We would rather refuse a set than thin your own.',
    note: 'Volume fan — study drawing',
    signatureVariant: 2,
  },
  makeup: {
    id: 'makeup',
    name: 'Makeup',
    numeral: '04',
    headline: 'Skin, only better lit.',
    intro:
      'Bronze, luminous and undetectable at arm’s length. Built for the light you will actually be standing in, and photographed before you leave.',
    note: 'Soft glam palette — study drawing',
    signatureVariant: 0,
  },
};

export const roomsMeta = Object.values(rooms);
