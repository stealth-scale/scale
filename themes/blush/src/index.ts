/**
 * States Blush: a pink product on navy and pearl, drawn round. A rounded body face, a corner and
 * a quarter, buttons drawn as pills, a looser density with wider insets, bold headings and
 * semibold labels, surfaces after dark that keep seven tenths of the navy's chroma, shadows at
 * four fifths of the default ink, and a tempo a touch slower than the foundation's. The four
 * colors are stated outright and the engine draws every other value from them. Nothing here
 * names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";
import { button } from "#recipes/button.ts";

/**
 * Fixes the rounded stack the page is read in: the machine's own, with the generic family at the
 * end.
 */
export const ROUNDED =
  'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT", "Arial Rounded MT Bold", Calibri, "Source Sans 3", sans-serif';

/**
 * Fixes the padding of a medium control, in rem, before the density scale.
 */
export const INSET = 1.25;

/**
 * Draws a pink product on navy and pearl, round: a rounded face, round corners, pill buttons,
 * wide insets, bold headings, calm surfaces after dark and soft shadows in the navy's hue.
 */
export const blush: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 0.8, hue: 263 },
  faces: { body: ROUNDED },
  metrics: { inset: INSET, scale: 1.05 },
  motion: { pace: 1.1 },
  name: "blush",
  recipes: { button },
  shape: { corner: "1.25rem" },
  type: { heading: { weight: "bold" }, label: { weight: "semibold" } },
});
