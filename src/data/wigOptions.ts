import type { WigOptionGroup } from '../types';

/**
 * The wigs options sheet.
 *
 * A lace unit is not one product, it is eight decisions taken in order: how it
 * is installed, which lace, what frontpiece, which cap, how dense, how long,
 * which texture, which colour — and then whatever finishing the hairline needs.
 * The prices here are the real increments we quote in the chair; the estimate
 * on the page is the sum of them, so nothing is revealed at the till.
 *
 * Price basis (checked Oct 2026 against the Ghana market): Anna's own menu
 * (closure install GH₵90–140, frontal GH₵160–200) anchors the install line;
 * Accra salons list frontal installs at GH₵250–350, frontal customization
 * (pluck + bleach) at GH₵120, lace tint at GH₵80, wig wash/revamp at ~GH₵50;
 * human-hair bundles run ~GH₵450 at 12″ rising to ~GH₵1,300 at 30″. The
 * sheet sits at the Cape Coast end of those ranges — it is a starting
 * estimate, and the final quote is always confirmed in the chair.
 */

/**
 * The old GH₵620 base no longer sits underneath the sheet. It has been
 * divided equally across the ten cards that used to read "Included"
 * (GH₵620 ÷ 10 = GH₵62 each), so the estimate can start at GH₵0 and every
 * single pick — standard choices included — visibly moves the price.
 */
export const WIG_INCLUDED_TOTAL = 620;
export const WIG_INCLUDED_SHARE = 62;

/** The sheet starts empty: no base charge until the client chooses a line. */
export const WIG_BASE = {
  price: 0,
  label: 'Start from scratch',
  note: 'The sheet starts at GH₵0. Every line you choose adds its price — the standard choices each carry GH₵62 of the old GH₵620 base.',
} as const;

export const WIG_GROUPS: WigOptionGroup[] = [
  {
    id: 'install',
    name: 'The install',
    question: 'How is the unit going on?',
    intro:
      'Every unit is washed, braided down and fitted by hand. The install is the floor the rest of the sheet is built on.',
    options: [
      {
        id: 'glueless',
        name: 'Glueless closure install',
        spec: '5×5 closure · elastic band',
        add: WIG_INCLUDED_SHARE,
        detail:
          'Braided down, banded, and held with an adjustable strap. No adhesive anywhere near your hairline.',
        note: 'The one we fit first-timers and anyone growing their edges back.',
        recommended: true,
        meta: '2 hrs',
      },
      {
        id: 'frontal',
        name: 'Signature frontal install',
        spec: '13×6 frontal · melted',
        add: 150,
        detail:
          'Frontal bleached, tinted and plucked by hand, then melted to your hairline with no lace grid in sight.',
        note: 'For a hairline that has to disappear on camera.',
        meta: '3 hrs',
      },
      {
        id: 'bridal',
        name: 'Bridal install',
        spec: 'trial + day-of + pin-up kit',
        add: 300,
        detail:
          'A trial, a day-of install and a kit to hold it through the ceremony and the reception.',
        note: 'Booked with the trial at least three weeks out. Two hours on-call on the morning.',
        meta: '4 hrs + trial',
      },
    ],
  },
  {
    id: 'lace',
    name: 'The lace',
    question: 'Which lace?',
    intro:
      'Lace is chosen against your skin in daylight, not on a screen. If the swatch does not vanish at your temple, we do not sell it to you.',
    options: [
      {
        id: 'transparent',
        name: 'Transparent lace',
        spec: 'standard',
        add: WIG_INCLUDED_SHARE,
        detail:
          'The everyday lace. Melts well on deep and medium skin tones and survives two or three installs.',
        note: 'The safe read, and the one most clients leave with.',
        recommended: true,
        meta: 'Replaced every 3 installs',
      },
      {
        id: 'swiss',
        name: 'Swiss lace',
        spec: 'fine',
        add: 100,
        detail:
          'A finer thread than transparent lace — softer on the forehead, and more easily torn at the temples.',
        note: 'Choose it if you part and re-part daily. Handle it like stockings.',
        meta: 'Replaced every 2 installs',
      },
      {
        id: 'hd',
        name: 'HD lace',
        spec: 'ultra-fine',
        add: 160,
        detail:
          'The thinnest lace made. Invisible in daylight and under flash, and the first thing to go if the unit is handled roughly.',
        note: 'Bridal and editorial only, in our book. Not a daily-wear lace.',
        meta: 'Replaced every 2 installs',
      },
    ],
  },
  {
    id: 'frontpiece',
    name: 'The frontpiece',
    question: 'How much parting space?',
    intro:
      'The frontpiece decides where the hair can be parted and how far back the illusion runs. Bigger is not automatically better — it is more lace to maintain.',
    options: [
      {
        id: 'closure-4x4',
        name: '4×4 closure',
        spec: '4 × 4',
        add: WIG_INCLUDED_SHARE,
        detail: 'A small square at the crown of the head. One part, no ear-to-ear finish.',
        note: 'The most discreet footprint, and the cheapest to replace.',
        meta: '8 services deep',
      },
      {
        id: 'closure-5x5',
        name: '5×5 closure',
        spec: '5 × 5',
        add: WIG_INCLUDED_SHARE,
        detail: 'More room to part than a 4×4, without committing to lace at the temples.',
        recommended: true,
        meta: 'Standard',
      },
      {
        id: 'frontal-13x4',
        name: '13×4 frontal',
        spec: '13 × 4',
        add: 180,
        detail: 'Ear to ear, four inches deep. The classic frontal part line.',
        note: 'For a middle part that has to hold all night.',
      },
      {
        id: 'frontal-13x6',
        name: '13×6 frontal',
        spec: '13 × 6',
        add: 250,
        detail:
          'Six inches of parting space, so the hair can be swept back off the face without showing a tracks line.',
        note: 'The house signature. It is what most frontals in our lookbook are built on.',
        recommended: false,
      },
      {
        id: 'frontal-360',
        name: '360 frontal',
        spec: '360°',
        add: 400,
        detail: 'Lace all the way around the perimeter — high ponytails, updos, and nothing to hide at the nape.',
        note: 'Needs a hand to install properly and a scarf every night. Not a beginner unit.',
      },
    ],
  },
  {
    id: 'cap',
    name: 'The cap',
    question: 'How should the cap sit?',
    intro:
      'Cape Coast is hot and humid for eight months of the year. The cap is where that is either managed or endured.',
    options: [
      {
        id: 'standard',
        name: 'Standard cap',
        spec: 'combs + strap',
        add: WIG_INCLUDED_SHARE,
        detail: 'Combs at the sides and an adjustable strap at the nape. The default on most stock units.',
        note: 'Fine for an evening. Less so for a full day in the sun.',
      },
      {
        id: 'breathable',
        name: 'Breathable mesh cap',
        spec: 'open weave',
        add: 110,
        detail: 'An open-weave cap that lets heat out at the crown and the nape.',
        note: 'The one we recommend on the coast. Noticeably cooler by the afternoon.',
        recommended: true,
      },
      {
        id: 'silicone',
        name: 'Silicone grip cap',
        spec: 'grip strips',
        add: 140,
        detail:
          'Grip strips instead of combs, so nothing pulls at your own hairline and the unit does not shift.',
        note: 'Best for fine or thinning edges, and for anyone who takes the unit off nightly.',
      },
    ],
  },
  {
    id: 'density',
    name: 'The density',
    question: 'How much hair?',
    intro:
      'Density is the single most over-ordered line on the sheet. We will fit what your hairline can carry, not what the photograph shows.',
    options: [
      {
        id: '150',
        name: '150% density',
        spec: 'natural',
        add: WIG_INCLUDED_SHARE,
        detail: 'Reads as your own hair from across a room, and behaves like it in wind.',
        note: 'What we put on clients who work in offices and churches.',
      },
      {
        id: '180',
        name: '180% density',
        spec: 'full',
        add: 120,
        detail: 'The house standard for a frontal install. Full, with a visible part and no flat spots.',
        recommended: true,
      },
      {
        id: '200',
        name: '200% density',
        spec: 'camera-ready',
        add: 180,
        detail: 'Dense enough for flash photography. Heavier at the nape, and warmer.',
        note: 'Book an extra half hour — this density takes longer to melt down.',
      },
      {
        id: '250',
        name: '250% density',
        spec: 'editorial',
        add: 260,
        detail: 'The heaviest we will sell. A photographs-only density, not an everyday one.',
        note: 'We will refuse this on fine or fragile hairlines. It is not worth your edges.',
      },
    ],
  },
  {
    id: 'length',
    name: 'The length',
    question: 'How long?',
    intro:
      'Measured from the crown to the tip. On a 5 ft 4 frame, 22 inches ends at the bra strap.',
    options: [
      {
        id: '14',
        name: '14 inches',
        spec: "14″",
        add: WIG_INCLUDED_SHARE,
        detail: 'Lob length — at the jaw on most frames.',
      },
      {
        id: '16',
        name: '16 inches',
        spec: "16″",
        add: 120,
        detail: 'Clavicle. The shortest we recommend for a first frontal.',
      },
      {
        id: '18',
        name: '18 inches',
        spec: "18″",
        add: 180,
        detail: 'Collarbone. The most-ordered length in the house.',
        recommended: true,
      },
      {
        id: '20',
        name: '20 inches',
        spec: "20″",
        add: 240,
        detail: 'Top of the chest. Still light enough to wear down all day.',
      },
      {
        id: '22',
        name: '22 inches',
        spec: "22″",
        add: 320,
        detail: 'Bra strap. The longest we call everyday.',
      },
      {
        id: '24',
        name: '24 inches',
        spec: "24″",
        add: 400,
        detail: 'Under the bust. Needs a nightly scarf and a weekly brush-out.',
      },
      {
        id: '26',
        name: '26 inches',
        spec: "26″",
        add: 500,
        detail: 'Waist. Two weeks to order, and a wash every eight wears.',
      },
      {
        id: '28',
        name: '28 inches',
        spec: "28″",
        add: 620,
        detail: 'Below the waist. Heavy at the root — we will braid down an extra row.',
      },
      {
        id: '30',
        name: '30 inches',
        spec: "30″",
        add: 740,
        detail:
          'Hip. Ordered in pairs so the ends can be replaced when they thin, which they will.',
      },
    ],
  },
  {
    id: 'texture',
    name: 'The texture',
    question: 'Which pattern?',
    intro:
      'Texture decides how much work the unit is between installs. Straight shows every cuticle; waves forgive.',
    options: [
      {
        id: 'straight',
        name: 'Bone straight',
        spec: '1A',
        add: WIG_INCLUDED_SHARE,
        detail: 'Mirror straight. The easiest to style and the least forgiving of a cheap bundle.',
        note: 'Ask for it if you straighten your own hair anyway.',
      },
      {
        id: 'body-wave',
        name: 'Body wave',
        spec: 'loose S',
        add: WIG_INCLUDED_SHARE,
        detail: 'Loose S-wave that holds its shape through humidity and brushes out in the morning.',
        note: 'The house texture. If you do not want to think about it, this is it.',
        recommended: true,
      },
      {
        id: 'loose-wave',
        name: 'Loose wave',
        spec: 'loose curl',
        add: 90,
        detail: 'A wider, softer curl than body wave, with more movement at the ends.',
      },
      {
        id: 'deep-wave',
        name: 'Deep wave',
        spec: 'defined curl',
        add: 90,
        detail: 'A deep, springy pattern that needs water and a leave-in to stay defined.',
        note: 'Beautiful on day one. It will ask for attention on day four.',
      },
      {
        id: 'water-wave',
        name: 'Water wave',
        spec: 'wet-look curl',
        add: 110,
        detail: 'A wet, rippled curl that photographs like it is still damp.',
      },
      {
        id: 'kinky-curly',
        name: 'Kinky curly',
        spec: 'type 4 coil',
        add: 130,
        detail: 'Coils matched to type 4 hair — the closest blend for a natural leave-out.',
        note: 'Needs a leave-in and a wide-tooth comb, and never a fine brush.',
      },
      {
        id: 'yaki',
        name: 'Yaki straight',
        spec: 'relaxed',
        add: 90,
        detail: 'Straight with a relaxed texture, so it blends with chemically straightened hair.',
      },
    ],
  },
  {
    id: 'colour',
    name: 'The colour',
    question: 'Which colour?',
    intro:
      'Every colour is checked against your skin in daylight before it is ordered. Screens lie, and so do filters.',
    options: [
      {
        id: '1b',
        name: 'Natural black',
        spec: '1B',
        add: WIG_INCLUDED_SHARE,
        detail: 'Off-black with a warm undertone. The default, and the easiest to match.',
        recommended: true,
      },
      {
        id: '2',
        name: 'Dark brown',
        spec: '2',
        add: 90,
        detail: 'A soft brown that reads black indoors and warm in the sun.',
      },
      {
        id: '4',
        name: 'Honey brown',
        spec: '4',
        add: 120,
        detail: 'A medium brown with gold in it. Flatters warm undertones.',
      },
      {
        id: '99j',
        name: 'Burgundy',
        spec: '99J',
        add: 150,
        detail: 'A deep red-wine. Sits well beside the house gold, and photographs richly.',
        note: 'Fades toward brown by month three. We can re-tone at an install.',
      },
      {
        id: 'ombre',
        name: 'Ombré',
        spec: '1B / 27',
        add: 180,
        detail: 'Dark at the root into honey at the ends, hand-blended so the line is not a line.',
      },
      {
        id: 'custom',
        name: 'Custom colour',
        spec: 'matched to swatch',
        add: 240,
        detail: 'Matched to a fabric swatch or a photograph you bring in.',
        note: 'Two weeks to order. Non-returnable once tinted.',
        meta: '2 weeks',
      },
    ],
  },
  {
    id: 'finishing',
    name: 'The finishing',
    question: 'Anything else?',
    intro:
      'The finishing is what separates a unit from a hairline. Choose as many as your lace needs — each one adds its own line to the sheet.',
    multi: true,
    options: [
      {
        id: 'bleach-knots',
        name: 'Bleach the knots',
        spec: 'knots',
        add: 70,
        detail: 'Knots lightened so the lace does not look dotted at the parting.',
        meta: 'Waived on frontals',
      },
      {
        id: 'tint-lace',
        name: 'Tint the lace',
        spec: 'matched',
        add: 80,
        detail: 'Lace tinted to your scalp colour, mixed by hand against your skin.',
      },
      {
        id: 'baby-hairs',
        name: 'Baby hairs',
        spec: 'laid',
        add: 30,
        detail: 'Edges laid with a soft brush — or left alone, if you prefer them.',
        note: 'We will lay them; we will not draw them on.',
      },
      {
        id: 'elastic-band',
        name: 'Elastic band',
        spec: 'glueless',
        add: 40,
        detail: 'A wide band sewn in at the nape so the unit holds without adhesive.',
        meta: 'Waived on glueless installs',
      },
      {
        id: 'cut-style',
        name: 'Custom cut & style',
        spec: 'on you',
        add: 100,
        detail: 'Layers, curtain bangs or a blunt bob, cut on your head rather than on a block.',
        note: 'Cut after the install, never before.',
      },
      {
        id: 'wash',
        name: 'Wig wash & deep condition',
        spec: 'drop-off',
        add: 50,
        detail: 'Washed, conditioned, detangled and dried on a head stand.',
        meta: '48 hrs drop-off',
      },
    ],
  },
];

/** How the sheet is read, in the order we actually work. */
export const WIG_STEPS = [
  {
    numeral: '01',
    title: 'Build the sheet',
    body: 'Choose the install, the lace and the length here. The estimate updates as you go, so nothing is a surprise at the till.',
  },
  {
    numeral: '02',
    title: 'Send it to the house',
    body: 'Email the build or paste it into the booking form. We reply within a day with two times and an honest note on anything that will not suit you.',
  },
  {
    numeral: '03',
    title: 'Hair is ordered',
    body: 'Stock lengths arrive in five to seven days; anything over 26 inches or custom-coloured takes two weeks. A card holds the order.',
  },
  {
    numeral: '04',
    title: 'Install day',
    body: 'Wash, braid-down, bleach, pluck, melt, cut. Two hours for a glueless closure, three for a frontal, and aftercare written down before you leave.',
  },
];

/** What the house will not do, whatever the sheet says. */
export const WIG_REFUSALS = [
  'We will not glue an edge down to save twenty minutes.',
  'We will not fit 250% density on a hairline that cannot carry it.',
  'We will not reuse lace. Once it has lifted, it is replaced.',
  'We will not promise a colour we have not seen in daylight.',
];

export const WIG_FAQ = [
  {
    q: 'Can I bring my own unit?',
    a: 'Yes. Book a Wig Customisation instead of an install and drop the unit off clean and dry, 48 hours ahead. We will tell you honestly if the lace is past reviving — most are, after a second install.',
  },
  {
    q: 'How long does a unit last?',
    a: 'Six to nine months of daily wear with a wash every eight to ten wears. HD lace is replaced at each install; transparent and Swiss lace last two to three. The hair outlives the lace, which is why we sell them separately.',
  },
  {
    q: 'How far ahead should I book?',
    a: 'Two weeks for a stock length, four for anything over 26 inches, custom colour or a bridal trial. December and the wedding season fill six weeks out.',
  },
  {
    q: 'What if the density is too much once it is on?',
    a: 'We thin it in the chair, free, within the first week. Density can come down; it cannot go up, which is why we start lower than the photograph.',
  },
  {
    q: 'Do you install outside Cape Coast?',
    a: 'We travel to Elmina and Takoradi for bridal parties and groups of three or more. Units can also be couriered anywhere in Ghana once the build is confirmed and paid for.',
  },
];
