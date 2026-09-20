/**
 * States Harbour: a steel blue product on navy and mist, drawn soft. Shadows cast at little more
 * than half the default ink, surfaces after dark that keep three quarters of the navy's chroma, a
 * looser density, a longer measure, body text with more air, headings at a medium weight, and a
 * slower tempo that eases in and out. The four colors are stated outright and the engine draws
 * every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Draws a steel blue product on navy and mist, soft: light shadows in the navy's hue, a looser
 * density, more air in the text and a slow tempo.
 */
export const harbour: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 0.6, hue: 241 },
  metrics: { prose: "70ch", scale: 1.05 },
  motion: { enter: "in-out", move: "in-out", pace: 1.25 },
  name: "harbour",
  shape: { corner: "0.375rem" },
  type: { body: { leading: "relaxed" }, heading: { weight: "medium" } },
});
