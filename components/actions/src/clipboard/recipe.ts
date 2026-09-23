/**
 * Declares the slot recipe of the clipboard: layout and spacing for its seven parts.
 *
 * @remarks
 *   The trigger has no control styles. A caller renders it as the library's `Button` or
 *   `IconButton` through `as`, so it matches every other button in a theme. The clipboard has no
 *   colour or surface of its own, so it offers no `palette` or `effect` axis. The button it renders
 *   through `as` carries both. The root aligns its children at the start, so a trigger on its own
 *   keeps its button width. The control row stretches to the width of the root, so a field inside
 *   it fills the row.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the label text and the gaps step through.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Slot styles and the size axis. Defaults to `md`.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { alignItems: "center", alignSelf: "stretch", display: "flex" },
    indicator: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
    },
    label: { color: "fg", display: "block" },
    root: { alignItems: "start", display: "flex", flexDirection: "column" },
  },
  className: "clipboard",
  defaultVariants: { size: "md" },
  jsx: [/^Clipboard(\.\w+)?$/u],
  slots: ["root", "label", "control", "input", "trigger", "indicator", "valueText"],
  variants: {
    /**
     * The label text style and the two gaps.
     *
     * @remarks
     *   The gap between the label and the row is one size smaller than the gap between the field
     *   and the trigger. The field and the trigger take their own size through their providers.
     */
    size: onSlots({
      control: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), STEPS),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), STEPS),
    }),
  },
});
