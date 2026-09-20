/**
 * States what a pane is: the box a framed scene is drawn in, which meets the window's edges the
 * way the scene meets its card on the page.
 *
 * @remarks
 *   On the page an inset scene sits in the card's own room and a bled or bared one reaches the
 *   card's edges. In a device the window stands in for the card, so an inset scene keeps the same
 *   room from the window's edges, the way a page on a phone keeps its gutters, and a bled or bared
 *   scene fills the window, the way a shell fills a screen. The room is the card's medium inset,
 *   so a theme that moves the card's room moves the pane's.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Draws an inset pane until a caller says how the scene meets the window.
 */
export const recipe = defineRecipe({
  base: { inlineSize: "full" },
  className: "pane",
  defaultVariants: { frame: "inset" },
  jsx: [/^Pane$/u],
  variants: {
    /**
     * How the scene meets the window: in the card's room, or at its edges.
     */
    frame: {
      bare: { padding: "0" },
      bleed: { padding: "0" },
      inset: { padding: dense("{spacing.inset.md}") },
    },
  },
});
