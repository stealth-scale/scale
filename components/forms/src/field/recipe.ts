/**
 * Defines the styles a field is drawn with.
 *
 * @remarks
 *   Seven parts. The root stacks them, the label names the control, the required indicator marks a
 *   field that has to be filled in, the control is what a person fills, and the helper text, the
 *   counter and the message sit under it.
 *   The message and the required indicator read the palette rather than a fixed ink, and the
 *   status axis sets it. A field defaults to the error palette, so a message is red without a
 *   caller stating anything, and a field reporting something else sets the status once.
 *   The orientation axis puts the label above the control or beside it. Beside it, the label takes
 *   a column of its own.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * The steps a field is read at.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws a field stacked at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { minInlineSize: "0" },
    counter: { color: "fg.muted", fontVariantNumeric: "tabular-nums", marginInlineStart: "auto" },
    errorText: {
      alignItems: "center",
      color: "colorPalette.fg",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
    },
    helperText: { color: "fg.muted" },
    label: {
      _disabled: { layerStyle: "disabled" },
      alignItems: "center",
      display: "inline-flex",
      fontWeight: "medium",
      gap: dense("{spacing.gap.xs}"),
    },
    requiredIndicator: { color: "colorPalette.fg", lineHeight: "1" },
    root: { colorPalette: "error", display: "flex", inlineSize: "full" },
  },
  className: "field",
  defaultVariants: { orientation: "vertical", size: "md" },
  jsx: [/^Field(\.\w+)?$/u],
  slots: ["root", "label", "requiredIndicator", "control", "helperText", "counter", "errorText"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Where the label sits against the control.
     */
    orientation: {
      horizontal: {
        label: { flex: "0 0 auto", paddingBlockStart: dense("{spacing.gap.xs}") },
        root: { alignItems: "flex-start", flexDirection: "row" },
      },
      vertical: { root: { flexDirection: "column" } },
    },

    size: onSlots({
      counter: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      errorText: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      helperText: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
    }),

    /**
     * The palette the message and the required mark are drawn in. A field defaults to the error
     * palette, and one reporting something else states its own.
     */
    status: onSlot("root", statusVariants()),
  },
});
