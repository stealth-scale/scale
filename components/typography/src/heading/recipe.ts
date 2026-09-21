/**
 * States what a heading is: a title set in a heading role, in an ink, with an effect and a motion
 * where a page wants them, cut to one line where a caller asks.
 *
 * @remarks
 *   Every value is a heading role, a foreground role, a text layer style or an animation style,
 *   so a theme moves all of them. The size axis names the heading roles and not the steps of the
 *   type scale. A heading states how loud it is. Which level it is stays with the element, where
 *   a screen reader reads it, and a caller changes the level with `as`. The shine effect carries
 *   the shimmer that moves it, because a shine that stands still is a gradient. The base balances
 *   the lines, so a heading that wraps breaks into even lines rather than leaving one word alone
 *   on the last.
 */

import {
  defineRecipe,
  motionVariants,
  textSizes,
  toneVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a heading in the large heading role until a caller says otherwise, in the ink it inherits
 * until a caller picks one, and with no effect and no motion until a caller asks for one.
 */
export const recipe = defineRecipe({
  base: { textWrap: "balance" },
  className: "heading",
  compoundVariants: [
    { css: { textStyle: "display.sm" }, display: true, name: "display-quiet", size: "2xl" },
    { css: { textStyle: "display.lg" }, display: true, name: "display-loud", size: "4xl" },
  ],
  defaultVariants: { size: "lg" },
  jsx: [/Heading$/u],
  variants: {
    /**
     * Whether the title is set in the display role rather than the heading role.
     *
     * @remarks
     *   The display role is the theme's loudest: the heading face at the top of the type scale,
     *   bold, tracked tighter and led at nothing. It is what a page opens on, and it was drawn by
     *   the theme and reachable from no component until this axis named it.
     *   The role holds three steps and the switch takes the middle one, which the two loudest
     *   sizes then move: `2xl` reads the quietest of the three and `4xl` the loudest. Every other
     *   size takes the middle step, because a display heading is a page's opening line and the
     *   three steps are how loud that line is rather than a scale to be read down.
     *   It is a switch rather than three more steps of the size axis. A class carries the value a
     *   caller picked and not the axis it was picked on, so a step named `sm` on two axes of one
     *   recipe would write one class for both.
     */
    display: { true: { textStyle: "display.md" } },

    effect: {
      gradient: { layerStyle: "text.gradient" },
      shine: { animationStyle: "shimmer", layerStyle: "text.shine" },
    },

    motion: motionVariants(["fade", "rise", "reveal"]),
    size: textSizes("heading"),
    tone: toneVariants(),
    truncate: { true: truncate() },
  },
});
