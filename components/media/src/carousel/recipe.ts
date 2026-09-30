/**
 * Styles a carousel: the slides in a scroller that snaps a page at a time, the triggers that move a
 * page, the dots that pick one, the rotation control and the progress text.
 *
 * @remarks
 *   The machine writes the scroller's layout inline, a grid of slides a page wide with scroll
 *   snapping, and spaces the slides by its `spacing` option. The root passes that option a custom
 *   property the recipe sets to the theme's `gap.md`. A dot is a 24px target around an 8px mark in
 *   the palette's `border` role, which measures 3:1 against every surface. The current dot is a
 *   20px pill in the palette's solid, so the page it marks differs in shape as well as in color.
 *   With `controls` set to `overlay`, the controls share the slides' grid cell. The triggers are at
 *   the sides, the dots on a `bg.panel` pill at the bottom, padded by a dot's 2px focus ring, and
 *   the rotation control and the progress text at the top. In a vertical carousel the machine sizes
 *   a slide to a share of the scroller's height, so the scroller takes the `landscape` ratio unless
 *   `ratio` sets another. A picture that is a slide's child covers the slide: it keeps its own
 *   aspect ratio where the slide is as tall as its content, and the slide crops it where the
 *   scroller's ratio sets the height.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  paletteVariants,
  ratioVariants,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the root passes to the machine as the gap between slides.
 */
export const GAP = "--carousel-gap";

/**
 * Selects a part of a carousel that runs top to bottom.
 */
const VERTICAL = "&[data-orientation=vertical]";

/**
 * Corners the slides offer. A fully round slide would clip its picture to an ellipse.
 */
const CORNERS = cornerVariants(["l1", "l2", "l3"]);

/**
 * Distance of an overlaid control from the slides' edge.
 */
const EDGE = dense("{spacing.gap.sm}");

/**
 * Sets a `bg.panel` pill behind an overlaid control, so it reads over any photograph.
 */
const PILL = {
  background: "bg.panel",
  borderRadius: "full",
  boxShadow: "sm",
  position: "absolute",
};

/**
 * Defines the carousel recipe, with the controls under the slides, neutral dots and `l3` slides by
 * default.
 */
export const recipe = defineSlotRecipe({
  base: {
    autoplayTrigger: { flexShrink: "0" },
    control: {
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      justifyContent: "space-between",
      [VERTICAL]: { flexDirection: "column" },
    },
    indicator: {
      _current: {
        _hover: { "&::after": { background: "colorPalette.solid.hover" } },
        "&::after": { background: "colorPalette.solid", inlineSize: "5" },
      },
      _highContrast: {
        _current: { "&::after": { background: "Highlight" } },
        "&::after": { background: "CanvasText", forcedColorAdjust: "none" },
      },
      _hover: { "&::after": { background: "colorPalette.border.hover" } },
      "&::after": {
        background: "colorPalette.border",
        blockSize: "2",
        borderRadius: "full",
        content: "''",
        inlineSize: "2",
        transitionDuration: "moderate",
        transitionProperty: "inline-size, background-color",
      },
      alignItems: "center",
      background: "transparent",
      borderRadius: "full",
      borderWidth: "0",
      boxSize: "6",
      cursor: "button",
      display: "inline-flex",
      flexShrink: "0",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "inside",
      justifyContent: "center",
      padding: "0",
    },
    indicatorGroup: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      [VERTICAL]: { flexDirection: "column" },
    },
    item: {
      "& > img": { blockSize: "full", display: "block", inlineSize: "full", objectFit: "cover" },
      overflow: "hidden",
      position: "relative",
    },
    itemGroup: {
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      [VERTICAL]: { aspectRatio: "landscape", flex: "1", minInlineSize: "0" },
    },
    nextTrigger: { flexShrink: "0" },
    prevTrigger: { flexShrink: "0" },
    progressText: {
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      textStyle: "label.sm",
      whiteSpace: "nowrap",
    },
    root: {
      [GAP]: dense("{spacing.gap.md}"),
      gap: dense("{spacing.gap.sm}"),
      minInlineSize: "0",
      position: "relative",
    },
  },
  className: "carousel",
  defaultVariants: { controls: "outside", palette: "neutral", radius: "l3" },
  jsx: [/^Carousel(\.\w+)?$/u],
  slots: [
    "root",
    "itemGroup",
    "item",
    "control",
    "nextTrigger",
    "prevTrigger",
    "indicatorGroup",
    "indicator",
    "autoplayTrigger",
    "progressText",
  ],
  variants: {
    /**
     * Where the controls go: beside the slides in the root's flow, or over the slides.
     *
     * @remarks
     *   Beside the slides, the root is a flex column, a row in a vertical carousel. Over the
     *   slides, the root is a grid whose first cell contains both the scroller and the control, so
     *   the control covers the slides exactly and any other child takes the next row. The control
     *   passes presses through, and each control in it takes them.
     */
    controls: {
      outside: {
        root: { display: "flex", flexDirection: "column", [VERTICAL]: { flexDirection: "row" } },
      },
      overlay: {
        autoplayTrigger: { insetBlockStart: EDGE, insetInlineStart: EDGE, position: "absolute" },
        control: {
          "& > *": { pointerEvents: "auto" },
          gridArea: "1 / 1 / 2 / 2",
          padding: EDGE,
          pointerEvents: "none",
          position: "relative",
        },
        indicatorGroup: {
          ...PILL,
          insetBlockEnd: EDGE,
          left: "50%",
          padding: "0.5",
          translate: "-50% 0",
          [VERTICAL]: {
            insetBlockEnd: "auto",
            insetInlineEnd: EDGE,
            left: "auto",
            top: "50%",
            translate: "0 -50%",
          },
        },
        itemGroup: { gridArea: "1 / 1 / 2 / 2" },
        progressText: {
          ...PILL,
          color: "fg",
          insetBlockStart: EDGE,
          insetInlineEnd: EDGE,
          paddingBlock: "1",
          paddingInline: dense("{spacing.gap.sm}"),
        },
        root: { display: "grid" },
      },
    },

    /**
     * Palette of the dots.
     */
    palette: onSlot("indicator", paletteVariants()),

    /**
     * Corner radius token of the slides and of the scroller's focus ring.
     */
    radius: onSlots({ item: CORNERS, itemGroup: CORNERS }),

    /**
     * Aspect ratio token of the scroller, whose height a vertical carousel needs. A horizontal
     * carousel without it is as tall as its slides.
     */
    ratio: onSlot("itemGroup", ratioVariants()),
  },
});
