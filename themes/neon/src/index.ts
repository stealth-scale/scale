/**
 * States Neon: a violet product with hot pink and yellow beside it, on grape after dark and on the
 * palest violet by day, drawn loud. Surfaces that keep half the grape's chroma so the fills and
 * the solids carry the color, shadows at twice the default ink, a thick indicator and a wide
 * ring, headings set black and tracked tight in a geometric face, a snappy tempo, and a glass
 * look that blurs further and saturates what shows through it. The four colors are stated
 * outright and the engine draws every other value from them. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Fixes the geometric stack every heading is set in: the machine's own, with the generic family
 * at the end.
 */
export const GEOMETRIC = 'Avenir, Montserrat, Corbel, "URW Gothic", "Source Sans 3", sans-serif';

/**
 * Draws a violet product on grape and the palest violet, loud: calm surfaces under loud fills,
 * heavy shadows in the grape's hue, a thick indicator, a wide ring, black geometric headings, a
 * snappy tempo and a deeper glass.
 */
export const neon: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 2, hue: 292 },
  faces: { heading: GEOMETRIC },
  looks: {
    layerStyles: {
      glass: {
        value: { backdropFilter: "blur({blurs.lg}) saturate(1.5)", background: "bg.panel/60" },
      },
    },
  },
  motion: { pace: 0.6 },
  name: "neon",
  shape: { corner: "0.75rem", indicator: "3px", ring: { offset: "2px", width: "3px" } },
  type: { heading: { tracking: "tight", weight: "black" }, label: { weight: "semibold" } },
});
