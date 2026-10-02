/**
 * Styles a bar that fills a track to a value, which the progress recipe renders for the progress
 * bar and the meter.
 *
 * @remarks
 *   The root is a grid. The label starts the first row and the value ends it, and the track spans
 *   the row below, so a bar without words is the track alone. The `inline` layout puts the three on
 *   one row, with the track taking the room the words leave. The size is the track's thickness on
 *   the gap scale, 4, 6, 8, 12 and 16px from `xs` to `xl`, and the words keep the label style at
 *   every size. The range fills in the palette's solid. Under forced colors the range fills with
 *   `Highlight` and the track keeps a hairline `CanvasText` outline. Segments fill the track in the
 *   order they render, each in the theme's series color at its place unless it states a series
 *   color or a palette, and keep their colors under forced colors. A marker crosses the track at a
 *   value, 150% of its thickness, in the ink with a panel-colored edge.
 */

import {
  axis,
  dense,
  onSlot,
  PALETTES,
  paletteVariants,
  SERIES,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the track offers.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Custom property of a marker's place along the track, a percentage from the track's start.
 */
export const MARKER = "--progress-marker";

/**
 * Custom property of a segment's share of the track, a percentage.
 */
export const SHARE = "--progress-share";

/**
 * Attribute a segment writes the color it states to.
 */
export const TINT = "data-color";

/**
 * Width of a marker: the width of a line that indicates a state.
 */
const TICK = "{borderWidths.indicator}";

/**
 * Styles each segment in the series color at its place: the first in `series.1`, the ninth in
 * `series.1` again.
 *
 * @remarks
 *   The rules are inside `:where()`, which counts nothing towards specificity, so a stated color
 *   applies over them whatever order the rules are written in.
 */
const PLACES: Record<string, SystemStyleObject> = Object.fromEntries(
  SERIES.map((step): [string, SystemStyleObject] => [
    `&:where(:nth-of-type(${String(SERIES.length)}n + ${step}))`,
    { backgroundColor: `series.${step}` },
  ]),
);

/**
 * Styles a segment in the series color or the palette's solid it states.
 */
const STATED: Record<string, SystemStyleObject> = Object.fromEntries([
  ...SERIES.map((step): [string, SystemStyleObject] => [
    `&[${TINT}="series.${step}"]`,
    { backgroundColor: `series.${step}` },
  ]),
  ...PALETTES.map((palette): [string, SystemStyleObject] => [
    `&[${TINT}=${palette}]`,
    { backgroundColor: "colorPalette.solid", colorPalette: palette },
  ]),
]);

/**
 * Styles the track in each look: the palette's muted role, or a muted ground with an inset line.
 */
const TRACKS = {
  outline: { backgroundColor: "bg.muted", boxShadow: "inset" },
  subtle: { backgroundColor: "colorPalette.muted" },
};

/**
 * Lists the looks in the order of the shared set of looks, loudest first.
 */
const LOOKS = axis(["subtle", "outline"], (look) => TRACKS[look]);

/**
 * Styles the root, the label, the value, the track, the range, the segments and the marker of a
 * bar.
 */
export const BASE = {
  label: {
    color: "fg",
    gridColumn: "1",
    minInlineSize: "0",
    overflowX: "clip",
    overflowY: "visible",
    textOverflow: "ellipsis",
    textStyle: "label.sm",
    whiteSpace: "nowrap",
  },
  marker: {
    _highContrast: {
      backgroundColor: "CanvasText",
      boxShadow: "0 0 0 {borderWidths.hairline} Canvas",
      forcedColorAdjust: "none",
    },
    backgroundColor: "fg",
    boxShadow: "0 0 0 {borderWidths.hairline} {colors.bg.panel}",
    inlineSize: TICK,
    insetBlock: "-25%",
    insetInlineStart: `clamp(0%, calc(var(${MARKER}) - ${TICK} / 2), calc(100% - ${TICK}))`,
    pointerEvents: "none",
    position: "absolute",
  },
  range: {
    _highContrast: {
      backgroundColor: "Highlight",
      color: "HighlightText",
      forcedColorAdjust: "none",
    },
    _motionReduce: { transitionDuration: "0s" },
    backgroundColor: "colorPalette.solid",
    blockSize: "full",
    borderRadius: "inherit",
    position: "relative",
    transitionDuration: "move",
    transitionProperty: "width",
    transitionTimingFunction: "move",
  },
  root: {
    alignItems: "center",
    columnGap: dense("{spacing.gap.sm}"),
    display: "grid",
    gridAutoFlow: "dense",
    rowGap: dense("{spacing.gap.xs}"),
  },
  segment: {
    ...PLACES,
    ...STATED,
    _highContrast: { forcedColorAdjust: "none" },
    _motionReduce: { transitionDuration: "0s" },
    "&:first-of-type": { borderEndStartRadius: "inherit", borderStartStartRadius: "inherit" },
    "&:last-of-type": { borderEndEndRadius: "inherit", borderStartEndRadius: "inherit" },
    "& + &": {
      _highContrast: {
        borderInlineStartColor: "Canvas",
        borderInlineStartStyle: "solid",
        borderInlineStartWidth: "hairline",
      },
    },
    blockSize: "full",
    inlineSize: `var(${SHARE})`,
    minInlineSize: "0",
    transitionDuration: "move",
    transitionProperty: "inline-size",
    transitionTimingFunction: "move",
  },
  track: {
    _highContrast: {
      outlineColor: "CanvasText",
      outlineOffset: "calc({borderWidths.hairline} * -1)",
      outlineStyle: "solid",
      outlineWidth: "hairline",
    },
    display: "flex",
    minInlineSize: "0",
    position: "relative",
  },
  valueText: {
    color: "fg.muted",
    fontVariantNumeric: "tabular-nums",
    gridColumn: "-2 / -1",
    justifySelf: "end",
    textStyle: "label.sm",
    whiteSpace: "nowrap",
  },
};

/**
 * Offers the axes every bar takes: where the words go, the palette, the ends, the thickness and
 * the look of the track.
 */
export const VARIANTS = {
  /**
   * Where the words go: above the track, or on its row at either end.
   */
  layout: {
    inline: {
      root: { gridTemplateColumns: "auto minmax(0, 1fr) auto" },
      track: { gridColumn: "2" },
    },
    stacked: {
      root: { gridTemplateColumns: "minmax(0, 1fr) auto" },
      track: { gridColumn: "1 / -1" },
    },
  },
  palette: onSlot("root", paletteVariants()),

  /**
   * The ends of the track, which the range takes too.
   */
  shape: onSlot("track", {
    full: { borderRadius: "full" },
    rounded: { borderRadius: "l1" },
    square: { borderRadius: "none" },
  }),

  /**
   * The thickness of the track.
   */
  size: onSlot(
    "track",
    sizeVariants((size) => ({ blockSize: dense(`{spacing.gap.${size}}`) }), SIZES),
  ),

  /**
   * Fills the track with the palette's muted role, or with a muted ground and an inset line.
   */
  variant: onSlot("track", LOOKS()),
};
