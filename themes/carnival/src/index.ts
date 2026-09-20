/**
 * States Carnival: a red product with orange and yellow beside it, on navy after dark and on
 * cream by day, drawn playful. A one-rem corner over a half-rem inner one, a taller control at a
 * looser density, a scale that climbs by a minor third, headings set extrabold in a humanist face,
 * labels set bold, a quick tempo, and a warning drawn from the orange. The four colors are stated
 * outright and the engine draws every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Fixes the humanist stack every heading is set in: the machine's own, with the generic family
 * at the end.
 */
export const HUMANIST =
  'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", "Source Sans 3", sans-serif';

/**
 * Fixes how fast the scale climbs: a minor third.
 */
export const RATIO = 1.2;

/**
 * Fixes the height of a medium control, in rem, before the density scale.
 */
export const CONTROL = 2.75;

/**
 * Draws a red product on navy and cream, playful: round corners, tall controls, a faster-climbing
 * scale, extrabold humanist headings, bold labels, a quick tempo and shadows in the navy's hue.
 */
export const carnival: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 1.25, hue: 256 },
  faces: { heading: HUMANIST },
  metrics: { control: CONTROL, scale: 1.05 },
  motion: { pace: 0.85 },
  name: "carnival",
  shape: { corner: "1rem", l1: "0.5rem" },
  type: { heading: { weight: "extrabold" }, label: { weight: "bold" }, ratio: RATIO },
});
