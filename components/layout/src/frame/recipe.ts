/**
 * States what a frame is: a box of a fixed shape that holds a picture, a video or a map, clipped
 * to its corners.
 *
 * @remarks
 *   The shapes and the corners are the theme's, so a theme that states a ratio reaches every frame
 *   through it and a component adds nothing to the vocabulary. Whatever the frame holds is drawn
 *   at the frame's own size, so a picture of any dimensions fills the shape rather than setting
 *   it, and the fit axis decides whether the picture is cropped to fill or held whole inside it.
 */

import { cornerVariants, defineRecipe, ratioVariants } from "@stealthscale/theme/authoring";

/**
 * Draws a square frame that crops what it holds until a caller says otherwise.
 */
export const recipe = defineRecipe({
  base: {
    "& > *": { blockSize: "100%", inlineSize: "100%" },
    display: "block",
    overflow: "hidden",
    position: "relative",
  },
  className: "frame",
  defaultVariants: { fit: "cover", ratio: "square" },
  jsx: [/^Frame$/u],
  variants: {
    /**
     * How far what the frame holds is thrown out of focus.
     *
     * @remarks
     *   The three blurs the theme draws, each one a layer style. A frame is the box a picture, a
     *   video or a map is drawn in, and a picture behind a caption or standing in for one that has
     *   not loaded is the case for one. They were drawn by the theme and reachable from no
     *   component until this axis named them.
     *   What is blurred is grown to cover the frame. A blur samples the pixels around each one it
     *   writes, and past the edge of a picture there are none, so the picture fades out along all
     *   four sides and the frame's own rectangle goes with it. Each step grows by rather more than
     *   its radius costs, and the frame clips what that pushes out.
     */
    blur: {
      sm: { "& > *": { layerStyle: "blur.sm", scale: "1.06" } },

      md: { "& > *": { layerStyle: "blur.md", scale: "1.09" } },

      lg: { "& > *": { layerStyle: "blur.lg", scale: "1.12" } },
    },

    fit: {
      contain: { "& > *": { objectFit: "contain" } },
      cover: { "& > *": { objectFit: "cover" } },
    },

    radius: cornerVariants(),
    ratio: ratioVariants(),
  },
});
