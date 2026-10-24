/**
 * The gallery wall.
 *
 * Each entry is one frame. While `src` is null the frame renders as an
 * elegant placeholder in the category's name. To publish a real client
 * photo: save it under `public/images/gallery/`, set `src` to its path
 * (e.g. '/images/gallery/wig-frontal-01.jpg') and give it a caption.
 * Real photos keep their natural shape — portrait, square and landscape
 * frames all sit together in the masonry, so send photos as they are.
 */

export type GalleryCategory = 'Wigs' | 'Lashes' | 'Piercings' | 'Makeup';

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  /** Real photo path ('/images/gallery/…'), or null for a placeholder frame. */
  src: string | null;
  /** Caption shown once the real photo is in. */
  caption: string;
  /** Placeholder frame shape until the photo lands, e.g. '4 / 5'. */
  aspect: string;
}

export const GALLERY_FILTERS: Array<'All' | GalleryCategory> = [
  'All',
  'Wigs',
  'Lashes',
  'Piercings',
  'Makeup',
];

export const galleryItems: GalleryItem[] = [
  { id: 'g01', category: 'Wigs', src: '/images/gallery/wig-curly-install.webp', caption: 'Curly frontal install', aspect: '4 / 5' },
  { id: 'g11', category: 'Lashes', src: '/images/gallery/lashes-cat-eye.webp', caption: 'Cat-eye lash set', aspect: '4 / 5' },
  { id: 'g04', category: 'Piercings', src: '/images/gallery/piercing-helix-tragus.webp', caption: 'Helix & tragus piercings', aspect: '4 / 5' },
  { id: 'g12', category: 'Wigs', src: '/images/gallery/wig-sleek-updo-install.webp', caption: 'Sleek updo install', aspect: '4 / 5' },
  { id: 'g02', category: 'Makeup', src: null, caption: 'Soft glam', aspect: '3 / 4' },
  { id: 'g07', category: 'Lashes', src: '/images/gallery/lashes-volume-set.webp', caption: 'Volume lash set', aspect: '4 / 5' },
  { id: 'g13', category: 'Wigs', src: '/images/gallery/wig-on-stand-styling.webp', caption: 'On the stand, mid-style', aspect: '4 / 5' },
  { id: 'g14', category: 'Piercings', src: '/images/gallery/piercing-helix-charm.webp', caption: 'Fresh helix piercing', aspect: '4 / 5' },
  { id: 'g10', category: 'Makeup', src: '/images/gallery/makeup-full-glam.webp', caption: 'Full glam', aspect: '4 / 5' },
  { id: 'g15', category: 'Lashes', src: '/images/gallery/lashes-dramatic-set.webp', caption: 'Dramatic lash set', aspect: '4 / 5' },
  { id: 'g05', category: 'Wigs', src: '/images/gallery/wig-body-wave-install.webp', caption: 'Body-wave install', aspect: '3 / 4' },
  { id: 'g03', category: 'Lashes', src: '/images/gallery/lashes-in-progress.webp', caption: 'During a lash set', aspect: '1 / 1' },
  { id: 'g06', category: 'Makeup', src: null, caption: 'Bridal makeup', aspect: '4 / 3' },
  { id: 'g16', category: 'Lashes', src: '/images/gallery/lashes-wispy-set.webp', caption: 'Wispy lash set', aspect: '4 / 5' },
  { id: 'g09', category: 'Piercings', src: '/images/gallery/piercing-tongue.webp', caption: 'Tongue piercing', aspect: '3 / 4' },
  { id: 'g08', category: 'Wigs', src: '/images/gallery/wig-side-part-install.webp', caption: 'Side-part install', aspect: '1 / 1' },
  { id: 'g17', category: 'Lashes', src: '/images/gallery/lashes-mega-volume.webp', caption: 'Mega volume set', aspect: '4 / 5' },
  { id: 'g18', category: 'Lashes', src: '/images/gallery/lashes-bonnet-bed.webp', caption: 'Fresh set, all smiles', aspect: '4 / 3' },
  { id: 'g19', category: 'Lashes', src: '/images/gallery/lashes-soft-set.webp', caption: 'Soft, natural set', aspect: '4 / 5' },
];
