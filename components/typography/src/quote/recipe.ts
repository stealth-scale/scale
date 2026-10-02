/**
 * Styles an inline quotation's marks, text ink and entrance motion.
 *
 * @remarks
 *   The recipe has no base, so a quotation inherits the font of its line. The browser adds the
 *   quotation marks from the `quotes` property, which resolves against the element's `lang`, so a
 *   German page gets German marks. The recipe has no `palette` axis, because a text ink is not a
 *   colour of its own, and no `effect` axis, because a quotation renders no box.
 */

import { defineRecipe, motionVariants, toneVariants } from "@stealthscale/theme/authoring";

/**
 * Defaults to the browser's quotation marks and inherits the ink of the line.
 */
export const recipe = defineRecipe({
  className: "quote",
  defaultVariants: { marks: "auto" },
  jsx: [/Quote$/u],
  variants: {
    /**
     * Quotation marks.
     *
     * @remarks
     *   `auto` sets `quotes: auto`, so a theme can extend the class with other marks. `none`
     *   removes the marks, for text that contains its own punctuation, such as a quotation inside
     *   another.
     */
    marks: {
      auto: { quotes: "auto" },
      none: { quotes: "none" },
    },

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
