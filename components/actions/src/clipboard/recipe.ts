/**
 * States what a clipboard is: a value, the control that copies it, and the mark that says it did.
 *
 * @remarks
 *   Seven parts. The root stacks a label over the control row, the control lays the field and the
 *   trigger side by side, the input shows the value read-only, the trigger is what a person
 *   presses, the indicator swaps its mark while the copy is fresh, and the value text writes the
 *   value in a run of text. The trigger draws no control look of its own. A caller draws it as a
 *   button of the library through `as`, so a theme that moves the button moves the trigger with
 *   it, and the recipe here states only how the parts are placed. The root aligns its parts at
 *   the start, so a trigger drawn on its own keeps a button's width rather than stretching across
 *   whatever holds the root, and the control row stretches back to the root's width so a field
 *   in it fills the row.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * The steps a label and a control row are set at.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Draws a labelled row at the middle size until a caller says otherwise.
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
     * How much room the parts take, which the label and the gaps step together.
     */
    size: onSlots({
      control: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), STEPS),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), STEPS),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), STEPS),
    }),
  },
});
