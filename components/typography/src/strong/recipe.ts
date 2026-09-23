/**
 * Styles a strong run's weight, text ink and entrance motion.
 *
 * @remarks
 *   The weight is an axis with no `normal` value, because a run at the weight of its line shows no
 *   importance. The recipe does not use the `bolder` keyword, because it resolves against the
 *   inherited weight and produces a different weight in each context. The recipe has no `palette`
 *   axis, because a text ink is not a colour of its own, and no `effect` axis, because a strong run
 *   renders no box.
 */

import {
  defineRecipe,
  motionVariants,
  toneVariants,
  weightVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the `semibold` weight and inherits the ink of the line.
 */
export const recipe = defineRecipe({
  className: "strong",
  defaultVariants: { weight: "semibold" },
  jsx: [/Strong$/u],
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
     * Font weight token: `medium`, `semibold` or `bold`.
     */
    weight: weightVariants(["medium", "semibold", "bold"]),
  },
});
