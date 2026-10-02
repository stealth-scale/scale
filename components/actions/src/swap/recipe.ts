/**
 * Recipe for a swap: two marks in one place, one of which shows, and the motion that replaces one
 * with the other.
 *
 * @remarks
 *   The root is an inline grid and both indicators take its one cell, so the root is as large as
 *   the larger mark whichever shows, and nothing beside it moves. An indicator with `data-hidden`
 *   keeps its room with `visibility: hidden`, which also takes it out of the accessibility tree and
 *   the tab order. The `motion` axis
 *   picks the pair of animation styles an indicator enters and leaves with, and the leaving mark
 *   and the entering mark run at once. Under reduced motion the animation styles run nothing, so
 *   the marks change at once. The recipe has no `palette` and no `size` axis: the marks take their
 *   color and their size from the control around them.
 */

import { axis, defineSlotRecipe, motion, onSlot } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe.
 */
export const CLASS = "swap";

/**
 * Lists the motions in reading order: the default first, then the others, then none.
 */
const MOTIONS = ["scale", "fade", "slide", "none"] as const;

/**
 * Maps each motion to the animation styles an indicator enters and leaves with, or to no animation.
 * The scale runs from half a mark's size, so a small icon visibly grows into place.
 */
const PAIRS = {
  fade: motion("fade.in", "fade.out"),
  none: { animation: "none" },
  scale: { ...motion("scale-fade.in", "scale-fade.out"), "--scale-distance": "0.5" },
  slide: motion("slide-up.in", "slide-up.out"),
};

/**
 * Defines the swap recipe, which scales the marks in and out by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      "&[data-hidden]": { visibility: "hidden" },
      alignItems: "center",
      display: "inline-flex",
      gridArea: "1 / 1 / 2 / 2",
      justifyContent: "center",
    },
    root: { display: "inline-grid", placeItems: "center" },
  },
  className: CLASS,
  defaultVariants: { motion: "scale" },
  jsx: [/^Swap(\.\w+)?$/u],
  slots: ["root", "indicator"],
  variants: {
    /**
     * Motion the marks replace each other with.
     */
    motion: onSlot("indicator", axis(MOTIONS, (name) => PAIRS[name])()),
  },
});
