/**
 * Styles a stressed run's italic face, text ink and entrance motion.
 *
 * @remarks
 *   The base declares `font-style: italic` instead of relying on the browser default, so a theme
 *   whose font family has no italic face can extend the declaration. The recipe has no `palette`
 *   axis, because a text ink is not a colour of its own, and no `effect` axis, because a stressed
 *   run renders no box.
 */

import { defineRecipe, motionVariants, toneVariants } from "@stealthscale/theme/authoring";

/**
 * Sets the italic face and inherits the ink of the line.
 */
export const recipe = defineRecipe({
  base: { fontStyle: "italic" },
  className: "em",
  jsx: [/Em$/u],
  variants: {
    /**
     * Entrance animation. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["fade", "rise", "reveal"]),

    /**
     * Foreground token of the text.
     */
    tone: toneVariants(),
  },
});
