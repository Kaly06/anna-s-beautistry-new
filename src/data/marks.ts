/**
 * The house marks, drawn as line-art.
 *
 * Four of them are the materials the studio will and will not work with —
 * lace, titanium, silk and pigment. The fifth is the mark on the door: the
 * Halo, an eye ringed with lashes, printed on every appointment card and
 * struck into the mirror frame at Ayesu.
 */

export type MarkName = 'halo' | 'lace' | 'titanium' | 'silk' | 'pigment';

/** Eight studs on a ring, written as circle paths. */
function studRing(radius: number, count: number, dot = 1.1): string[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = Math.round((20 + radius * Math.cos(angle)) * 100) / 100;
    const y = Math.round((20 + radius * Math.sin(angle)) * 100) / 100;
    return `M${x} ${y}m-${dot} 0a${dot} ${dot} 0 1 0 ${dot * 2} 0a${dot} ${dot} 0 1 0 -${dot * 2} 0Z`;
  });
}

export const MARKS: Record<
  MarkName,
  { label: string; note: string; path: string[] }
> = {
  halo: {
    label: 'The Halo',
    note: 'The house mark. An eye, ringed — what we are here to frame.',
    path: [
      'M20 4a16 16 0 1 0 0 32a16 16 0 1 0 0-32Z',
      'M20 11a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z',
      ...studRing(18.6, 8, 1),
    ],
  },
  lace: {
    label: 'Swiss HD Lace',
    note: '0.08mm, hand-plucked, tinted to your scalp. Nothing left to hide.',
    path: [
      'M8 28V16a12 12 0 0 1 24 0v12',
      'M8 28h24',
      'M8 22h24',
      'M8 13h24',
      'M14 8v20',
      'M20 4v24',
      'M26 8v20',
      'M8 28c4 6 8 6 11 3',
      'M16 28c2 6 6 7 9 4',
      'M24 28c2 5 5 6 8 3',
    ],
  },
  titanium: {
    label: 'Implant-grade Titanium',
    note: 'ASTM F-136, nickel-free — the same grade used in surgical implants.',
    path: [
      'M20 5a15 15 0 1 0 0 30a15 15 0 1 0 0-30Z',
      'M20 12a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z',
      'M20 1v38',
      'M20 3.4a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2Z',
      'M33.4 25.6a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2Z',
      'M6.6 25.6a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2Z',
    ],
  },
  silk: {
    label: 'Korean Silk Lashes',
    note: 'Matte, 30% lighter than synthetic, and it holds a curl in humidity.',
    path: [
      'M5 22c5-9 25-9 30 0-5 8-25 8-30 0Z',
      'M20 22m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0-9 0Z',
      'M9 15l-3-6',
      'M15 12l-2-7',
      'M20 11v-7',
      'M25 12l2-7',
      'M31 15l3-6',
      'M12 27l-2 5',
      'M20 29v5',
      'M28 27l2 5',
    ],
  },
  pigment: {
    label: 'Mineral Pigment',
    note: 'Micronised, non-comedogenic, mixed for heat rather than for filters.',
    path: [
      'M20 5c7 9 12 15 12 21a12 12 0 1 1-24 0c0-6 5-12 12-21Z',
      'M14 26a6 6 0 0 0 6 6',
      'M25 19a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4Z',
      'M15 35a0.9 0.9 0 1 0 0 1.8a0.9 0.9 0 1 0 0-1.8Z',
    ],
  },
};

/** The four material marks, in codex order. */
export const CODEX: { name: MarkName; for: string }[] = [
  { name: 'lace', for: 'Wigs' },
  { name: 'silk', for: 'Lashes' },
  { name: 'titanium', for: 'Piercings' },
  { name: 'pigment', for: 'Makeup' },
];
