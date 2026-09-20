/**
 * States Ink: the look the components were drawn against. Charcoal on paper by day, paper on
 * charcoal after dark, and a blue accent, on the foundation's own greys, corners and shadows.
 * Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";

/**
 * Draws charcoal on paper by day and paper on charcoal after dark, with a blue accent.
 */
export const ink: Theme = defineTheme({ colors: COLORS, name: "ink" });
