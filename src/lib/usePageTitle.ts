import { useEffect } from 'react';

/**
 * SEO lives here so no page has to think about it.
 *
 * Google needs on every URL:
 *   1. A unique title — what the blue link says.
 *   2. A unique description — the two grey lines underneath it.
 *   3. A canonical link — tells Google which address is the real one, so the
 *      vercel.app address and a future annasbeautistry.com don't compete.
 *   4. Keywords — minor for Google, still useful for local search context.
 *
 * The share image (og:image) defaults to the brand card in index.html, but a
 * page can pass its own image for richer shares.
 */

const SITE_URL = 'https://anna-s-beautistry-new.vercel.app';
const BRAND = "Anna's Beautistry";
const HOME_TITLE =
  "Anna's Beautistry | Wig Installation, Lashes, Piercings & Makeup in Cape Coast";
const HOME_DESCRIPTION =
  'Book wig installation, lash extensions, needle-only piercings and bridal makeup in Ayesu, Cape Coast. One client at a time, prices and durations listed.';
const HOME_KEYWORDS =
  "wig installation Cape Coast, lash extensions Cape Coast, piercing studio Cape Coast, makeup artist Cape Coast, bridal makeup Cape Coast, beauty salon Cape Coast, Anna's Beautistry";

export interface PageMeta {
  /** Page name only — the brand is appended for you. Omit on the homepage. */
  title?: string;
  description?: string;
  /** Path of this page, e.g. "/services". Defaults to whatever the browser is on. */
  path?: string;
  /** Comma-separated local search keywords for this page. */
  keywords?: string;
  /** Absolute or root-relative share image for this page. */
  image?: string;
  /** Keep this URL out of search results (admin, error pages). */
  noindex?: boolean;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function usePageMeta({
  title,
  description,
  path,
  keywords,
  image,
  noindex = false,
}: PageMeta = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BRAND}` : HOME_TITLE;
    const desc = description ?? HOME_DESCRIPTION;
    const keys = keywords ?? HOME_KEYWORDS;
    const canonical = `${SITE_URL}${path ?? window.location.pathname}`.replace(/\/$/, '') || SITE_URL;
    const shareImage = image
      ? image.startsWith('http')
        ? image
        : `${SITE_URL}${image}`
      : `${SITE_URL}/og-image.jpg`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[name="keywords"]', 'name', 'keywords', keys);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', shareImage);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow',
    );
    setCanonical(canonical);
  }, [title, description, path, keywords, image, noindex]);
}

/** Kept for the pages that only ever needed a title. */
export function usePageTitle(title?: string) {
  usePageMeta({ title });
}

export { HOME_TITLE, HOME_DESCRIPTION, HOME_KEYWORDS, SITE_URL };
