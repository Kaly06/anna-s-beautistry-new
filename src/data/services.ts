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
    service: 'Wig Installation',
    image: '/images/clients/client-Efua-wig-installation.jpg',
  },
  {
    quote:
      'I wanted drama and I said so plainly. She gave me the fullest set I have ever worn and it still feels like nothing on my eyes. Three weeks on, strangers are still stopping me to ask who does my lashes.',
    name: 'Abena Frimpong',
    role: 'Lashes · Mega Volume',
    service: 'Mega Volume Lashes',
    image: '/images/clients/client-Abena-mega-volume.jpg',
  },
  {
    quote:
      'My bridal trial ran twenty minutes over because she kept adjusting the light. On the day, the makeup held through the ceremony, the heat and the reception.',
    name: 'Akosua Mensima',
    role: 'Makeup · bridal, Elmina',
    service: 'Bridal Makeup',
    image: '/images/clients/client-Akosua-bridal-makeup.jpg',
  },
  {
    quote:
      'I was shaking in the chair and she simply slowed everything down. She marked the spot twice, handed me the mirror, and the piercing was finished before the deep breath she asked me to take.',
    name: 'Adjoa Quarshie',
    role: 'Piercings · nostril',
    service: 'Nostril Piercing',
    image: '/images/clients/client-Adjoa-nostril.jpg',
  },
  {
    quote:
      'I told her I have five minutes in the morning, not fifty. She built me a glueless unit I shake out and wear — no glue, no salon visit — and it still looks like I spent the whole morning on it.',
    name: 'Yaa Owusu',
    role: 'Wigs · custom glueless unit',
    service: 'Wig Construction / Making',
    image: '/images/clients/client-Yaa-glueless-unit.jpg',
  },
  {
    quote:
      'The lash set is so light I forget it is there until someone asks. That is the compliment I wanted — not "your lashes are lovely", but "your eyes are lovely".',
    name: 'Zainab Yakubu',
    role: 'Lashes · Volume Lash Extensions',
    service: 'Volume Lash Extensions',
    image: '/images/clients/client-Zainab-volume-lashes.jpg',
  },
  {
    quote:
      'For my mother’s 60th I wanted to look like myself on my best-rested day. That is exactly what she did — my own skin, but lit. I did not want to wash it off that night.',
    name: 'Nana Ama Agyemang',
    role: 'Makeup · soft glam',
    service: 'Soft Glam Makeup',
    image: '/images/clients/client-Nana-ama-soft-glam.jpg',
  },
  {
    quote:
      'She talked me out of the third hoop and was right. It healed in six weeks with no irritation at all, and I have since brought my daughter for her first lobes.',
    name: 'Ama Serwaa',
    role: 'Piercings · earlobe & cartilage',
    service: 'Earlobe & Cartilage Piercing',
    image: '/images/clients/client-Ama-piercings.jpg',
  },
  {
    quote:
      'My old unit was dry, tangled and honestly embarrassing. She treated it, re-curled it and sent it back looking like the day I bought it. I nearly wasted money on a new one.',
    name: 'Maame Grant',
    role: 'Wigs · revamping',
    service: 'Wig Revamping',
    image: '/images/clients/client-Maame-wig-revamping.jpg',
  },
  {
    quote:
      'The pixie changed my whole mood. She cut it on my head, not on a stand, so it sits exactly the way my face needs. I walk differently in it — I am serious.',
    name: 'Araba Mensah',
    role: 'Wigs · pixie styling',
    service: 'Wig Styling & Custom Services',
    image: '/images/clients/client-Araba-pixie.jpg',
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
