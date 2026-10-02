/**
 * Styles an `iframe` as a box of one of the theme's ratios, as wide as its container.
 *
 * @remarks
 *   The ratio holds the box's shape before the framed document loads, so nothing below it moves
 *   when it does. The box is `bg.panel` with a hairline edge, which bounds a framed page with a
 *   white ground on a white page. The recipe sets no focus ring. Firefox and Chromium match no
 *   focus pseudo-class on an `iframe` while its document has focus, as the HTML Standard asks for a
 *   navigable container.
 */

import { cornerVariants, defineRecipe, ratioVariants } from "@stealthscale/theme/authoring";

/**
 * Styles a 16:9 frame with the `l3` corners.
 */
export const recipe = defineRecipe({
  base: {
    background: "bg.panel",
    blockSize: "auto",
    borderColor: "border",
    borderStyle: "solid",
    borderWidth: "hairline",
    display: "block",
    inlineSize: "full",
    maxInlineSize: "full",
  },
  className: "iframe",
  defaultVariants: { radius: "l3", ratio: "video" },
  jsx: [/^Iframe$/u],
  variants: {
    /**
     * Corner radius token. The axis leaves out `full`, because a framed document's content reaches
     * the frame's corners and a fully round corner clips it.
     */
    radius: cornerVariants(["l1", "l2", "l3"]),

    /**
     * Aspect ratio token the frame keeps before and after its document loads.
     */
    ratio: ratioVariants(),
  },
});
