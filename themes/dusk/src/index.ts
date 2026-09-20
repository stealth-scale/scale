/**
 * States Dusk: a coral product with mauve and plum beside it, on navy after dark and on the
 * palest coral by day, drawn soft. Body text a step larger with more air, headings at the normal
 * weight in an old-style serif, a one-rem corner, a ring that leaves more room round the control,
 * shadows at half the default ink, surfaces that keep four fifths of the page's chroma, and a
 * slow tempo that eases in and out. The four colors are stated outright and the engine draws
 * every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Fixes the old-style serif stack every heading is set in: the machine's own, with the generic
 * family at the end.
 */
export const SERIF =
  '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, Georgia, serif';

/**
 * Fixes the size body text is set at, in rem.
 */
export const BODY = 1.0625;

/**
 * Draws a coral product on navy and the palest coral, soft: larger body text, light serif
 * headings, round corners, a roomy ring, faint shadows in the navy's hue and a slow tempo.
 */
export const dusk: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 0.5, hue: 246 },
  faces: { heading: SERIF },
  motion: { enter: "in-out", move: "in-out", pace: 1.5 },
  name: "dusk",
  shape: { corner: "1rem", ring: { offset: "3px", width: "2px" } },
  type: {
    base: BODY,
    body: { leading: "relaxed" },
    heading: { leading: "snug", tracking: "normal", weight: "normal" },
  },
});
