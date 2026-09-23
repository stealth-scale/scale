/**
 * Declares the tag slot recipe for a short label with an optional mark at either end and a button
 * that removes it.
 *
 * @remarks
 *   The looks are the flat layer styles, so a tag does not repaint on hover. The close trigger is
 *   the one control, with the focus ring from `interactive()` and a touch target from
 *   `touchTarget()`, because the tag is under the 24px WCAG 2.5.8 target at the smaller sizes. The
 *   root does not shrink in a flex row, so a row of tags wraps and no label is truncated. The
 *   root is capped at its container's width, and the label truncates with an ellipsis at that cap.
 *   Marks and the close glyph are sized in `em`, so they follow the label.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  flatVariants,
  interactive,
  onSlot,
  PALETTES,
  paletteVariants,
  sizeVariants,
  touchTarget,
} from "@stealthscale/theme/authoring";

import { CHIP_SIZES, chipSize } from "#chip.ts";

/**
 * Styles the element at either end of the tag, which contains a mark.
 *
 * @remarks
 *   The element is pulled `0.125em` towards the tag's edge, because a glyph has space inside its
 *   box, so the glyph's ink is as far from the edge as the label is.
 */
const ELEMENT = {
  "& > svg": { blockSize: "1em", inlineSize: "1em" },
  alignItems: "center",
  display: "inline-flex",
  flexShrink: "0",
};

/**
 * Tag slot recipe, the surface look at the md size in the neutral palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    /**
     * The close trigger draws its focus ring inside its box, because a ring outside it falls on
     * the tag's fill.
     */
    closeTrigger: {
      ...interactive(),
      ...touchTarget(),
      _hover: { background: "colorPalette.emphasized" },
      "& > svg": { blockSize: "0.875em", inlineSize: "0.875em" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      blockSize: "1.25em",
      borderRadius: "l1",
      borderStyle: "none",
      color: "currentcolor",
      display: "inline-flex",
      flexShrink: "0",
      focusVisibleRing: "inside",
      inlineSize: "1.25em",
      justifyContent: "center",
      marginInlineEnd: "-0.25em",
      padding: "0",
    },
    endElement: { ...ELEMENT, marginInlineEnd: "-0.125em" },

    /**
     * The label is raised `0.1em` and clipped on the inline axis only.
     *
     * @remarks
     *   The raise puts the lowercase x-height's centre within 0.7px of the tag's centre at every
     *   size. The block axis is not clipped, because the descenders extend to the label box's edge.
     */
    label: {
      minInlineSize: "0",
      overflowX: "clip",
      overflowY: "visible",
      textOverflow: "ellipsis",
      translate: "0 -0.1em",
      whiteSpace: "nowrap",
    },
    /**
     * The root draws a hairline outline in forced colors, where the browser replaces the fill and
     * the solid, subtle and plain looks have no border to mark the box.
     */
    root: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      alignItems: "center",
      colorPalette: "neutral",
      display: "inline-flex",
      flexShrink: "0",
      maxInlineSize: "full",
      userSelect: "none",
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    },
    startElement: { ...ELEMENT, marginInlineStart: "-0.125em" },
  },
  className: "tag",
  compoundVariants: [
    /**
     * The close trigger on a solid tag hovers to a tint of the contrast ink and draws its focus
     * ring in the contrast ink, because the `emphasized` role is lighter than the solid fill and
     * the `focusRing` role is as dark as it.
     */
    {
      css: {
        closeTrigger: {
          _hover: { background: "colorPalette.contrast/20" },
          focusRingColor: "colorPalette.contrast",
        },
      },
      name: "contrasted",
      variant: "solid",
    },
  ],
  defaultVariants: { radius: "l2", size: "md", variant: "surface" },
  jsx: [/^Tag\.\w+$/u],
  slots: ["root", "label", "startElement", "endElement", "closeTrigger"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the tag, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` animates the halo and stops under reduced motion.
     */
    effect: onSlot("root", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),
    palette: onSlot("root", paletteVariants()),
    radius: onSlot("root", cornerVariants()),

    /**
     * The height, padding, gap and label text style from `chipSize`, shared with the badge.
     */
    size: onSlot("root", sizeVariants(chipSize, CHIP_SIZES)),
    variant: onSlot("root", flatVariants()),
  },
});
