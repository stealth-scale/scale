/**
 * Styles a frame: a box of a theme aspect ratio and corner radius that clips a picture, a video or
 * a map to its shape.
 *
 * @remarks
 *   Every value reads a ratio token, a radius token or a blur layer style. The frame sizes its
 *   child to 100% in both directions, so the ratio sets the shape and `fit` sets whether the child
 *   is cropped or letterboxed. The recipe has no `palette` axis, because the child fills the frame.
 *   It has no `effect` axis, because `blur` is the frame's effect and a glow in the palette's solid
 *   has no relation to the picture.
 */

import { cornerVariants, defineRecipe, ratioVariants } from "@stealthscale/theme/authoring";

/**
 * Defaults to a square frame that crops its child.
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
     * Blurs the child with one of the theme's `blur.*` layer styles.
     *
     * @remarks
     *   A blur fades a picture towards transparency within its radius of each edge. The steps scale
     *   the child by 1.06, 1.09 and 1.12, so the faded edge falls outside the frame, which clips
     *   it.
     */
    blur: {
      sm: { "& > *": { layerStyle: "blur.sm", scale: "1.06" } },

      md: { "& > *": { layerStyle: "blur.md", scale: "1.09" } },

      lg: { "& > *": { layerStyle: "blur.lg", scale: "1.12" } },
    },

    /**
     * Object fit of the child. `cover` crops it to the shape and `contain` shows all of it.
     */
    fit: {
      contain: { "& > *": { objectFit: "contain" } },
      cover: { "& > *": { objectFit: "cover" } },
    },

    /**
     * Corner radius token.
     */
    radius: cornerVariants(),

    /**
     * Aspect ratio token.
     */
    ratio: ratioVariants(),
  },
});
