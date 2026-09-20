/**
 * States Pine: a green product with teal and sage beside it, on the night after dark and on the
 * palest sage by day, drawn quiet. Surfaces that keep seven tenths of the page's chroma, shadows
 * at three quarters of the default ink, a looser density and a longer measure, a scale that
 * climbs by a minor third, body text with more air, headings at a medium weight in a humanist
 * face, and a slow tempo that eases both ways. The four colors are stated outright and the engine
 * draws every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Fixes the humanist stack every heading is set in: the machine's own, with the generic family
 * at the end.
 */
export const HUMANIST = 'Optima, Candara, "Noto Sans", "Source Sans 3", sans-serif';

/**
 * Fixes how fast the scale climbs: a minor third.
 */
export const RATIO = 1.2;

/**
 * Draws a green product on the night and the palest sage, quiet: calm surfaces, light shadows in
 * the night's hue, a looser density, a faster-climbing scale, more air in the text and a slow
 * tempo.
 */
export const pine: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 0.75, hue: 212 },
  faces: { heading: HUMANIST },
  metrics: { prose: "68ch", scale: 1.05 },
  motion: { enter: "in-out", leave: "in-out", move: "in-out", pace: 1.3 },
  name: "pine",
  shape: { corner: "0.625rem" },
  type: { body: { leading: "relaxed" }, heading: { weight: "medium" }, ratio: RATIO },
});
