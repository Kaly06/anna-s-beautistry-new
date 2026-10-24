import { useEffect } from 'react';

/**
 * SEO lives here so no page has to think about it.
 *
 * Two things Google needs on every URL, and one thing WhatsApp needs:
 *   1. A unique title — what the blue link says.
 *   2. A unique description — the two grey lines underneath it.
 *   3. A canonical link — tells Google which address is the real one, so the
 *      vercel.app address and a future annasbeautistry.com don't compete.
 *
 * The share image (og:image) is set once in index.html, because every page
 * shares the same brand card.
 */

const SITE_URL = 'https://anna-s-beautistry-new.vercel.app';
const BRAND = "Anna's Beautistry";
const HOME_TITLE = "Anna's Beautistry — Wig artistry, piercing, lashes & makeup, Cape Coast";
const HOME_DESCRIPTION =
  'A Cape Coast beauty house for hand-laid lace, needle-only piercings, weightless lash sets and skin-first makeup. One client, one chair, one mirror.';

export interface PageMeta {
  /** Page name only — the brand is appended for you. Omit on the homepage. */
  title?: string;
  description?: string;
  /** Path of this page, e.g. "/services". Defaults to whatever the browser is on. */
  path?: string;
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

export function usePageMeta({ title, description, path, noindex = false }: PageMeta = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${BRAND}` : HOME_TITLE;
    const desc = description ?? HOME_DESCRIPTION;
    const canonical = `${SITE_URL}${path ?? window.location.pathname}`.replace(/\/$/, '') || SITE_URL;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow',
    );
    setCanonical(canonical);
  }, [title, description, path, noindex]);
}

/** Kept for the pages that only ever needed a title. */
export function usePageTitle(title?: string) {
  usePageMeta({ title });
}

export { HOME_TITLE, HOME_DESCRIPTION, SITE_URL };
