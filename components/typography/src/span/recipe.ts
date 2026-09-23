/**
 * Styles a span's text ink, weight, truncation and entrance motion.
 *
 * @remarks
 *   The recipe has no base and no `size` axis, so a span inherits the font of its line. `Text` with
 *   `as="span"` sets the `md` body size, which resets a run inside a heading. The recipe has no
 *   `palette` axis, because a text ink is not a colour of its own, and no `effect` axis, because a
 *   span renders no box.
 */

import {
  defineRecipe,
  motionVariants,
  toneVariants,
  truncate,
  weightVariants,
} from "@stealthscale/theme/authoring";

/**
 * Leaves every axis unset, so a span inherits the ink, the weight and the size of its line.
 */
export const recipe = defineRecipe({
  className: "span",
  jsx: [/Span$/u],
  variants: {
    /**
     * Entrance animation. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["fade", "rise", "reveal"]),

    /**
     * Foreground token of the text.
     */
    tone: toneVariants(),

    /**
     * Cuts the run to one line that ends in an ellipsis.
     *
     * @remarks
     *   The value sets `display: inline-block`, because `overflow` has no effect on an inline box,
     *   and a `full` maximum width, so the box never exceeds its line.
     */
    truncate: { true: { ...truncate(), display: "inline-block", maxWidth: "full" } },

    /**
     * Font weight token.
     */
    weight: weightVariants(),
  },
});
