/**
 * Styles an image cropper: a picture in a viewport, the selection over the part it keeps with the
 * rest dimmed, the handles that resize the selection, and the thirds shown while it moves.
 *
 * @remarks
 *   The picture sets the viewport's shape: the image spans the viewport's width at its own ratio,
 *   because the machine writes `object-fit: fill` on it and measures the image's box for the crop
 *   it exports. The selection's box is the crop. Its line is a `bg.panel` hairline border and a
 *   `border.emphasized` inset hairline, so one of them contrasts with any photograph in either
 *   mode. The line's middle is the selection's padding edge, where the machine centres every
 *   handle. A spread shadow in `bg.backdrop` dims the viewport outside the crop. The focus ring is
 *   one color, so a `bg.panel` spread fills the gap under it and the ring contrasts with that band
 *   over any photograph. Forced colors drop shadows and paint the border in `CanvasText`, and the
 *   handles' dots keep a transparent hairline border for the same reason. A handle is a 24px
 *   target, and its visible dot is a pseudo-element inside it. The viewport and the selection take
 *   the `drag` cursor, because a press on either moves the crop or pans the picture, and the
 *   selection takes `dragging` while it moves.
 */

import { cornerVariants, defineSlotRecipe, onSlot } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "image-cropper";

/**
 * Paints the inner hairline of the selection's line.
 */
const LINE = "inset 0 0 0 {borderWidths.hairline} {colors.border.emphasized}";

/**
 * Fills the gap between the selection and its focus ring with `bg.panel`, so the ring contrasts
 * with that band over any photograph.
 */
const BAND = "0 0 0 {spacing.ring} {colors.bg.panel}";

/**
 * Dims the viewport outside the selection.
 */
const DIM = "0 0 0 100vmax {colors.bg.backdrop}";

/**
 * Selects a handle at a corner, whose dot is one step larger than an edge's.
 */
const CORNER =
  "&:is([data-position=ne], [data-position=nw], [data-position=se], [data-position=sw])";

/**
 * Defines the image cropper recipe, with the `l2` corners on the viewport by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    grid: {
      "&:is([data-dragging], [data-panning])": { opacity: "1" },
      "&[data-axis=horizontal]": { borderBlockWidth: "hairline" },
      "&[data-axis=vertical]": { borderInlineWidth: "hairline" },
      borderColor: "bg.panel",
      borderStyle: "solid",
      borderWidth: "0",
      opacity: "0",
      transitionDuration: "moderate",
      transitionProperty: "opacity",
    },
    handle: {
      "&::after": {
        background: "bg.panel",
        borderColor: "transparent",
        borderRadius: "full",
        borderStyle: "solid",
        borderWidth: "hairline",
        boxShadow: "0 0 0 {borderWidths.hairline} {colors.border.emphasized}",
        boxSize: "2.5",
        boxSizing: "border-box",
        content: "''",
      },
      "&[data-disabled]": { display: "none" },
      alignItems: "center",
      blockSize: "6",
      [CORNER]: { "&::after": { boxSize: "3" } },
      display: "flex",
      inlineSize: "6",
      justifyContent: "center",
      touchAction: "none",
    },
    image: {
      blockSize: "auto",
      display: "block",
      inlineSize: "full",
      maxInlineSize: "none",
    },
    root: { display: "block", inlineSize: "full", position: "relative" },
    selection: {
      _focusVisible: { boxShadow: [LINE, BAND, DIM].join(", ") },
      "&:is([data-dragging], [data-panning])": { cursor: "dragging" },
      "&[data-shape=circle]": { borderRadius: "full" },
      borderColor: "bg.panel",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: [LINE, DIM].join(", "),
      boxSizing: "border-box",
      cursor: "drag",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    },
    viewport: { background: "bg.emphasized", cursor: "drag", display: "block" },
  },
  className: CLASS,
  defaultVariants: { radius: "l2" },
  jsx: [/^ImageCropper(\.\w+)?$/u],
  slots: ["root", "viewport", "image", "selection", "handle", "grid"],
  variants: {
    /**
     * Corner radius token of the viewport. The axis leaves out `full`, because a fully round
     * viewport clips the selection's corners and the handles on them.
     */
    radius: onSlot("viewport", cornerVariants(["l1", "l2", "l3"])),
  },
});
