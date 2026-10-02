/**
 * Styles a paragraph's body size, text ink, weight, alignment, truncation, entrance motion and fade
 * mask.
 *
 * @remarks
 *   Every value reads a body text style, a foreground token, a font weight token, an animation
 *   style or a layer style. The recipe has no `palette` axis, because a text ink is not a colour of
 *   its own, and no `effect` axis, because a paragraph renders no box.
 */

import {
  defineRecipe,
  motionVariants,
  textSizes,
  toneVariants,
  truncate,
  weightVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the `md` body size and inherits the ink, the weight and the alignment.
 *
 * @remarks
 *   The base sets `text-wrap: pretty`, so the browser avoids a single word on the last line, and
 *   `overflow-wrap: anywhere`, so a word wider than the container breaks instead of overflowing.
 *   `anywhere` and not `break-word`, because only `anywhere` lowers the min-content width, which a
 *   flex or grid item is sized from.
 */
export const recipe = defineRecipe({
  base: { overflowWrap: "anywhere", textWrap: "pretty" },
  className: "text",
  defaultVariants: { size: "md" },
  jsx: [/Text$/u],
  variants: {
    /**
     * Inline alignment of the lines. `start` and `end` follow the writing direction.
     */
    align: {
      start: { textAlign: "start" },

      center: { textAlign: "center" },

      end: { textAlign: "end" },

      justify: { textAlign: "justify" },
    },

    /**
     * Fade mask, read from the theme's `mask.*` layer styles.
     *
     * @remarks
     *   `bottom` fades the last lines of a passage that overflows its box. `edges` fades both
     *   inline ends of a line that scrolls. `radial` fades out from the centre.
     */
    mask: {
      bottom: { layerStyle: "mask.bottom" },

      edges: { layerStyle: "mask.edges" },

      radial: { layerStyle: "mask.radial" },
    },

    /**
     * Entrance animation. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["fade", "rise", "reveal"]),

    /**
     * Step of the body text role, from `xs` to `xl`.
     */
    size: textSizes("body"),

    /**
     * Foreground token of the text.
     */
    tone: toneVariants(),

    /**
     * Cuts the text to one line that ends in an ellipsis.
     */
    truncate: { true: truncate() },

    /**
     * Font weight token.
     */
    weight: weightVariants(),
  },
});
