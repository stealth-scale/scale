/**
 * Styles a video: a block of a theme aspect ratio that keeps its shape before the clip's metadata
 * loads.
 *
 * @remarks
 *   A `video` reports its size only once its metadata loads, so without a ratio it is 0 pixels tall
 *   and grows mid-load, which moves everything below it. The ratio defaults to `video`, 16:9. The
 *   background is `bg.emphasized`, which shows while the poster loads and fills the bars of the
 *   `contain` fit. A hairline edge bounds pale footage on a light page. The recipe has no `palette`
 *   axis, because the clip fills the element, and no `effect` axis, because a glow in a palette has
 *   no relation to the clip.
 */

import { cornerVariants, defineRecipe, ratioVariants } from "@stealthscale/theme/authoring";

/**
 * Defines the video recipe, which defaults to a 16:9 clip that fills its shape inside `l3` corners.
 */
export const recipe = defineRecipe({
  base: {
    background: "bg.emphasized",
    blockSize: "auto",
    borderColor: "border",
    borderStyle: "solid",
    borderWidth: "hairline",
    display: "block",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    inlineSize: "full",
    maxInlineSize: "full",
  },
  className: "video",
  defaultVariants: { fit: "cover", radius: "l3", ratio: "video" },
  jsx: [/^Video$/u],
  variants: {
    /**
     * Object fit of the clip. `cover` crops it to the shape and `contain` shows the whole clip
     * between bars.
     */
    fit: {
      contain: { objectFit: "contain" },
      cover: { objectFit: "cover" },
    },

    /**
     * Corner radius token.
     */
    radius: cornerVariants(),

    /**
     * Aspect ratio token the element keeps before and after the metadata loads.
     */
    ratio: ratioVariants(),
  },
});
