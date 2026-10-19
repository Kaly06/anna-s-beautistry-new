export type ServiceId = 'wigs' | 'piercing' | 'lashes' | 'makeup';

/** A room of the house, as it appears on the home page and in the nav. */
export interface Service {
  id: ServiceId;
  name: string;
  /** Shown on the category card, on hover. */
  description: string;
  image: string;
  count: string;
}

/** One line of the treatment menu, as it appears on a service page. */
export interface MenuItem {
  slug: string;
  service: ServiceId;
  name: string;
  price: number;
  /** Duration in minutes — drives the label and the sort. */
  duration: number;
  tagline: string;
  /** The aftercare note, shown in the modal. */
  note: string;
  /** Which line-drawing to render (see src/lib/specimens.ts). */
  variant: number;
  tag?: string;
  focus?: 'attention';
  image?: string;
}

/** A signature treatment, featured on the home page. */
export interface Signature {
  id: string;
  name: string;
  service: string;
  price: number;
  duration: string;
  image: string;
  detail: string;
  description: string;
  tag?: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}
