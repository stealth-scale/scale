/**
 * Styles the seven slots of the clipboard.
 *
 * @remarks
 *   The recipe places the parts and does nothing else to them. The trigger carries no control
 *   styling here because a caller renders it as the library's button through `as`, which keeps it
 *   in step with every other button in a theme. The root aligns its children at the start, so a
 *   trigger standing on its own keeps a button's width instead of stretching across the root's
 *   container, and the control row stretches back to the root's width so a field inside it fills
 *   the row.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * The three sizes the label text and the gaps step through.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Declares the slot styles and the single size axis, defaulting to md.
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
     * The room the parts occupy, stepping the label text and both gaps together.
     *
     * @remarks
     *   The root's gap is taken one step below the control's, so the label sits tighter to the row
     *   than the field sits to the trigger.
     */
    size: onSlots({
      control: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), STEPS),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), STEPS),
    }),
  },
});
