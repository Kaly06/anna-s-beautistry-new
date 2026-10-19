# Anna's Beautistry

A Cape Coast beauty house — wig installation, piercing, lashes and makeup — built on the
design system of the Sika jewellery house: deep royal plum (her purple), champagne gold,
Cormorant Garamond over Montserrat, and the same slow-motion reveal vocabulary.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | The house: hero, services, signatures, studio, materials, looks, booking |
| `/services/:serviceId` | A room of the menu — `wigs`, `piercing`, `lashes`, `makeup` |
| `/services/:serviceId/:slug` | The same room, with one service open in a modal |

## How the design carries over from Sika

The original house is a Ghanaian haute-joaillerie site. The parts worth keeping were not
the rings but the grammar, so the grammar is what moved:

- **Palette — her colours are purple and gold.** `ink` 950–500 is a deep royal-plum
  scale (`#36145e`–`#8f5cc4`) that replaces black as the foundation, `royal` 50–900 is
  the vivid purple used for glows and accents, `gold` 50–800 is the unchanged champagne
  gold, and `ivory` 50–500 is cooled to lilac-ivory so light sections read as pale
  lavender. The former `blush` token now holds the soft lilac accent scale.
- **Type** — `display-1/2/3` clamps, `.eyebrow` with its `0.42em` tracking, and the
  tracked-out `0.3em` buttons are the same rules (`src/index.css`).
- **Motion** — one easing curve (`EASE`, `[0.22, 1, 0.36, 1]`), word-by-word masked
  headlines (`SplitText`), scroll-triggered `Reveal`, magnetic buttons, a gold hairline
  tracking scroll progress, and the opening `Loader` curtain that lifts upward.
- **Custom cursor** — a trailing gold ring with a crisp dot, fine pointers only.
- **Sections, mapped** — Collections → Services, Featured pieces → Signature treatments,
  The atelier → The studio, The Adinkra codex → The materials, Newsletter → Booking.

## What is new

- **The Halo** (`src/data/marks.ts`) replaces the Adinkrahene monogram: an eye ringed
  with studs, drawn as concentric rings so it still reads as a house mark at 16px.
- **Materials codex** — four marks for the four materials the house will not swap:
  Swiss HD lace, implant-grade titanium, Korean silk lashes, mineral pigment.
- **Study drawings** (`src/lib/specimens.ts`) — every line of the treatment menu is drawn
  parametrically as stroked SVG in a 200×200 box, so a 32-item menu needs no photography
  and still looks considered. Change a variant number and the drawing changes.
- **Booking** — a two-column form that collects the sitting, not a newsletter signup.

## Content

All copy and prices live in `src/data/`: `house.ts` (brand, address, hours), `services.ts`
(the four rooms, signatures, testimonials), `menu.ts` (32 treatments with price, duration
and aftercare) and `rooms.ts` (the copy above each menu). Prices are illustrative cedi
figures; `formatPrice` and `formatDuration` in `house.ts` do the formatting.

## Imagery

`public/images/*.webp` are art-directed in the house style. Replace them with studio
photographs before launch — the paths are referenced from `services.ts`, `rooms.ts` and
the components by name (`hero`, `cat-*`, `svc-*`, `studio`).
