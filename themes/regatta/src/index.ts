/**
 * States Regatta: a crimson product with deep blue and teal beside it, on navy after dark and on
 * the palest navy by day, drawn sharp. An eighth-rem corner, a wide ring flush with the control,
 * a tighter density and gap, a quick press on a symmetric curve, headings set extrabold and
 * tracked tighter in a condensed face, and buttons set in capitals. The four colors are stated
 * outright and the engine draws every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";
import { button } from "#recipes/button.ts";

/**
 * Fixes the condensed stack every heading is set in: the machine's own, with the generic
 * families at the end.
 */
export const CONDENSED =
  'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';

/**
 * Draws a crimson product on navy and the palest navy, sharp: an eighth-rem corner, a flush
 * ring, a tight density, a quick press and condensed extrabold headings, with shadows in the
 * navy's hue.
 */
export const regatta: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 1.25, hue: 260 },
  faces: { heading: CONDENSED },
  metrics: { gap: 0.375, scale: 0.95 },
  motion: { pace: 0.8, press: "in-out" },
  name: "regatta",
  recipes: { button },
  shape: { corner: "0.125rem", ring: { offset: "0px", width: "3px" } },
  type: {
    heading: { tracking: "tighter", weight: "extrabold" },
    label: { tracking: "wider", weight: "semibold" },
  },
});
