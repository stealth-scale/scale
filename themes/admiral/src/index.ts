/**
 * States Admiral: a teal blue product on navy and chalk, drawn formal. Headings in a transitional
 * serif, set semibold and tracked tight, a crisp quarter-rem corner, a thick indicator, and
 * shadows cast a fifth harder than the default. The four colors are stated outright and the
 * engine draws every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Fixes the transitional serif stack every heading is set in: the machine's own, with the
 * generic family at the end.
 */
export const SERIF = 'Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif';

/**
 * Draws a teal blue product on navy and chalk, formal: serif headings, crisp corners, a thick
 * indicator and firm shadows in the navy's hue.
 */
export const admiral: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 1.2, hue: 254 },
  faces: { heading: SERIF },
  name: "admiral",
  shape: { corner: "0.25rem", indicator: "3px" },
  type: { heading: { tracking: "tight", weight: "semibold" } },
});
