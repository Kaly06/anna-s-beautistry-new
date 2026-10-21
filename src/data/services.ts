import type { Service, ServiceId, Signature, Testimonial } from '../types';

export const services: Service[] = [
  {
    id: 'wigs',
    name: 'Wigs',
    description:
      'Installation, construction, reconstruction, revamping, styling and custom services for every stage of your unit.',
    image: '/images/cat-wigs.webp',
    count: '5 services',
  },
  {
    id: 'lashes',
    name: 'Lashes',
    description:
      'Classic, hybrid, volume and mega volume Korean silk sets, with refill and maintenance mapped to your natural lashes.',
    image: '/images/cat-lashes.webp',
    count: '5 services',
  },
  {
    id: 'piercing',
    name: 'Piercings',
    description:
      'Needle-only earlobe, cartilage, Nostril, lip / Medusa and navel piercings in implant-grade titanium.',
    image: '/images/cat-piercing.webp',
    count: '5 services',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    description:
      'Soft glam, full glam, bridal makeup and a dedicated bridal trial — skin-first and built to last.',
    image: '/images/cat-makeup.webp',
    count: '4 services',
  },
];

export const serviceIds: ServiceId[] = services.map((service) => service.id);

export const signatures: Signature[] = [
  {
    id: 'wigs-wig-installation',
    name: 'Wig Installation',
    service: 'Wigs',
    price: 90,
    priceFrom: true,
    duration: '2 hrs',
    image: '/images/svc-frontal.webp',
    detail: 'Closure · frontal · pony · sew-in',
    description: 'Professional installation tailored to your preferred style.',
    tag: 'Popular',
    href: '/services/wigs/wig-installation',
  },
  {
    id: 'lashes-volume',
    name: 'Volume Lash Extensions',
    service: 'Lashes',
    price: 80,
    priceFrom: true,
    duration: '2 hrs',
    image: '/images/svc-lashes.webp',
    detail: '0.05mm silk · 4D fans',
    description: 'Lightweight handmade fans applied to each natural lash for dramatic fullness.',
    href: '/services/lashes/volume-lash-extensions',
  },
  {
    id: 'piercing-cartilage',
    name: 'Cartilage Piercing (Helix/Tragus)',
    service: 'Piercings',
    price: 40,
    priceFrom: true,
    duration: '30 min',
    image: '/images/svc-stack.webp',
    detail: 'Needle-only · implant-grade titanium',
    description: 'Precision upper ear cartilage piercing with professional aftercare guidance.',
    tag: 'Popular',
    href: '/services/piercing/cartilage-piercing-helix-tragus',
  },
  {
    id: 'makeup-soft-glam',
    name: 'Soft Glam Makeup',
    service: 'Makeup',
    price: 80,
    priceFrom: true,
    duration: '1 hr 30',
    image: '/images/svc-glam.webp',
    detail: 'Luminous matte · mineral pigment',
    description: 'Natural, polished makeup for everyday events and photos.',
    href: '/services/makeup/soft-glam-makeup',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'I have worn lace for eleven years and no one has ever matched my hairline like Anna. Three weeks in, nobody could find the line — including my sister, who was looking for it.',
    name: 'Efua Baidoo',
    role: 'Wigs · client since 2019',
  },
  {
    quote:
      'She talked me out of the third hoop and was right. It healed in six weeks with no irritation at all, and I have since brought my daughter for her first lobes.',
    name: 'Ama Serwaa',
    role: 'Piercings · earlobe & cartilage',
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
    role: 'Lashes · Volume Lash Extensions',
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
