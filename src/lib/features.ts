/**
 * Feature switches for sections that exist in the code but are not live yet.
 *
 * wigOptionsSheet — the wigs options/build sheet. Kept in the codebase for a
 * future rollout, but hidden from the public site while false: no nav,
 * footer, services or service-page links render, and the route itself
 * answers 404. To bring it back, flip this to true — every link returns.
 *
 * Private preview while hidden: open
 *   /services/wigs/options?preview=wig-build
 * once in a browser and the sheet stays unlocked in that browser
 * (localStorage), so it can be reviewed without going live.
 */
export const FEATURES = {
  wigOptionsSheet: false,
} as const;

export const WIG_OPTIONS_PREVIEW_KEY = 'wig-build';
export const WIG_OPTIONS_STORAGE_KEY = 'annas-beautistry:wig-options-preview';
