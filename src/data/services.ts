import type { Service, ServiceId, Signature, Testimonial } from '../types';

export const services: Service[] = [
  {
    id: 'wigs',
    name: 'Lace & Wigs',
    description:
      'Hand-plucked frontals melted to your own hairline, glueless closures, and revamps for the unit you already love.',
    image: '/images/cat-wigs.webp',
    count: '8 services',
  },
  {
    id: 'piercing',
    name: 'Piercing',
    description:
      'Needle-only, single-use, implant-grade titanium. Lobes, stacks, helix, conch and nostril, marked and measured with you.',
    image: '/images/cat-piercing.webp',
    count: '8 services',
  },
  {
    id: 'lashes',
    name: 'Lashes',
    description:
      'Korean silk sets placed one extension at a time — classic, hybrid, volume and wispy, mapped to your eye shape.',
    image: '/images/cat-lashes.webp',
    count: '8 services',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    description:
      'Skin-first glam that still reads as skin in daylight: soft, full, bridal, traditional and editorial.',
    image: '/images/cat-makeup.webp',
    count: '8 services',
  },
];

export const serviceIds: ServiceId[] = services.map((service) => service.id);

export const signatures: Signature[] = [
  {
    id: 'wigs-1',
    name: 'The Frontal Rebirth',
    service: 'Lace & Wigs',
    price: 850,
    duration: '3 hrs',
    image: '/images/svc-frontal.webp',
    detail: '13×6 HD frontal · hand-plucked',
    description:
      'A 13×6 HD frontal, bleached, tinted and plucked by hand, then melted to your hairline with no lace grid in sight.',
    tag: 'Signature',
    href: '/services/wigs/signature-lace-frontal',
  },
  {
    id: 'piercing-2',
    name: 'The Kotokuraba Stack',
    service: 'Piercing',
    price: 640,
    duration: '45 min',
    image: '/images/svc-stack.webp',
    detail: '3 piercings · implant-grade titanium',
    description:
      'Three piercings planned as one composition — lobe, helix and flat — in solid titanium that stays in through healing.',
    tag: 'Most booked',
    href: '/services/piercing/curated-ear-stack',
  },
  {
    id: 'lashes-3',
    name: 'The Sea Mist Volume',
    service: 'Lashes',
    price: 560,
    duration: '2 hrs 45',
    image: '/images/svc-lashes.webp',
    detail: '0.05mm silk · 4D fans',
    description:
      'A full volume set in matte Korean silk, weighed for humidity so it survives a Cape Coast afternoon.',
    tag: 'Signature',
    href: '/services/lashes/volume-set',
  },
  {
    id: 'makeup-1',
    name: 'Cape Coast Soft Glam',
    service: 'Makeup',
    price: 600,
    duration: '1 hr 30',
    image: '/images/svc-glam.webp',
    detail: 'Luminous matte · mineral pigment',
    description:
      'Bronze, light and undetectable up close. The face people book when they want to be told they look well, not done.',
    tag: 'Signature',
    href: '/services/makeup/soft-glam',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'I have worn lace for eleven years and no one has ever matched my hairline like Anna. Three weeks in, nobody could find the line — including my sister, who was looking for it.',
    name: 'Efua Baidoo',
    role: 'Lace & Wigs · client since 2019',
  },
  {
    quote:
      'She talked me out of the third hoop and was right. It healed in six weeks with no irritation at all, and I have since brought my daughter for her first lobes.',
    name: 'Nana Ama Kuntu',
    role: 'Piercing · curated stack',
  },
  {
    quote:
      'My bridal trial ran twenty minutes over because she kept adjusting the light. On the day, the makeup held through the ceremony, the heat and the reception.',
    name: 'Akosua Mensima',
    role: 'Makeup · bridal, Elmina',
  },
  {
    quote:
      'The lash set is so light I forget it is there until someone asks. That is the compliment I wanted — not "your lashes are lovely", but "your eyes are lovely".',
    name: 'Zainab Yakubu',
    role: 'Lashes · volume set',
  },
];

/** The ticker phrases under the hero. */
export const MARQUEE = [
  'Lace laid by hand',
  'Needle-only piercings',
  'Implant-grade titanium',
  'Korean silk lashes',
  'Skin-first makeup',
  'One client at a time',
];
