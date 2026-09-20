/**
 * States what a container is: the measure a page is read at, centred in whatever holds it, with a
 * gutter down each side.
 *
 * @remarks
 *   Every value is a named measure or a semantic inset, so a theme moves the measure of every page
 *   by restating one scale. The gutter is in the base rather than on an axis, because a page sets
 *   it once and a caller who wants none says so. `prose` is the measure running text is read at,
 *   which is counted in characters and so follows the face a theme sets rather than a width in
 *   rem.
 */

import { defineRecipe, dense, widthSizes } from "@stealthscale/theme/authoring";

/**
 * Draws a page at the wide measure with the large gutter until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: { inlineSize: "full", marginInline: "auto", paddingInline: dense("{spacing.inset.lg}") },
  className: "container",
  defaultVariants: { size: "3xl" },
  jsx: [/^Container$/u],
  variants: {
    flush: { true: { paddingInline: "0" } },
    size: { ...widthSizes(), full: { maxInlineSize: "full" }, prose: { maxInlineSize: "prose" } },
  },
});
