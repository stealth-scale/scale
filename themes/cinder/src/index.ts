/**
 * States Cinder: a red product on slate and ash, drawn hard. Sharp corners, a heavy control edge
 * and a thick indicator, hard shadows, a tighter density, a press answered fast on a straight
 * curve, bold headings tracked tight in a grotesque, and badges set in capitals. The four colors
 * are stated outright and the engine draws every other value from them. Nothing here names a
 * component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";
import { badge } from "#recipes/badge.ts";

/**
 * Fixes the grotesque stack every heading is set in: the machine's own, with the generic family
 * at the end.
 */
export const GROTESQUE =
  'Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';

/**
 * Draws a red product on slate and ash, hard: sharp corners, a heavy edge, hard shadows in the
 * slate's hue, a tight density, a fast press and bold grotesque headings.
 */
export const cinder: Theme = defineTheme({
  colors: COLORS,
  depth: { depth: 1.5, hue: 251 },
  faces: { heading: GROTESQUE },
  metrics: { scale: 0.95 },
  motion: { pace: 0.75, press: "linear" },
  name: "cinder",
  recipes: { badge },
  shape: {
    control: "2px",
    corner: "0.125rem",
    indicator: "3px",
    ring: { offset: "1px", width: "2px" },
  },
  type: { heading: { tracking: "tight", weight: "bold" }, label: { weight: "semibold" } },
});
