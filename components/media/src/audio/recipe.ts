/**
 * Styles an `audio` element as a block as wide as its container.
 *
 * @remarks
 *   The browser draws the controls, so the recipe sets the box and the focus ring alone and offers
 *   no axis. A radius on the element clips Chromium's control panel, and the panel's colours follow
 *   the page's `color-scheme`.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Styles an audio element that fills the inline size of its container.
 */
export const recipe = defineRecipe({
  base: {
    display: "block",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    inlineSize: "full",
    maxInlineSize: "full",
  },
  className: "audio",
  jsx: [/^Audio$/u],
});
