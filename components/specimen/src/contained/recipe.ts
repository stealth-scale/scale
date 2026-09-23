/**
 * Styles the contained box: a layout containment boundary around a scene's example.
 *
 * @remarks
 *   `contain: layout` makes the box the containing block of a `position: fixed` descendant, so a
 *   skip link that is fixed to the window corner under keyboard focus renders at the box's corner
 *   inside the scene. The box also forms a stacking context, so the descendant's `z-index` applies
 *   inside the box.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Contains the layout of the box's descendants.
 */
export const recipe = defineRecipe({
  base: { contain: "layout", display: "block" },
  className: "contained",
  jsx: [/^Contained$/u],
});
