/**
 * Recipe for the date picker: a label, an input with a clear trigger and a trigger at its end, and
 * a panel of views that opens under it, each a header and a table of days, months or years.
 *
 * @remarks
 *   The input and its triggers match a combobox of the same size. The panel takes the select's
 *   surface, and its views scroll in the primitives package's scroll area inside it, only past the
 *   room the positioner reports. An inline panel has no cap. A day's cell is at least 24px square,
 *   a month's or a year's 1.75 days wide. A selected cell fills with the palette's solid, or
 *   `Highlight` under forced colors, and a range's middle with the palette's subtle fill. The
 *   palette axis offers the four hues that are not statuses and precedes the status axis.
 */

import {
  below,
  controlSizes,
  defineSlotRecipe,
  dense,
  field,
  FIELD_EDGE,
  fieldStatusVariants,
  fieldVariants,
  interactive,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
  statusEmitted,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import { cleared, clearEnd, indicated, triggerEnd } from "#combobox/metrics.ts";
import { cellSide, cellStates, CLASS, CLEARED, LAST, wideCell } from "#date-picker/metrics.ts";
import {
  content,
  control,
  flushed,
  glyph,
  inset,
  label,
  labelSizes,
  root,
  rootSizes,
  rows,
  rowsSizes,
  SIZES,
  viewport,
  viewportSizes,
} from "#dropdown.ts";
import { trigger, triggerSide, triggerSizes } from "#input-group/trigger.ts";

/**
 * Palettes the palette axis offers: the ones that are not statuses.
 */
const HUES = ["primary", "secondary", "accent", "neutral"] as const;

/**
 * Returns a square button placed at the input's end, centred on the input's height.
 */
function placed(): SystemStyleObject {
  return { ...trigger(), insetBlockStart: "50%", position: "absolute", translate: "0 -50%" };
}

/**
 * Defines the date picker recipe, which defaults to an outline input at size `md` in the primary
 * palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    body: rows(),
    clearTrigger: placed(),
    content: {
      ...content(),
      "&[data-inline]": { boxShadow: "none", inlineSize: "fit", maxBlockSize: "none" },
      maxBlockSize: "var(--available-height)",
    },
    control: {
      ...control(),
      "& > svg": { color: "fg.muted", flexShrink: "0" },
      alignItems: "center",
    },
    hiddenInput: { srOnly: true },
    input: {
      ...field(),
      _open: { [FIELD_EDGE]: "{colors.fg.subtle}" },
      appearance: "none",
      borderRadius: "l2",
      inlineSize: "full",
      minInlineSize: "0",
      textAlign: "start",
    },
    label: label(),
    monthSelect: { ...field(), borderRadius: "l2", cursor: "button" },
    nextTrigger: trigger(),
    positioner: {},
    presetTrigger: {
      ...interactive(),
      _hover: { background: "bg.muted" },
      alignItems: "center",
      borderRadius: "l2",
      display: "flex",
      justifyContent: "flex-start",
      textAlign: "start",
    },
    prevTrigger: trigger(),
    rangeText: { fontWeight: "semibold" },
    root: root(),
    table: { borderCollapse: "separate", borderSpacing: "0" },
    tableBody: {},
    tableCell: {
      "&[data-type=week-number]": { color: "fg.muted", textAlign: "center" },
      padding: "0",
      textAlign: "center",
    },
    tableCellTrigger: {
      ...interactive(),
      ...cellStates(),
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      _hover: { background: "bg.muted" },
      alignItems: "center",
      borderRadius: "l2",
      cursor: "button",
      display: "inline-flex",
      focusVisibleRing: "inside",
      fontVariantNumeric: "tabular-nums",
      justifyContent: "center",
    },
    tableHead: {},
    tableHeader: { color: "fg.muted", fontWeight: "medium", textAlign: "center" },
    tableRow: {},
    trigger: { ...placed(), _invalid: { color: "fg.error" } },
    valueText: { color: "fg" },
    view: { display: "flex", flexDirection: "column" },
    viewControl: { alignItems: "center", display: "flex", justifyContent: "space-between" },
    viewport: viewport(),
    viewTrigger: {
      ...trigger(),
      _disabled: {
        _highContrast: { color: "CanvasText", forcedColorAdjust: "none" },
        pointerEvents: "none",
      },
      color: "fg",
      fontWeight: "semibold",
      inlineSize: "auto",
    },
    yearSelect: { ...field(), borderRadius: "l2", cursor: "button" },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md", variant: "outline" },
  jsx: [/^DatePicker(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "input",
    "trigger",
    "clearTrigger",
    "positioner",
    "content",
    "viewport",
    "body",
    "view",
    "viewControl",
    "viewTrigger",
    "prevTrigger",
    "nextTrigger",
    "rangeText",
    "table",
    "tableHead",
    "tableHeader",
    "tableBody",
    "tableRow",
    "tableCell",
    "tableCellTrigger",
    "monthSelect",
    "yearSelect",
    "presetTrigger",
    "valueText",
    "hiddenInput",
  ],
  staticCss: [statusEmitted(), { palette: [...HUES] }],
  variants: {
    /**
     * Palette of a selected cell and a range, one of the four hues that are not statuses.
     */
    palette: onSlot("content", paletteVariants(HUES)),

    /**
     * Height, insets and text of the input, the places of its triggers, and the panel's padding,
     * gaps, cells and text.
     */
    size: onSlots({
      body: sizeVariants(
        (size) => ({ ...rowsSizes()[size], gap: dense(`{spacing.gap.${below(size)}}`) }),
        SIZES,
      ),
      clearTrigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          "& svg": { boxSize: glyph(size) },
          insetInlineEnd: clearEnd(size),
        }),
        SIZES,
      ),
      control: sizeVariants(
        (size) => ({
          "& > svg": { boxSize: glyph(size) },
          columnGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      input: sizeVariants(
        (size) => ({
          ...controlSizes()[size],
          [CLEARED]: { paddingInlineEnd: cleared(size) },
          fontWeight: "normal",
          [LAST]: { paddingInlineEnd: indicated(size) },
          paddingInlineEnd: inset(size),
          paddingInlineStart: inset(size),
        }),
        SIZES,
      ),
      label: labelSizes(),
      monthSelect: sizeVariants((size) => controlSizes()[below(size)], SIZES),
      nextTrigger: sizeVariants(
        (size) => ({ ...triggerSizes()[size], "& svg": { boxSize: glyph(size) } }),
        SIZES,
      ),
      presetTrigger: sizeVariants(
        (size) => ({
          minBlockSize: cellSide(size),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `body.${below(size)}`,
        }),
        SIZES,
      ),
      prevTrigger: sizeVariants(
        (size) => ({ ...triggerSizes()[size], "& svg": { boxSize: glyph(size) } }),
        SIZES,
      ),
      rangeText: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: rootSizes(),
      tableCell: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), SIZES),
      tableCellTrigger: sizeVariants(
        (size) => ({
          "&[data-view=month], &[data-view=year]": { minInlineSize: wideCell(size) },
          minBlockSize: cellSide(size),
          minInlineSize: cellSide(size),
          textStyle: `body.${below(size)}`,
        }),
        SIZES,
      ),
      tableHeader: sizeVariants(
        (size) => ({
          blockSize: cellSide(size),
          inlineSize: cellSide(size),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      trigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          "& svg": { boxSize: glyph(size) },
          insetInlineEnd: triggerEnd(size),
        }),
        SIZES,
      ),
      view: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      viewport: viewportSizes(),
      viewTrigger: sizeVariants(
        (size) => ({
          blockSize: triggerSide(size),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      yearSelect: sizeVariants((size) => controlSizes()[below(size)], SIZES),
    }),

    /**
     * Status the date picker reports. Each value sets the input's edge and focus ring from that
     * status's palette.
     */
    status: onSlot("input", fieldStatusVariants()),

    /**
     * Edges and surface of the input.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, the same as the input's.
     */
    variant: {
      ...onSlot("input", fieldVariants()),
      flushed: { input: { layerStyle: "field.flushed" }, root: flushed() },
    },
  },
});
