/**
 * Recipe for the slider: a track a person drags one or more thumbs along to pick a value.
 *
 * @remarks
 *   Ten slots. The root is the `fieldset` that groups the thumbs, with the element's edge, margin,
 *   padding and minimum width reset, laid out as a grid: the label starts the first row, the value
 *   text ends it, and the control spans the row below. The control is inset by half a thumb at each
 *   end, so a thumb at the minimum or the maximum ends at the root's edge, and nothing has to be
 *   measured before the thumbs render. The thumb is a circle of the tag height, and the track's
 *   thickness reads the gap scale, 4, 6 and 8px from `sm` to `lg`. The track takes the progress
 *   bar's two looks, and the thumb is a panel circle with an edge in the palette's solid on the
 *   outline look, or a solid circle with a panel ring on the subtle look. An invalid slider takes
 *   the error palette, and a read-only thumb dashes its edge. A marker is a dot on the track, in
 *   the range's contrast ink under the value, with its label below the thumbs. The dragging
 *   indicator is a bubble on the `bg.inverted` fill above its thumb. Under forced colors the range
 *   fills with `Highlight`, the track keeps a hairline `CanvasText` outline, the thumb keeps its
 *   edge, and the marker dots take `HighlightText` on the range and `CanvasText` after it. A
 *   vertical slider lays the same parts out on the block axis in a column as wide as its widest
 *   part. The recipe has no `effect` axis, because an effect would compete with the thumb's focus
 *   ring.
 */

import {
  axis,
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  sizeVariants,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
const CLASS = "slider";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Maps each size to the gap token the track is as thick as: 4, 6 and 8px. The angle slider's ring
 * reads the same tokens.
 */
export const THICKNESSES: Readonly<Record<(typeof SIZES)[number], string>> = {
  lg: "md",
  md: "sm",
  sm: "xs",
};

/**
 * Custom property with half the thumb's side, the control's inset at each end, set by the size
 * axis and read by the control, the thumb and the markers.
 */
const HALF = "--slider-half";

/**
 * Custom property with the track's thickness, set by the size axis and read by the track.
 */
const THICK = "--slider-thick";

/**
 * Selects a control whose markers have labels.
 */
const LABELLED = `&:has(.${CLASS}__marker:not(:empty))`;

/**
 * Fills the subtle track with the palette's muted role and the outline track with a muted ground
 * and an inset line. The angle slider's ring takes the same looks.
 */
export const TRACKS = {
  outline: { backgroundColor: "bg.muted", boxShadow: "inset" },
  subtle: { backgroundColor: "colorPalette.muted" },
};

/**
 * Makes the outline thumb a panel circle edged in the palette's solid and the subtle thumb a solid
 * circle with a panel ring. The angle slider's thumb takes the same looks.
 */
export const THUMBS = {
  outline: { background: "bg.panel", borderColor: "colorPalette.solid" },
  subtle: { background: "colorPalette.solid", borderColor: "bg.panel" },
};

/**
 * Lists the looks in the order of the shared set of looks.
 */
export const LOOKS = ["subtle", "outline"] as const;

/**
 * Defines the slider recipe, which defaults to the outline look at size `md` in the primary
 * palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      _horizontal: {
        [LABELLED]: { marginBlockEnd: "calc(1lh + {spacing.gap.sm})" },
        marginInline: `var(${HALF})`,
        minBlockSize: `calc(var(${HALF}) * 2)`,
      },
      _vertical: {
        blockSize: "48",
        flexDirection: "column",
        marginBlock: `var(${HALF})`,
        minInlineSize: `calc(var(${HALF}) * 2)`,
      },
      alignItems: "center",
      display: "flex",
      gridColumn: "1 / -1",
      justifyContent: "center",
    },
    draggingIndicator: {
      background: "bg.inverted",
      borderRadius: "l1",
      color: "fg.inverted",
      fontVariantNumeric: "tabular-nums",
      insetBlockEnd: "calc(100% + {spacing.gap.sm})",
      left: "50%",
      paddingInline: "gap.sm",
      pointerEvents: "none",
      position: "absolute",
      textStyle: "label.sm",
      translate: "-50% 0",
      whiteSpace: "nowrap",
    },
    label: { color: "fg", fontWeight: "medium", gridColumn: "1" },
    marker: {
      _before: {
        _highContrast: { forcedColorAdjust: "none" },
        borderRadius: "full",
        boxSize: "1",
        content: '""',
        flexShrink: "0",
      },
      _horizontal: {
        flexDirection: "column",
        gap: `calc(var(${HALF}) - {sizes.1} / 2 + {spacing.gap.xs})`,
        marginBlockStart: "calc({sizes.1} / -2)",
      },
      _vertical: {
        gap: `calc(var(${HALF}) - {sizes.1} / 2 + {spacing.gap.xs})`,
        marginInlineStart: "calc({sizes.1} / -2)",
      },
      "&:not([data-state=under-value])": {
        _before: { _highContrast: { background: "CanvasText" }, background: "fg.muted" },
      },
      "&[data-state=under-value]": {
        _before: {
          _highContrast: { background: "HighlightText" },
          background: "colorPalette.contrast",
        },
      },
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      textStyle: "label.sm",
      whiteSpace: "nowrap",
    },
    markerGroup: {
      _horizontal: { insetBlockStart: "50%", insetInline: "0" },
      _vertical: { insetBlock: "0", insetInlineStart: "50%" },
      pointerEvents: "none",
      position: "absolute",
      userSelect: "none",
    },
    range: {
      _highContrast: { background: "Highlight", forcedColorAdjust: "none" },
      _horizontal: { blockSize: "full" },
      _vertical: { inlineSize: "full" },
      background: "colorPalette.solid",
      borderRadius: "inherit",
    },
    root: {
      _disabled: { layerStyle: "disabled" },
      _vertical: { gridTemplateColumns: "auto", inlineSize: "fit", justifyItems: "center" },
      alignItems: "baseline",
      borderStyle: "none",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    thumb: {
      ...touchTarget(),
      _disabled: { cursor: "disabled" },
      _horizontal: { insetBlockStart: "50%", translate: "0 -50%" },
      _vertical: { left: "50%", translate: "-50% 0" },
      "&[data-readonly]": { borderStyle: "dashed" },
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "indicator",
      boxSize: `calc(var(${HALF}) * 2)`,
      cursor: "slider",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      outline: "none",
    },
    track: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      _horizontal: { blockSize: `var(${THICK})` },
      _vertical: { inlineSize: `var(${THICK})` },
      borderRadius: "full",
      flex: "1",
      overflow: "hidden",
    },
    valueText: {
      _vertical: { gridColumn: "1", justifySelf: "center" },
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      gridColumn: "2",
      justifySelf: "end",
    },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md", variant: "outline" },
  jsx: [/^Slider(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "valueText",
    "control",
    "track",
    "range",
    "thumb",
    "markerGroup",
    "marker",
    "draggingIndicator",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The palette the range, the thumb's edge and the focus ring read. An invalid slider reads the
     * error palette instead.
     */
    palette: onSlot(
      "root",
      axis(PALETTES, (palette) => ({
        _invalid: { colorPalette: "error" },
        colorPalette: palette,
      }))(),
    ),

    /**
     * The thumb's side on the tag scale, the track's thickness on the gap scale, and the text on
     * the label role, at each size. The rows sit one gap size smaller apart.
     */
    size: onSlot(
      "root",
      sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${below(size)}}`),
          [HALF]: `calc(${dense(`{sizes.tag.${size}}`)} / 2)`,
          rowGap: dense(`{spacing.gap.${below(size)}}`),
          textStyle: `label.${size}`,
          [THICK]: dense(`{spacing.gap.${THICKNESSES[size]}}`),
        }),
        SIZES,
      ),
    ),

    /**
     * The track and the thumb in each look.
     */
    variant: onSlots({
      thumb: axis(LOOKS, (look) => THUMBS[look])(),
      track: axis(LOOKS, (look) => TRACKS[look])(),
    }),
  },
});
