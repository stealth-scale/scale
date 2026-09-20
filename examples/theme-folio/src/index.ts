/**
 * States Folio: an editorial product, set to be read. A violet brand on greys tinted to match,
 * body text a step larger than the foundation's, a scale that climbs by a major third, the system
 * serifs, and shadows cast with half again the default ink. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS, PRODUCT } from "#colors.ts";

/**
 * Fixes the size body text is set at, in rem.
 */
export const BODY = 1.0625;

/**
 * Fixes how fast the scale climbs: a major third.
 */
export const RATIO = 1.25;

/**
 * Fixes the serif stack a page is read in.
 */
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/**
 * Draws a violet product on tinted greys, set larger and climbing faster, in a serif.
 */
export const folio: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 1.5, hue: PRODUCT },
  faces: { body: SERIF },
  name: "folio",
  type: { base: BODY, ratio: RATIO },
});
