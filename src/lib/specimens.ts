import type { ServiceId } from '../types';

/**
 * Parametric line-art specimens for the treatment menu.
 *
 * Every service is described as a list of stroke primitives in a 200x200 box,
 * so the whole menu shares one drawing language and no entry needs a photograph
 * to look considered. Geometry is generated per variant: the lace cap gets a
 * different mesh density, the ear a different stud count, the eye a wider fan.
 */

export type Prim =
  | { t: 'path'; d: string; w?: number; o?: number }
  | { t: 'circle'; cx: number; cy: number; r: number; w?: number; o?: number }
  | {
      t: 'ellipse';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      rot?: number;
      w?: number;
      o?: number;
    }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; w?: number; o?: number };

const n = (v: number) => Math.round(v * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** A lace frontal: cap, mesh, and strands falling off the baseline. */
function lace(v: number): Prim[] {
  const cx = 100;
  const cy = 116;
  const rx = 58;
  const ry = 78;
  const cols = 5 + (v % 3);
  const rows = 2 + ((v + 1) % 3);
  const prims: Prim[] = [];

  prims.push({ t: 'path', d: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`, w: 1.25 });
  prims.push({ t: 'line', x1: cx - rx, y1: cy, x2: cx + rx, y2: cy, w: 0.9, o: 0.6 });

  for (let i = 1; i <= rows; i += 1) {
    const y = cy - (ry * i) / (rows + 1);
    const half = rx * Math.sqrt(Math.max(0, 1 - ((cy - y) / ry) ** 2));
    prims.push({
      t: 'line',
      x1: n(cx - half),
      y1: n(y),
      x2: n(cx + half),
      y2: n(y),
      w: 0.55,
      o: 0.4,
    });
  }

  for (let i = 1; i <= cols; i += 1) {
    const x = cx - rx + (2 * rx * i) / (cols + 1);
    const dy = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
    prims.push({ t: 'line', x1: n(x), y1: n(cy), x2: n(x), y2: n(cy - dy), w: 0.55, o: 0.4 });
  }

  const strands = 3 + (v % 2);
  for (let i = 0; i < strands; i += 1) {
    const x = cx - 42 + (i * 84) / (strands - 1);
    prims.push({
      t: 'path',
      d: `M${n(x)} ${cy} C ${n(x - 7)} ${cy + 30} ${n(x + 9)} ${cy + 52} ${n(x - 3)} ${cy + 72}`,
      w: 0.85,
      o: 0.5,
    });
  }

  return prims;
}

/** An ear under the needle: hoop, studs, and the needle's line. */
function piercing(v: number): Prim[] {
  const r = 44 + (v % 3) * 6;
  const studs = 3 + v;
  const spread = 150 + v * 22;
  const start = -90 - spread / 2 + 10 * v;
  const prims: Prim[] = [];

  prims.push({ t: 'circle', cx: 100, cy: 100, r, w: 1.15, o: 0.85 });
  prims.push({ t: 'circle', cx: 100, cy: 100, r: n(r * 0.42), w: 0.9, o: 0.45 });
  prims.push({ t: 'circle', cx: 100, cy: 100, r: n(r * 0.16), w: 0.8, o: 0.9 });

  for (let i = 0; i < studs; i += 1) {
    const deg = start + (spread * i) / Math.max(1, studs - 1);
    prims.push({
      t: 'circle',
      cx: n(100 + r * Math.cos(rad(deg))),
      cy: n(100 + r * Math.sin(rad(deg))),
      r: 3 + (i % 2),
      w: 0.9,
    });
  }

  const a = rad(-64 + v * 26);
  prims.push({
    t: 'line',
    x1: n(100 - Math.cos(a) * 78),
    y1: n(100 - Math.sin(a) * 78),
    x2: n(100 + Math.cos(a) * 78),
    y2: n(100 + Math.sin(a) * 78),
    w: 0.7,
    o: 0.35,
  });

  return prims;
}

/** An eye with a fan of extensions placed along the upper lid. */
function lashes(v: number): Prim[] {
  const cx = 100;
  const cy = 116;
  const rx = 54;
  const ry = 30;
  const count = 9 + (v % 3) * 2;
  const len = 15 + (v % 2) * 9;
  const prims: Prim[] = [];

  prims.push({ t: 'path', d: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`, w: 1.2 });
  prims.push({
    t: 'path',
    d: `M${cx - rx} ${cy} A${rx} ${n(ry * 0.6)} 0 0 0 ${cx + rx} ${cy}`,
    w: 0.85,
    o: 0.5,
  });
  prims.push({ t: 'circle', cx, cy, r: 13, w: 0.9, o: 0.75 });
  prims.push({ t: 'circle', cx, cy, r: 4.5, w: 0.9, o: 0.9 });

  for (let i = 0; i < count; i += 1) {
    const t = rad(24 + (132 * i) / (count - 1));
    const px = cx + rx * Math.cos(t);
    const py = cy - ry * Math.sin(t);
    const tipX = cx + (rx + len) * Math.cos(t + 0.1);
    const tipY = cy - (ry + len * 0.95) * Math.sin(t);
    const ctrlX = cx + (rx + len * 0.45) * Math.cos(t + 0.02);
    const ctrlY = cy - (ry + len * 0.55) * Math.sin(t);
    prims.push({
      t: 'path',
      d: `M${n(px)} ${n(py)} Q ${n(ctrlX)} ${n(ctrlY)} ${n(tipX)} ${n(tipY)}`,
      w: 0.85,
      o: 0.8,
    });
  }

  for (let i = 0; i < 5; i += 1) {
    const t = rad(36 + (108 * i) / 4);
    prims.push({
      t: 'line',
      x1: n(cx + (rx - 8) * Math.cos(t)),
      y1: n(cy + (ry * 0.6 - 4) * Math.sin(t)),
      x2: n(cx + (rx - 1) * Math.cos(t)),
      y2: n(cy + (ry * 0.6 + 8) * Math.sin(t)),
      w: 0.6,
      o: 0.35,
    });
  }

  return prims;
}

/** Makeup: four still lifes — a lip, a drop of pigment, a compact, a brush. */
function makeup(v: number): Prim[] {
  const kind = v % 4;

  if (kind === 0) {
    return [
      { t: 'path', d: 'M58 108 C 74 84 126 84 142 108 C 126 132 74 132 58 108 Z', w: 1.2 },
      { t: 'path', d: 'M58 108 C 78 102 122 102 142 108', w: 0.8, o: 0.55 },
      { t: 'path', d: 'M84 90 C 92 96 108 96 116 90', w: 0.7, o: 0.4 },
      { t: 'path', d: 'M74 118 C 86 126 114 126 126 118', w: 0.7, o: 0.4 },
      { t: 'circle', cx: 92, cy: 114, r: 2.4, w: 0.8, o: 0.5 },
      { t: 'circle', cx: 112, cy: 112, r: 1.7, w: 0.8, o: 0.5 },
    ];
  }

  if (kind === 1) {
    return [
      { t: 'path', d: 'M100 34 C 116 60 134 80 134 104 A 34 34 0 1 1 66 104 C 66 80 84 60 100 34 Z', w: 1.2 },
      { t: 'path', d: 'M80 112 a 20 20 0 0 0 20 20', w: 0.85, o: 0.5 },
      { t: 'path', d: 'M100 34 C 106 44 112 52 116 60', w: 0.7, o: 0.35 },
      { t: 'circle', cx: 118, cy: 96, r: 2.6, w: 0.8, o: 0.45 },
      { t: 'circle', cx: 86, cy: 138, r: 1.8, w: 0.8, o: 0.45 },
    ];
  }

  if (kind === 2) {
    return [
      { t: 'circle', cx: 100, cy: 100, r: 52, w: 1.15 },
      { t: 'circle', cx: 100, cy: 100, r: 38, w: 0.85, o: 0.5 },
      { t: 'circle', cx: 84, cy: 88, r: 10, w: 0.9, o: 0.7 },
      { t: 'circle', cx: 114, cy: 92, r: 7, w: 0.9, o: 0.55 },
      { t: 'circle', cx: 96, cy: 116, r: 8.5, w: 0.9, o: 0.6 },
      { t: 'path', d: 'M62 132 C 84 118 120 108 142 118', w: 0.8, o: 0.4 },
      { t: 'path', d: 'M62 144 C 86 130 122 120 142 130', w: 0.8, o: 0.25 },
    ];
  }

  return [
    { t: 'path', d: 'M72 156 L 104 74', w: 1.1 },
    { t: 'path', d: 'M84 150 L 116 68', w: 0.85, o: 0.45 },
    { t: 'path', d: 'M96 58 L 128 50 L 132 66 L 100 74 Z', w: 1.05 },
    { t: 'path', d: 'M100 60 C 92 40 96 26 108 20 C 118 26 120 42 112 60', w: 0.95 },
    { t: 'path', d: 'M106 24 C 100 38 102 48 106 58', w: 0.6, o: 0.4 },
    { t: 'path', d: 'M112 28 C 110 40 112 50 114 58', w: 0.6, o: 0.3 },
    { t: 'circle', cx: 70, cy: 160, r: 3, w: 0.8, o: 0.5 },
  ];
}

const FAMILIES: Record<ServiceId, (v: number) => Prim[]> = {
  wigs: lace,
  piercing,
  lashes,
  makeup,
};

/** The line-drawing for one line of the menu. */
export function specimen(service: ServiceId, variant: number): Prim[] {
  return FAMILIES[service](Math.abs(Math.round(variant)));
}
