/**
 * Styles a heading's text role, text ink, text effect, entrance motion and truncation.
 *
 * @remarks
 *   Every value reads a heading or display text style, a foreground token, a text layer style or an
 *   animation style. `size` sets the prominence and `as` sets the heading level, so a screen reader
 *   reads the level from the element. The recipe has no `palette` axis, because a text ink is not a
 *   colour of its own.
 */

import {
  defineRecipe,
  motionVariants,
  textSizes,
  toneVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the `lg` heading size, the inherited ink, no effect and no motion.
 *
 * @remarks
 *   The base sets `text-wrap: balance`, so the browser breaks a wrapped heading into lines of even
 *   length, and `overflow-wrap: anywhere`, so a word wider than the container breaks instead of
 *   overflowing. `anywhere` and not `break-word`, because only `anywhere` lowers the min-content
 *   width, which a flex or grid item is sized from. The `display-quiet` and `display-loud`
 *   compounds set the display role's `sm` step at `2xl` and its `lg` step at `4xl`.
 */
export const recipe = defineRecipe({
  base: { overflowWrap: "anywhere", textWrap: "balance" },
  className: "heading",
  compoundVariants: [
    { css: { textStyle: "display.sm" }, display: true, name: "display-quiet", size: "2xl" },
    { css: { textStyle: "display.lg" }, display: true, name: "display-loud", size: "4xl" },
  ],
  defaultVariants: { size: "lg" },
  jsx: [/Heading$/u],
  variants: {
    /**
     * Sets the display text role in place of the heading role.
     *
     * @remarks
     *   `true` reads `display.md` at every size except `2xl` and `4xl`, which the compounds set.
     *   The axis is a boolean and not three more `size` values, because a variant class contains
     *   the value and not the axis, so a value named `sm` on two axes would produce one class for
     *   both.
     */
    display: { true: { textStyle: "display.md" } },

    /**
     * Text effect.
     *
     * @remarks
     *   `gradient` reads the `text.gradient` layer style. `shine` reads `text.shine` and the
     *   `shimmer` animation style, which moves the highlight.
     */
    effect: {
      gradient: { layerStyle: "text.gradient" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },

    /**
     * Entrance animation. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["fade", "rise", "reveal"]),

    /**
     * Step of the heading text role, from `xs` to `4xl`.
     */
    size: textSizes("heading"),

    /**
     * Foreground token of the text.
     */
    tone: toneVariants(),

    /**
     * Cuts the text to one line that ends in an ellipsis.
     */
    truncate: { true: truncate() },
  },
});
