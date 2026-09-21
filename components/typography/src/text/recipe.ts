/**
 * States what a paragraph is: running text in a size, an ink, a weight and an alignment, cut to
 * one line where a caller asks, and moved or masked where a page wants it.
 *
 * @remarks
 *   Every value is a body role, a foreground role, a font weight token, an animation style or a
 *   layer style, so a theme moves all of them. A paragraph reads as the page reads until a caller
 *   picks a value, and the recipe is the key a theme extends every paragraph by. The base wraps
 *   the lines prettily, which keeps one word off the last line of a paragraph.
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
 * Draws a paragraph in the middle body size until a caller says otherwise, and in the ink, the
 * weight and the alignment it inherits until a caller picks one. A motion enters it, and a mask
 * fades its bottom edge out, where a caller asks.
 */
export const recipe = defineRecipe({
  base: { textWrap: "pretty" },
  className: "text",
  defaultVariants: { size: "md" },
  jsx: [/Text$/u],
  variants: {
    align: {
      start: { textAlign: "start" },

      center: { textAlign: "center" },

      end: { textAlign: "end" },

      justify: { textAlign: "justify" },
    },

    /**
     * Which edges the words fade out at, for a passage cut short by the room it is given.
     *
     * @remarks
     *   All three fades the theme draws. `bottom` fades the last lines of a passage that runs past
     *   its box, `edges` fades both inline ends of a line that scrolls, and `radial` fades a block
     *   away from its middle. Only the first was offered, so the other two were drawn by the theme
     *   and reachable from nothing.
     */
    mask: {
      bottom: { layerStyle: "mask.bottom" },

      edges: { layerStyle: "mask.edges" },

      radial: { layerStyle: "mask.radial" },
    },
    motion: motionVariants(["fade", "rise", "reveal"]),
    size: textSizes("body"),
    tone: toneVariants(),
    truncate: { true: truncate() },
    weight: weightVariants(),
  },
});
