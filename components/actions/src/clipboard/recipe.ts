/**
 * States what a clipboard is: a value, the control that copies it, and the mark that says it did.
 *
 * @remarks
 *   Seven parts. The root stacks a label over the control row, the control lays the field and the
 *   trigger side by side, the input shows the value read-only, the trigger is what a person
 *   presses, the indicator swaps its mark while the copy is fresh, and the value text writes the
 *   value in a run of text. The trigger draws no control look of its own. A caller draws it as a
 *   button of the library through `as`, so a theme that moves the button moves the trigger with
 *   it, and the recipe here states only how the parts are placed.
 */

import { below, defineSlotRecipe, onSlots, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * The steps a label and a control row are set at.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Draws a labelled row at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { alignItems: "center", display: "flex" },
    indicator: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
    },
    label: { color: "fg", display: "block" },
    root: { display: "flex", flexDirection: "column" },
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
      control: sizeVariants((size) => ({ gap: `gap.${size}` }), STEPS),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), STEPS),
      root: sizeVariants((size) => ({ gap: `gap.${below(size)}` }), STEPS),
    }),
  },
});
