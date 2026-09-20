/**
 * States Fathom: a deep teal product on marine greys, rounder than the foundation. Everything here
 * is a value, and nothing names a component, so the theme installs in a repository whose
 * components it has never met. The colors are published beside the theme, so a theme built on
 * Fathom states what differs over them.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS, NEUTRAL } from "#colors.ts";

export { COLORS } from "#colors.ts";

/**
 * Draws a deep teal product on marine greys, rounder than the foundation and cast in its own hue.
 */
export const fathom: Theme = defineTheme({
  colors: COLORS,
  depth: { hue: NEUTRAL },
  name: "fathom",
  shape: { corner: "1rem" },
});
