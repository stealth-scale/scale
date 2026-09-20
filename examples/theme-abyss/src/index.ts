/**
 * States Abyss: Fathom taken into deep water. The same teal, now the accent, an indigo brand on
 * pages nearer black and nearer white, a sharper corner, every button's label tracked wide, and
 * every badge's label in capitals. Everything else is Fathom's, which Abyss extends rather than
 * restates. The badge is a recipe an application registers rather than a package, and Abyss
 * extends it by its key as it extends the button.
 *
 * @packageDocumentation
 */

import { fathom } from "@stealthscale/example-theme-fathom";
import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { COLORS } from "#colors.ts";
import { extension as badge } from "#recipes/badge.ts";
import { extension as button } from "#recipes/button.ts";

/**
 * Draws Fathom in deep water, derived from it.
 */
export const abyss: Theme = defineTheme({
  colors: COLORS,
  extends: fathom,
  name: "abyss",
  recipes: { badge, button },
  shape: { corner: "0.5rem" },
});
