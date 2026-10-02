/**
 * Styles a ring whose range fills to the value, with the value in its middle and a label.
 *
 * @remarks
 *   The root is a grid as wide as its content, so the ring's column is as wide as the ring in any
 *   parent. The ring and the value text share one cell. The label takes the row below it or,
 *   inline, the column beside it. The size sets the `--size` and `--thickness` properties the
 *   machine's circles read: 24, 32, 40, 48 and 64px wide, and 4, 4, 4, 6 and 8px thick. From `md`
 *   up the value text takes the largest text style whose "100%" fits inside the ring. The recipe
 *   hides it at `xs` and `sm`. For a value the machine does not know, a quarter arc turns once per
 *   1.2s. Under reduced motion the ring stops and the range is a dashed line around the whole ring.
 *   Under forced colors the range strokes in `Highlight` and the track is a hairline `CanvasText`
 *   circle at the ring's outer edge.
 */

import {
  axis,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the ring offers.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Maps each size to the sizes token the ring is as wide as: 24, 32, 40, 48 and 64px.
 */
const WIDTHS: Readonly<Record<(typeof SIZES)[number], string>> = {
  lg: "12",
  md: "10",
  sm: "8",
  xl: "16",
  xs: "6",
};

/**
 * Maps each size to the gap token the ring is as thick as: 4, 4, 4, 6 and 8px.
 */
const THICKNESSES: Readonly<Record<(typeof SIZES)[number], string>> = {
  lg: "sm",
  md: "xs",
  sm: "xs",
  xl: "md",
  xs: "xs",
};

/**
 * Maps each size to the value text's styles. `xs` and `sm` hide it. From `md` up it takes the
 * largest text style whose "100%" fits inside the hole: 32, 36 and 48px.
 */
const FIGURES: Readonly<Record<(typeof SIZES)[number], SystemStyleObject>> = {
  lg: { textStyle: "label.xs" },
  md: { textStyle: "2xs" },
  sm: { display: "none" },
  xl: { textStyle: "label.md" },
  xs: { display: "none" },
};

/**
 * Styles the track under forced colors as a hairline `CanvasText` circle at the ring's outer edge.
 *
 * @remarks
 *   The range is a thick `Highlight` arc, so the two differ in weight whatever the system colors
 *   are. The track's own `--thickness` sets both its stroke and its radius. Chromium's `Highlight`
 *   is translucent, so a track as thick as the arc would show through it.
 */
const FORCED = { "--thickness": "{borderWidths.hairline}", stroke: "CanvasText" };

/**
 * Strokes the track in each look: the palette's muted role, or the muted ground. Each look states
 * the forced track, because a look applies over the base.
 */
const TRACKS = {
  outline: { _highContrast: FORCED, stroke: "bg.muted" },
  subtle: { _highContrast: FORCED, stroke: "colorPalette.muted" },
};

/**
 * Lists the looks in the order of the shared set of looks, loudest first.
 */
const LOOKS = axis(["subtle", "outline"], (look) => TRACKS[look]);

/**
 * Defines the progress circle recipe, which defaults to the outline look at the middle size in the
 * primary palette, with round ends.
 */
export const recipe = defineSlotRecipe({
  base: {
    circle: {
      _highContrast: { forcedColorAdjust: "none" },
      "&[data-state=indeterminate]": { animationStyle: "spin" },
      display: "block",
      gridArea: "ring",
    },
    label: { color: "fg", gridArea: "label", textStyle: "label.sm" },
    range: {
      _highContrast: { stroke: "Highlight" },
      _motionReduce: { transitionDuration: "0s" },
      "&[data-state=indeterminate]": {
        _motionReduce: { strokeDasharray: "var(--thickness) calc(var(--thickness) * 2)" },
        strokeDasharray: "calc(var(--circumference) / 4) var(--circumference)",
      },
      stroke: "colorPalette.solid",
      transitionDuration: "move",
      transitionProperty: "stroke-dashoffset",
      transitionTimingFunction: "move",
    },
    root: {
      alignItems: "center",
      columnGap: dense("{spacing.gap.sm}"),
      display: "inline-grid",
      inlineSize: "fit",
      rowGap: dense("{spacing.gap.xs}"),
    },
    track: { stroke: "bg.muted" },
    valueText: {
      alignSelf: "center",
      color: "fg",
      fontVariantNumeric: "tabular-nums",
      fontWeight: "medium",
      gridArea: "ring",
      justifySelf: "center",
      whiteSpace: "nowrap",
    },
  },
  className: "progress-circle",
  defaultVariants: {
    layout: "stacked",
    palette: "primary",
    shape: "full",
    size: "md",
    variant: "outline",
  },
  jsx: [/^ProgressCircle\.\w+$/u],
  slots: ["root", "label", "circle", "track", "range", "valueText"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Where the label goes: under the ring, or beside it.
     */
    layout: {
      inline: {
        root: { gridTemplateAreas: '"ring label"', justifyItems: "start" },
      },
      stacked: {
        root: { gridTemplateAreas: '"ring" "label"', justifyItems: "center" },
      },
    },
    palette: onSlot("root", paletteVariants()),

    /**
     * The ends of the range.
     */
    shape: onSlot("range", {
      full: { strokeLinecap: "round" },
      square: { strokeLinecap: "butt" },
    }),

    /**
     * The ring's width and thickness, and the value text's style.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({
          "--size": dense(`{sizes.${WIDTHS[size]}}`),
          "--thickness": dense(`{spacing.gap.${THICKNESSES[size]}}`),
        }),
        SIZES,
      ),
      valueText: sizeVariants((size) => FIGURES[size], SIZES),
    }),

    /**
     * Strokes the track in the palette's muted role, or in the muted ground.
     */
    variant: onSlot("track", LOOKS()),
  },
});
