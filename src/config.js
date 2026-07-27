/* global __SHOW_PROTOTYPE__ */

/**
 * Prototype gate.
 *
 * The institute marketplace, institute details, education basket and eligibility
 * checker all run on mock data (see src/data/institutes.js). They were built for
 * the internal demo and must stay off the public build.
 *
 * `__SHOW_PROTOTYPE__` is substituted with a literal at build time (see
 * vite.config.js), so when it is false the prototype pages and their mock data
 * are stripped from the bundle entirely rather than merely hidden.
 *
 * Off by default. To bring them back locally:
 *   VITE_SHOW_PROTOTYPE=true npm run dev
 */
export const SHOW_PROTOTYPE = __SHOW_PROTOTYPE__
